# 01 – Quiz-Plattform: Zeitprotokoll

> Bezug: `tasks.md` (Spalte Ist), `retro.md` (Soll/Ist), Constitution Artikel XIV, `docs/prozess/sdd-ablauf.md` („Zeiterfassung“)

Methode:

- **Ab Stufe 1:** Jede Stufe und jede Task bekommt Zeilen, auch Specify, Plan, Analyze, Verify und Retro. In der Spalte „Was“ steht die Task (`T-xx`) oder der Name der Stufe (z. B. `Spec`, `Plan`, `Verify`, `Retro`).
- **Art:** `Arbeit` oder `Wartezeit`. Wartezeit auf den Inhaber (Antworten, Freigaben, Schritte 👤) zählt mit, so wie in einem echten Projekt, steht aber in **eigenen Zeilen**. Eine Zeile enthält nie beides: Die Wartezeit endet mit der ersten Ablesung der Systemuhr nach der Antwort, danach beginnt eine neue Zeile `Arbeit`.
- **Start und Ende** nach der Systemuhr (`date`), nicht geschätzt. Ende heißt: Test grün, Protokoll geschrieben bzw. Stufe abgeschlossen.
- **Pausen** zwischen Sitzungen zählen nicht: Eine Task oder Stufe kann mehrere Zeilen haben.
- **Parallele Tasks:** Die Zeit zählt nur einmal. Sie gehört der Task, an der die Sitzung gerade arbeitet; die Zeilen überlappen sich nicht.
- **Summen:** Unter der Tabelle stehen je Stufe bzw. Task Arbeit, Wartezeit und Gesamt.
- **Auswertung:** Das **Ist ist die Gesamtzeit** (Arbeit + Wartezeit), weil auch das Soll die Abstimmung enthält. Die Summe je Task wird auf Viertelstunden gerundet (mindestens 0,25 h) und in `tasks.md` als Ist eingetragen. Retro und eine spätere Abrechnung weisen Arbeit und Wartezeit zusätzlich getrennt aus; dafür zählen die genauen Minuten aus dieser Tabelle.

