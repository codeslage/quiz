# 01 – Quiz-Plattform: Plan

> Status: **Entwurf**
> Stand: 2026-11-27 (Stufe 3; Editor mit Formularen nach Entscheidung des Inhabers)
> Bezug: `spec.md` (Status: Geklärt am 2026-11-27, freigegeben am 2026-11-26), `CONSTITUTION.md` (v1.1.0), ADR 0001–0004 in `docs/adr/`; in `codeslage/werkstatt`: `specs/02-architektur.md` (A1, A2), ADR 0009, ADR 0014
> SDD-Stufe: 3 Plan

## Technischer Ansatz

Eine einzelne Web-App mit **Astro im Server-Modus** (ADR 0001), **PostgreSQL mit Drizzle** (ADR 0003), **Zod** für jede Prüfung an der Systemgrenze und **Better Auth mit Google** nur für die Admin-Oberfläche (ADR 0002). Rate-Limit und Löschlauf laufen im App-Prozess (ADR 0004). Lokal startet alles mit `docker compose up` (App, Postgres, Migrationen, erstes Quiz). Öffentlich wird erst ab Phase S betrieben.

Leitlinien:

- **Rechnen an einer Stelle:** Die Auswertung eines Durchgangs (Punkte, Prozent, Bereiche, Rang, XP, Serien, Abzeichen, Tipps) ist ein reines TypeScript-Modul ohne I/O. Der Browser nutzt es für die Anzeige, der Server rechnet beim Speichern **selbst noch einmal** und verwirft, was der Browser behauptet. Gespeichert werden nur die Antwort-IDs und das Server-Ergebnis.
- **Ein Schema für den Inhalt:** Das Zod-Schema `QuizContent` beschreibt ein Quiz vollständig. Es hat zwei Stufen: `DraftContent` (Struktur stimmt, darf unvollständig sein) für das Speichern von Entwürfen und `PublishableContent` (alle Regeln aus AK-15) für die Veröffentlichung.
- **Keine Wiedererkennung:** Spielseiten setzen keine Cookies und nutzen kein `localStorage`. Die IP-Adresse kommt nur in die Map des Rate-Limits.

## Bausteine & Struktur

```
src/
├─ domain/        # rein, ohne I/O: Schemas, Auswertung, Aggregation, Rundung
│  ├─ content.ts      # Zod: DraftContent, PublishableContent, Typen
│  ├─ scoring.ts      # Durchgang → Ergebnis (AK-3, AK-4, AK-28)
│  ├─ aggregate.ts    # Durchgänge → Auswertung, Mindestzahl, 5-%-Rundung (AK-9–11, AK-18)
│  └─ submission.ts   # Zod: Einsendung eines Durchgangs
├─ db/            # Drizzle-Schema, Migrationen, Zugriff (nur hier SQL)
├─ server/        # Anwendungslogik mit I/O: runs, groups, quizzes, auth, rate-limit, retention, log
├─ pages/         # Astro-Seiten und API-Routen (dünn: prüfen, Server aufrufen, antworten)
├─ components/    # Astro-Komponenten (Ergebnis, Netzdiagramm, Formular-Teile)
└─ client/        # Browser-Skripte: Spielablauf, Quiz-Editor
seed/
└─ ki-kompetenz-quest/  # abgeleitete Inhalte + Referenzfälle, mit Herkunft und MIT-Hinweis (AK-4, AK-23)
```

Erlaubte Richtungen (per dependency-cruiser geprüft, Artikel XV):

- `pages` → `server`, `components`, `domain`
- `components` → `domain`
- `client` → `domain`
- `server` → `db`, `domain`
- `db` → `domain` (nur Typen)
- `domain` → nichts aus `src/` außer sich selbst

`client` und `components` dürfen nie `server` oder `db` importieren, damit kein Server-Code in den Browser gerät.

## Datenmodell & Schnittstellen

### Tabellen

