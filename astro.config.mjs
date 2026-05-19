import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://my-tech.pages.dev",
  output: "static",
  integrations: [mdx()]
});
