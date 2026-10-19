import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import site from '../data/site.json';

export { site };

export async function getPage(id: string) {
  const page = await getEntry('pages', id);
  if (!page) throw new Error(`Page "${id}" is missing in the pages collection`);
  return page.data;
}

type Listed = 'publications' | 'media' | 'cv' | 'teaching' | 'researchAreas' | 'projects';

/** All entries of a collection with their id, sorted by the `order` field. */
export async function list<C extends Listed>(collection: C): Promise<(CollectionEntry<C>['data'] & { id: string })[]> {
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  return all
    .map((e) => ({ id: e.id, ...(e.data as CollectionEntry<C>['data']) }))
    .sort((a, b) => a.order - b.order);
}

/** Entries of a list collection that belong to one section, sorted. */
export async function bySection(collection: 'cv' | 'teaching', section: string) {
  return (await list(collection)).filter((e) => e.section === section);
}

/** Marks rows whose year repeats the previous row, so each year shows once. */
export function withYearGroups<T>(rows: T[], get: (r: T) => string | number | undefined) {
  let prev = '';
  return rows.map((row) => {
    const label = String(get(row) ?? '');
    const repeat = label !== '' && label === prev;
    if (label) prev = label;
    return { row, label, repeat };
  });
}

/** Splits a trailing language note (" · German") off a details line. */
export function splitLang(details?: string): [string | undefined, string | undefined] {
  const m = details?.match(/^(.*?)(?:\s*·\s*)?\b(German)$/);
  return m ? [m[1] || undefined, m[2]] : [details, undefined];
}

export const mediaFormats = {
  text: 'Writing',
  audio: 'Audio',
  video: 'Video',
} as const;
