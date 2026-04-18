/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  WEB3FORMS_ACCESS_KEY?: string;
}

declare namespace App {
  interface Locals extends Runtime { }
}

interface ImportMetaEnv {
  readonly WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

