# Review: Stufe 3 Plan (`feature/quiz-plan`)

> Agent `code-reviewer`, 2026-11-27, Commit b0d7b39 · Ausgabe unverändert übernommen, Abschnitt „Umsetzung“ von der schreibenden Sitzung

Ergebnis: ❌ nicht mergebar (offene 🔴)

Geprüft: Commit b0d7b39 gegen `main` mit 7 Dateien (`specs/01-quiz/plan.md`, `docs/adr/0001`–`0004`, `specs/01-quiz/zeiten.md`, `project-words.txt`). Gelesen: Spec (Stand Clarify), Plan-Vorlage, `code-review.md`, `sdd-ablauf.md`, die CI (`ci.yml` und die eingebundenen CWK-Workflows) und `02-architektur.md` in werkstatt. Lokal ausgeführt: `pnpm format` schlägt fehl. `spellcheck`, `lint`, `typecheck`, `test` und der spec-check sind ohne Fehler.

## Befunde

| #   | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
| --- | ---- | ----------- | ------ | ---------- | ------- |
| 1   | 🔴   | `specs/01-quiz/zeiten.md:30-32` | Die drei neuen Plan-Zeilen sind nicht nach Prettier formatiert (Tabellenspalten nicht ausgerichtet). | `pnpm format` meldet `[warn] specs/01-quiz/zeiten.md` mit Exit-Code 1. Der Job `format` in `cwk-rules.yml` führt genau diesen Befehl aus, damit wird `ci-ok` rot und der PR ist blockiert. | II, XV |
| 2   | 🟡   | `specs/01-quiz/plan.md:130` | Schritt 4 nimmt eine Einsendung nur an, wenn ihre Version „die neueste“ ist. | Eine Person startet die Quest in Version 1. Während sie spielt, veröffentlicht der Inhaber Version 2. Ihre Einsendung zu Version 1 wird mit 400 abgelehnt, und der abgeschlossene Durchgang geht verloren. Das widerspricht AK-5 („ein abgeschlossener Durchgang wird … gespeichert“) und AK-16 (Durchgänge bleiben ihrer Version zugeordnet). Vorschlag: jede veröffentlichte Version eines nicht archivierten Quiz annehmen. | II |
| 3   | 🟡   | `specs/01-quiz/plan.md:122` | „Seed läuft beim Start, wenn das Quiz fehlt.“ | Der Inhaber löscht die Quest endgültig (AK-27, mit Bestätigung). Beim nächsten Neustart legt der Seed sie samt neuer Version wieder an. Das endgültige Löschen hält also nicht. Der Plan sollte festlegen, dass der Seed nur in eine leere Datenbank schreibt bzw. nur einmal läuft (z. B. als eigene Migration). | V, II |
| 4   | 🟡   | `specs/01-quiz/plan.md:59` | Beim endgültigen Löschen eines Quiz nennt der Plan nur die Durchgänge. Was mit `quiz_versions` passiert, bleibt offen. Gleichzeitig heißt es: „Versionen haben keine Löschfunktion“. | `quiz_versions.quiz_id` verweist auf `quizzes`. Bleiben die Versionen stehen, scheitert das Löschen des Quiz am Fremdschlüssel. Werden sie mitgelöscht, fehlt diese Regel im Plan und im Test zu AK-27 (Zeile 196). Klarstellen: Versionen werden nur zusammen mit ihrem Quiz gelöscht, nie einzeln. | V |
| 5   | 🟡   | `docs/adr/0003-daten-versionen-als-schnappschuss.md:27` | Laut ADR stehen die Abhängigkeiten „alle [unter] MIT bzw. Unlicense“. `plan.md:104` nennt für `drizzle-orm`/`drizzle-kit` dagegen Apache-2.0. | Das ADR macht eine falsche Lizenzangabe. Wer die Lizenzprüfung nach Artikel XI am ADR festmacht, liest für Drizzle die falsche Lizenz. | XI, XII |
| 6   | 🟡   | `docs/adr/0001-app-astro-ssr.md:22`, `specs/01-quiz/plan.md:126` | Gegen das Ausführen von HTML (AK-22) gibt es eine Lint-Regel nur für `set:html` in `.astro`-Dateien. Die Browser-Skripte unter `src/client/` (Spielablauf, Editor) zeigen dieselben Quiz-Texte an. Für sie schreibt der Plan nur beim Netzdiagramm vor, auf `innerHTML` zu verzichten. | Rendert der Spielablauf eine Frage oder Erklärung per `innerHTML`, wird ein `<img onerror>` im Fragetext ausgeführt. Kein Lint-Check fängt das ab, erst der E2E-Test findet es, und auch nur für die getesteten Felder. Vorschlag: ESLint-Verbot für `innerHTML`/`outerHTML`/`insertAdjacentHTML` in `src/client/`. | VII, XV |
| 7   | ⚪   | `specs/01-quiz/plan.md:83`, `:78` | Ablehnungen werden mit „Weg“ protokolliert. Der Weg `/r/<report_token>` enthält das Geheimnis selbst. Eine `Referrer-Policy` ist nicht vorgesehen. | Wird das Logging allgemein auf alle Wege ausgedehnt (z. B. 404-Logs), landen echte Auswertungs-Tokens im Log. Gleiches gilt für den Referer, sobald die Kundenauswertung auf eine externe Seite verlinkt (z. B. `PRIVACY_URL`). Vorschlag: Tokens nie in Logs schreiben, `Referrer-Policy: no-referrer` auf `/r/*`. | VI, XVI |
| 8   | ⚪   | `docs/adr/0002-admin-login-better-auth.md:21` | Laut Plan wird nur die E-Mail gegen `ADMIN_EMAILS` geprüft. | Empfehlung: zusätzlich `email_verified` des Google-Profils prüfen, damit ein Google-Konto mit unbestätigter Fremdadresse nicht durchkommt. | VII |
| 9   | ⚪   | `specs/01-quiz/plan.md:118`, `:122` | Schritt 1 ist auf AK-25 abgebildet („samt … dem ersten Quiz“). Der Seed der Quest kommt aber erst in Schritt 2. | Nach Schritt 1 lässt sich AK-25 nur zum Teil nachweisen. Schritt 2 sollte AK-25 ebenfalls nennen, damit `tasks.md` den vollständigen Nachweis zuordnet. | II |
| 10  | ⚪   | `specs/01-quiz/plan.md:134`, `:152` | AK-21 nennt ausdrücklich „Links“. In den Schritten erscheint AK-21 nur bei 4 (Einsendung) und 7 (Admin). Bei Gruppen-Code (Schritt 5) und Auswertungs-Token (Schritt 9) fehlt der Bezug. | Der Bezug von den Tasks zu AK-21 hat dadurch eine Lücke. Das fällt in Stufe 5 (Analyze) auf, lässt sich aber hier schon schließen. | II |
| 11  | ⚪   | `specs/01-quiz/zeiten.md:34-39` | In den Summen fehlt eine Zeile „Plan“. | Nach der Methode in `zeiten.md` stehen die Summen je Stufe unter der Tabelle. Spätestens mit der Freigabe des Plans nachtragen. | XIV |

