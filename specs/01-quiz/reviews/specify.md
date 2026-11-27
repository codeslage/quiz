## Review: codeslage/quiz PR #6 (`feature/quiz-spec`) · Vorhaben 01-quiz · SDD-Stufe 1 (Umzug der freigegebenen Spec), README, project-words.txt

Ergebnis: ✅ mergebar (keine 🔴; 🟡 im selben PR beheben oder bewusst in Stufe 2 vertagen)

### Befunde

| # | Grad | Datei:Zeile | Befund | Fehlerfall | Artikel |
|---|---|---|---|---|---|
| 1 | 🟡 | `specs/01-quiz/zeiten.md:22` | In der Zeile „Repo“ (Art `Arbeit`) steckt nach eigener Bemerkung auch die Wartezeit auf `gh auth refresh` durch den Inhaber. Das widerspricht der Methode in Z. 8 („Eine Zeile enthält nie beides“) und `sdd-ablauf.md`, „Zeiterfassung“. | Retro und eine spätere Abrechnung weisen die 3 Minuten komplett als Arbeit aus, obwohl ein Teil davon Wartezeit war. | XIV |
| 2 | 🟡 | `specs/01-quiz/zeiten.md:23` | Das Protokoll endet um 09:36. Der Commit `240ecfa` ist aber von 09:37:37, der werkstatt-Commit `aa01459` (Roadmap) von 09:38:23. Danach kamen noch README, `project-words.txt`, beide PRs und dieses Review. Diese Zeit fehlt (noch). | Wird so gemergt, fehlt im Ist des Vorhabens der Aufwand für Verweis, PRs und Review. | XIV |
| 3 | 🟡 | `specs/01-quiz/zeiten.md:22-23, 30` | „Was = Repo“ ist weder eine Stufe noch eine Task. Die Methode (Z. 7) erlaubt nur `T-xx` oder Stufennamen. Der Umzug gehört zu Stufe 1, also `Spec` mit Bemerkung. | In der Summen-Tabelle und der Retro steht eine Kategorie ohne Soll und ohne Stufe. Sie lässt sich mit nichts vergleichen. | XIV |
| 4 | 🟡 | `specs/01-quiz/spec.md:123` | Unter Risiken steht noch „Widerruf → Frage 2“. Frage 2 ist aber beantwortet (Z. 132, AK-26). | Ein Leser hält den Widerruf von Auswertungslinks für offen. Im Plan wird er womöglich erneut diskutiert. | IV |
| 5 | 🟡 | `specs/01-quiz/spec.md:78-79` (AK-10, AK-11) | AK-10 wertet „je Quiz-Version“ aus. AK-11 setzt die Mindestzahl aber nur je Gruppe („Hat eine Gruppe weniger als 5 Durchgänge“). Ob die Schwelle je Version gilt, bleibt offen. Das gehört als Frage in Stufe 2, vor den Plan. | Eine Gruppe hat 3 Durchgänge in v1 und 4 in v2, zusammen also 7. Wörtlich nach AK-11 zeigt der Link dann Werte, je Version aber nur aus 3 bzw. 4 Durchgängen. Das ist genau der Rückschluss auf Einzelne, den K3 und das Risiko in Z. 122 ausschließen sollen. | VIII, IV |
| 6 | ⚪ | `specs/01-quiz/spec.md:5` | Der Bezug „`specs/03-roadmap.md` (… Vorhaben Quiz-Plattform)“ in werkstatt gibt es erst nach dem Merge von werkstatt PR #82. | Wird #6 vor #82 gemergt, zeigt der Bezug ins Leere. Reihenfolge: #82 zuerst oder beide zusammen. | XII |
| 7 | ⚪ | `project-words.txt:36-40` | Die fünf neuen Wörter stehen unsortiert am Ende, die übrige Liste ist sortiert. | Rein kosmetisch. Bei späteren Sync- oder Merge-Konflikten ist die Liste schwerer zu lesen. | XV |

### Checkliste

