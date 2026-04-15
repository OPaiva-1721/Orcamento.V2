import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const clientes = pgTable('clientes', {
  id:        serial('id').primaryKey(),
  nome:      varchar('nome', { length: 255 }).notNull(),
  cnpj:      varchar('cnpj', { length: 14 }).notNull(),   // armazenado limpo (14 dígitos)
  email:     varchar('email', { length: 255 }).notNull().unique(),
  telefone:  varchar('telefone', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ClienteInsert = typeof clientes.$inferInsert;
export type ClienteSelect = typeof clientes.$inferSelect;
