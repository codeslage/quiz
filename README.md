# project-template

Vorlage für neue Projekt-Repos von codeslage. Neue Repos entstehen nicht über „Use this template“, sondern mit `pnpm cwk new <name>` aus `codeslage/werkstatt` (Runbook `docs/runbooks/neues-projekt.md` dort).

- Regeln und Prüfungen kommen aus dem CodeslageWerkzeugKasten (CWK). Welche Dateien dazugehören, steht in `cwk/manifest.json` von `codeslage/werkstatt`. Geändert werden sie dort, nicht hier.
- `cwk.json` nennt den CWK-Stand, ob das Repo Code hat und wohin die Doku gehört.
- Die Beispiel-App in `src/` beantwortet nur `/health`. Starten: `pnpm install`, dann `pnpm start`.
