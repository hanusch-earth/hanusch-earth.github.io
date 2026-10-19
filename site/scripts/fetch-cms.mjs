// Pulls the site content from Baserow and writes it to src/data/*.json and
// src/assets/img/, in exactly the shape src/content.config.ts expects.
// Runs before every build (npm run build). Without a BASEROW_TOKEN it does
// nothing and the build uses the JSON files already in the repo.
//
// Env: BASEROW_TOKEN (read-only database token), BASEROW_URL (optional,
// defaults to Baserow Cloud). Locally both may also live in
// ~/.config/hanusch/baserow.env.
import { readFile, writeFile, stat, copyFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const DATA = join(root, 'src/data');
const IMG = join(root, 'src/assets/img');
const PUBLIC_IMG = join(root, 'public/img');

const localEnv = join(homedir(), '.config/hanusch/baserow.env');
if (!process.env.BASEROW_TOKEN && existsSync(localEnv)) {
  for (const line of readFileSync(localEnv, 'utf8').split('\n')) {
    const m = line.match(/^\s*(BASEROW_TOKEN|BASEROW_URL)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^['"]|['"]$/g, '');
  }
}
const TOKEN = process.env.BASEROW_TOKEN;
const BASE = (process.env.BASEROW_URL || 'https://api.baserow.io').replace(/\/$/, '');
if (!TOKEN) {
  console.log('[cms] no BASEROW_TOKEN, building from the JSON files in src/data');
  process.exit(0);
}

async function api(path) {
  const res = await fetch(BASE + path, { headers: { Authorization: `Token ${TOKEN}` } });
  if (!res.ok) throw new Error(`[cms] ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

/** All rows of a table in their manual (drag and drop) order; rows without a name are skipped. */
async function rows(tables, name) {
  return (await allRows(tables, name)).filter((r) => ['Title', 'Heading', 'Key', 'Label'].some((k) => text(r[k])));
}

async function allRows(tables, name) {
  const table = tables.find((t) => t.name === name);
  if (!table) throw new Error(`[cms] table "${name}" is missing in Baserow`);
  const out = [];
  for (let page = 1; ; page++) {
    const r = await api(`/api/database/rows/table/${table.id}/?user_field_names=true&size=200&page=${page}`);
    out.push(...r.results);
    if (!r.next) return out;
  }
}

// ---------- helpers ----------
const text = (v) => (typeof v === 'string' ? v.trim() : '');
/** Drops empty strings, null and empty arrays so optional schema fields stay unset. */
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length)));
const option = (v) => v?.value ?? '';
const linked = (v) => (Array.isArray(v) && v[0] ? v[0].id : undefined);
const order = (i) => (i + 1) * 10;
/** Newest year first; rows without a year go last; equal years keep the Baserow row order. */
const byYear = (list) => list.map((r, i) => [r, i]).sort(([a, i], [b, j]) => (Number(b.Year) || -1) - (Number(a.Year) || -1) || i - j).map(([r]) => r);
const num = (v) => (v == null || v === '' ? undefined : Number(v));
const paragraphs = (v) => text(v).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const links = (v) =>
  text(v).split('\n').map((l) => l.split('|').map((s) => s.trim())).filter(([label, url]) => label && URL.canParse(url)).map(([label, url]) => ({ label, url }));

/** Leaves out entries with an empty required field, so one unfinished row in Baserow does not stop the whole build. */
const complete = (table, required) => (list) =>
  list.filter((e) => {
    const missing = required.filter((k) => e[k] == null || e[k] === '');
    if (missing.length) console.log(`${process.env.GITHUB_ACTIONS ? '::warning::' : ''}[cms] skipped ${table} "${e.title}": ${missing.join(', ')} missing`);
    return !missing.length;
  });

function slugger() {
  const seen = new Set();
  return (s, prefix = '') => {
    const base = prefix + text(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').slice(0, 80).replace(/^-|-$/g, '');
    let id = base || 'entry', n = 2;
    while (seen.has(id)) id = `${base}-${n++}`;
    seen.add(id);
    return id;
  };
}

/** Downloads a Baserow file field's first file into src/assets/img and returns its file name. */
async function image(field) {
  const f = Array.isArray(field) ? field[0] : undefined;
  if (!f) return undefined;
  const name = f.visible_name.replace(/[^\w.-]+/g, '-');
  const target = join(IMG, name);
  const known = existsSync(target) && (await stat(target)).size === f.size;
  if (!known) {
    const res = await fetch(f.url);
    if (!res.ok) throw new Error(`[cms] download ${name} -> ${res.status}`);
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    console.log(`[cms] image ${name}`);
  }
  return name;
}

async function write(name, data) {
  const file = join(DATA, `${name}.json`);
  const next = JSON.stringify(data, null, 2) + '\n';
  const prev = existsSync(file) ? await readFile(file, 'utf8') : '';
  if (prev !== next) {
    await writeFile(file, next);
    console.log(`[cms] updated ${name}.json`);
  }
}

// ---------- tables -> JSON ----------
const tables = await api('/api/database/tables/all-tables/');
await mkdir(IMG, { recursive: true });

const sections = await rows(tables, 'Sections');
const sectionKey = new Map(sections.map((s) => [s.id, text(s.Key)]));

const pages = [];
for (const p of await rows(tables, 'Pages')) {
  const src = await image(p.Photo);
  pages.push(clean({
    id: text(p.Slug),
    title: text(p.Title),
    description: text(p.Description),
    intro: paragraphs(p.Intro),
    figure: src && clean({ src, alt: text(p['Photo alt text']), caption: text(p['Photo caption']), ratio: text(p['Photo ratio']) }),
    sections: sections
      .filter((s) => linked(s.Page) === p.id)
      .map((s) => clean({ key: text(s.Key), heading: text(s.Heading), note: text(s.Note), html: text(s.Content) })),
  }));
}
await write('pages', pages);

const settings = Object.fromEntries((await rows(tables, 'Settings')).map((s) => [text(s.Key), s]));
const val = (k) => text(settings[k]?.Value);
const portrait = await image(settings.portrait?.File);
if (portrait) {
  await mkdir(PUBLIC_IMG, { recursive: true });
  await copyFile(join(IMG, portrait), join(PUBLIC_IMG, portrait));
}
await write('site', {
  name: val('name'),
  formalName: val('formalName'),
  tagline: val('tagline'),
  role: val('role'),
  intro: val('intro'),
  description: val('description'),
  email: val('email'),
  contactLead: val('contactLead'),
  portrait: { src: portrait, alt: val('portrait'), credit: val('portraitCredit') },
  featured: {
    publication: val('featuredPublication'),
    label: val('featuredLabel'),
    subtitle: val('featuredSubtitle'),
    text: val('featuredText'),
    credits: val('featuredCredits'),
    link: { label: val('featuredLinkLabel'), url: val('featuredLinkUrl') },
  },
  profiles: (await rows(tables, 'Profiles')).map((p) => ({ label: text(p.Label), url: text(p.URL) })).filter((p) => p.label && p.url),
});

const CATEGORY = { Monograph: 'monograph', 'Edited volume': 'edited', 'Journal article': 'article', 'Book chapter': 'chapter', 'Report & other': 'other' };
const STATUS = { Published: 'published', 'In progress': 'in-progress' };
const pubSlug = slugger();
const publications = [];
for (const [i, p] of byYear(await rows(tables, 'Publications')).entries()) {
  publications.push(clean({
    id: pubSlug(text(p.Slug) || p.Title),
    order: order(i),
    category: CATEGORY[option(p.Category)] ?? 'other',
    status: STATUS[option(p.Status)] ?? 'published',
    year: num(p.Year),
    title: text(p.Title),
    url: text(p.URL),
    publisher: text(p.Publisher),
    details: text(p.Details),
    doi: text(p.DOI),
    openAccess: text(p['Open access']),
    cover: await image(p.Cover),
    coverAlt: text(p['Cover alt text']),
  }));
}
await write('publications', publications);

const FORMAT = { Writing: 'text', Audio: 'audio', Video: 'video' };
const mediaSlug = slugger();
await write('media', complete('Media', ['year'])(byYear(await rows(tables, 'Media')).map((m, i) => clean({
  id: mediaSlug(m.Title),
  order: order(i),
  year: num(m.Year),
  title: text(m.Title),
  url: text(m.URL),
  details: text(m.Details),
  format: FORMAT[option(m.Format)] ?? 'text',
  language: text(m.Language),
  audio: text(m['Audio file']),
  duration: num(m['Duration (seconds)']),
  links: links(m.Links),
}))));

for (const [table, file, prefix] of [['CV', 'cv', 'cv-'], ['Teaching', 'teaching', 't-']]) {
  const slug = slugger();
  await write(file, complete(table, ['section', 'period'])((await rows(tables, table)).map((r, i) => clean({
    id: slug(r.Title, prefix),
    order: order(i),
    section: sectionKey.get(linked(r.Section)) ?? '',
    period: text(r.Period),
    title: text(r.Title),
    details: text(r.Details),
    url: text(r.URL),
    links: links(r.Links),
  }))));
}

const areaSlug = slugger();
await write('research-areas', complete('Research areas', ['text'])((await rows(tables, 'Research areas')).map((r, i) => ({
  id: areaSlug(r.Title), order: order(i), title: text(r.Title), text: text(r.Text),
}))));

const projectSlug = slugger();
await write('projects', complete('Projects', ['period', 'text'])((await rows(tables, 'Projects')).map((r, i) => clean({
  id: projectSlug(r.Title), order: order(i), period: text(r.Period), title: text(r.Title), text: text(r.Text), links: links(r.Links),
}))));

console.log('[cms] content pulled from Baserow');
