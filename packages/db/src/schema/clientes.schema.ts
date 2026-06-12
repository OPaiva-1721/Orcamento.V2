import { pgTable, serial, varchar, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const clientes = pgTable(
  'clientes',
  {
    id:        serial('id').primaryKey(),
    ownerId:   varchar('owner_id', { length: 128 }).notNull(), // Firebase UID — escopo multi-tenant
    nome:      varchar('nome', { length: 255 }).notNull(),
    cnpj:      varchar('cnpj', { length: 14 }).notNull(),   // armazenado limpo (14 dígitos)
    email:     varchar('email', { length: 255 }).notNull(),
    telefone:  varchar('telefone', { length: 20 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('clientes_owner_id_idx').on(table.ownerId),
    uniqueIndex('clientes_owner_email_key').on(table.ownerId, table.email),
  ],
);

export type ClienteInsert = typeof clientes.$inferInsert;
export type ClienteSelect = typeof clientes.$inferSelect;
