import { getCollection, type CollectionEntry } from 'astro:content';

type Entry = CollectionEntry<'reading'>;

const STATUS_ORDER: Record<Entry['data']['status'], number> = { reading: 0, finished: 1, queued: 2 };

/**
 * Reading entries: reading first, then finished, then queued (as in Reading.dc.html), A–Z by file name
 * within each. Drafts are left out of production builds and shown by `npm run dev`, as for posts.
 * Every page or component that reads the collection goes through here, so no draft can leak.
 */
export async function getReading(): Promise<Entry[]> {
  const entries = await getCollection('reading', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => STATUS_ORDER[a.data.status] - STATUS_ORDER[b.data.status] || a.id.localeCompare(b.id));
}

/** An entry with a Markdown body has notes, published at notesHref(). */
export const hasNotes = (entry: Entry) => Boolean(entry.body?.trim());

export const notesHref = (entry: Entry) => `/reading/${entry.id}/`;

/**
 * What's on the desk (Home hero "reading" line and Glimpse tile): the first book being read, else the
 * first entry of any kind being read, else undefined.
 */
export async function getCurrentRead(): Promise<Entry | undefined> {
  const reading = (await getReading()).filter(({ data }) => data.status === 'reading');
  return reading.find(({ data }) => data.kind === 'book') ?? reading[0];
}
