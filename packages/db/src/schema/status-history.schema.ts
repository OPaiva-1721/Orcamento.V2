import { pgTable, serial, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { orcamentos } from './orcamentos.schema';

export const statusHistory = pgTable(
  'status_history',
  {
    id:          serial('id').primaryKey(),
    orcamentoId: integer('orcamento_id').notNull().references(() => orcamentos.id, { onDelete: 'cascade' }),
    status:      varchar('status', { length: 50 }).notNull(),
    dataMudanca: timestamp('data_mudanca').defaultNow().notNull(),
    observacao:  varchar('observacao', { length: 500 }),
  },
  (table) => [
    index('status_history_orcamento_id_idx').on(table.orcamentoId),
  ],
);

export type StatusHistoryInsert = typeof statusHistory.$inferInsert;
export type StatusHistorySelect = typeof statusHistory.$inferSelect;
