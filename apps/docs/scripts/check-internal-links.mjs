// Link-integrity guard for hand-maintained internal docs links.
//
// The marketing mega-menu (lib/nav-taxonomy.ts) and the homepage link grids
// (app/[locale]/page.tsx — TRY_TASKS / QUICK_LINKS / HELP_LINKS) hardcode ~40
// deep `/docs/...` paths that are NOT derived from the content tree. Nothing
// else verifies they resolve, so renaming or moving a content page would
// silently 404 the nav/homepage with a green build. This script scans every
// source file under app/ and lib/ for `/docs/...` string literals and asserts
// each one maps to a real page under content/docs, failing CI if any dangle.
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

const totalBroken = broken.size + navBroken.length;

if (totalBroken === 0) {
  console.log("✔ internal docs links: all resolve to content pages");
  console.log("✔ nav-taxonomy.ts paths: all resolve to content pages");
  process.exit(0);
}

if (broken.size > 0) {
  console.error(`✖ ${broken.size} internal docs link(s) point to missing content pages:\n`);
  for (const [docPath, files] of broken) {
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

console.error(
  "\nEither create the content page or update the link. These links are hand-" +
    "maintained (lib/nav-taxonomy.ts, app/[locale]/page.tsx) and not derived\n" +
    "from the content tree, so this guard is the only thing catching the drift."
);
process.exit(1);
