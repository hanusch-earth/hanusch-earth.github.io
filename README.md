# hanusch.earth

Website of Prof. Dr. Frederic Hanusch, Professor of Planetary Change and Politics at Justus Liebig University Giessen. Live at https://www.hanusch.earth.

## Structure

| Path | Content |
|---|---|
| `site/` | Astro project (static build) |
| `site/src/pages/` | one file per page, plus `sitemap.xml` and `llms.txt` |
| `site/src/components/`, `site/src/layouts/` | building blocks and the page frame |
| `site/src/styles/site.css` | the one stylesheet |
| `site/src/data/` | content as JSON, pulled from Baserow before each build |
| `site/src/assets/img/` | photos and covers (resized at build time) |
| `site/public/` | fonts, audio, favicons, share image, robots.txt |
| `site/scripts/fetch-cms.mjs` | pulls the content from Baserow |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | product context and design system |

## Editing content

All texts, lists and photos are edited in Baserow (workspace "Hanusch.Earth", database "Webseite"). Rows appear in the order they have in Baserow; publications and media are sorted by year automatically. After a change, the site is rebuilt by the GitHub Action.

## Local development

```sh
cd site
npm ci
npm run dev      # local preview at http://localhost:4321
npm run build    # pulls Baserow content (if BASEROW_TOKEN is set) and builds to site/dist
```

`BASEROW_TOKEN` is a read-only Baserow database token. Locally it can live in `~/.config/hanusch/baserow.env`; never commit it. Without it the build uses the JSON files in `site/src/data/`.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes to GitHub Pages. It needs:

- the repository secret `BASEROW_TOKEN`,
- Pages set to "GitHub Actions" with the custom domain `www.hanusch.earth`,
- the repository variable `PAGES_ENABLED` set to `true`.
