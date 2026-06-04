// Link-integrity guard for hand-maintained internal docs links.
//
// The marketing mega-menu (lib/nav-taxonomy.ts) and the homepage link grids
// (app/page.tsx — TRY_TASKS / QUICK_LINKS / HELP_LINKS) hardcode ~40
// deep `/docs/...` paths that are NOT derived from the content tree. Nothing
// else verifies they resolve, so renaming or moving a content page would
// silently 404 the nav/homepage with a green build. This script scans every
// source file under app/ and lib/ for `/docs/...` string literals, and every
// MDX file under content/docs for href="/docs/..." attributes, asserting each
// one maps to a real page under content/docs and failing CI if any dangle.
//
// Scope: only `/docs` content links (which map deterministically to .mdx
// files). App routes like `/ask` are Next pages, not content, and are skipped.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = join(ROOT, "content", "docs");
const SCAN_DIRS = [join(ROOT, "app"), join(ROOT, "lib")];

/** Recursively collect .ts/.tsx files under a directory. */
function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Recursively collect .mdx files under a directory. */
function mdxFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...mdxFiles(full));
    else if (entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

/** Does a `/docs/...` path resolve to a content page (foo.mdx or foo/index.mdx)? */
function resolves(docPath) {
  const rest = docPath.replace(/^\/docs\/?/, ""); // "" for the /docs root
  const base = rest ? join(CONTENT_DIR, rest) : CONTENT_DIR;
  try {
    if (rest && statSync(`${base}.mdx`).isFile()) return true;
  } catch {}
  try {
    return statSync(join(base, "index.mdx")).isFile();
  } catch {
    return false;
  }
}

const LINK_RE = /["'](\/docs[a-z0-9/_-]*)["']/g;
const broken = new Map(); // path -> Set(files)

for (const dir of SCAN_DIRS) {
  for (const file of sourceFiles(dir)) {
    const text = readFileSync(file, "utf8");
    for (const [, docPath] of text.matchAll(LINK_RE)) {
      if (resolves(docPath)) continue;
      if (!broken.has(docPath)) broken.set(docPath, new Set());
      broken.get(docPath).add(relative(ROOT, file));
    }
  }
}

// ── MDX content href scan ────────────────────────────────────────────────────
// href="/docs/..." attributes in .mdx files are not covered by the source-file
// scan above (which only reads .ts/.tsx). A restructure or rename that updates
// the folder but misses an MDX cross-reference 404s silently. This pass scans
// every .mdx file under content/docs for href="/docs/..." values and validates
// each one resolves to a real page.
const MDX_HREF_RE = /href="(\/docs[a-z0-9/_-]*)"/g;
const mdxBroken = new Map(); // path -> Set(files)

for (const file of mdxFiles(CONTENT_DIR)) {
  const text = readFileSync(file, "utf8");
  for (const [, docPath] of text.matchAll(MDX_HREF_RE)) {
    if (resolves(docPath)) continue;
    if (!mdxBroken.has(docPath)) mdxBroken.set(docPath, new Set());
    mdxBroken.get(docPath).add(relative(ROOT, file));
  }
}

// ── NAV_GROUPS explicit path check ───────────────────────────────────────────
// The scan above catches /docs/... literals in lib/ via regex, but the nav
// items use `path:` fields that may also include anchors (#section) and
// non-/docs/ paths (/api-reference). This second pass explicitly validates
// every path: value in NAV_GROUPS, strips anchors before resolving, and
// emits a nav-specific error pointing to the exact item label so the broken
// link is easy to locate.
const NAV_FILE = join(ROOT, "lib", "nav-taxonomy.ts");
const navText = readFileSync(NAV_FILE, "utf8");
// Capture the label that precedes each path for context in error output.
// Matches: label: "...", ... path: "..." (within ~200 chars of each other)
const NAV_ITEM_RE =
  /label:\s*["']([^"']+)["'][^}]{0,200}?path:\s*["']([^"']+)["']/gs;
const navBroken = []; // { label, rawPath }

for (const [, label, rawPath] of navText.matchAll(NAV_ITEM_RE)) {
  if (!rawPath.startsWith("/docs")) continue; // skip /api-reference etc.
  const docPath = rawPath.split("#")[0]; // strip anchor before resolving
  if (resolves(docPath)) continue;
  navBroken.push({ label, rawPath });
}

// ── next.config.mjs redirect destinations ────────────────────────────────────
// The redirects() array in next.config.mjs contains hand-maintained /docs/...
// destination paths that silently rot when content is renamed. The generic
// source-file scan above skips next.config.mjs (it's .mjs, not .ts/.tsx), so
// stale redirect destinations pass CI undetected. This third pass closes that
// gap by extracting every destination: "..." value and validating it.
const CONFIG_FILE = join(ROOT, "next.config.mjs");
const configText = readFileSync(CONFIG_FILE, "utf8");
const REDIRECT_DEST_RE = /destination:\s*["']([^"']+)["']/g;
const redirectBroken = []; // { destination, source }

// Also capture source: so the error output names the broken redirect clearly.
// We walk source/destination pairs by matching them in order of appearance.
const REDIRECT_PAIR_RE =
  /source:\s*["']([^"']+)["'][^}]{0,300}?destination:\s*["']([^"']+)["']/gs;

for (const [, source, destination] of configText.matchAll(REDIRECT_PAIR_RE)) {
  if (!destination.startsWith("/docs")) continue; // skip /api-reference etc.
  if (destination.includes(":")) continue; // skip wildcard/param destinations (e.g. :path*)
  const docPath = destination.split("#")[0]; // strip any anchor
  if (resolves(docPath)) continue;
  redirectBroken.push({ source, destination });
}

const totalBroken = broken.size + mdxBroken.size + navBroken.length + redirectBroken.length;

if (totalBroken === 0) {
  console.log("✔ internal docs links: all resolve to content pages");
  console.log("✔ MDX content hrefs: all resolve to content pages");
  console.log("✔ nav-taxonomy.ts paths: all resolve to content pages");
  console.log("✔ next.config.mjs redirect destinations: all resolve to content pages");
  process.exit(0);
}

if (broken.size > 0) {
  console.error(`✖ ${broken.size} internal docs link(s) point to missing content pages:\n`);
  for (const [docPath, files] of broken) {
    console.error(`  ${docPath}`);
    for (const f of files) console.error(`      ↳ ${f}`);
  }
}

if (mdxBroken.size > 0) {
  console.error(`\n✖ ${mdxBroken.size} MDX href(s) in content/docs point to missing content pages:\n`);
  for (const [docPath, files] of mdxBroken) {
    console.error(`  ${docPath}`);
    for (const f of files) console.error(`      ↳ ${f}`);
  }
}

if (navBroken.length > 0) {
  console.error(
    `\n✖ ${navBroken.length} NAV_GROUPS path(s) in lib/nav-taxonomy.ts point to missing content pages:\n`
  );
  for (const { label, rawPath } of navBroken) {
    console.error(`  ${rawPath}  (label: "${label}")`);
  }
}

if (redirectBroken.length > 0) {
  console.error(
    `\n✖ ${redirectBroken.length} redirect destination(s) in next.config.mjs point to missing content pages:\n`
  );
  for (const { source, destination } of redirectBroken) {
    console.error(`  ${destination}  (redirected from: ${source})`);
  }
}

console.error(
  "\nEither create the content page or update the link. Links in nav-taxonomy.ts,\n" +
    "app/page.tsx, next.config.mjs, and MDX href attributes are hand-maintained\n" +
    "and not derived from the content tree — this guard is the only thing catching the drift."
);
process.exit(1);
