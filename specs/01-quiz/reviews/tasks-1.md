# Review: Stufen 4 Tasks und 5 Analyze (`feature/quiz-tasks`)

> Agent `code-reviewer`, 2026-11-27, Commit aa366fa · Ausgabe unverändert übernommen, Abschnitt „Umsetzung“ von der schreibenden Sitzung

Ergebnis: ✅ mergebar (kein 🔴; sechs 🟡 sollten vor dem Merge behoben oder begründet werden)

Geprüft: Commit aa366fa gegen `main`, 2 Dateien (`specs/01-quiz/tasks.md` neu, `specs/01-quiz/zeiten.md` +1 Zeile). Gelesen habe ich `CONSTITUTION.md`, `docs/prozess/code-review.md`, `sdd-ablauf.md`, `spec.md` (AK-1 bis AK-28, Fragen 1 bis 12), `plan.md` (Schritte 1 bis 11, Teststrategie), die Vorlage `specs/_vorlagen/tasks.md` und die vollständige `zeiten.md`. Lokal ausgeführt: `pnpm format`, `spellcheck`, `lint`, `typecheck` und `test` sind alle ohne Fehler. Nachgerechnet: Jedes AK von 1 bis 28 kommt in der Spalte „AK“ mindestens einmal vor. Es sind 29 Tasks in 12 PRs, die Summe Soll ist 31,75 h und stimmt. Die Abhängigkeiten haben keine Zyklen.

## Befunde

