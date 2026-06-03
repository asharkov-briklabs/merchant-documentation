import * as Sentry from "@sentry/nextjs";
import { loader } from "fumadocs-core/source";
import { openapi } from "./openapi";

// Type-only helper — never called at runtime. Captures the exact return type of
// loader() when invoked with the openapi source + plugin, which augments PageData
// with getAPIPageProps(). Using `ReturnType<typeof loader>` without this loses the
// plugin-specific augmentation and causes a type error at the call site.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _buildApiSource(src: Awaited<ReturnType<typeof openapi.staticSource>>) {
  return loader(src, { baseUrl: "/api", plugins: [openapi.loaderPlugin()] });
}
type ApiSource = ReturnType<typeof _buildApiSource>;

// Returned when the OpenAPI spec fails to parse or the file is missing.
// Consumers call apiSource.getPage() → null → notFound(), so /api/* pages
// show a proper 404 instead of an unhandled module-init 500 that takes down
// every page that imports this module.
function makeEmptySource(): ApiSource {
  return {
    pageTree: { type: "folder", name: "API Reference", children: [] },
    getPage: () => null,
    generateParams: () => [],
  } as unknown as ApiSource;
}

let apiSource: ApiSource;

try {
  apiSource = loader(await openapi.staticSource(), {
    baseUrl: "/api",
    plugins: [openapi.loaderPlugin()],
  });
} catch (err) {
  Sentry.captureException(err, {
    tags: { module: "api-source" },
    extra: { message: "OpenAPI spec failed to load — /api/* pages will return 404" },
  });
  console.error("[api-source] Failed to initialize OpenAPI source — /api/* pages will return 404:", err);
  apiSource = makeEmptySource();
}

export { apiSource };
