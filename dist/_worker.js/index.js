globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as renderers } from './chunks/_@astro-renderers_BdVEDqPn.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BvFcID6E.mjs';
import { manifest } from './manifest_BKpRV4y3.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/about.astro.mjs');
const _page1 = () => import('./pages/blog.astro.mjs');
const _page2 = () => import('./pages/blogpost.astro.mjs');
const _page3 = () => import('./pages/consultations.astro.mjs');
const _page4 = () => import('./pages/project.astro.mjs');
const _page5 = () => import('./pages/webdesign.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/about.astro", _page0],
    ["src/pages/blog.astro", _page1],
    ["src/pages/blogPost.astro", _page2],
    ["src/pages/consultations.astro", _page3],
    ["src/pages/project.astro", _page4],
    ["src/pages/webdesign.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
