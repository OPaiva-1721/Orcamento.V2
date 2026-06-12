import { pgTable, serial, varchar, numeric, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { clientes } from './clientes.schema';

export const orcamentos = pgTable('orcamentos', {
  id:             serial('id').primaryKey(),
  descricao:      varchar('descricao', { length: 1000 }).notNull(),
  preco:          numeric('preco', { precision: 12, scale: 2, mode: 'number' }).notNull(),
  status:         varchar('status', { length: 50 }).notNull().default('Pendente'),
  formaPagamento: boolean('forma_pagamento').notNull().default(false),
  dataInicio:     timestamp('data_inicio').notNull(),
  dataTermino:    timestamp('data_termino'),
  clienteId:      integer('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().notNull(),
});

export type OrcamentoInsert = typeof orcamentos.$inferInsert;
export type OrcamentoSelect = typeof orcamentos.$inferSelect;
