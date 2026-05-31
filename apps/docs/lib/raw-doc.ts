import { readFileSync } from "node:fs";
import { join } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";

/**
 * Serialize a doc page back to clean Markdown for the "Copy page" / "View as
 * Markdown" actions (the LLM-friendly pattern from docs.stripe.com). The
 * compiled `page.data.body` is a React component, not text, so — like the
 * Ask-AI retrieval index — we read the raw `.mdx` source from disk.
 *
 * Node.js runtime only (filesystem access); callers must run on `nodejs`.
 */

const CONTENT_DIR = join(process.cwd(), "content", "docs");

interface MarkdownablePage {
  file: { path: string };
  data: { title?: string; description?: string };
}

// ── AST types (subset of mdast + remark-mdx) ─────────────────────────────────

interface MdastNode {
  type: string;
  children?: MdastNode[];
  [key: string]: unknown;
}

interface JsxAttr {
  name: string;
  value: string | { type: string; value: string } | null;
}

// ── Attribute helpers ─────────────────────────────────────────────────────────

function strAttr(attrs: JsxAttr[] | undefined, name: string): string | null {
  const a = attrs?.find((a) => a.name === name);
  return typeof a?.value === "string" ? a.value : null;
}

function exprAttr(attrs: JsxAttr[] | undefined, name: string): string | null {
  const a = attrs?.find((a) => a.name === name);
  if (a?.value && typeof a.value === "object" && "value" in a.value) {
    return (a.value as { value: string }).value;
  }
  return null;
}

/** A valueless JSX prop (`expandable`) parses to a `null` value in mdast. */
function boolAttr(attrs: JsxAttr[] | undefined, name: string): boolean {
  const a = attrs?.find((a) => a.name === name);
  return !!a && (a.value === null || a.value === "true");
}

// ── Template-literal helpers (for <ApiExample> request/response props) ────────

/** Apply the common template-literal escapes so copied code reads naturally. */
function cookTemplate(raw: string): string {
  return raw.replace(
    /\\([\\`$nrt])/g,
    (_, c: string) =>
      ({ "\\": "\\", "`": "`", $: "$", n: "\n", r: "\r", t: "\t" })[c] ?? c,
  );
}

/** Parse `{ curl: `…`, node: `…` }` into ordered { lang, code } pairs. */
function parseRequestObject(expr: string): { lang: string; code: string }[] {
  const out: { lang: string; code: string }[] = [];
  const re = /(\w+)\s*:\s*`((?:[^\\`]|\\[\s\S])*)`/g;
  let m;
  while ((m = re.exec(expr)) !== null) {
    out.push({ lang: m[1], code: cookTemplate(m[2]) });
  }
  return out;
}

/** Parse a bare template literal `…` prop value into its cooked string. */
function parseTemplateLiteral(expr: string): string | null {
  const m = /^`((?:[^\\`]|\\[\s\S])*)`$/.exec(expr.trim());
  return m ? cookTemplate(m[1]) : null;
}

/** Map an SDK id to a sensible Markdown fence language. */
function langToFence(lang: string): string {
  return { curl: "bash", node: "js" }[lang] ?? lang;
}

// ── TypeTable → markdown table ────────────────────────────────────────────────

interface TypeField {
  field: string;
  type: string;
  description: string;
  default: string;
}

function parseTypeTableFields(expr: string): TypeField[] {
  const fields: TypeField[] = [];
  // Each entry: fieldName: { type: "...", description: "...", default: "..." }
  const fieldRe = /(\w+):\s*\{([^{}]+)\}/g;
  let m;
  while ((m = fieldRe.exec(expr)) !== null) {
    const body = m[2];
    const get = (k: string) =>
      new RegExp(`${k}:\\s*"([^"]*)"`, "i").exec(body)?.[1] ?? "";
    fields.push({
      field: m[1],
      type: get("type"),
      description: get("description"),
      default: get("default") || "—",
    });
  }
  return fields;
}

