import { Inject, Injectable } from '@nestjs/common';
import { eq, ilike, count, sql } from 'drizzle-orm';
import { clientes } from '@orcamento/db';
import { Cliente, CreateClienteData, UpdateClienteData, ClienteFilters, PaginatedResponse } from '@orcamento/shared-types';
import { IClienteRepository } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';
import { CnpjAlreadyExistsException } from '../../../../domain/cliente/exceptions/cnpj-already-exists.exception';
import { EmailAlreadyExistsException } from '../../../../domain/cliente/exceptions/email-already-exists.exception';

@Injectable()
export class ClienteDrizzleRepository implements IClienteRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: any) {}

  async findById(id: number): Promise<Cliente | null> {
    const rows = await this.db.query.clientes.findFirst({
      where: eq(clientes.id, id),
      with: { destinatarios: true, orcamentos: true },
    });
    return rows ?? null;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const row = await this.db.query.clientes.findFirst({
      where: eq(clientes.email, email),
    });
    return row ?? null;
  }

  async findAll(filters: ClienteFilters): Promise<PaginatedResponse<Cliente>> {
    const page  = filters.page  ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    const whereClause = filters.q ? ilike(clientes.nome, `%${filters.q}%`) : undefined;

    const [rows, [totalRow]] = await Promise.all([
      this.db.query.clientes.findMany({
        where: whereClause,
        with: { destinatarios: true, orcamentos: true },
        limit,
        offset,
        orderBy: (c: any, { desc }: any) => [desc(c.createdAt)],
      }),
      this.db.select({ value: count() }).from(clientes).where(whereClause ?? sql`1=1`),
    ]);

    const total = Number(totalRow?.value ?? 0);
    return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(data: CreateClienteData): Promise<Cliente> {
    try {
      const [row] = await this.db
        .insert(clientes)
        .values({
          nome:     data.nome,
          cnpj:     data.cnpj.replace(/[^\d]/g, ''),
          email:    data.email,
          telefone: data.telefone,
        })
        .returning();
      return row;
    } catch (err: any) {
      this.handleUniqueViolation(err, data);
      throw err;
    }
  }

  async update(id: number, data: UpdateClienteData): Promise<Cliente> {
    try {
      const updateData: Record<string, any> = {};
      if (data.nome     !== undefined) updateData.nome     = data.nome;
      if (data.email    !== undefined) updateData.email    = data.email;
      if (data.telefone !== undefined) updateData.telefone = data.telefone;
      if (data.cnpj     !== undefined) updateData.cnpj     = data.cnpj.replace(/[^\d]/g, '');
      updateData.updatedAt = new Date();

      const [row] = await this.db
        .update(clientes)
        .set(updateData)
        .where(eq(clientes.id, id))
        .returning();
      return row;
    } catch (err: any) {
      this.handleUniqueViolation(err, data);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(clientes).where(eq(clientes.id, id));
  }

  async countOrcamentos(clienteId: number): Promise<number> {
    const { orcamentos } = await import('@orcamento/db');
    const [row] = await this.db
      .select({ value: count() })
      .from(orcamentos)
      .where(eq(orcamentos.clienteId, clienteId));
    return Number(row?.value ?? 0);
  }

  private handleUniqueViolation(err: any, data: any): void {
    if (err.code === '23505') {
      if (err.constraint?.includes('email')) throw new EmailAlreadyExistsException(data.email ?? '');
      if (err.constraint?.includes('cnpj'))  throw new CnpjAlreadyExistsException(data.cnpj ?? '');
    }
  }
}
