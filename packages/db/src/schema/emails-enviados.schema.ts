import { pgTable, serial, integer, timestamp, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import type { EmailStatus } from '@orcamento/shared-types';
import { orcamentos } from './orcamentos.schema';
import { destinatarios } from './destinatarios.schema';

export const emailsEnviados = pgTable(
  'emails_enviados',
  {
    id:             serial('id').primaryKey(),
    orcamentoId:    integer('orcamento_id').notNull().references(() => orcamentos.id, { onDelete: 'cascade' }),
    destinatarioId: integer('destinatario_id').notNull().references(() => destinatarios.id, { onDelete: 'cascade' }),
    dataEnvio:      timestamp('data_envio').defaultNow().notNull(),
    status:         varchar('status', { length: 20 }).$type<EmailStatus>().notNull().default('Enviado'),
  },
  (table) => [
    uniqueIndex('emails_enviados_orcamento_destinatario_key').on(table.orcamentoId, table.destinatarioId),
  ],
);

export type EmailEnviadoInsert = typeof emailsEnviados.$inferInsert;
export type EmailEnviadoSelect = typeof emailsEnviados.$inferSelect;
