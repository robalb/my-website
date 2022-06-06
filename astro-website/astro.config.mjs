import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), react()],
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    //not as cool as https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/
    syntaxHighlight: 'prism',
  },
  site: "https://halb.it"
});