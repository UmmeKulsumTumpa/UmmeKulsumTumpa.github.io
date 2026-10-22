import { defineCollection } from 'astro:content';
import { glob, file, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

/* Markdown collections: one file = one entry ------------------------------ */

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.enum(['llm', 'engineering', 'notes', 'essays'])).default([]),
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
    url: z.string().url().optional(),
    why: z.string().optional(),
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
  details: z.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional() })).default([]),
  courses: z.array(z.object({ name: z.string(), note: z.string() })).default([]),
});

const org = z.object({
  id: z.string(),
  org: z.string(),
  short: z.string(),
  url: z.string().url().optional(),
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
  loader: file('src/content/publications.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    tldr: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

export const collections = { writing, reading, experience, education, projects, publications };
