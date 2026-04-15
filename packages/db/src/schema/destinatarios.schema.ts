import { pgTable, serial, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { clientes } from './clientes.schema';

export const destinatarios = pgTable(
  'destinatarios',
  {
    id:        serial('id').primaryKey(),
    nome:      varchar('nome', { length: 255 }).notNull(),
    email:     varchar('email', { length: 255 }).notNull(),
    clienteId: integer('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('destinatarios_email_cliente_id_key').on(table.email, table.clienteId),
  ],
);

export type DestinatarioInsert = typeof destinatarios.$inferInsert;
export type DestinatarioSelect = typeof destinatarios.$inferSelect;