| Tabelle              | Felder (Auszug)                                                                                                                                                          | Hinweis                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `quizzes`            | `id`, `slug` (eindeutig, Teil der URL), `title`, `draft` (JSONB, `DraftContent`), `archived_at`, `created_at`, `updated_at`                                              | Entwurf wird überschrieben, Version nie                                                        |
| `quiz_versions`      | `id`, `quiz_id`, `number` (1, 2, …), `content` (JSONB, `PublishableContent`), `published_at`                                                                             | unveränderlich (keine Update-Funktion im Code; Test)                                           |
| `groups`             | `id`, `quiz_id`, `label` (nur für den Admin), `play_code` (10 Zeichen, Base32), `report_token_hash` (SHA-256), `archived_at`, `created_at`                               | Auswertungs-Token: 32 Byte Zufall, nur der Hash liegt in der DB; Neu-Erzeugen ersetzt den Hash |
| `runs`               | `id`, `quiz_version_id`, `group_id` (nullable), `answers` (JSONB: Frage-ID → Antwort-ID), `result` (JSONB: Prozent, Bereiche, Rang, XP, Serien, Abzeichen), `created_at` | keine Spalte für IP, Gerät oder Freitext (AK-6)                                                |
| Better-Auth-Tabellen | `user`, `session`, `account`, `verification`                                                                                                                             | enthalten nur das Admin-Konto                                                                  |

Löschen (AK-27, AK-19): `runs` hängt per Fremdschlüssel an Version und Gruppe. Endgültiges Löschen eines Quiz oder einer Gruppe löscht die zugehörigen Durchgänge in einer Transaktion, nachdem die Bestätigungsseite die Anzahl gezeigt hat. Versionen haben keine Löschfunktion.

### Inhalt eines Quiz (`QuizContent`)

- `areas[]`: `id`, `name`, `badge` (Name des Bereichs-Abzeichens), `tip` (Tipp bei schwachem Bereich)
- `questions[]`: `id`, `areaId`, `text`, `explanation`, `answers[]` (`id`, `text`, `points` 0–3)
- `ranks[]`: `minPercent`, `name`, `text`; der erste beginnt bei 0
- `rules`: `badgeThreshold` (z. B. 0,8), `tipThreshold` (z. B. 0,8), `maxTips` (2), `allGoodTip`, `xp` (aus/an mit `perPoint`, `streakBonus`, `streakMax`), `streakBadge` (aus/an mit `name`, `length`)
- `intro`, `disclaimer`: Texte für Start- und Ergebnisseite

Die Regeln bilden die Quest vollständig ab (`XP_PER_POINT = 10`, `STREAK_BONUS = 5`, `STREAK_MAX = 4`, `BADGE_AT = 0.8`, `STREAK_BADGE = 5`, Tipp-Schwelle 0,8, höchstens 2 Tipps). „Volltreffer“ heißt: die höchste Punktzahl der Frage. In der Quest ist das bei jeder Frage 3, das Ergebnis bleibt also gleich (AK-4 prüft es).

### Endpunkte und Seiten

| Weg                           | Wer        | Zweck                                                                                                   | AK                       |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| `GET /q/<slug>`               | öffentlich | Start, Hinweis zur Speicherung, Spiel; neueste Version                                                  | AK-1, AK-7               |
| `GET /q/<slug>/g/<play_code>` | öffentlich | wie oben, Durchgang zählt zur Gruppe; unbekannter Code → Fehlerseite 404                                | AK-8                     |
| `POST /api/runs`              | öffentlich | Einsendung `{versionId, playCode?, answers}`; prüft, rechnet, speichert, liefert Ergebnis und Vergleich | AK-5, AK-9, AK-20, AK-21 |
| `GET /r/<report_token>`       | Link       | Kundenauswertung je Version; falscher Token → gleiche 404 wie „nicht gefunden“                          | AK-10–12, AK-26          |
| `/admin/**`, `/api/admin/**`  | Admin      | Quizze, Editor, Veröffentlichen, Gruppen, Auswertung, Archivieren, Löschen                              | AK-13–18, AK-27          |
| `/api/auth/**`                | Admin      | Better Auth (Google)                                                                                    | AK-13                    |
| `GET /health`                 | Betrieb    | Lebenszeichen inkl. Datenbank                                                                           | AK-25                    |

