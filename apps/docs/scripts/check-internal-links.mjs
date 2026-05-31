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

if (broken.size === 0) {
  console.log("✔ internal docs links: all resolve to content pages");
  process.exit(0);
}

console.error(`✖ ${broken.size} internal docs link(s) point to missing content pages:\n`);
for (const [docPath, files] of broken) {
  console.error(`  ${docPath}`);
  for (const f of files) console.error(`      ↳ ${f}`);
}
console.error(
  "\nEither create the content page or update the link. These links are hand-" +
    "maintained (lib/nav-taxonomy.ts, app/[locale]/page.tsx) and not derived\n" +
    "from the content tree, so this guard is the only thing catching the drift."
);
process.exit(1);
