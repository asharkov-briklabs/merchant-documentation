import * as Sentry from "@sentry/nextjs";
import { loader } from "fumadocs-core/source";
import { openapi } from "./openapi";

type ApiSource = ReturnType<typeof loader>;

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
