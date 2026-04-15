import { relations } from 'drizzle-orm';
import { clientes } from './clientes.schema';
import { destinatarios } from './destinatarios.schema';
import { orcamentos } from './orcamentos.schema';
import { orcamentosDestinatarios } from './orcamentos-destinatarios.schema';
import { emailsEnviados } from './emails-enviados.schema';
import { statusHistory } from './status-history.schema';

export const clientesRelations = relations(clientes, ({ many }) => ({
  destinatarios: many(destinatarios),
  orcamentos:    many(orcamentos),
}));

export const destinatariosRelations = relations(destinatarios, ({ one, many }) => ({
  cliente:        one(clientes, { fields: [destinatarios.clienteId], references: [clientes.id] }),
  orcamentos:     many(orcamentosDestinatarios),
  emailsEnviados: many(emailsEnviados),
}));

export const orcamentosRelations = relations(orcamentos, ({ one, many }) => ({
  cliente:        one(clientes, { fields: [orcamentos.clienteId], references: [clientes.id] }),
  destinatarios:  many(orcamentosDestinatarios),
  emailsEnviados: many(emailsEnviados),
  statusHistory:  many(statusHistory),
}));

export const orcamentosDestinatariosRelations = relations(orcamentosDestinatarios, ({ one }) => ({
  orcamento:    one(orcamentos, { fields: [orcamentosDestinatarios.orcamentoId], references: [orcamentos.id] }),
  destinatario: one(destinatarios, { fields: [orcamentosDestinatarios.destinatarioId], references: [destinatarios.id] }),
}));

export const emailsEnviadosRelations = relations(emailsEnviados, ({ one }) => ({
  orcamento:    one(orcamentos, { fields: [emailsEnviados.orcamentoId], references: [orcamentos.id] }),
  destinatario: one(destinatarios, { fields: [emailsEnviados.destinatarioId], references: [destinatarios.id] }),
}));

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  orcamento: one(orcamentos, { fields: [statusHistory.orcamentoId], references: [orcamentos.id] }),
}));
