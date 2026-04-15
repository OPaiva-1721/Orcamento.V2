// Schemas
export * from './schema/clientes.schema';
export * from './schema/destinatarios.schema';
export * from './schema/orcamentos.schema';
export * from './schema/orcamentos-destinatarios.schema';
export * from './schema/emails-enviados.schema';
export * from './schema/status-history.schema';
export * from './schema/relations';

// Re-export drizzle-orm helpers usados frequentemente
export { eq, and, or, like, desc, asc, count, sum, inArray, isNull, isNotNull, sql } from 'drizzle-orm';