| #   | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
| --- | ---- | ----------- | ------ | ---------- | ------- |
| 1   | 🟡   | specs/01-quiz/tasks.md:54–55, 84, 118 | Die Analyse sagt, die Testarten „entsprechen der Spec“. Für AK-9 und AK-11 verlangt die Spec aber **Integration + E2E**. Die Tasks nennen nur `src/domain/aggregate.test.ts` (in `domain/`, also ein Unit-Test ohne DB) und E2E. Auf Server- bzw. DB-Ebene prüft kein Integrationstest die Auswahl der Vergleichsmenge: gleiche Version, eigener Durchgang ausgeschlossen, Gruppe oder nur Durchgänge ohne Gruppe. Die Lücke steckt schon im Plan (plan.md:180 nennt `aggregate.test.ts` unter „Integration“), die Analyse hat sie nicht gefunden. | Die Abfrage in `server/` liefert Durchgänge aller Versionen oder schließt den eben gespeicherten Durchgang nicht aus. Die Unit-Tests bleiben grün, weil sie fertige Listen bekommen. Das E2E-Szenario „4 vs. 5 andere“ deckt weder zwei Versionen noch die Trennung „öffentlich ohne Gruppen“ ab. | II |
| 2   | 🟡   | specs/01-quiz/tasks.md:45, 53, 84 | Der Plan verlangt: „Jede Ablehnung wird strukturiert protokolliert … nie mit Gruppen-Code oder Auswertungs-Token“. Dazu gibt es nur für das Rate-Limit (T-13) und für eine erfolgreiche Einsendung (T-14) einen Test. Für die Ablehnungen 400 und 404 (T-12, T-15, T-26) nennt keine Task das Protokollieren oder einen Log-Test, ebenso wenig für die Bedingung „kein Code und kein Token im Log“. | Der Logger aus T-02 schreibt bei 404 auf `/q/<slug>/g/<code>` (archivierte, also echte Gruppe) oder beim Aufruf von `/r/<token>` den Pfad mit. Dann steht ein gültiger Spiel- oder Auswertungslink im Log, und kein Test schlägt an. Umgekehrt kann eine Ablehnung ganz ohne Log bleiben. | XVI, VII, VIII |
| 3   | 🟡   | specs/01-quiz/tasks.md:83, 91, 68 | AK-21 („Admin-Eingaben“ werden per Schema geprüft) ist nur für den Entwurf (T-20) mit einem Test belegt. T-25 (Gruppe anlegen mit `label`) und T-28 (Bestätigung durch Eintippen des Namens, Lösch- und Archiv-Aktionen) tragen AK-21 nicht und haben keinen Test mit ungültiger Eingabe. In T-20 deckt der Test die Struktur des Entwurfs ab, nicht den Slug. Der Plan fordert „je Systemgrenze ein Test mit ungültiger Eingabe“. | Beim Anlegen eines Quiz mit Slug `../admin`, Leerzeichen oder einem doppelten Slug prüft kein Test, dass das abgelehnt wird. Dasselbe gilt für ein leeres oder 10 000 Zeichen langes Gruppen-Label oder eine fremde Quiz-ID in der Lösch-Anfrage. | VII, II |
| 4   | 🟡   | specs/01-quiz/tasks.md:45 | Laut Plan ist die Leitlinie: Der Server „rechnet selbst noch einmal und verwirft, was der Browser behauptet“, und Ungültiges wird „abgelehnt, nicht repariert“. In den Tests von T-12 fehlt ein Fall mit einer manipulierten Einsendung, etwa mit Zusatzfeldern. | Der Browser sendet `{versionId, answers, result: {percent: 100}}`. Ob das mit 400 abgelehnt oder still entfernt wird, legt kein Test fest. Zod entfernt unbekannte Felder standardmäßig, das wäre ein „Reparieren“ entgegen AK-21. | VII, II |
| 5   | 🟡   | specs/01-quiz/zeiten.md:37–45 | Es gibt eine Zeile `Tasks`, aber keine Zeile für **Analyze**, obwohl die Methode (Zeile 7) Analyze ausdrücklich nennt und `tasks.md` die Analyse als erledigt meldet. In der Tabelle „Summen“ fehlt außerdem die Zeile `Tasks`. | In der Retro fehlen Stufe 5 und die Summe der Stufe 4. Soll/Ist ist dann unvollständig. | XIV |
| 6   | 🟡   | specs/01-quiz/tasks.md:29, 125 | Für T-06 ist die Quest-Datei nötig, die nur „vom Inhaber im Chat geliefert“ wurde und nicht im Repo liegt. Die Task hat kein 👤 und keine Abhängigkeit „Datei vom Inhaber bereitstellen“. | Die Sitzung für PR-2 startet frisch und hat die Datei nicht. Die Referenzwerte für AK-4 lassen sich dann nicht ermitteln, oder sie werden aus dem Seed selbst errechnet, und der Test beweist nichts mehr. | II, IV |
| 7   | ⚪   | specs/01-quiz/tasks.md:84 | `Referrer-Policy: no-referrer` für `/r/*` ist Teil von T-26, aber kein Test prüft den Header. | Fehlt der Header, sendet der Browser beim Klick auf einen externen Link den Token als Referer mit, und alle Tests bleiben grün. | II, VII |
| 8   | ⚪   | specs/01-quiz/tasks.md:21, 61–62 | Für die manuellen Tests von AK-13 (echter Google-Login) und AK-25 (lokaler Start nach Runbook) ist keine Protokolldatei festgelegt. Bei T-11 gibt es dagegen `reviews/T-11-manuell.md`. | In Stufe 7 fehlt ein auffindbarer Nachweis für diese beiden manuellen Tests. | II |
| 9   | ⚪   | specs/01-quiz/tasks.md:70–71 | T-22 (Vorschau mit der Spielseite) und T-23 (Spielen ohne XP) brauchen T-09 und T-10. In der Spalte „Abhängig von“ steht nur T-21 bzw. T-22. Abgesichert ist das nur über den Satz zur Reihenfolge in Zeile 103. | Liest jemand nur die Tabelle, könnte er PR-7b vor PR-3 beginnen. | III |
| 10  | ⚪   | specs/01-quiz/spec.md:6, plan.md:6 | In den Kopfzeilen steht noch „SDD-Stufe: 2 Clarify · nächste: 3 Plan“ bzw. „3 Plan“. Das Vorhaben steht jetzt in Stufe 4/5. | Der Kopf der Spec zeigt einen veralteten Stand. | XII |

## Checkliste

