# ADR 0001 – Eine App mit Astro im Server-Modus

> Status: **Vorgeschlagen** am 2026-11-27 (Stufe 3, Freigabe mit dem Plan) · Stand: 2026-11-27
> Bezug: `specs/01-quiz/spec.md` (AK-1, AK-2, AK-14, AK-22, AK-24, AK-25), `specs/01-quiz/plan.md`; in `codeslage/werkstatt`: `specs/02-architektur.md` (A1), ADR 0014; Constitution XI, XIII, XV

## Kontext

Die Plattform braucht Seiten zum Spielen und Auswerten, eine Admin-Oberfläche mit Formularen und Endpunkte, die Einsendungen prüfen und speichern. Inhalte aus dem Quiz dürfen nie als HTML ausgeführt werden (AK-22). Die Webseite von codeslage läuft bereits mit Astro (ADR 0014 in `werkstatt`), das Portal soll Next.js bekommen.

## Optionen

|                                   | Astro, Server-Modus (`@astrojs/node`)             | Next.js                           | Node-Server mit eigenen Templates      |
| --------------------------------- | ------------------------------------------------- | --------------------------------- | -------------------------------------- |
| Ausgabe von Quiz-Inhalten (AK-22) | Ausdrücke werden standardmäßig maskiert           | maskiert (React)                  | eigener Code für das Maskieren         |
| JavaScript im Browser             | nur auf Seiten, die es brauchen (Spielen, Editor) | React-Laufzeit auf jeder Seite    | nur, was man selbst schreibt           |
| Seiten und Endpunkte in einer App | ja (Seiten und API-Routen)                        | ja                                | Routing selbst bauen                   |
| Gemeinsamer Stack                 | wie die Webseite                                  | wie das spätere Portal            | keiner                                 |
| Abhängigkeiten (XI)               | `astro`, `@astrojs/node`; MIT, aktiv gepflegt     | `next`, `react`, `react-dom`; MIT | keine, aber deutlich mehr eigener Code |

## Entscheidung

Die Plattform ist **eine App mit Astro im Server-Modus** (`output: 'server'`, Adapter `@astrojs/node`, eigenständiger Node-Server). Interaktive Teile (Spielablauf, Quiz-Editor) sind kleine Skripte in TypeScript ohne UI-Framework. HTML aus Daten wird nie roh ausgegeben (`set:html` ist per Lint-Regel verboten).

## Folgen

- Kein Monorepo: Das Repo enthält genau eine App unter `src/`. Die Regeln für Modulgrenzen gelten innerhalb von `src/` (siehe Plan).
- ESLint, Knip, Prettier und Modulgrenzen müssen `.astro`-Dateien kennen, wie in `werkstatt` für die Webseite.
- Das Dockerfile der Vorlage wird durch Build und Start der Astro-App ersetzt.