function makeTableNode(fields: TypeField[]): MdastNode {
  const cell = (value: string, code = false): MdastNode => ({
    type: "tableCell",
    children: [{ type: code ? "inlineCode" : "text", value }],
  });
  const row = (cells: MdastNode[]): MdastNode => ({
    type: "tableRow",
    children: cells,
  });
  return {
    type: "table",
    align: [null, null, null, null],
    children: [
      row(["Field", "Type", "Description", "Default"].map((h) => cell(h))),
      ...fields.map((f) =>
        row([cell(f.field, true), cell(f.type, true), cell(f.description), cell(f.default, true)]),
      ),
    ],
  };
}

// ── <Attributes> → nested markdown list ──────────────────────────────────────

function isAttributesEl(n: MdastNode): boolean {
  return (
    (n.type === "mdxJsxFlowElement" || n.type === "mdxJsxTextElement") &&
    n.name === "Attributes"
  );
}

/** Collect inline content from prose nodes (flattening paragraphs). */
function inlineFromNodes(nodes: MdastNode[]): MdastNode[] {
  const out: MdastNode[] = [];
  for (const n of nodes) {
    if (n.type === "paragraph") out.push(...(n.children ?? []));
    else if (["text", "inlineCode", "link", "strong", "emphasis", "break"].includes(n.type))
      out.push(n);
  }
  return out;
}

/**
 * Pull nested `<Attributes>` out of an attribute's subtree. They may sit at the
 * top level OR — when no blank line precedes them — text-level inside the
 * description paragraph, so the search has to recurse. Returns the converted
 * nested lists plus the remaining prose with those groups removed.
 */
function extractNested(nodes: MdastNode[]): { nested: MdastNode[]; prose: MdastNode[] } {
  const nested: MdastNode[] = [];
  const prose: MdastNode[] = [];
  for (const n of nodes) {
    if (isAttributesEl(n)) {
      nested.push(convertAttributes(n));
    } else if (n.children) {
      const r = extractNested(n.children);
      nested.push(...r.nested);
      prose.push({ ...n, children: r.prose });
    } else {
      prose.push(n);
    }
  }
  return { nested, prose };
}

function convertAttribute(node: MdastNode): MdastNode {
  const attrs = node.attributes as JsxAttr[] | undefined;
  const name = strAttr(attrs, "name") ?? "";
  const type = strAttr(attrs, "type");
  const badges = [
    boolAttr(attrs, "required") && "required",
    boolAttr(attrs, "expandable") && "expandable",
    boolAttr(attrs, "deprecated") && "deprecated",
  ].filter(Boolean) as string[];

  const { nested, prose: proseRaw } = extractNested(node.children ?? []);
  const prose = transformNodes(proseRaw);
  const desc = inlineFromNodes(prose);

  const heading: MdastNode[] = [
    { type: "strong", children: [{ type: "text", value: name }] },
  ];
  if (type) heading.push({ type: "text", value: " " }, { type: "inlineCode", value: type });
  if (badges.length) heading.push({ type: "text", value: ` (${badges.join(", ")})` });
  if (desc.length) heading.push({ type: "text", value: " — " }, ...desc);

  return {
    type: "listItem",
    spread: false,
    children: [{ type: "paragraph", children: heading }, ...nested],
  };
}

function isAttributeEl(n: MdastNode): boolean {
  return (
    (n.type === "mdxJsxFlowElement" || n.type === "mdxJsxTextElement") &&
    n.name === "Attribute"
  );
}

/**
 * Collect the `<Attribute>` children of an `<Attributes>` group. remark-mdx may
 * wrap them in a paragraph (when authored without blank lines), so we descend
 * through wrappers — but stop at each `<Attribute>` (its own nested group is
 * handled by convertAttribute) and never recurse into a nested `<Attributes>`.
 */
function collectAttributeEls(nodes: MdastNode[]): MdastNode[] {
  const out: MdastNode[] = [];
  for (const n of nodes) {
    if (isAttributeEl(n)) out.push(n);
    else if (isAttributesEl(n)) continue;
    else if (n.children) out.push(...collectAttributeEls(n.children));
  }
  return out;
}

