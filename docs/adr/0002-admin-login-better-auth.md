# ADR 0002 – Admin-Login mit Better Auth und Google

> Status: **Vorgeschlagen** am 2026-11-27 (Stufe 3, Freigabe mit dem Plan) · Stand: 2026-11-27
> Bezug: `specs/01-quiz/spec.md` (AK-6, AK-13, Frage 1, Frage 12), `specs/01-quiz/plan.md`; in `codeslage/werkstatt`: `specs/02-architektur.md` (Logins: Google Workspace OAuth; Better Auth); Constitution VI, VII, XIII

## Kontext

Nur das codeslage-Konto des Inhabers darf die Admin-Oberfläche erreichen, per Google-Anmeldung. Welches Konto erlaubt ist, soll Einstellung sein (AK-13). Bis Phase S läuft alles lokal. Spielende bekommen keine Cookies (AK-6).

## Optionen

|                         | Better Auth mit Google-Anbieter                 | Cloudflare Access vor `/admin`              | OAuth selbst gebaut            |
| ----------------------- | ----------------------------------------------- | ------------------------------------------- | ------------------------------ |
| Läuft lokal             | ja (Google erlaubt `localhost` als Rückleitung) | nein, erst mit Domain und Tunnel ab Phase S | ja                             |
| Eigener Sicherheitscode | wenig: nur die Prüfung des erlaubten Kontos     | keiner                                      | viel (Zustand, Token, Sitzung) |
| Passt zur Architektur   | ja, dort als Login-Baustein vorgesehen          | ja, für geschützte Web-Oberflächen          | nein                           |
| Abhängigkeiten (XI)     | `better-auth`; MIT, aktiv gepflegt              | keine im Code                               | keine, aber Sicherheitsrisiko  |

## Entscheidung

**Better Auth** mit dem Google-Anbieter, Sitzungen in Postgres. Nach jeder Anmeldung und bei jeder Admin-Anfrage wird die E-Mail des Kontos gegen `ADMIN_EMAILS` geprüft (Einstellung, eine Adresse vorerst). Andere Konten werden abgelehnt und nicht angelegt. Das Sitzungs-Cookie entsteht nur bei der Admin-Anmeldung.

## Folgen

- Google-OAuth-Client (Client-ID und Secret) für `localhost` anlegen: Schritt des Inhabers 👤, Werte nur in `.env` (Constitution VI); Runbook `docs/runbooks/admin-login.md`.
- In CI und E2E wird die echte Google-Anmeldung nicht durchlaufen: Tests legen eine Admin-Sitzung direkt an und prüfen die Ablehnung ohne bzw. mit fremder Sitzung. Der echte Ablauf ist ein dokumentierter manueller Test.
- Ab Phase S kommt Google als Zweck „Admin-Login“ in `docs/dsgvo.md` von `werkstatt` (Frage 12). Cloudflare Access kann dann zusätzlich davor stehen.
