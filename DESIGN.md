---
name: hanusch.earth
description: Personal academic website of Prof. Dr. Frederic Hanusch, Planetary Change and Politics
colors:
  ground: "#0B0D0F"
  warm-white: "#F4F2ED"
  body-ash: "#D2D0CA"
  meta-slate: "#8A9096"
  hairline: "#24272B"
  hairline-strong: "#3A3E43"
  horizon-neon: "#D7FF00"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(46px, 7vw, 104px)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(34px, 4vw, 56px)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.2vw, 30px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  section:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(22px, 1.9vw, 27px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.62
  meta:
    fontFamily: "Source Sans 3, Source Sans Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  tag: "4px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  row: "18px"
  section: "clamp(72px, 8vw, 120px)"
  container: "1344px"
components:
  nav-link:
    textColor: "{colors.meta-slate}"
    typography: "{typography.label}"
  nav-link-active:
    textColor: "{colors.warm-white}"
    typography: "{typography.label}"
  list-row:
    textColor: "{colors.warm-white}"
    typography: "{typography.title}"
    padding: "18px 0"
  filter-button:
    textColor: "{colors.meta-slate}"
    typography: "{typography.label}"
    padding: "8px 0"
  filter-button-active:
    textColor: "{colors.warm-white}"
    typography: "{typography.label}"
    padding: "8px 0"
  tag:
    textColor: "{colors.meta-slate}"
    rounded: "{rounded.tag}"
    padding: "1px 7px"
---

# Design System: hanusch.earth

## Overview

**Creative North Star: "The Scholar's Index"**

The site reads like a carefully kept index of a body of work: a near-black page, a large light name, and then lists of books, articles, positions and appearances, each dated and set on a hairline. The work carries the page. There is no illustration, no planetary imagery and no decoration; the only pictures are real photographs and real publisher covers. The client rejected every planetary visual direction, so the subject lives in the words, not in the ornament.

Density is calm and generous at the top of each page and compact inside the lists, where visitors scan for a year, a title or a DOI. One horizon line, drawn under every page title, is the system's single signature, echoing the cut through the logo mark.

**Key Characteristics:**
- Near-black ground, warm white type, neutral grey meta text.
- Very light Space Grotesk at display sizes; Source Sans 3 for reading.
- Two-column sections: heading left, content right.
- Dated rows with the year shown once per group.
- Neon is held to the logo, the active nav, one highlight and a short marker on each section line.

## Colors

A near-monochrome dark palette with one electric accent held in reserve.

### Primary
- **Horizon Neon** (`horizon-neon`): the brand accent. It sits behind the cut in the logo mark, underlines the active navigation item, marks one highlight per page (on the home page the "New book" marker) and sits as a short 56×2px marker on the top hairline of every content section, so sections are easy to tell apart (client request, 2026-10-18). Also used for text selection and the keyboard focus ring.

### Neutral
- **Ground** (`ground`): the page background everywhere, including header, menu and footer. Not pure black.
- **Warm White** (`warm-white`): headings, titles, links and the logo disc. Warm rather than pure white, because pure white flickers on near-black.
- **Body Ash** (`body-ash`): running text and lead paragraphs (12.6:1 on ground).
- **Meta Slate** (`meta-slate`): years, details, captions, inactive navigation (6.0:1 on ground).
- **Hairline** (`hairline`): row and section dividers, header rule.
- **Hairline Strong** (`hairline-strong`): the horizon rule under titles, cover outlines, link underlines at rest, tag borders.

**The Neon Places Rule.** Horizon Neon appears only in the logo mark, the active nav underline, one highlight per page and the section marker. Never as a full-width divider, background, button fill or other decoration.

## Typography

**Display Font:** Space Grotesk (with system-ui)
**Body Font:** Source Sans 3 (with Source Sans Pro, system-ui)

**Character:** A light, slightly technical grotesque at very large sizes against a quiet humanist sans for reading. Both are self-hosted (latin and latin-ext) for privacy.

### Hierarchy
- **Display** (300, clamp(46px, 7vw, 104px), 0.95): the name on the home page and every page title.
- **Headline** (300, clamp(34px, 4vw, 56px), 1.02): the featured book title.
- **Lead** (400, clamp(22px, 2.2vw, 30px), 1.3): the opening statement of a page, the role line on home.
- **Section** (400, clamp(22px, 1.9vw, 27px), 1.2): section headings in the left column, sentence case.
- **Title** (400, 19px, 1.35): list row titles, book titles.
- **Body** (400, 18px, 1.62): running text, max measure about 40em.
- **Meta** (400, 16px, 1.5): row details, authors, venues, DOIs.
- **Label** (400, 15px): navigation, filters, link groups, years (tabular figures).

**The No Eyebrow Rule.** No small uppercase label above a heading. Context such as "New book · MIT Press 2026" goes below the title as meta.

## Layout

A 12-column grid inside a 1344px container with a fluid gutter. Every content section is a two-column pair: a sticky heading in columns 1–3 and the content in columns 4–12, separated from the previous section by a hairline and generous space (`spacing.section`). Page heroes: the title spans the full width above a horizon rule; below it the lead text sits on the left (cols 1–6) and the photo on the right (cols 7–12). No in-page index: the pages are short (client request).

Rows inside lists use a fixed year column (7.5rem) and the content beside it; on phones the year moves above the title. Below 860px the sticky left column stacks above its content and the navigation becomes a full-screen menu. On the home page the portrait hangs over the horizon rule beside the name; on phones (600px and below) name and portrait stay side by side above the rule, the name set smaller. Sub-page photos take the right half beside the lead from 1100px, without enlargement; below that they follow the lead. The home page holds only intro, the current book and contact.

**The Index Rule.** Lists are rows on hairlines, never cards. A year is printed once per group.

## Elevation & Depth

Flat by design. There are no shadows. Depth comes only from the hairline system. The sticky header and the sticky filter row are solid ground, so nothing shows through while content scrolls beneath.

## Shapes

Square. Photos and covers have no radius. The only rounded element is the small language tag (`rounded.tag`). The logo mark is a full circle cut by a curved horizon; that curve is the one organic form in the system.

## Components

### Navigation
- **Style:** label type in meta slate; hover turns warm white.
- **Active:** warm white with a 2px Horizon Neon underline offset 10px.
- **Mobile:** below 860px a "Menu" button opens a full-screen dialog with large light links on hairlines; focus is trapped inside and Escape closes it.

### List rows (signature)
- Year column in meta slate with tabular figures, hidden when it repeats the row above.
- Title in warm white; linked titles show an underline only on hover.
- Details in meta slate; DOIs printed as plain links.
- Optional format icon column on Media (text, audio, video; one stroke family, 1.4px).

### Filters
- Text buttons without counts, in a solid row that sticks under the header. Active: warm white with a 2px warm white underline. Filtering re-groups the year labels, keeps the choice in the URL and wraps onto two lines on phones instead of scrolling sideways.

### Covers and photos
- Covers 2:3 with a 1px hairline-strong outline and slight dimming (brightness 0.93) that lifts on hover.
- Photos bound to the content column, 3:2 by default (a figure may declare its own ratio), caption in label type below.

### Tag
- Small outlined tag for "German" and similar qualifiers.

## Do's and Don'ts

### Do:
- **Do** keep the ground at #0B0D0F and type in warm white, never pure white.
- **Do** put new lists in the two-column section with dated rows.
- **Do** show real photographs and publisher covers only, with credits.
- **Do** draw the horizon rule under every page title.

### Don't:
- **Don't** add planetary imagery, globes, orbits, starfields or other decoration; the client rejected that direction.
- **Don't** use Horizon Neon beyond its places (logo, active nav, one highlight, section marker).
- **Don't** use cards, shadows or rounded corners for content.
- **Don't** put an uppercase label above a heading.
