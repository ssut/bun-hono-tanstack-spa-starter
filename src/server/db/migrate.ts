import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { db } from './kysely.ts';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, 'migrations'),
  }),
});

const { error, results } = await migrator.migrateToLatest();

for (const result of results ?? []) {
  if (result.status === 'Success') {
    console.log(`[migrate] applied: ${result.migrationName}`);
  } else if (result.status === 'Error') {
    console.error(`[migrate] failed: ${result.migrationName}`);
  }
}

if (error) {
  console.error('[migrate] migration failed', error);
  process.exit(1);
}

console.log('[migrate] all migrations applied');
await db.destroy();
process.exit(0);
