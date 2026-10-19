// llms.txt: a plain fact sheet for AI assistants, built from the same content
// as the pages, so it stays current with every CMS change.
import type { APIRoute } from 'astro';
import { site, list, getPage } from '../lib/content';

const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;
  const [areas, pubs, research, cv] = await Promise.all([list('researchAreas'), list('publications'), getPage('research'), getPage('cv')]);
  const books = pubs
    .filter((p) => (p.category === 'monograph' || p.category === 'edited') && p.status === 'published')
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    ...cv.intro.map(plain).flatMap((p) => [p, '']),
    '## Research',
    '',
    // the first research paragraph repeats the CV intro above
    ...research.intro.slice(1).map(plain).flatMap((p) => [p, '']),
    ...areas.map((a) => `- ${a.title}: ${plain(a.text)}`),
    '',
    '## Books',
    '',
    ...books.map((b) => `- ${b.title}${b.category === 'edited' ? ' (edited volume)' : ''}. ${b.publisher}, ${b.year}.${b.url ?? b.doi ? ` ${b.url ?? b.doi}` : ''}`),
    '',
    `Full list of publications: ${url('/publications/')}`,
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- Affiliation: Justus Liebig University Giessen, Germany`,
    '',
    '## Links',
    '',
    `- [Website](${url('/')})`,
    `- [Curriculum vitae](${url('/cv/')})`,
    `- [Research](${url('/research/')})`,
    `- [Publications](${url('/publications/')})`,
    `- [Teaching](${url('/teaching/')})`,
    `- [Media](${url('/media/')})`,
    ...site.profiles.map((p) => `- [${p.label}](${p.url})`),
    `- [Legal notice](${url('/legal-notice/')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
