import type { IncomingMessage, ServerResponse } from 'node:http';

// Minimale Beispiel-App der Vorlage: nur /health. Ersetzen, sobald das Projekt eigene Endpunkte hat.
export function handle(request: IncomingMessage, response: ServerResponse): void {
  const ok = request.method === 'GET' && request.url === '/health';
  response.writeHead(ok ? 200 : 404, { 'content-type': 'application/json' });
  response.end(JSON.stringify(ok ? { status: 'ok' } : { error: 'not found' }));
}