function convertAttributes(node: MdastNode): MdastNode {
  const items = collectAttributeEls(node.children ?? []).map(convertAttribute);
  return { type: "list", ordered: false, spread: false, children: items };
}

// ── Component → mdast transform ───────────────────────────────────────────────

function transformNodes(nodes: MdastNode[]): MdastNode[] {
  const out: MdastNode[] = [];
  for (const node of nodes) {
    if (node.type === "mdxjsEsm") continue; // strip import/export statements
    if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
      out.push(...convertJsx(node));
    } else if (node.children) {
      out.push({ ...node, children: transformNodes(node.children) });
    } else {
      out.push(node);
    }
  }
  return out;
}

function convertJsx(node: MdastNode): MdastNode[] {
  const name = node.name as string | null;
  const attrs = node.attributes as JsxAttr[] | undefined;
  const children = transformNodes(node.children ?? []);

  switch (name) {
    case "Callout":
      return [
        {
          type: "blockquote",
          children: children.length ? children : [{ type: "paragraph", children: [] }],
        },
      ];

    case "Card": {
      const title = strAttr(attrs, "title") ?? "";
      const href = strAttr(attrs, "href");
      const description = strAttr(attrs, "description");
      const inline: MdastNode[] = href
        ? [{ type: "link", url: href, children: [{ type: "text", value: title }] }]
        : [{ type: "text", value: title }];
      if (description) inline.push({ type: "text", value: ` — ${description}` });
      return [{ type: "paragraph", children: inline }];
    }

    case "Accordion": {
      const title = strAttr(attrs, "title") ?? strAttr(attrs, "label") ?? "";
      return [
        { type: "heading", depth: 4, children: [{ type: "text", value: title }] },
        ...children,
      ];
    }

    case "Tab": {
      const value = strAttr(attrs, "value") ?? "";
      return value
        ? [{ type: "heading", depth: 5, children: [{ type: "text", value }] }, ...children]
        : children;
    }

    case "TypeTable": {
      const expr = exprAttr(attrs, "type");
      if (expr) {
        const fields = parseTypeTableFields(expr);
        if (fields.length) return [makeTableNode(fields)];
      }
      return children;
    }

    case "Attributes":
      return [convertAttributes(node)];

    case "ApiExample": {
      const method = strAttr(attrs, "method");
      const path = strAttr(attrs, "path");
      const out: MdastNode[] = [];
      if (method || path) {
        out.push({
          type: "paragraph",
          children: [{ type: "inlineCode", value: `${method ?? ""} ${path ?? ""}`.trim() }],
        });
      }
      const requestExpr = exprAttr(attrs, "request");
      if (requestExpr) {
        for (const r of parseRequestObject(requestExpr)) {
          out.push({ type: "code", lang: langToFence(r.lang), value: r.code });
        }
      }
      const responseExpr = exprAttr(attrs, "response");
      const response = responseExpr ? parseTemplateLiteral(responseExpr) : null;
      if (response) out.push({ type: "code", lang: "json", value: response });
      return out;
    }

    // Pass-through containers — strip the tag, keep children
    default:
      return children;
  }
}

function remarkStripMdx() {
  return (tree: MdastNode) => {
    tree.children = transformNodes(tree.children ?? []);
  };
}

// ── Processor (frozen/reusable after first processSync call) ──────────────────

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkStripMdx)
  .use(remarkStringify, { bullet: "-", fences: true });

const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/;

// ── Public API ────────────────────────────────────────────────────────────────

export function pageToMarkdown(page: MarkdownablePage): string {
  const raw = readFileSync(join(CONTENT_DIR, page.file.path), "utf8");
  // Strip frontmatter before parsing — remarkParse would misread it as <hr> + paragraph.
  const source = raw.replace(FRONTMATTER_RE, "");
  const body = String(processor.processSync(source)).trim();

  const title = page.data.title ?? "";
  const desc = page.data.description ? `\n\n> ${page.data.description}` : "";
  return `# ${title}${desc}\n\n${body}\n`;
}
