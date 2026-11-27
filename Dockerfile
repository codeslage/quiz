# Beispiel-App der Vorlage: ohne Abhängigkeiten zur Laufzeit, ohne Root, mit HEALTHCHECK.
# Basis-Image per Digest des Multi-Arch-Index gepinnt (wie in werkstatt), Updates über Dependabot.
FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY package.json ./
COPY src src
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["node", "src/main.ts"]
