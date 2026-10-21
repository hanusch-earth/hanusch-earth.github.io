# Inhalte: welche Tabelle steuert was

Die aktuellen Felder mit Hilfetexten und erlaubten Auswahlwerten zeigt jederzeit `baserow.py tables`. Diese Datei erklärt, wo die Inhalte auf der Seite erscheinen und wie die Felder gefüllt werden.

## Allgemeine Formate

- **Absätze** in langen Textfeldern: durch eine Leerzeile getrennt.
- **HTML** ist nur erlaubt in: Pages → `Intro`, Settings → `intro`, Sections → `Content`. Sparsam: `<em>…</em>` für Buchtitel, `<a href="…">…</a>` für Links. Alle anderen Felder sind reiner Text.
- **Links-Felder** (`Links`): ein Link pro Zeile im Format `Label | https://…`. Zeilen ohne gültige Adresse werden ausgelassen.
- **Auswahlfelder** (`Category`, `Status`, `Format`): den Wert als Text schreiben, z. B. `"Category": "Journal article"`.
- **Verknüpfungen** (`Section` bei CV und Teaching, `Page` bei Sections): Liste mit der Zeilen-ID, z. B. `"Section": [18]`. IDs mit `rows Sections <key>` nachsehen.
- **Dateifelder** (`Cover`, `Photo`, Settings → `File`): erst `upload <datei>`, die Ausgabe (eine Liste) unverändert als Feldwert eintragen. Ersetzt das bisherige Bild.
- **Sprache:** Endet `Details` bei Publications oder Media auf „German“ (z. B. `Interview, Deutschlandfunk · German`), zeigt die Seite ein Sprach-Etikett.

## Startseite (/)

Kommt aus **Settings** (Spalte `Key` = was, `Value` = Inhalt; nur `Value` bzw. `File` ändern).

| Key | Erscheint als |
|---|---|
| `name`, `role` | Name und Rolle oben |
| `intro` | Kurzvorstellung (HTML erlaubt) |
| `portrait` | Porträt: Bild im Feld `File`, Alternativtext in `Value` |
| `portraitCredit` | Bildnachweis unter dem Porträt |
| `featuredPublication` | `Slug` der Publikation, die unter „Current“ steht (braucht ein Cover) |
| `featuredLabel` | Zeile wie „New book · MIT Press 2026“ |
| `featuredSubtitle`, `featuredText`, `featuredCredits` | Untertitel, Kurzbeschreibung, Mitautoren des hervorgehobenen Buchs |
| `featuredLinkLabel`, `featuredLinkUrl` | Haupt-Link des hervorgehobenen Buchs |
| `contactLead`, `email` | Kontaktzeile und öffentliche E-Mail |
| `description` | Beschreibung für Suchmaschinen (ca. 150 Zeichen) |
| `formalName`, `tagline` | Name mit Titeln (für Suchmaschinen), Zeile im Fußbereich |

**Neues Buch hervorheben:** Buch in Publications anlegen (mit Cover und einem `Slug`, z. B. `planetary-politics`), dann `featuredPublication` auf diesen Slug setzen und die übrigen `featured…`-Werte anpassen.

## Seitenköpfe: Research, Teaching, Publications, Media, CV, Contact

Tabelle **Pages**, eine Zeile pro Seite. `Title` (Überschrift), `Intro` (Absätze; der erste groß, HTML erlaubt), `Photo` mit `Photo alt text` und `Photo caption` (Bildunterschrift/Nachweis), `Photo ratio` (leer = 3 / 2), `Description` (für Suchmaschinen, ca. 150 Zeichen). `Slug` nie ändern.

## Abschnitte

Tabelle **Sections**: die Zwischenüberschriften jeder Seite (`Heading`) und eine optionale Notiz (`Note`). `Content` (HTML) nur bei reinen Textabschnitten: Adresse auf Contact, Legal notice, Privacy. `Key` nie ändern; keine Abschnitte anlegen oder löschen (dafür braucht es Code).

