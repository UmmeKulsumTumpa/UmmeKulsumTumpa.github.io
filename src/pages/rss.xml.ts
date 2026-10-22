import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { getPosts, postHref } from '../lib/posts';

// /rss.xml (SPEC §5.5): every published post, newest first; drafts are left out by getPosts().
export async function GET(context: APIContext) {
  if (!context.site) throw new Error('/rss.xml needs `site` in astro.config');
  const posts = await getPosts();
  return rss({
    title: `Writing · ${site.name}`,
    description: "Notes on LLMs, building software, and the books and ideas I can't stop thinking about.",
    site: new URL('/writing/', context.site).href,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: postHref(post),
      categories: post.data.tags,
    })),
    customData: `<language>en</language><atom:link href="${new URL('/rss.xml', context.site).href}" rel="self" type="application/rss+xml"/>`,
  });
}
