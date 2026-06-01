import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { attachFile } from "fumadocs-openapi/source";
import { apiDocs, apiMeta } from "@/.source";

export const apiSource = loader({
  baseUrl: "/api",
  source: createMDXSource(apiDocs, apiMeta),
  pageTree: {
    attachFile,
  },
});
