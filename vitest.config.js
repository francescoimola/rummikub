import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // public/ is build output, and src/assets/scripts is passthrough-copied into it wholesale —
    // without this every browser-script suite runs a second time against a stale copy.
    exclude: [...configDefaults.exclude, "public/**"],
  },
});
