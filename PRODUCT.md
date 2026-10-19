# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, static output, hosted on GitHub Pages (built by a GitHub Action). Content is edited in Baserow and pulled into JSON collections (`site/src/data/`) at build time by `site/scripts/fetch-cms.mjs`. Content must therefore never be hard-coded in templates.

## Users

Mixed audience, academic world first (confirmed 2026-10-11).

1. **Primary – the academic and institutional world:** conference and workshop organisers, fellow researchers, funders, publishers, programme committees. They usually already know Frederic Hanusch or one of his books and come to check something specific: current affiliation, recent publications, a CV for an application or a programme booklet, a bio, contact.
2. **Secondary – public and cultural world:** journalists, editors, curators, artists, policy people. They often find him through a book, an interview or a search and don't yet know what "planetary politics" means. They need a clear framing and reasons to trust him before they get in touch.
3. Students looking for his modules exist but are not the focus.

## Product Purpose

The personal academic website of Prof. Dr. Frederic Hanusch, Professor of Planetary Change and Politics at Justus Liebig University Giessen. It replaces the existing Wix site at hanusch.earth.

Success: he gets found and asked — for talks, collaborations, fellowships, reviews and media requests. Research, publications, teaching and media appearances work as the evidence behind that.

## Positioning

He works at the point where the humanities and social sciences meet planetary change: what politics would look like if the Earth itself could take part in it. Recurring threads are the planetary as a political category, deep time and planetary temporalities, and the future of democracy (including nonhuman participation). Another academic site could copy the layout but not this body of work: books with MIT Press, Cambridge University Press and Routledge, co-founding the Panel on Planetary Thinking, and the science–art residency programme.

## Operating Context

- Visitors look up specifics: latest book, a citation, a bio to paste into a programme, a portrait, an email address.
- Much of the content is long lists that change: publications (books, articles & chapters, policy reports), talks, media items (video, audio, print/online), courses. These are the parts that will be maintained in the CMS later.
- Content is in English. Some publications and media items are German-language originals and are labelled "(German)".

## Capabilities and Constraints

- Language: English only for now (confirmed 2026-10-11). German may come later; don't block it structurally.
- Sections carried over from the old site in full: Home/Profile, Research, CV, Publications, Teaching, Media. **Beekeeping is removed entirely** — that topic no longer exists and must not appear anywhere (including the bio).
- Public contact: university address only (Justus Liebig University Giessen, Senckenbergstraße 3, 35390 Giessen, frederic.hanusch@uni-giessen.de). The Marburg address and mobile number from the letterhead must **not** appear on the website.
- SEO/GEO work is deferred to after design approval. Design approval by the client is the immediate goal.
- Decided (2026-10-19): Baserow as CMS, GitHub Pages as host, no contact form (email link only).

## Brand Commitments

- The logo system (kept outside this repository) is final and is adopted unchanged: the "Horizon" mark (a disc cut by a horizon), the name set in Space Grotesk, optional tagline "PLANETARY CHANGE & POLITICS" only where context is missing.
- Name form: "Frederic Hanusch" in the logo; "Prof. Dr. Frederic Hanusch" in contact and formal contexts.
- Voice: scholarly and precise, not promotional; first person is used on the current site for research and teaching texts, third person for the bio.

## Evidence on Hand

All captured from the live site on 2026-10-11 in `recherche/live-seite/` (text + full-page screenshots):

- Bio with affiliations (JLU Giessen; Panel on Planetary Thinking co-founder; Earth System Governance Project Working Group on Democracy co-convener; British Academy / Carnegie Endowment working group on Transnational and Planetary Challenges).
- Books: Our Planetary Condition (MIT Press, forthcoming 2026), The Politics of Deep Time (CUP 2023), Democracy and Climate Change (Routledge 2018), Seeds for Democratic Futures (transcript 2024) and the German edition Demokratie säen (2026), Planetar denken (2021), two works in progress under contract (OUP handbook, CUP Element).
- Long list of articles & chapters and WBGU policy reports.
- Full CV (education, positions, scholarships).
- Teaching concept and course list.
- Media: video (3sat scobel, Centre for Deliberative Democracy, THE NEW INSTITUTE, Earth101), audio, print/online (FAZ, Die Furche, Futurium, Spiegel, ARD hartaberfair, etc.).
- Research page: three research areas named (the planetary, time, democracy) but described as "more information soon"; arts collaboration (Planetary Scholars and Artists in Residence Program with Claus Leggewie).
- Profile links: ORCID 0000-0002-1864-9284, Google Scholar, ResearchGate, Academia.

Also on hand (downloaded in original resolution, see `recherche/live-seite/bilder/ZUORDNUNG.md`): a portrait photo of Frederic Hanusch, covers of all books and WBGU reports, video thumbnails, and at least three audio items (podcast and radio).

Absent — must not be invented: photographer credit for the portrait, detailed descriptions of the three research areas, upcoming talks with dates, testimonials. Ask the client.

## Product Principles

1. **Evidence over claims.** The work speaks: books, publishers, institutions. No marketing superlatives.
2. **Fast to the specific thing.** An organiser must find bio, CV, latest book and email within seconds.
3. **Make the idea legible to newcomers.** One clear framing of "planetary change and politics" for people who arrive without context.
4. **Content is data.** Every list must be maintainable from a CMS without touching layout.
5. **Restraint carries the brand.** The identity is precise and sparse; the site should feel the same.
