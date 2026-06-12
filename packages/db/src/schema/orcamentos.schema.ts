import { pgTable, serial, varchar, numeric, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core';
import type { OrcamentoStatus } from '@orcamento/shared-types';
import { clientes } from './clientes.schema';

export const orcamentos = pgTable(
  'orcamentos',
  {
    id:             serial('id').primaryKey(),
    descricao:      varchar('descricao', { length: 1000 }).notNull(),
    preco:          numeric('preco', { precision: 12, scale: 2, mode: 'number' }).notNull(),
    status:         varchar('status', { length: 50 }).$type<OrcamentoStatus>().notNull().default('Pendente'),
    formaPagamento: boolean('forma_pagamento').notNull().default(false),
    dataInicio:     timestamp('data_inicio').notNull(),
    dataTermino:    timestamp('data_termino'),
    clienteId:      integer('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
    createdAt:      timestamp('created_at').defaultNow().notNull(),
    updatedAt:      timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('orcamentos_cliente_id_idx').on(table.clienteId),
    index('orcamentos_status_idx').on(table.status),
  ],
);

export type OrcamentoInsert = typeof orcamentos.$inferInsert;
export type OrcamentoSelect = typeof orcamentos.$inferSelect;