## Checkliste

| #   | Prüfpunkt | ✅/❌/– | Anmerkung |
| --- | --------- | ------- | --------- |
| 1   | Auftrag | ✅ | Der Diff enthält nur Stufe 3: Plan, ADRs, Zeiten, Wörterliste. Jedes AK 1–28 steht in der Teststrategie und ist einem Schritt zugeordnet (Lücken nur bei Befund 9 und 10). |
| 2   | Korrektheit | ❌ | Befunde 2, 3 und 4 sind Randfälle, die zu Datenverlust oder einem Widerspruch zur Spec führen. |
| 3   | Tests | ✅ | Die Teststrategie nennt je AK Art und Ort und prüft Verhalten (z. B. AK-19 mit 24 Monaten ± 1 Tag, AK-20 mit der 11. Einsendung). Manuelle Tests gibt es nur mit Begründung. |
| 4   | Eingaben | ✅ | Zod an jeder Grenze, Einstellungen beim Start geprüft, der Server rechnet selbst. Für Links siehe Befund 10. |
| 5   | Sicherheit | ✅ | Token nur als Hash, Admin nur mit erlaubtem Konto, `TRUST_PROXY` nur auf ausdrückliche Einstellung, nichts Internes im öffentlichen Repo. Härtungen in Befund 6, 7 und 8. |
| 6   | Datenschutz | ✅ | Keine IP- oder Geräte-Spalten, IP nur in der Map im Speicher, keine Cookies für Spielende. Google ist ab Phase S für `dsgvo.md` vorgemerkt (Frage 12). |
| 7   | Mensch im Loop | ✅ | Inhalte gehen nur über die Veröffentlichung durch den Inhaber online. Die App macht keine KI-Aufrufe. |
| 8   | Zerstörerisches | ❌ | Das endgültige Löschen ist mit Bestätigung und Namenseingabe vorgesehen, aber Befund 3 (Seed holt Gelöschtes zurück) und Befund 4 (Versionen beim Löschen ungeklärt) sind offen. |
| 9   | Code-Qualität | ✅ | Modulrichtungen sind festgelegt und werden mit dependency-cruiser geprüft. Die Beispiel-App wird entfernt. Es gibt noch keinen Code. |
| 10  | Abhängigkeiten | ✅ | Jedes Paket hat Zweck und Lizenz (alle erlauben kommerzielle Nutzung, auch MPL-2.0 für axe). Begründung je PR ist vorgesehen. Die Lizenzangabe in ADR 0003 ist falsch (Befund 5). |
| 11  | Fehler | ✅ | Start bricht bei fehlender Einstellung ab. Ablehnungen und Löschlauf werden strukturiert protokolliert. Benachrichtigung kommt ab Phase S, begründet in ADR 0004. |
| 12  | Doku | ❌ | Die ADRs 0001–0004 liegen vor, und der Plan folgt der Vorlage samt Constitution-Check. Aber `zeiten.md` ist nicht formatiert und bricht die CI (Befund 1); die Summenzeile fehlt (Befund 11). Der Plan steht korrekt auf „Entwurf“, die ADRs auf „Vorgeschlagen“, weil die Freigabe des Plans noch aussteht. |

