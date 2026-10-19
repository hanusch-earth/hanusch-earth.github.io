// Content model for hanusch.earth.
//
// Every list on the site is a collection loaded from a JSON file in src/data/.
// The content is edited in Baserow; scripts/fetch-cms.mjs pulls it into those
// JSON files before each build. The schemas below are the contract the
// Baserow tables have to match.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const order = z.number().int();

const link = z.object({ label: z.string(), url: z.url() });

const figure = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  // CSS aspect ratio, e.g. "16 / 9"; photos default to 3 / 2
  ratio: z.string().optional(),
});

const pages = defineCollection({
  loader: file('src/data/pages.json'),
  schema: z.object({
    title: z.string(),
    // meta description for search engines and link previews
    description: z.string().optional(),
    intro: z.array(z.string()).default([]),
    figure: figure.optional(),
    sections: z
      .array(
        z.object({
          key: z.string(),
          heading: z.string(),
          note: z.string().optional(),
          html: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const publications = defineCollection({
  loader: file('src/data/publications.json'),
  schema: z.object({
    order,
    category: z.enum(['monograph', 'edited', 'article', 'chapter', 'other']),
    status: z.enum(['published', 'in-progress']).default('published'),
    year: z.number().int().optional(),
    title: z.string(),
    url: z.url().optional(),
    publisher: z.string().optional(),
    details: z.string().optional(),
    doi: z.url().optional(),
    openAccess: z.url().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    links: z.array(link).optional(),
  }),
});

const media = defineCollection({
  loader: file('src/data/media.json'),
  schema: z.object({
    order,
    year: z.number().int(),
    title: z.string(),
    url: z.url().optional(),
    details: z.string().optional(),
    format: z.enum(['text', 'audio', 'video']),
    language: z.string().optional(),
    // Optional audio file (mp3) for an inline player, once the files exist.
    audio: z.string().optional(),
    // Length of the audio in seconds, shown before the file loads.
    duration: z.number().int().optional(),
    links: z.array(link).optional(),
  }),
});

const listEntry = z.object({
  order,
  section: z.string(),
  period: z.string(),
  title: z.string(),
  details: z.string().optional(),
  url: z.url().optional(),
  links: z.array(link).optional(),
});

const cv = defineCollection({ loader: file('src/data/cv.json'), schema: listEntry });
const teaching = defineCollection({ loader: file('src/data/teaching.json'), schema: listEntry });

const researchAreas = defineCollection({
  loader: file('src/data/research-areas.json'),
  schema: z.object({ order, title: z.string(), text: z.string() }),
});

const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    order,
    period: z.string(),
    title: z.string(),
    text: z.string(),
    links: z.array(link).optional(),
  }),
});

export const collections = { pages, publications, media, cv, teaching, researchAreas, projects };
