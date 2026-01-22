globalThis.process ??= {}; globalThis.process.env ??= {};
import { p as decodeKey } from './chunks/astro/server_DjWKGrLa.mjs';
import './chunks/astro-designed-error-pages_DhmwHPMd.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_qShBSFp6.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/francescoimola/Repositories/rummikub/","cacheDir":"file:///Users/francescoimola/Repositories/rummikub/node_modules/.astro/","outDir":"file:///Users/francescoimola/Repositories/rummikub/dist/","srcDir":"file:///Users/francescoimola/Repositories/rummikub/src/","publicDir":"file:///Users/francescoimola/Repositories/rummikub/public/","buildClientDir":"file:///Users/francescoimola/Repositories/rummikub/dist/","buildServerDir":"file:///Users/francescoimola/Repositories/rummikub/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":false,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blogPost/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blogpost","isIndex":false,"type":"page","pattern":"^\\/blogPost\\/?$","segments":[[{"content":"blogPost","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blogPost.astro","pathname":"/blogPost","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"consultations/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/consultations","isIndex":false,"type":"page","pattern":"^\\/consultations\\/?$","segments":[[{"content":"consultations","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/consultations.astro","pathname":"/consultations","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"project/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/project","isIndex":false,"type":"page","pattern":"^\\/project\\/?$","segments":[[{"content":"project","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/project.astro","pathname":"/project","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"webdesign/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/webdesign","isIndex":false,"type":"page","pattern":"^\\/webdesign\\/?$","segments":[[{"content":"webdesign","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/webdesign.astro","pathname":"/webdesign","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://francescoimola.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/francescoimola/Repositories/rummikub/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/blog.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/blogPost.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/consultations.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/project.astro",{"propagation":"none","containsHead":true}],["/Users/francescoimola/Repositories/rummikub/src/pages/webdesign.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/blog@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blogPost@_@astro":"pages/blogpost.astro.mjs","\u0000@astro-page:src/pages/consultations@_@astro":"pages/consultations.astro.mjs","\u0000@astro-page:src/pages/project@_@astro":"pages/project.astro.mjs","\u0000@astro-page:src/pages/webdesign@_@astro":"pages/webdesign.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_i7ebLf6g.mjs","/Users/francescoimola/Repositories/rummikub/node_modules/.pnpm/unstorage@1.17.4/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/Users/francescoimola/Repositories/rummikub/node_modules/.pnpm/astro@5.16.11_rollup@4.55.1_typescript@5.9.3_yaml@2.8.2/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_Bg0irISW.mjs","/Users/francescoimola/Repositories/rummikub/src/components/BlogFilters.jsx":"_astro/BlogFilters.DF7YdFK2.js","@radix-ui/themes":"_astro/themes.C574r7wf.js","/Users/francescoimola/Repositories/rummikub/src/components/Footer.jsx":"_astro/Footer.B219AyGU.js","@astrojs/react/client.js":"_astro/client.C94oRX3q.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/life-coaching.CVn-2mio.png","/_astro/tedx-journeys.DQLzCnza.png","/_astro/folks-homepage.DrkNJL9s.png","/_astro/make-and-mind.DdRqzc4j.png","/_astro/francesco.CWfu-vdW.png","/_astro/folks-directory.DEew0Qe6.png","/_astro/about.CHPvlPFI.css","/20cf138c587fcec5690ef40bb633d8caeb7e7521.png","/4af625ac59257d3992b5d950b2889f48ca8690c1.png","/5f149a11bd752941196bf21b29d18dcbd4abe84a.png","/9d1bf513c8464d2ff42f99bab694d63f10db760a.svg","/b909995069939616194a2ed57f67f848589b8d21.png","/bbb4c700572f2803af7c9509d26d0c5757545977.png","/c7595d77c8de469c5593dbef9c20c30f22d0bde4.svg","/cc155cf62009844c7340e05261e57dcf4cd9fd81.svg","/ed34f2fda9a1567e34059c367ea1d040e43aaf38.svg","/favicon.svg","/_astro/BlogFilters.DF7YdFK2.js","/_astro/Footer.B219AyGU.js","/_astro/client.C94oRX3q.js","/_astro/index.CMA9SPEp.js","/_astro/index.KYzBjJVy.js","/_astro/text.BoxklP-g.js","/_astro/theme.BZTpUMv1.js","/_astro/themes.C574r7wf.js","/assets/c7595d77c8de469c5593dbef9c20c30f22d0bde4.svg","/fonts/Ronzino-Bold.woff2","/fonts/Ronzino-BoldOblique.woff2","/fonts/Ronzino-Medium.woff2","/fonts/Ronzino-MediumOblique.woff2","/fonts/Ronzino-Oblique.woff2","/fonts/Ronzino-Regular.woff2","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_astro/about.CHPvlPFI.css","/_worker.js/_astro/folks-directory.DEew0Qe6.png","/_worker.js/_astro/folks-homepage.DrkNJL9s.png","/_worker.js/_astro/francesco.CWfu-vdW.png","/_worker.js/_astro/life-coaching.CVn-2mio.png","/_worker.js/_astro/make-and-mind.DdRqzc4j.png","/_worker.js/_astro/tedx-journeys.DQLzCnza.png","/_worker.js/pages/about.astro.mjs","/_worker.js/pages/blog.astro.mjs","/_worker.js/pages/blogpost.astro.mjs","/_worker.js/pages/consultations.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/project.astro.mjs","/_worker.js/pages/webdesign.astro.mjs","/_worker.js/chunks/Layout_DZlmMVf3.mjs","/_worker.js/chunks/_@astro-renderers_DQt-oJRx.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_BrVgS_nh.mjs","/_worker.js/chunks/_astro_assets_BTmGCVuv.mjs","/_worker.js/chunks/aspect-ratio_j1zQnvW_.mjs","/_worker.js/chunks/astro-designed-error-pages_DhmwHPMd.mjs","/_worker.js/chunks/astro_Dsa69zOO.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/index_BafoQAXf.mjs","/_worker.js/chunks/noop-middleware_qShBSFp6.mjs","/_worker.js/chunks/path_CH3auf61.mjs","/_worker.js/chunks/react-icons.esm_1PembC0v.mjs","/_worker.js/chunks/remote_CrdlObHx.mjs","/_worker.js/chunks/sharp_Bg0irISW.mjs","/_worker.js/chunks/astro/server_DjWKGrLa.mjs","/about/index.html","/blog/index.html","/blogPost/index.html","/consultations/index.html","/project/index.html","/webdesign/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"DO6Te3IGffoJws5ii1jFjjdjxkW1p2cmR7lqjGcWh0Q=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