| # | Prüfpunkt | ✅/❌/– | Anmerkung |
|---|---|---|---|
| 1 | Auftrag | ✅ | Der Diff ändert nur `specs/01-quiz/spec.md`, `specs/01-quiz/zeiten.md`, `README.md` und `project-words.txt`. Verglichen mit `specs/09-quiz/` auf dem werkstatt-Branch `feature/quiz-spec` ist der Inhalt der Spec wirklich unverändert: Es ändern sich nur die Nummer im Titel und die Zeilen Stand/Bezug. |
| 2 | Korrektheit | ✅ | Status, Freigabedatum und offene Fragen sind stimmig: Die blockierenden Fragen 2–4 sind beantwortet. Spec, Roadmap (PR #82) und README stimmen überein: Bau nach Phase 2, öffentlich ab Phase S. Die Bezüge auf werkstatt (Vision Erfolg 6, Prinzip „Wiederverwendbar“, Architektur A2, ADR 0009) gibt es alle. Kleinere Unstimmigkeiten siehe Befunde 4 und 5. |
| 3 | Tests | ✅ | Noch kein Code. Jedes der 26 AKs nennt eine Testart. AK-20 hängt an Frage 6 (Grenzwert) und AK-13 an Frage 1 (Login). Beide sind als nicht blockierend markiert, müssen aber im Plan feststehen. AK-4/AK-23 brauchen die Quest-Datei (Frage 10). CI komplett grün inklusive `ci-ok`, lokal `pnpm spellcheck` und Prettier grün. |
| 4 | Eingaben | ✅ | Als Anforderung verankert (AK-21, AK-22). |
| 5 | Sicherheit / Öffentlich vs. intern | ✅ | Das Repo ist öffentlich. Es enthält keine Secrets, Kontonamen, Kontaktdaten oder Hostnamen. `admin:org` in `zeiten.md` ist nur der Name eines GitHub-Token-Scopes, kein Kontoname. `PUBLIC_BLOCKLIST` ist gesetzt, der Öffentlich-Scan lief mit `--require-blocklist` grün. |
| 6 | Datenschutz | ✅ | Spec ohne personenbezogene Daten (AK-6), mit Mindestzahl und 24 Monaten Löschfrist. Lücke bei der Mindestzahl je Version siehe Befund 5. |
| 7 | Mensch im Loop | ✅ | Veröffentlichen nur durch den Inhaber (AK-14, AK-15). |
| 8 | Zerstörerisches | ✅ | Das automatische Löschen ist an eine Frist gebunden (AK-19). Manuelles Löschen ist als Frage 7 offen. |
| 9 | Code-Qualität / CWK-Regeln | ✅ | Keine CWK-Datei geändert: Keine der geänderten Dateien steht in `cwk/manifest.json`. `CLAUDE.md`, `cspell.config.yaml` und `cwk.json` sind unberührt. „Regeln / CWK-Abgleich“ ist grün. |
| 10 | Abhängigkeiten | – | keine |
| 11 | Fehler | – | Kein Code. In der Spec ist verlangt, dass Ablehnungen und Löschläufe protokolliert werden. |
| 12 | Doku | ✅ | Die README beschreibt jetzt das Projekt. `zeiten.md` ist fortgeführt, aber unvollständig (Befunde 1–3). |

### Zusammenfassung für den Inhaber

Mit dieser Änderung zieht die freigegebene Quiz-Spec aus der werkstatt in das neue Repo `codeslage/quiz`. Dazu kommen eine passende README und fünf Fachbegriffe für die Rechtschreibprüfung. Der Inhalt der Spec ist nachweislich unverändert, und das Repo hält die Regeln der Vorlage ein. Ein echtes Risiko gibt es nicht. Zu klären ist aber eine inhaltliche Frage für Stufe 2: Gilt die Mindestzahl von 5 Teilnahmen je Quiz-Version oder für die ganze Gruppe? Sonst ließen sich bei kleinen Gruppen Einzelne erkennen. Außerdem sollte das Zeitprotokoll noch die Minuten nach 09:36 bekommen und Arbeit und Warten sauber trennen.

### Umsetzung (aufrufende Sitzung)

- Befunde 1–3: `zeiten.md` – Zeilen als `Spec` mit getrennter Wartezeit, fehlende Zeit nach 09:36 ergänzt.
- Befund 4: Risiko verweist auf AK-26.
- Befund 5: als Frage 11 (nicht blockierend) für Stufe 2 aufgenommen.
- Befund 6: Merge-Reihenfolge werkstatt#82 vor quiz#6.
- Befund 7: Wortliste sortiert.
