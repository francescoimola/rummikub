import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/built-*.test.js"],
  },
});
