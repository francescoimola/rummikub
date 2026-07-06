const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const { promisify } = require("util");
const { readFile } = require("fs");
const { JSDOM } = require("jsdom");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  if (eleventyConfig === null || eleventyConfig === undefined) {
    throw new Error("Eleventy configuration is null or undefined.");
  }

  try {
    let markdownItOptions = {
      html: true,
    };

    // Custom markdown-it plugin to add eleventy:ignore to remote images
    const md = markdownIt(markdownItOptions).use(markdownItAttrs);

    // Store original image renderer
    const defaultImageRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    // Override image renderer to add eleventy:ignore to remote URLs
    md.renderer.rules.image = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcIndex = token.attrIndex('src');

      if (srcIndex >= 0) {
        const src = token.attrs[srcIndex][1];
        // If it's a remote URL, add eleventy:ignore
        if (src.startsWith('http://') || src.startsWith('https://')) {
          token.attrPush(['eleventy:ignore', '']);
        }
      }

      return defaultImageRender(tokens, idx, options, env, self);
    };

    eleventyConfig.setLibrary("md", md);
    eleventyConfig.addPlugin(eleventySass);
    eleventyConfig.addPlugin(pluginRss);

    // The sass plugin only watches the index.scss entry, not its @use'd
    // partials (_colors.scss, _scale.scss, etc.). Watch the whole css dir so
    // editing a partial triggers a rebuild + recompile in --serve mode.
    eleventyConfig.addWatchTarget("./src/css/");

    eleventyConfig.setServerOptions({ domDiff: false });

    // Add eleventy:ignore to remote images BEFORE image transform runs
    eleventyConfig.addTransform("ignoreRemoteImages", (content, outputPath) => {
      if (outputPath?.endsWith(".html")) {
        // Add eleventy:ignore to all images with remote URLs (http/https)
        content = content.replace(
          /<img\s+([^>]*?)src=["'](https?:\/\/[^"']+)["']([^>]*?)>/gi,
          (match, before, url, after) => {
            // Don't add if already has eleventy:ignore
            if (match.includes("eleventy:ignore")) {
              return match;
            }
            return `<img ${before}src="${url}"${after} eleventy:ignore>`;
          }
        );
      }
      return content;
    });

    // eleventy-img transform configuration
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
      // Output image formats
      formats: ["webp", "jpeg"],

      // Output directory (relative to project root)
      outputDir: "./public/assets/images",

      // URL path for generated images
      urlPath: "/assets/images/",

      // Output image widths
      widths: [400, 800, 1200, 1440, "auto"],

      // Optional, attributes assigned on <img> nodes override these values
      defaultAttributes: {
        loading: "lazy",
        decoding: "async",
      },

      // Custom filename format for local images
      filenameFormat: function (_id, src, width, format) {
        const path = require("path");
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      },
    });

    // Add lazy loading attributes to all images (including Cloudinary)
    eleventyConfig.addTransform("lazyImages", (content, outputPath) => {
      if (outputPath?.endsWith(".html")) {
        content = content.replace(/<img(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>');
        content = content.replace(/<img(?![^>]*\bdecoding=)([^>]*)>/gi, '<img decoding="async"$1>');
      }
      return content;
    });

    // Blog categories collection - extracts all unique categories from blog posts
    eleventyConfig.addCollection("blogCategories", function (collectionApi) {
      let categories = new Set();
      let posts = collectionApi.getFilteredByTag("blog");
      posts.forEach((p) => {
        if (p.data.categories) {
          p.data.categories.forEach((c) => categories.add(c));
        }
      });
      return Array.from(categories).sort();
    });

    // Passthrough copy for static assets (exclude images - handled by plugin)
    eleventyConfig.addPassthroughCopy("src/assets/favicon");
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy({ "src/css/vendor": "css/vendor" });
    eleventyConfig.addPassthroughCopy("src/assets/*.js");
    // Project videos (mp4/webm) + posters — copied byte-for-byte. NOT run through
    // eleventy-img (that plugin only touches <img>); <video> is left untouched.
    eleventyConfig.addPassthroughCopy("src/assets/portfolio");
    eleventyConfig.addPassthroughCopy("src/assets/video");
    eleventyConfig.addPassthroughCopy("src/assets/images/*.gif");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/_redirects");

    // Readable date filter
    eleventyConfig.addFilter("readableDate", function (date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    });

    // Add split filter for Nunjucks
    eleventyConfig.addFilter("split", function (str, separator) {
      return str.split(separator);
    });

    // Add limit filter for Nunjucks
    eleventyConfig.addFilter("limit", function (array, limit) {
      return array.slice(0, limit);
    });

    // Filter blog posts by category
    eleventyConfig.addFilter("filterByCategory", function (posts, cat) {
      if (!cat) return posts;
      cat = cat.toLowerCase();
      return posts.filter((p) => {
        if (!p.data.categories) return false;
        let cats = p.data.categories.map((s) => s.toLowerCase());
        return cats.includes(cat);
      });
    });

    // Slugify filter for URL-safe strings
    eleventyConfig.addFilter("slugify", function (str) {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    });

    // URL encoding filter for social share links
    eleventyConfig.addFilter("urlencode", function (str) {
      if (!str) return "";
      return encodeURIComponent(String(str));
    });

    // Helper shortcode for Cloudinary/remote images (automatically adds eleventy:ignore)
    eleventyConfig.addShortcode("remoteImg", function(src, width, height, alt, attrs = "") {
      return `<img src="${src}" width="${width}" height="${height}" alt="${alt}" ${attrs} eleventy:ignore>`;
    });

    // Animated image shortcode: converts GIF to animated WebP with GIF fallback
    eleventyConfig.addShortcode("animatedImg", async function (src, alt, options = {}) {
      const path = require("path");
      const fsSrc = src.startsWith("./") ? "src" + src.slice(1) : src.startsWith("/") ? "src" + src : src;

      let metadata = await eleventyImage(fsSrc, {
        widths: [400, 800, 1200],
        formats: ["webp", "gif"],
        sharpOptions: { animated: true, limitInputPixels: false },
        outputDir: "./public/assets/images",
        urlPath: "/assets/images/",
        filenameFormat: function (_id, src, width, format) {
          const ext = path.extname(src);
          const name = path.basename(src, ext);
          return `${name}-${width}w.${format}`;
        },
      });

      return eleventyImage.generateHTML(metadata, {
        alt,
        sizes: options.sizes || "(max-width: 49rem) 100vw, 60ch",
        loading: "lazy",
        decoding: "async",
        "eleventy:ignore": "",
        ...(options.class && { class: options.class }),
      });
    });

    // Lazy, autoplay-in-view project video. Mirrors the old Astro ProjectVideo:
    // preload="none" + data-src so nothing downloads until the IntersectionObserver
    // in app-core.js sees it near the viewport (see .project-video* CSS + app-core.js).
    //   {% projectVideo "/assets/portfolio/x.webm", "Alt text" %}                 (webm-only, Safari 16+)
    //   {% projectVideo "/assets/portfolio/x.mp4", "Alt", webm="/assets/portfolio/x.webm" %}  (webm + mp4 fallback)
    //   options: { poster, webm, caption }
    eleventyConfig.addShortcode("projectVideo", function (src, alt = "", options = {}) {
      const { poster, webm, caption } = options || {};
      const posterAttr = poster ? ` poster="${poster}"` : "";
      // Multi-format: <source data-src> (webm first, mp4 fallback). Single-format:
      // video[data-src] with no type attribute, so a .webm or .mp4 works directly.
      const sources = webm
        ? `<source data-src="${webm}" type="video/webm"><source data-src="${src}" type="video/mp4">`
        : "";
      const dataSrc = webm ? "" : ` data-src="${src}"`;
      const figcaption = caption
        ? `\n  <figcaption class="has-text-grey">${caption}</figcaption>`
        : "";
      return `<figure class="project-video">
  <div class="project-video-wrapper">
    <video class="project-video-el" muted loop playsinline preload="none"${dataSrc}${posterAttr} aria-label="${alt}">${sources}</video>
    <button class="project-video-play" type="button" aria-label="Play video">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.45)"/>
        <path d="M19 15l14 9-14 9V15z" fill="white"/>
      </svg>
    </button>
  </div>${figcaption}
</figure>`;
    });

    return {
      dir: {
        input: "src",
        output: "public",
      },
    };
  } catch (error) {
    console.error("Error configuring Eleventy:", error);
    throw error;
  }
};
