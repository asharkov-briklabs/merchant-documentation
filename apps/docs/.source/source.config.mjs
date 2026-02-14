// source.config.ts
import { defineCollections } from "fumadocs-mdx/config";
var merchant = defineCollections({
  type: "doc",
  dir: "content/merchant"
});
var banks = defineCollections({
  type: "doc",
  dir: "content/banks"
});
export {
  banks,
  merchant
};
