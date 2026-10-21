# Änderungen am Code der Website

Nur nach ausdrücklicher Zustimmung (siehe SKILL.md). Repository: https://github.com/hanusch-earth/hanusch-earth.github.io (öffentlich, Branch `main`). Jeder Push auf `main` baut die Seite neu und stellt sie live, mit den aktuellen Inhalten aus Baserow.

## Einmal einrichten

Prüfe zuerst, was schon da ist, und richte nur das Fehlende ein. Erkläre ihm jeden Schritt in einem Satz; Befehle, die eine Anmeldung oder ein Passwort brauchen, tippt **er selbst** mit `!` davor ein, damit nichts davon im Chat landet.

| Was | Prüfen | Installieren |
|---|---|---|
| Git | `git --version` | macOS: `xcode-select --install` (oder `brew install git`); Windows: `winget install Git.Git` |
| GitHub CLI | `gh --version` | macOS: `brew install gh`; Windows: `winget install GitHub.cli`; sonst https://cli.github.com |
| Node.js ab 22.22 | `node --version` | macOS: `brew install node@22` oder Installer von https://nodejs.org (LTS); Windows: `winget install OpenJS.NodeJS.LTS` |

Ohne Homebrew auf dem Mac: die Installer von https://git-scm.com, https://cli.github.com und https://nodejs.org nehmen.

**Bei GitHub anmelden** (er selbst):
```
! gh auth login
```
Antworten: GitHub.com → HTTPS → „Authenticate Git with your GitHub credentials“: Yes → „Login with a web browser“. Er kopiert den angezeigten Code, bestätigt im Browser, fertig. Danach prüfen mit `gh auth status`; es muss sein Konto erscheinen. Mit `gh repo view hanusch-earth/hanusch-earth.github.io --json viewerPermission` prüfen, dass er `ADMIN` oder `WRITE` hat; sonst muss der Entwickler ihn einladen.

**Repository holen** (einmal, z. B. in seinen Benutzerordner):
```
gh repo clone hanusch-earth/hanusch-earth.github.io ~/hanusch-website
cd ~/hanusch-website/site && npm ci
```
Den Ordner merken; beim nächsten Mal dort weitermachen.

## Ablauf bei jeder Code-Änderung

1. **Stand holen:** `git -C ~/hanusch-website pull --ff-only`. Schlägt das fehl, gibt es lokale Reste: zeig sie ihm (`git status`) und frag, bevor du etwas verwirfst.
2. **Ändern.** Wo was liegt, steht in der `README.md` des Repositorys (Abschnitt Structure). Bleib im Stil des vorhandenen Codes; `DESIGN.md` beschreibt Farben, Schriften und Abstände. Kleine, gezielte Änderungen; nichts nebenbei umbauen.
3. **Lokal bauen und ansehen:**
   ```
   cd ~/hanusch-website/site
   BASEROW_TOKEN="$(cat ~/.config/hanusch-website/baserow-token)" npm run build
   npm run preview
   ```
   Der Build muss ohne Fehler durchlaufen. `npm run preview` zeigt die Seite unter http://localhost:4321; bitte ihn, sich die geänderte Stelle anzusehen (am Rechner und, wenn es ums Layout geht, im schmalen Fenster wie am Handy). Danach den Vorschau-Server beenden.
4. **Zeigen und zweites Ja einholen:** Fasse zusammen, welche Dateien sich wie geändert haben (`git status`, `git diff --stat`). Erst nach seinem Ja weiter.
5. **Committen und pushen:** nur die Dateien, die du bewusst geändert hast, einzeln mit `git add <datei>`; kurze englische Commit-Nachricht, die sagt, was sich ändert. Dann `git push`.
6. **Dranbleiben bis live:** `python3 <skill-ordner>/scripts/baserow.py status` zeigt den Build (Ereignis `push`); warten, bis er `completed success` ist (meist 1–3 Minuten), dann mit `baserow.py live <Pfad> "<Text>"` prüfen und ihm melden, dass es online ist. Bei `failure` den Link zum Lauf öffnen, Fehler erklären und beheben oder rückgängig machen (unten).

## Regeln

- **Keine Zugangsdaten ins Repository.** Es ist öffentlich. Tokens bleiben in `~/.config/…`.
- **Inhalte gehören nach Baserow,** nicht in den Code. `site/src/data/*.json` und die Bilder in `site/src/assets/img/` und `site/public/img/` schreibt der Build jedes Mal neu aus Baserow; Änderungen dort von Hand gehen beim nächsten Build verloren. Der lokale Build ändert diese Dateien ebenfalls, deshalb nur die eigenen Dateien committen (Schritt 5).
- **Nicht anfassen** ohne seine ausdrückliche Bitte und einen Hinweis auf den Entwickler: `.github/workflows/`, `site/scripts/fetch-cms.mjs`, `site/astro.config.mjs`, Rechtstexte, `.gitignore`.
- **Neue Dateien** außerhalb von `site/` und dem Skill-Ordner werden von der `.gitignore` ausgeschlossen; neue Dateien also in `site/` anlegen. MP3s nach `site/public/audio/` (Dateiname klein mit Bindestrichen, z. B. `2026-sender-thema.mp3`), dann in Baserow bei Media `Audio file` auf `/audio/<datei>.mp3` setzen und `Duration (seconds)` eintragen. Nur Aufnahmen, die veröffentlicht werden dürfen (Rechte beim Sender erfragen); große Dateien (über 50 MB) vorher ansprechen.
- **Kein Force-Push, kein Umschreiben der Historie.**

## Rückgängig machen

Eine veröffentlichte Änderung zurücknehmen, ohne Historie zu löschen:
```
git -C ~/hanusch-website revert --no-edit <commit>
git -C ~/hanusch-website push
```
Den Commit findest du mit `git log --oneline -5`. Auch das Zurücknehmen braucht sein Ja.
