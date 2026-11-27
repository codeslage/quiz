# ADR 0004 – Ein Prozess: Rate-Limit im Speicher, Löschlauf in der App

> Status: **Angenommen** am 2026-11-27 (Freigabe des Inhabers mit dem Plan) · Stand: 2026-11-27
> Bezug: `specs/01-quiz/spec.md` (AK-6, AK-19, AK-20), `specs/01-quiz/plan.md`; Constitution VIII, XI, XVI

## Kontext

Einsendungen werden je IP-Adresse begrenzt, die IP darf nur flüchtig verwendet werden (AK-6, AK-20). Durchgänge älter als 24 Monate werden automatisch gelöscht (AK-19). Bis auf Weiteres läuft genau eine Instanz der App.

## Optionen

|                   | Im Speicher der App              | In Postgres                                | Eigener Dienst (Redis, Cron) |
| ----------------- | -------------------------------- | ------------------------------------------ | ---------------------------- |
| IP nur flüchtig   | ja, verschwindet mit dem Fenster | nein, IP (oder Hash) läge in der Datenbank | ja, aber noch ein Dienst     |
| Mehrere Instanzen | nein                             | ja                                         | ja                           |
| Aufwand (XI)      | wenige Zeilen                    | Tabelle, Aufräumen                         | Betrieb, Abhängigkeit        |

## Entscheidung

**Beides läuft im App-Prozess.** Das Rate-Limit zählt je IP-Adresse in festen Stundenfenstern in einer Map im Speicher; abgelaufene Einträge werden entfernt. Der Löschlauf startet beim Start der App und danach einmal täglich, löscht Durchgänge älter als 24 Monate und protokolliert nur die Anzahl.

## Folgen

- Ein Neustart setzt die Zähler zurück; das ist bei einem Richtwert hinnehmbar.
- Laufen später mehrere Instanzen, wird dieses ADR ersetzt (z. B. Zähler in Postgres ohne IP, nur mit gekürztem Hash).
- Fällt der Löschlauf aus, protokolliert die App einen Fehler; die Benachrichtigung kommt mit dem Betrieb ab Phase S.
