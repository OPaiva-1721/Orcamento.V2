import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema-exports';

/** Tipo do client Drizzle com o schema do projeto (inclui a API relacional `query`). */
export type Database = NodePgDatabase<typeof schema>;