| Was     | Art       | Start            | Ende             | Dauer | Bemerkung                                                                                                                                                           |
| ------- | --------- | ---------------- | ---------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec    | Arbeit    | 2026-11-26 21:52 | 2026-11-26 21:54 | 0:02  | Entwurf `spec.md`, Roadmap-Eintrag; die Fragerunde davor im Chat lief ohne Ablesung der Systemuhr und fehlt                                                         |
| Spec    | Wartezeit | 2026-11-26 21:54 | 2026-11-26 22:15 | 0:21  | Freigabe und Antworten auf die Fragen 2–4; darin die kurze Erklärung zu Frage 3 (ohne eigene Ablesung); Ende = erste Ablesung nach der Antwort                      |
| Spec    | Arbeit    | 2026-11-26 22:15 | 2026-11-26 22:16 | 0:01  | Antworten 2–4 eingetragen, AK-9, AK-10, AK-26                                                                                                                       |
| Spec    | Wartezeit | 2026-11-26 22:16 | 2026-11-26 22:26 | 0:10  | Freigabe der Spec; Ende = erste Ablesung nach der Antwort                                                                                                           |
| Spec    | Arbeit    | 2026-11-26 22:26 | 2026-11-26 22:26 | 0:00  | Freigabe eingetragen, Commit                                                                                                                                        |
| Spec    | Arbeit    | 2026-11-27 09:33 | 2026-11-27 09:34 | 0:01  | Umzug in eigenes Repo: Runbook `neues-projekt.md` gelesen, Voraussetzungen geprüft, Recht `admin:org` fehlte; Ende ohne Ablesung, nach dem letzten Befehl geschätzt |
| Spec    | Wartezeit | 2026-11-27 09:34 | 2026-11-27 09:36 | 0:02  | Inhaber: `gh auth refresh` und `cwk new quiz`; Ende = Anlage des Repos laut GitHub                                                                                  |
| Spec    | Arbeit    | 2026-11-27 09:36 | 2026-11-27 09:43 | 0:07  | CI und Einstellungen des neuen Repos geprüft, Spec umgezogen, README, Roadmap-Verweis in `werkstatt`, beide PRs, Review-Agent                                       |
| Spec    | Arbeit    | 2026-11-27 09:43 | 2026-11-27 09:45 | 0:02  | Review-Befunde umgesetzt, Review abgelegt                                                                                                                           |
| Spec    | Arbeit    | 2026-11-27 09:45 | 2026-11-27 09:55 | 0:10  | Merge-Konflikt CHANGELOG, Review-Datei in `specify.md` umbenannt, CI, Merge beider PRs, Branch gelöscht; Ende ohne Ablesung, geschätzt                              |
| Clarify | Arbeit    | 2026-11-27 20:33 | 2026-11-27 20:34 | 0:01  | Spec gelesen, Lücken gesucht (Rate-Limit vs. keine IP, öffentlicher Durchschnitt), Branch                                                                           |
| Clarify | Wartezeit | 2026-11-27 20:34 | 2026-11-27 20:38 | 0:04  | zwei Fragerunden (Fragen 1, 5–8, 10, 11); Ende = erste Ablesung nach der Antwort                                                                                    |
| Clarify | Arbeit    | 2026-11-27 20:38 | 2026-11-27 20:41 | 0:03  | Antworten eingetragen, AK angepasst, AK-27 und AK-28, Review-Agent, Befunde 1–8 umgesetzt, PR                                                                       |
| Plan    | Arbeit    | 2026-11-27 20:47 | 2026-11-27 20:48 | 0:01  | Vorlage, Architektur, CI-Projektblock und Quest-Regeln gelesen, Branch                                                                                              |
| Plan    | Wartezeit | 2026-11-27 20:48 | 2026-11-27 20:49 | 0:01  | Frage zur Art des Editors; Ende = erste Ablesung nach der Antwort                                                                                                   |
| Plan    | Arbeit    | 2026-11-27 20:49 | 2026-11-27 20:51 | 0:02  | `plan.md`, ADR 0001–0004                                                                                                                                            |
| Plan    | Arbeit    | 2026-11-27 20:51 | 2026-11-27 20:55 | 0:04  | Review-Agent, Befunde 1–11 umgesetzt, Review abgelegt, PR                                                                                                           |
| Plan    | Arbeit    | 2026-11-27 20:55 | 2026-11-27 20:57 | 0:02  | Spec-Check rot: Review-Datei in `plan-1.md` umbenannt, CI grün                                                                                                      |
| Plan    | Wartezeit | 2026-11-27 20:57 | 2026-11-27 20:58 | 0:01  | Freigabe des Plans; Ende = erste Ablesung nach der Antwort                                                                                                          |
| Plan    | Arbeit    | 2026-11-27 20:58 | 2026-11-27 20:58 | 0:00  | Freigabe eingetragen, Merge                                                                                                                                         |
| Tasks   | Arbeit    | 2026-11-27 21:08 | 2026-11-27 21:10 | 0:02  | Vorlage, Retro der Webseite (Kalibrierung), `tasks.md` mit 29 Tasks                                                                                                 |
| Analyze | Arbeit    | 2026-11-27 21:10 | 2026-11-27 21:11 | 0:01  | AK-Abdeckung maschinell geprüft, Analyse in `tasks.md`, Commit                                                                                                      |
| Tasks   | Arbeit    | 2026-11-27 21:11 | 2026-11-27 21:15 | 0:04  | Review-Agent (Sitzung dazwischen neu gestartet), Befunde 1–10 umgesetzt, Review abgelegt                                                                            |

## Summen

| Was     | Arbeit | Wartezeit | Gesamt |
| ------- | ------ | --------- | ------ |
| Spec    | 0:23   | 0:33      | 0:56   |
| Clarify | 0:04   | 0:04      | 0:08   |
| Plan    | 0:09   | 0:02      | 0:11   |
| Tasks   | 0:06   | 0:00      | 0:06   |
| Analyze | 0:01   | 0:00      | 0:01   |
