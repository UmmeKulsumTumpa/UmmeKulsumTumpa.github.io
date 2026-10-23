import { defineCollection } from 'astro:content';
import { glob, file, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

/* Markdown collections: one file = one entry ------------------------------ */

/** Writing tags, in the order of the filter pills on /writing/ (src/lib/posts.ts re-exports it as TAGS). */
export const WRITING_TAGS = ['llm', 'engineering', 'notes', 'essays'] as const;

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.enum(WRITING_TAGS)).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const reading = defineCollection({
  loader: glob({ base: './src/content/reading', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    kind: z.enum(['book', 'paper', 'article']),
    status: z.enum(['reading', 'finished', 'queued']),
    topic: z.string().optional(),
    year: z.union([z.number(), z.string()]).optional(),
    finished: z.coerce.date().optional(), // the day you finished it; books finished this year count in "books in <year>"
    url: z.url().optional(),
    why: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/* YAML collections: one file = a list of entries --------------------------- */

/**
 * Astro stores entries sorted by id, which loses the order of a YAML list. Lists are newest first
 * by their position in the file (SPEC §4), so this wraps file() and records each entry's position
 * as `order`. Read in file order with `.sort((a, b) => a.data.order - b.data.order)`.
 */
function ordered(path: string): Loader {
  const inner = file(path);
  return {
    name: 'ordered-file-loader',
    load: (context) => {
      let position = 0;
      return inner.load({
        ...context,
        parseData: (props) => context.parseData({ ...props, data: { ...props.data, order: position++ } }),
      });
    },
  };
}

const role = z.object({
  title: z.string(),
  type: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  current: z.boolean().default(false),
  summary: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  link: z.object({ label: z.string(), href: z.string() }).optional(), // shown after the summary
  details: z.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional() })).default([]),
  courses: z.array(z.object({ name: z.string(), note: z.string() })).default([]),
  progress: z.number().min(0).max(100).optional(), // thesis progress in %, shown on the Home education tile
});

const org = z.object({
  id: z.string(),
  org: z.string(),
  short: z.string(),
  url: z.url().optional(),
  location: z.string(),
  span: z.string(),
  roles: z.array(role).min(1),
  order: z.number(), // set by ordered(): position in the YAML file, not written by hand
});

const experience = defineCollection({ loader: ordered('src/content/experience.yaml'), schema: org });
const education = defineCollection({ loader: ordered('src/content/education.yaml'), schema: org });

const projects = defineCollection({
  loader: ordered('src/content/course-projects.yaml'),
  schema: z.object({
    id: z.string(), // GitHub repo name
    category: z.enum(['spl', 'ai', 'sys', 'fund']),
    lang: z.string(),
    desc: z.string(),
    course: z.string(),
    order: z.number(), // set by ordered(): position in the YAML file, not written by hand
  }),
});

const publications = defineCollection({
  loader: ordered('src/content/publications.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    short: z.string().optional(), // shorter title for the Home research tile (falls back to title)
    venueShort: z.string().optional(), // shorter venue for the Home research tile (falls back to venue)
    tldr: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    order: z.number(), // set by ordered(): position in the YAML file, not written by hand
  }),
});

/** Experience "02 · selected projects": a `line` piece is plain text or a link shown inside the line. */
const selectedProjects = defineCollection({
  loader: ordered('src/content/selected-projects.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    href: z.string(),
    meta: z.string().optional(),
    line: z.array(z.union([z.string(), z.object({ text: z.string(), href: z.string() })])).min(1),
    stack: z.string(),
    order: z.number(), // set by ordered(): position in the YAML file, not written by hand
  }),
});

/** Experience "03 · toolbox": one entry per column. */
const toolbox = defineCollection({
  loader: ordered('src/content/toolbox.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    items: z.array(z.string()).min(1),
    order: z.number(), // set by ordered(): position in the YAML file, not written by hand
  }),
});

/** Education "05 · certifications": thumbnail links to the full-size certificate image. */
const certifications = defineCollection({
  loader: ordered('src/content/certifications.yaml'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      issuer: z.string(),
      date: z.string(), // shown as written, e.g. "Dec 2024"
      note: z.string().optional(), // one line under the title
      image: image(), // path relative to the YAML file, e.g. ../assets/certificates/<file>.jpg
      alt: z.string(), // describes the certificate image
      url: z.url().optional(), // issuer's verification page, shown as a link
      order: z.number(), // set by ordered(): position in the YAML file, not written by hand
    }),
});

export const collections = { writing, reading, experience, education, projects, publications, selectedProjects, toolbox, certifications };