## Zusammenfassung für den Inhaber

Diese Änderung legt fest, wie die Quiz-Plattform gebaut wird: eine einzelne Web-App, eine Datenbank, Google-Login nur für Sie, 11 Bauschritte, und für jedes Akzeptanzkriterium ist ein Test eingeplant. Der Plan ist durchdacht und passt zur Architektur von codeslage. Blockiert ist der PR durch einen Formatierungsfehler in der Zeiterfassung, der die automatische Prüfung rot macht. Inhaltlich sollten vor Ihrer Freigabe drei Lücken geschlossen werden. Erstens: Wer gerade spielt, während Sie eine neue Version veröffentlichen, verliert sein Ergebnis. Zweitens: Ein endgültig gelöschtes erstes Quiz würde beim nächsten Neustart von selbst wieder auftauchen. Drittens: Was mit alten Versionen passiert, wenn Sie ein Quiz löschen, ist nicht festgelegt. Ausprobieren lässt sich in dieser Stufe noch nichts. Prüfen Sie beim Lesen vor allem, ob die Grenzen von 10 Einsendungen pro Stunde (öffentlich) und 60 (Gruppen-Links) für Ihre Workshops passen.

## Umsetzung

| #   | Entscheidung |
| --- | ------------ |
| 1   | behoben: `prettier --write` |
| 2   | behoben: jede veröffentlichte Version eines nicht archivierten Quiz wird angenommen (Schritt 4) |
| 3   | behoben: Seed als eigene Migration, läuft genau einmal (Schritt 2) |
| 4   | behoben: Löschen eines Quiz löscht Gruppen, Versionen und Durchgänge; Versionen nie einzeln (Datenmodell, ADR 0003, Test AK-27) |
| 5   | behoben: Lizenzen in ADR 0003 korrigiert |
| 6   | behoben: ESLint-Verbot für `innerHTML`, `outerHTML`, `insertAdjacentHTML` in `src/client/` (Schritt 3, ADR 0001) |
| 7   | behoben: keine Codes oder Tokens in Logs, `Referrer-Policy: no-referrer` auf `/r/*` |
| 8   | behoben: `email_verified` zusätzlich geprüft (Schritt 6, ADR 0002) |
| 9   | behoben: Schritt 2 nennt AK-25 |
| 10  | behoben: AK-21 bei Schritt 5 (Gruppen-Code) und 9 (Auswertungs-Token) |
| 11  | behoben: Summenzeile „Plan“ |
