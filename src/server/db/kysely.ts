import { CamelCasePlugin, Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { env } from '../env.ts';
import type { Database } from './types.ts';

const pg = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({ postgres: pg }),
  plugins: [new CamelCasePlugin()],
});
