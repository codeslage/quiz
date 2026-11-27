import { createServer } from 'node:http';
import { handle } from './health.ts';

const port = Number(process.env.PORT ?? 3000);

// Strukturiert auf die Standardausgabe, ohne personenbezogene Daten (Constitution XVI).
createServer(handle).listen(port, () => console.log(JSON.stringify({ level: 'info', msg: 'listening', port })));
