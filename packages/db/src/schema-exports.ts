// Barrel apenas com tabelas e relations (sem helpers do drizzle-orm),
// usado para inferir o tipo do client Drizzle.
export * from './schema/clientes.schema';
export * from './schema/destinatarios.schema';
export * from './schema/orcamentos.schema';
export * from './schema/orcamentos-destinatarios.schema';
export * from './schema/emails-enviados.schema';
export * from './schema/status-history.schema';
export * from './schema/relations';
