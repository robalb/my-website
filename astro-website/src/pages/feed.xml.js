import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';


export async function GET(context) {
  //configuration
  let icon_url = "https://halb.it/favicon.ico"
  let logo_url = "https://halb.it/favicon.svg"
  let language = "en-us"
  let feed_title = "Robalb's blog"
  let feed_description = "Articles and CTF writeups"
  let author_name = "Alberto Ventafridda"
  const defaults = {
    title: "missing title",
    description: "",
  };
  let last_update = new Date().toISOString()


  //import all pages
  let posts = import.meta.glob('./posts/*.{md,mdx}');
  let items = [];
  for (const path in posts) {
    let mod = await posts[path]();
    let front = mod.frontmatter
    let item = {
      title: (front.title || defaults.title),
      description: front.description || defaults.description,
      link: front.permalink || (context.site + mod.url.slice(1)),
      pubDate: front.publishDate || front.publishdate
    }
    items.push(item)
  }

  return rss({
    // `<title>` field in output xml
    title: feed_title,
    // `<description>` field in output xml
    description: feed_description,
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: items,
    // (optional) inject custom xml
    customData: `
<language>${language}</language>
<logo>${logo_url}</logo>
<icon>${icon_url}</icon>
<updated>${last_update}</updated>
<author>
  <name>${author_name}</name>
</author>
`,
  });
}
