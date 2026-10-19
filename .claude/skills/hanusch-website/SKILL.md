---
name: hanusch-website
description: Inhalte der Website hanusch.earth (Prof. Dr. Frederic Hanusch) in Baserow ändern und veröffentlichen. Verwenden, wenn neue Publikationen, Medienauftritte, Lebenslauf- oder Lehreinträge, Forschungsfelder, Projekte, Texte, Fotos, das hervorgehobene Buch auf der Startseite oder Profil-Links hinzugefügt, geändert oder entfernt werden sollen, oder wenn die Website neu veröffentlicht werden soll.
---

# Website hanusch.earth pflegen

Du pflegst die persönliche Website von Prof. Dr. Frederic Hanusch. Er sagt dir in eigenen Worten, was sich ändern soll („neues Buch“, „Interview vom Dienstag ergänzen“, „Foto auf der Lehre-Seite tauschen“). Du findest die richtige Stelle, zeigst ihm die Änderung, trägst sie nach seinem OK in Baserow ein, veröffentlichst die Seite und meldest dich, sobald sie live ist.

Sprich mit ihm in seiner Sprache (in der Regel Deutsch). Die Inhalte der Website sind **Englisch**.

## So funktioniert die Website

```
Baserow (Inhalte) ──„Publish now“──▶ GitHub Actions (baut die Seite, ca. 2 Min.) ──▶ GitHub Pages (live)
```

| Was | Wo |
|---|---|
| Inhalte | Baserow Cloud, Workspace „Hanusch.Earth“, Datenbank „Webseite“: https://baserow.io |
| Live-Seite | https://hanusch-earth.github.io (später https://www.hanusch.earth) |
| Code (Layout, Design, Seitenaufbau) | https://github.com/hanusch-earth/hanusch-earth.github.io, öffentlich |
| Builds | https://github.com/hanusch-earth/hanusch-earth.github.io/actions |

Änderungen in Baserow erscheinen **erst nach dem Veröffentlichen** auf der Seite. Das übernimmst du nach jeder Änderung selbst (siehe Ablauf).

## Werkzeug

Alle Zugriffe laufen über `scripts/baserow.py` in diesem Skill-Ordner (nur Python 3, keine Installation nötig). Rufe es mit dem vollen Pfad auf, z. B. `python3 <skill-ordner>/scripts/baserow.py rows Publications`. Ohne Argument zeigt es alle Befehle.

## Beim ersten Mal: Zugang einrichten

Prüfe zuerst mit `baserow.py check`, ob schon ein Token gespeichert ist. Wenn nicht:

1. Bitte ihn, in Baserow einen eigenen Datenbank-Token anzulegen: Baserow öffnen → links oben auf den Workspace-Namen bzw. sein Profil → **My settings** → **Database tokens** → **Create token**. Name z. B. „Claude“, Workspace **Hanusch.Earth**. Die Rechte (create, read, update, delete) bleiben alle an.
2. Speichern:
   - Am besten tippt er selbst in Claude Code `! python3 <skill-ordner>/scripts/baserow.py setup` und fügt den Token in die verdeckte Eingabe ein. So taucht er nie im Chat auf.
   - Schickt er dir den Token stattdessen im Chat, speicherst du ihn selbst: `printf '%s\n' '<token>' | python3 <skill-ordner>/scripts/baserow.py setup`. Sag ihm danach, dass er den Token in Baserow jederzeit widerrufen und einen neuen anlegen kann.
3. `setup` testet den Token und legt ihn in `~/.config/hanusch-website/baserow-token` ab (nur für ihn lesbar).

**Zugangsdaten gehören nie in diesen Skill, ins Repository oder in andere Dateien.** Das Repository ist öffentlich. Für das Veröffentlichen ist kein weiterer Schlüssel nötig: Das Skript liest die Adresse des Knopfs „Publish now“ aus Baserow. Einen GitHub-Zugang braucht er für die Inhaltspflege nicht.

## Ablauf bei jeder Änderung

1. **Verstehen.** Welche Seite, welcher Eintrag? Welche Tabelle zuständig ist, steht in [reference/inhalte.md](reference/inhalte.md). Fehlen Angaben (Jahr, Verlag, Link, Bildnachweis), frag nach. **Nichts erfinden**: keine Jahreszahlen, Titel, Links oder Beschreibungen raten. Lieber ein Feld leer lassen.
2. **Aktuellen Stand lesen** mit `rows <Tabelle> [Suchtext]`, damit du an der richtigen Zeile arbeitest und keine Dubletten anlegst.
3. **Vorschlag zeigen.** Knapp: Tabelle, Zeile, Feld, bisher → neu. Bei neuen Einträgen alle Felder, die du füllst. Formuliere englische Texte im Stil der vorhandenen Einträge (sachlich, kurz) und lass sie ihn bestätigen.
4. **Nach seinem OK schreiben** mit `create`, `update`, `move` oder `upload`. Mehrere Änderungen einer Anfrage zusammen erledigen.
5. **Veröffentlichen und dranbleiben**, einmal am Ende jeder abgeschlossenen Anfrage, auch bei kleinen Änderungen:
   ```
   python3 <skill-ordner>/scripts/baserow.py publish --check <Pfad> "<neuer Text>"
   ```
   `<Pfad>` ist die Seite mit der Änderung (`/`, `/publications/`, `/media/`, `/cv/`, `/teaching/`, `/research/`, `/contact/`), `<neuer Text>` ein kurzes, eindeutiges Stück des neuen Inhalts (z. B. der neue Titel). Bei Löschungen oder Bildern ohne prüfbaren Text nur `publish --wait`.
   Sag ihm vorher in einem Satz, dass die Seite gerade gebaut wird und du dich meldest, sobald sie live ist (meist 2–5 Minuten). Das Skript bleibt aktiv, bis der Build fertig und die Änderung online ist (höchstens etwa 30 Minuten). Gib dem Befehl deshalb genug Zeit: in Claude Code mit Timeout 600000 ms oder als Hintergrundbefehl, dessen Ende du abwartest; läuft er in ein Timeout, führe `status` und `live` aus, bis das Ergebnis feststeht.