| #   | Prüfpunkt | ✅/❌/– | Anmerkung |
| --- | --------- | ------- | --------- |
| 1   | Auftrag | ✅ | Jede Task hat ein AK und jedes AK eine Task. Plan-Schritte 1 bis 11 sind vollständig abgebildet. Die Teilung 7a/7b ist im Plan erlaubt. |
| 2   | Korrektheit | ✅ | Summe Soll, Anzahl der Tasks und PRs nachgerechnet, keine Zyklen. Kleinere Lücken in den Abhängigkeiten siehe #9. |
| 3   | Tests | ❌ | #1 (fehlende Integration für AK-9/11, Analyse-Aussage falsch), #4, #6. Nur 🟡, nicht blockierend. |
| 4   | Eingaben | ❌ | #3: Admin-Eingaben in T-25/T-28 und der Slug sind ohne Schema-Test geplant. Nur 🟡. |
| 5   | Sicherheit | ✅ | Keine Secrets. Token nur als Hash, Admin-Schutz je Weg getestet, nichts Internes im öffentlichen Repo. Kleiner Punkt #7. |
| 6   | Datenschutz | ✅ | Keine IP und keine Cookies (T-02, T-13, T-14). Fragen 12 und dsgvo sind bewusst auf Phase S vertagt. Log-Lücke siehe #2. |
| 7   | Mensch im Loop | ✅ | Keine KI-Aufrufe in der App, online geht nur, was veröffentlicht ist. ⛔ ist bei T-03 gesetzt. |
| 8   | Zerstörerisches | ✅ | T-28 löscht nur mit Bestätigungsseite und in einer Transaktion. Die Analyse grenzt das richtig von Artikel V ab. |
| 9   | Code-Qualität | – | Kein Code im Diff. Geplante Prüfungen (Knip, dependency-cruiser, ESLint-Verbote) stehen in T-01 und T-09. |
| 10  | Abhängigkeiten | – | Keine neuen Pakete. Die Regel 5 der Tasks verlangt die Begründung im PR. |
| 11  | Fehler | ❌ | #2: Ablehnungen 400/404 sind ohne geplantes Protokoll und ohne Test. Nur 🟡. |
| 12  | Doku | ❌ | #5 (`zeiten.md` unvollständig), #10 (Stufenangabe veraltet). Nur 🟡/⚪. |

## Zusammenfassung für den Inhaber

Mit dieser Änderung wird das Quiz-Vorhaben in 29 kleine Aufgaben und 12 Pakete zerlegt, je mit Zeitschätzung (zusammen knapp 32 Stunden), und es wird geprüft, ob alles zusammenpasst. Jede Anforderung der Spec hat eine Aufgabe und einen geplanten Test, gefährliche Lücken gibt es nicht. Es fehlen aber einige Prüfungen, die die Spec oder der Plan versprechen. Erstens wird nicht auf Datenbank-Ebene geprüft, ob der Durchschnittsvergleich wirklich nur die richtigen Teilnahmen zählt. Zweitens prüft kein Test, dass Ablehnungen protokolliert werden, ohne geheime Links ins Protokoll zu schreiben. Drittens fehlen Schema-Tests für einige Eingaben in der Admin-Oberfläche. Außerdem hängt die Aufgabe mit den Vergleichswerten der Quest an Ihrer Original-Datei, die nur im Chat liegt; Sie müssen sie dafür voraussichtlich noch einmal bereitstellen. Zum Ausprobieren gibt es noch nichts. Sehen Sie aber bitte die Zeitschätzungen und die Reihenfolge der Pakete durch, ob sie zu Ihrer Planung passen.

## Umsetzung

| #   | Entscheidung |
| --- | ------------ |
| 1   | behoben: T-17 mit `src/server/compare.test.ts` (Integration), AK-11 ergänzt; Aussage in der Analyse korrigiert. Der Plan bleibt unverändert, weil seine Testarten damit erfüllt sind |
| 2   | behoben: Logger schwärzt Code und Token (T-02, `log.test.ts`); Ablehnungen protokolliert und geprüft in T-12, T-15, T-26 |
| 3   | behoben: Schema-Tests für Slug (T-20), Gruppen-Label (T-25) und Lösch-Bestätigung bzw. fremde ID (T-28), jeweils AK-21 |
| 4   | behoben: T-12 mit strenger Prüfung, unbekannte Felder → 400 |
| 5   | behoben: Zeilen und Summen für Tasks und Analyze |
| 6   | behoben: T-06 mit 👤, Datei lokal unter `.local/` (in `.gitignore`) |
| 7   | behoben: Header-Test in T-26 |
| 8   | behoben: Protokolle `reviews/T-03-manuell.md` und `reviews/T-19-manuell.md` |
| 9   | behoben: T-22 hängt auch von T-10 ab, T-23 von T-09 |
| 10  | behoben: Kopfzeilen von Spec und Plan |