## Publications (/publications/)

| Feld | Hinweis |
|---|---|
| `Title` | Titel |
| `Subtitle` | Untertitel, erscheint direkt unter dem Titel (nur bei Büchern mit Cover) |
| `Category` | Monograph · Edited volume · Journal article · Book chapter · Report & other (bestimmt den Abschnitt) |
| `Status` | Published · In progress |
| `Year` | Jahr (Zahl) |
| `Publisher` | Verlag bzw. Zeitschrift |
| `Details` | z. B. Mitautoren, Band, Seiten |
| `URL`, `DOI`, `Open access` | vollständige Adressen (`https://doi.org/…`) |
| `Cover`, `Cover alt text` | nur für Bücher; mit Cover erscheint der Eintrag im Cover-Raster |
| `Slug` | leer lassen, außer für das hervorgehobene Buch |

Sortierung automatisch nach Jahr. „In progress“-Einträge stehen in einem eigenen Block unter den Covern; ihnen kein Cover geben, sonst erscheinen sie doppelt.

Beispiel (Werte ausgedacht, nur zur Form):
```json
{"Title": "Example Title", "Category": "Journal article", "Status": "Published", "Year": 2026,
 "Publisher": "Example Journal", "Details": "with A. Author", "DOI": "https://doi.org/10.0000/example"}
```

## Media (/media/)

| Feld | Hinweis |
|---|---|
| `Title`, `Year` | Pflicht (ohne Jahr fehlt der Eintrag auf der Seite) |
| `Format` | Writing · Audio · Video (Filter und Symbol) |
| `Details` | Medium, Sendung, Art; optional „· German“ am Ende |
| `URL` | Link zum Beitrag |
| `Audio file`, `Duration (seconds)` | nur für MP3s, die mit der Website ausgeliefert werden; eine neue MP3 ist eine Code-Änderung (siehe code.md) |
| `Links` | weitere Links, `Label | URL` pro Zeile |

Sortierung automatisch nach Jahr.

## Curriculum Vitae (/cv/) und Teaching (/teaching/)

Tabellen **CV** und **Teaching**. `Title`, `Section` (Pflicht, Verknüpfung zum Abschnitt), `Period` (Pflicht, Freitext wie `2024–` oder `2019–2022`), `Details`, `URL`, `Links`.

Abschnitte (Key → Überschrift):
- CV: `cv-positions` Positions, `cv-service` Leadership & service, `cv-education` Education, `cv-grants` Grants, `cv-fellowships` Fellowships
- Teaching: `t-modules` Modules in Giessen, `t-earlier` Earlier seminars, `t-supervision` Supervision

Die Reihenfolge innerhalb eines Abschnitts folgt der Zeilenreihenfolge (neueste meist oben): neue Einträge mit `--before <id des bisher obersten Eintrags im Abschnitt>` anlegen.

## Research (/research/)

- **Research areas:** `Title`, `Text` (Pflicht). Reihenfolge = Zeilenreihenfolge.
- **Projects:** `Title`, `Period` (Pflicht), `Text` (Pflicht), `Links`.

## Contact (/contact/)

- Adresse: Sections → Abschnitt `c-address`, Feld `Content` (HTML).
- Profil-Links (ORCID, Google Scholar, …): Tabelle **Profiles**, `Label` und `URL`. Suchmaschinen verbinden die Profile außerdem mit seiner Person.

## Legal notice und Privacy

Sections mit Keys `l-…` und `p-…`, Feld `Content` (HTML). Nur auf ausdrückliche Bitte ändern; rechtliche Prüfung empfehlen. Bei Änderungen der Datenschutzerklärung den Abschnitt `p-date` (Last updated) mit aktualisieren.

## Publish

Tabelle **Publish** mit dem Knopf „Publish now“. Nicht ändern; `baserow.py publish` drückt ihn.
