// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';
import inline from '@playform/inline';

import { visit } from 'unist-util-visit';

function remarkUnwrapImages() {
  /** @param {any} tree */
  return function (tree) {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length !== 1) return;
      if (node.children[0].type === 'image') {
        parent.children.splice(index, 1, node.children[0]);
        return index;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://francescoimola.com',
  trailingSlash: 'never',
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [mdx({
    remarkPlugins: [remarkUnwrapImages]
  }), sitemap({
    filter: (page) => !page.includes('/work-with-me') && !page.includes('/soon'),
    serialize: (item) => {
      // Strip trailing slashes (except homepage) to match internal links
      if (item.url !== 'https://francescoimola.com/' && item.url.endsWith('/')) {
        item.url = item.url.slice(0, -1);
      }
      return item;
    },
  }), react(), inline()],
  adapter: cloudflare({
    imageService: 'compile',
  }),
  output: 'server',
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
});