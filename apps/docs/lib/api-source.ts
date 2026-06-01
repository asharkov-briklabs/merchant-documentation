import { loader } from "fumadocs-core/source";
import { openapi } from "./openapi";

export const apiSource = loader(
  await openapi.staticSource(),
  {
    baseUrl: "/api",
    plugins: [openapi.loaderPlugin()],
  },
);
