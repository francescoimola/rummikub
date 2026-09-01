import { existsSync } from "node:fs";

// The built-output tests assert public/, which a clean checkout doesn't have.
export function requireBuild() {
  if (!existsSync("public/index.html")) {
    throw new Error("The built-output tests read public/ — run `pnpm build` first, then `pnpm test`.");
  }
}
