// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

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
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [mdx({
    remarkPlugins: [remarkUnwrapImages]
  }), sitemap(), react()],
  adapter: cloudflare({
    imageService: 'compile',
  }),
  output: 'server',
  vite: {
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
});