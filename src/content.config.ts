import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
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

const role = z.object({
  title: z.string(),
  type: z.string().optional(),
  start: z.string(),
  end: z.string().optional(),
  current: z.boolean().default(false),
  summary: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  details: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
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
});

const experience = defineCollection({ loader: file('src/content/experience.yaml'), schema: org });
const education = defineCollection({ loader: file('src/content/education.yaml'), schema: org });

const projects = defineCollection({
  loader: file('src/content/course-projects.yaml'),
  schema: z.object({
    id: z.string(), // GitHub repo name
    category: z.enum(['spl', 'ai', 'sys', 'fund']),
    lang: z.string(),
    desc: z.string(),
    course: z.string(),
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
