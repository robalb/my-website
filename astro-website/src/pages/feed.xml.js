import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';


export async function GET(context) {

  //import all pages
  let posts = import.meta.glob('./posts/*.{md,mdx}');
  let items = [];
  const defaults = {
    title: "missing title",
    description: "",
  };

  for (const path in posts) {
    let mod = await posts[path]();
    let front = mod.frontmatter
    let item = {
      title: (front.title || defaults.title),
      description: front.description || defaults.description,
      link: front.permalink || mod.url,
      pubDate: front.publishDate || front.publishdate,
      content: "CONT"
    }
    items.push(item)
    // console.log([path, "URL",  mod.url, mod.frontmatter, mod])
  }

  console.log(items)

  return rss({
    // `<title>` field in output xml
    title: 'Robalb\'s blog',
    // `<description>` field in output xml
    description: 'Articles and CTF writeups',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: items,
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
