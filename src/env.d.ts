/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  // No secrets required - newsletter uses public Loops form endpoint
}

declare namespace App {
  interface Locals extends Runtime { }
}

interface ImportMetaEnv {
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
