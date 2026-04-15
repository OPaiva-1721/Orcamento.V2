import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { orcamentos } from './orcamentos.schema';
import { destinatarios } from './destinatarios.schema';

// Tabela de junção M:N explícita
// (Prisma criava implicitamente como "_OrcamentoDestinatarios")
export const orcamentosDestinatarios = pgTable(
  'orcamentos_destinatarios',
  {
    orcamentoId:    integer('orcamento_id').notNull().references(() => orcamentos.id, { onDelete: 'cascade' }),
    destinatarioId: integer('destinatario_id').notNull().references(() => destinatarios.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.orcamentoId, table.destinatarioId] }),
  ],
);