Antworten von `POST /api/runs`: `201` mit Ergebnis, `400` mit Grund bei ungültiger Einsendung, `404` bei unbekanntem Gruppen-Code oder archivierter Gruppe bzw. archiviertem Quiz, `429` mit verständlicher Meldung beim Rate-Limit. Jede Ablehnung wird strukturiert protokolliert (Grund, Weg, ohne IP und ohne Inhalte).

### Rate-Limit (AK-20)

Festes Stundenfenster je IP-Adresse: **10 Einsendungen über öffentliche Links, 60 über Gruppen-Links** (Workshop hinter einer Firmen-IP). Werte sind Einstellung (`RATE_LIMIT_PUBLIC`, `RATE_LIMIT_GROUP`). Die IP kommt aus der Verbindung; einem `X-Forwarded-For` wird nur vertraut, wenn `TRUST_PROXY` gesetzt ist (ab Phase S).

### Vergleich und Mindestzahl (AK-9, AK-11)

- Vergleich auf der Ergebnisseite: über die Durchgänge derselben Version **ohne den eigenen**; mit Gruppe nur die Gruppe, sonst nur Durchgänge ohne Gruppe. Ab 5 solchen Durchgängen: Durchschnitt gesamt und je Bereich, auf 5-Prozent-Schritte gerundet. Darunter: „noch zu wenige Teilnahmen“.
- Kundenauswertung: je Version eine Karte; unter 5 Durchgängen nur Anzahl und Hinweis.
- Admin-Auswertung: alle Werte ohne Mindestzahl.

### Einstellungen (`.env.example`, nur Namen)

