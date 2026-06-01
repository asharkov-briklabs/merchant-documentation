import { generateFiles } from "fumadocs-openapi";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, "..");

await generateFiles({
  input: ["./openapi.yaml"],
  output: "./content/api",
  per: "tag",
  groupByFolder: false,
  cwd: root,
});

console.log("API docs generated in content/api/");
