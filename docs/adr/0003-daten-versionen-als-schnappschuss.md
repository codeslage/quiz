# ADR 0003 – Postgres mit Quiz-Versionen als geprüftem Schnappschuss

> Status: **Angenommen** am 2026-11-27 (Freigabe des Inhabers mit dem Plan) · Stand: 2026-11-27
> Bezug: `specs/01-quiz/spec.md` (AK-5, AK-10, AK-15, AK-16, AK-18, AK-21), `specs/01-quiz/plan.md`; in `codeslage/werkstatt`: `specs/02-architektur.md` (Drizzle + PostgreSQL, Zod); Constitution VII, XI, XIII

## Kontext

Ein Quiz besteht aus verschachtelten Inhalten (Bereiche, Fragen, Antworten, Ränge, Regeln). Veröffentlichte Versionen sind unveränderlich, Durchgänge werden immer mit den Regeln ihrer Version ausgewertet (AK-16). Die Datenmengen sind klein (Hunderte bis wenige Tausend Durchgänge je Version).

## Optionen

|                           | Inhalt als JSON-Schnappschuss je Version        | Normalisierte Tabellen (Frage, Antwort, …)            |
| ------------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Unveränderliche Versionen | natürlich: eine Zeile je Version, nie geändert  | Kopie aller Zeilen je Version, Fremdschlüssel-Kaskade |
| Prüfung (AK-15, AK-21)    | ein Zod-Schema für den ganzen Inhalt            | Schema plus Datenbank-Regeln, doppelt                 |
| Auswertung je Frage       | in TypeScript über die Durchgänge einer Version | per SQL                                               |
| Aufwand                   | gering                                          | deutlich höher (Migrationen, Joins, Editor-Mapping)   |

## Entscheidung

**PostgreSQL mit Drizzle.** Der Inhalt eines Quiz ist ein Dokument, das ein Zod-Schema beschreibt. Der Entwurf liegt als JSONB am Quiz; jede Veröffentlichung legt eine neue Zeile `quiz_versions` mit dem vollständig geprüften Inhalt an, die nie mehr geändert wird. Endgültig gelöscht werden Versionen nur zusammen mit ihrem Quiz (AK-27). Ein Durchgang speichert die gewählten Antwort-IDs und das daraus auf dem Server berechnete Ergebnis. Auswertungen rechnen in TypeScript über die Durchgänge einer Version.

## Folgen

- Die IDs von Bereichen, Fragen und Antworten sind stabil innerhalb einer Version; der Editor vergibt sie.
- Wächst eine Version auf sehr viele Durchgänge, kann die Auswertung später in SQL wandern, ohne das Modell zu ändern.
- Abhängigkeiten: `drizzle-orm`, `drizzle-kit` (nur Entwicklung), `postgres` (Treiber), `zod`; Lizenzen Apache-2.0 (Drizzle), Unlicense (`postgres`) und MIT (`zod`), alle aktiv gepflegt.