`DATABASE_URL`, `PORT`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS`, `PRIVACY_URL`, `RATE_LIMIT_PUBLIC`, `RATE_LIMIT_GROUP`, `TRUST_PROXY`. Alle werden beim Start per Zod geprüft; fehlt etwas, startet die App nicht und nennt die Variable.

### Neue Abhängigkeiten (Begründung im jeweiligen PR, Artikel XI)

| Paket                                    | Wofür                                    | Lizenz     |
| ---------------------------------------- | ---------------------------------------- | ---------- |
| `astro`, `@astrojs/node`                 | App, Seiten, API-Routen (ADR 0001)       | MIT        |
| `drizzle-orm`, `drizzle-kit` (dev)       | Schema, Migrationen, Abfragen (ADR 0003) | Apache-2.0 |
| `postgres`                               | Postgres-Treiber                         | Unlicense  |
| `zod`                                    | Schemas an jeder Systemgrenze            | MIT        |
| `better-auth`                            | Admin-Login mit Google (ADR 0002)        | MIT        |
| `@playwright/test` (dev)                 | E2E-Tests inkl. Tastatur und Farbschema  | Apache-2.0 |
| `@axe-core/playwright` (dev)             | Barrierefreiheit in E2E (AK-24)          | MPL-2.0    |
| ESLint-/Prettier-Plugins für Astro (dev) | Qualitäts-Checks für `.astro`-Dateien    | MIT        |

Versionen fest im Lockfile, Updates über Dependabot.

## Schritte (je ein PR)

### Schritt 1 – Grundgerüst

Astro-App mit `/health`, Docker Compose (App + Postgres), Drizzle-Schema und erste Migration, Einstellungen per Zod, strukturiertes Logging. Checks für `.astro` (ESLint, Prettier, Knip, dependency-cruiser mit den Richtungen oben). CI-Jobs im Projektblock: `integration` (Vitest gegen Postgres als Service-Container) und `e2e` (Playwright gegen das gebaute Image). Runbook `docs/runbooks/lokal-starten.md`. Beispiel-App der Vorlage entfernen. → AK-25

### Schritt 2 – Inhalt und Auswertung

`domain/content.ts` (beide Schema-Stufen), `domain/scoring.ts`, Seed der KI-Kompetenz-Quest unter `seed/` als abgeleitete Daten mit Herkunft und MIT-Hinweis, Referenzfälle (alles beste, alles schlechteste, gemischt) mit den erwarteten Werten der gelieferten Datei. Seed läuft beim Start, wenn das Quiz fehlt. → AK-3 (Unit), AK-4, AK-15 (Unit), AK-23, AK-28 (Unit)

### Schritt 3 – Spielen

Start-, Spiel- und Ergebnisseite für `/q/<slug>`, Spielablauf im Browser, Netzdiagramm als SVG aus Daten (ohne `innerHTML`), Hinweis zur Speicherung mit Link auf `PRIVACY_URL`, Fokus beim Fragenwechsel, Hell/Dunkel, reduzierte Bewegung. Noch ohne Speichern. → AK-1, AK-2, AK-3 (E2E), AK-7, AK-22 (Spielseiten), AK-24

### Schritt 4 – Speichern und Rate-Limit

`POST /api/runs` mit Zod-Prüfung (Version existiert und ist die neueste, jede Frage genau eine gültige Antwort), Neuberechnung auf dem Server, Speichern, Rate-Limit im Speicher, `429` sichtbar auf der Ergebnisseite. Test, dass keine Cookies gesetzt und keine IP gespeichert oder protokolliert wird. → AK-5, AK-6, AK-20, AK-21 (Einsendung)

### Schritt 5 – Gruppen-Spiellinks und Vergleich

`/q/<slug>/g/<code>`, Ablehnung unbekannter Codes, `domain/aggregate.ts` mit Mindestzahl und 5-%-Rundung, Vergleich auf der Ergebnisseite. Gruppen werden in diesem Schritt per Seed bzw. Testdaten angelegt; die Admin-Oberfläche folgt in Schritt 8. → AK-8, AK-9

### Schritt 6 – Admin-Login

Better Auth mit Google, Prüfung gegen `ADMIN_EMAILS`, Schutz aller `/admin`- und `/api/admin`-Wege, leere Admin-Startseite. Runbook `docs/runbooks/admin-login.md` (Google-OAuth-Client anlegen 👤). Tests mit direkt angelegter Sitzung; echter Google-Ablauf als manueller Test. → AK-13

### Schritt 7 – Quiz-Editor (Formulare)

Quiz-Liste, Anlegen, Editor mit Formularen für Bereiche, Fragen, Antworten, Ränge, Regeln (XP, Serien, Abzeichen, Tipps), Hinzufügen/Entfernen/Reihenfolge, Fehler am Feld, Speichern als Entwurf (`DraftContent`), Vorschau mit der Spielseite. Entwürfe sind öffentlich nicht erreichbar. → AK-14, AK-21 (Admin-Eingaben), AK-22 (Admin-Seiten), AK-28 (E2E)

Wird der PR zu groß, wird er in 7a (Bereiche, Fragen, Antworten) und 7b (Ränge, Regeln, Vorschau) geteilt.

### Schritt 8 – Veröffentlichen und Versionen

Veröffentlichen mit `PublishableContent` (Ablehnung mit Gründen je Feld), neue Version je Veröffentlichung, Versionsliste. Test, dass alte Durchgänge mit ihrer Version ausgewertet werden. → AK-15 (Integration), AK-16

### Schritt 9 – Gruppen und Kundenauswertung

Gruppen anlegen (Spiellink, Auswertungslink einmalig anzeigen), Auswertungslink neu erzeugen, Kundenauswertung `/r/<token>` je Version mit Mindestzahl, gleiche 404 für falsche Tokens. → AK-10, AK-11, AK-12, AK-17, AK-26

### Schritt 10 – Admin-Auswertung, Archivieren, Löschen

Auswertung je Quiz, Version und Gruppe bzw. öffentlich; Archivieren von Quiz und Gruppe; endgültiges Löschen mit Bestätigungsseite (zeigt Anzahl der betroffenen Durchgänge, Eingabe des Namens zur Bestätigung). → AK-18, AK-27

### Schritt 11 – Löschfrist

Löschlauf beim Start und täglich, löscht Durchgänge älter als 24 Monate, protokolliert die Anzahl; Fehler werden protokolliert. → AK-19

Reihenfolge: 1 → 2 → 3 → 4 → 5; 6 kann nach 1 parallel laufen; 7 → 8 → 9 → 10 nach 6; 11 nach 4.

## Teststrategie

Drei Ebenen: **Unit** (Vitest, `domain/`), **Integration** (Vitest gegen echte Postgres im Container, `server/` und API-Routen), **E2E** (Playwright gegen das gebaute Image mit Compose). Admin-E2E legen eine Sitzung direkt in der Datenbank an.

| AK    | Testart                     | Wo                                                                                                 |
| ----- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| AK-1  | E2E                         | `e2e/play.spec.ts`: Quest von Start bis Ergebnis                                                   |
| AK-2  | E2E                         | `e2e/play.spec.ts`: Sperre, Markierung beste/gewählte Antwort, Erklärung                           |
| AK-3  | Unit + E2E                  | `src/domain/scoring.test.ts`; `e2e/play.spec.ts` (Ergebnisseite)                                   |
| AK-4  | Unit                        | `src/domain/scoring.quest.test.ts` mit den drei Referenzfällen aus `seed/`                         |
| AK-5  | Integration                 | `src/server/runs.test.ts`: gespeichert mit Version/Gruppe; ohne Einsendung nichts                  |
| AK-6  | Integration + E2E           | Schema-Test (keine IP-/Geräte-Spalten), Log-Prüfung ohne IP; E2E: keine Cookies, kein Storage      |
| AK-7  | E2E                         | `e2e/play.spec.ts`: Hinweis und Link vor dem Start                                                 |
| AK-8  | Integration + E2E           | `src/server/runs.test.ts` (Gruppe, unbekannter Code → 404); `e2e/group.spec.ts`                    |
| AK-9  | Unit + Integration + E2E    | `src/domain/aggregate.test.ts` (Schwelle, ohne eigenen, Rundung, ohne Gruppen); E2E 4 vs. 5        |
| AK-10 | E2E                         | `e2e/report.spec.ts`: Werte je Version, keine Einzeldurchgänge                                     |
| AK-11 | Integration + E2E           | `aggregate.test.ts` je Version; `e2e/report.spec.ts` mit 4 Durchgängen                             |
| AK-12 | Integration                 | `src/server/groups.test.ts`: Token-Länge, falscher Token = gleiche Antwort wie unbekannt           |
| AK-13 | Integration + E2E + manuell | ohne/fremde/erlaubte Sitzung je Admin-Weg; manueller Google-Login (Runbook)                        |
| AK-14 | E2E                         | `e2e/admin-editor.spec.ts`: anlegen, bearbeiten, Entwurf nicht öffentlich                          |
| AK-15 | Unit + Integration          | `content.test.ts` (jede Regel einzeln); API lehnt mit Grund ab                                     |
| AK-16 | Integration                 | `src/server/quizzes.test.ts`: neue Version, alte unverändert, alte Durchgänge alt ausgewertet      |
| AK-17 | E2E                         | `e2e/admin-groups.spec.ts`                                                                         |
| AK-18 | E2E                         | `e2e/admin-report.spec.ts`: je Version, Gruppe, öffentlich                                         |
| AK-19 | Integration                 | `src/server/retention.test.ts`: 24 Monate + 1 Tag weg, 24 Monate − 1 Tag bleibt, Log-Anzahl        |
| AK-20 | Integration                 | `src/server/rate-limit.test.ts`: 11. öffentlich → 429, Gruppe bis 60, Fenster, Log                 |
| AK-21 | Integration                 | je Systemgrenze ein Test mit ungültiger Eingabe → abgelehnt, nichts gespeichert                    |
| AK-22 | E2E                         | Quiz mit `<script>`/`<img onerror>` in allen Textfeldern; nichts wird ausgeführt                   |
| AK-23 | Integration                 | Seed: Quest vorhanden, veröffentlicht, Bereiche/Fragen/Ränge/Abzeichen vollständig                 |
| AK-24 | E2E + manuell               | Tastatur-Durchlauf, Fokus, `colorScheme`, `reducedMotion`, axe; manuell Bildschirmleser            |
| AK-25 | CI + manuell                | CI baut und startet Compose, `/health` grün; manuell laut Runbook                                  |
| AK-26 | Integration + E2E           | neu erzeugen → alter Token 404, neuer zeigt Daten                                                  |
| AK-27 | Integration + E2E           | archiviert nicht spielbar, Auswertung bleibt; Löschen nur mit Bestätigung; keine Versions-Löschung |
| AK-28 | Unit + E2E                  | `scoring.test.ts` mit XP/Serien aus; Editor schaltet um, Spielseite zeigt keine XP                 |

## Constitution-Check

| Artikel                          | Bewertung | Anmerkung                                                                                                                    |
| -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| I Spec zuerst                    | ✅        | Spec geklärt; dieser Plan vor jedem Code                                                                                     |
| II Tests beweisen die Spec       | ✅        | jedes AK mit Test und Ort; Quest-Referenzfälle für AK-4; manuelle Tests nur für Google-Login, Bildschirmleser, lokalen Start |
| III Kleine Schritte              | ✅        | 11 Schritte, je ein PR; Editor bei Bedarf geteilt                                                                            |
| IV Fragen statt raten            | ✅        | Editor-Art mit dem Inhaber geklärt; Fragen 9 und 12 bleiben bis Phase S offen                                                |
| V Keine zerstörerischen Aktionen | ✅        | Löschen nur mit Bestätigungsseite (AK-27); Migrationen ohne Löschen; Löschlauf nur nach Frist                                |
| VI Secrets nie ins Repo          | ✅        | OAuth-Werte und `BETTER_AUTH_SECRET` nur in `.env`; Auswertungs-Token nur als Hash in der DB                                 |
| VII Sicher als Standard          | ✅        | Zod an jeder Grenze, Server rechnet selbst, `set:html` verboten, Admin nur mit erlaubtem Konto, Rate-Limit                   |
| VIII Datenschutz & EU            | ✅        | keine IP/Geräte-Daten gespeichert, keine Cookies für Spielende, Löschfrist; Google-Zweck in `dsgvo.md` ab Phase S (Frage 12) |
| IX Mensch im Loop                | ✅        | nichts geht ohne Veröffentlichung durch den Inhaber online; keine KI-Aufrufe in der App                                      |
| X Reproduzierbar                 | ✅        | Compose, Migrationen und Seed im Repo; Runbooks für lokalen Start und Google-Client                                          |
| XI Einfach vor vollständig       | ✅        | eine App, ein Prozess, JSON-Schnappschuss statt vieler Tabellen; jede Abhängigkeit oben begründet                            |
| XII Offen dokumentieren          | ✅        | ADR 0001–0004, Runbooks, Doku im selben PR                                                                                   |
| XIII Wiederverwendbar            | ✅        | Quiz-Regeln und Admin-Konto sind Daten bzw. Einstellung; `domain/` ohne codeslage-Bezug                                      |
| XIV Messen statt schätzen        | ✅        | Soll je Task in `tasks.md`, Ist in `zeiten.md`                                                                               |
| XV Kein unnötiger Code           | ✅        | Modulrichtungen per dependency-cruiser, Knip, Beispiel-App der Vorlage wird entfernt                                         |
| XVI Fehler sind sichtbar         | ✅        | strukturierte Logs ohne IP und Inhalte; Ablehnungen und Löschläufe protokolliert; Start bricht bei fehlender Einstellung ab  |

## Risiken

- **Projektblock der CI:** Die Jobs `integration` und `e2e` brauchen Postgres und Docker. Reicht der Projektblock von `ci.yml` dafür nicht, gehört die Erweiterung nach `werkstatt` (CWK) und kommt per Sync. Das klärt Schritt 1.
- **Editor-Aufwand:** Die Formulare sind der größte Brocken. Gegenmittel: Teilung in 7a/7b, Editor nutzt dasselbe Schema wie die Veröffentlichung.
- **Better Auth und Astro:** Die Einbindung ist dokumentiert, aber jung. Fällt sie in Schritt 6 schwer, ist die Rückfallebene ein schmaler eigener OAuth-Ablauf mit `openid-client` (neues ADR).
- **Rate-Limit hinter Proxy:** Ohne `TRUST_PROXY` sähe die App ab Phase S nur die Proxy-IP. Der Schalter ist eingeplant, die Einstellung gehört zum Betrieb in Phase S.
- **Gleichheit mit der Quest (AK-4):** Rundungen der Datei (`Math.round` auf ganze Prozent) werden exakt übernommen; die Referenzfälle sind die Prüfung.
