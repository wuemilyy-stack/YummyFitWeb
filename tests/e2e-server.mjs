import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { createServer } from 'node:http';
import { openStorage } from '../server/storage.mjs';
import { createApp } from '../server/app.mjs';
const directory = mkdtempSync(join(tmpdir(), 'yummyfit-e2e-'));
const storage = await openStorage({ databaseFile: join(directory, 'test.sqlite') });
const server = createServer(createApp({ storage, base: process.env.E2E_SITE_BASE || '/', rateMax: 500 }));
server.listen(4173, '127.0.0.1');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  server.close(async () => {
    await storage.close();
    if (!resolve(directory).startsWith(resolve(tmpdir()) + sep + 'yummyfit-e2e-')) throw new Error('Unsafe cleanup path');
    rmSync(directory, { recursive: true, force: true });
    process.exit(0);
  });
});
