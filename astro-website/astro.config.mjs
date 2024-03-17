import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    //not as cool as https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/
    syntaxHighlight: 'prism'
  },
  site: "https://halb.it"
});