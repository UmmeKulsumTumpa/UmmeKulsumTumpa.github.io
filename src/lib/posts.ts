import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'writing'>;
export type Tag = Post['data']['tags'][number];

/** Filter order on /writing/; the same values as the `tags` enum in content.config.ts. */
export const TAGS = ['llm', 'engineering', 'notes', 'essays'] as const satisfies readonly Tag[];

/**
 * Posts newest first. Drafts are left out of production builds (SPEC §5.5) and shown by `npm run dev`
 * so a draft can be previewed before it is published.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Reading time in minutes: words / 220, rounded up (at least 1). */
export function readingTime(post: Post): number {
  const words = post.body?.match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220));
}

/** Post date as shown on the site: YYYY-MM-DD. */
export const postDate = (post: Post) => post.data.date.toISOString().slice(0, 10);

export const postHref = (post: Post) => `/writing/${post.id}/`;
