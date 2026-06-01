import { rmSync } from "node:fs";
try {
  rmSync(".next/cache/webpack", { recursive: true, force: true });
} catch {}