6. **Melden, wenn es live ist.** Endet das Skript mit `LIVE:`, sag ihm in ein, zwei Sätzen, was jetzt online ist, mit Link zur Seite. Endet es mit `error:`, erkläre ihm verständlich, was los ist (siehe unten), und dass die Seite bis dahin den vorherigen Stand zeigt.

## Regeln

- **Löschen nur nach ausdrücklicher Bestätigung.** Zeig vorher die Zeile. Baserow hält Gelöschtes eine Weile im Papierkorb (Baserow → Trash), sag ihm das.
- **Technische Felder nicht ändern:** `Slug` (Pages), `Key` (Sections, Settings). Daran hängt der Aufbau der Seite. Bei Publications ist `Slug` nur für das hervorgehobene Buch wichtig; bei neuen Einträgen leer lassen (wird aus dem Titel erzeugt).
- **Rechtstexte** (Seiten Legal notice und Privacy) nur auf seine ausdrückliche Bitte ändern und dazu raten, Änderungen rechtlich prüfen zu lassen.
- **Keine privaten Daten** auf die Seite: keine private Adresse, keine Handynummer. Öffentlich sind die Dienstadresse in Giessen und die E-Mail aus den Settings.
- **Bilder** brauchen immer einen Alternativtext (englisch, beschreibt, was zu sehen ist). Dateinamen klein, mit Bindestrichen und eindeutig, z. B. `cover-planetary-politics.jpg`, denn der Dateiname wird zum Namen auf der Website und gleiche Namen überschreiben sich. JPG oder PNG, Cover hochkant 2:3, mindestens 600 px breit; Fotos mindestens 1600 px breit. Rechte und Bildnachweis erfragen.
- **Reihenfolge:** Publications und Media sortiert die Seite automatisch nach Jahr (neueste zuerst). Überall sonst gilt die Reihenfolge der Zeilen in Baserow; neue Einträge mit `create … --before <id>` an die richtige Stelle setzen oder danach mit `move` verschieben.
- **Unvollständige Zeilen** (z. B. Media ohne Jahr) lässt der Build aus und meldet sie unter Actions als Warnung. `publish --check` merkt das, weil der Text dann nicht online erscheint.

## Was nicht über Baserow geht

Layout, Farben, Schriften, neue Seiten oder Rubriken, neue Audio-Dateien (MP3s liegen im Repository unter `site/public/audio/`), die Domain und alles am Build sind Code-Änderungen im Repository. Das ist Aufgabe des Entwicklers der Seite. Sag ihm das offen, beschreib kurz, was geändert werden müsste, und biete an, eine Nachricht an den Entwickler zu formulieren. Ändere nichts im Repository, wenn er dich nicht ausdrücklich darum bittet.

## Wenn etwas nicht klappt

| Meldung | Ursache und Lösung |
|---|---|
| `no Baserow token stored yet` | Zugang einrichten (oben). |
| `Baserow rejected the token (401)` | Token gelöscht oder falsch: neuen anlegen, `setup` erneut. |
| `does not reach the database "Webseite"` | Token für den falschen Workspace angelegt: neuen für „Hanusch.Earth“. |
| `400 … ERROR_REQUEST_BODY_VALIDATION` | Feldname oder Wert falsch. Mit `tables` die Felder und erlaubten Auswahlwerte prüfen. |
| `the build ended with "failure"` | Meist ein ungültiger Wert in Baserow. Den Link zum Lauf öffnen lassen (Schritt „npm run build“ nennt den Fehler), korrigieren und erneut veröffentlichen. Bleibt es rot, den Entwickler informieren. |
| `the build ended with "cancelled"` | Ein zweiter Build hat ihn ersetzt (z. B. Knopf zweimal gedrückt). Mit `status` prüfen, ob der neuere grün ist, sonst erneut veröffentlichen. |
| `has not finished after 20 minutes` | GitHub ist überlastet (https://www.githubstatus.com). Später `status` prüfen; der Build läuft meist von selbst noch durch. |
| `not on … after 12 minutes` | Eintrag unvollständig (Warnung im Lauf) oder Text anders geschrieben als geprüft. Mit `rows` den Eintrag prüfen. |
