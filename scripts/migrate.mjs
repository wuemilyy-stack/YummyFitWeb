import { openStorage } from '../server/storage.mjs';
const storage = await openStorage({
  databaseUrl: process.env.DATABASE_URL, databaseFile: process.env.DATABASE_FILE, migrate: true,
  production: process.env.NODE_ENV === 'production',
});
await storage.close();
console.log('Database migrations through 002 applied.');
