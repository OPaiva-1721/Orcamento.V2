import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ilike, count, sql } from 'drizzle-orm';
import { clientes, orcamentos } from '@orcamento/db';
import {
  Cliente,
  CreateClienteData,
  UpdateClienteData,
  ClienteFilters,
  PaginatedResponse,
} from '@orcamento/shared-types';
import { IClienteRepository } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';
import { CnpjAlreadyExistsException } from '../../../../domain/cliente/exceptions/cnpj-already-exists.exception';
import { EmailAlreadyExistsException } from '../../../../domain/cliente/exceptions/email-already-exists.exception';

@Injectable()
export class ClienteDrizzleRepository implements IClienteRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: any) {}

  async findById(id: number, ownerId: string): Promise<Cliente | null> {
    const row = await this.db.query.clientes.findFirst({
      where: and(eq(clientes.id, id), eq(clientes.ownerId, ownerId)),
      with: { destinatarios: true, orcamentos: true },
    });
    return row ?? null;
  }

  async findByEmail(email: string, ownerId: string): Promise<Cliente | null> {
    const row = await this.db.query.clientes.findFirst({
      where: and(eq(clientes.email, email), eq(clientes.ownerId, ownerId)),
    });
    return row ?? null;
  }

  async findAll(filters: ClienteFilters): Promise<PaginatedResponse<Cliente>> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 10, 100);
    const offset = (page - 1) * limit;

    const ownerClause = eq(clientes.ownerId, filters.ownerId);
    const searchClause = filters.q
      ? ilike(clientes.nome, `%${filters.q}%`)
      : undefined;
    const whereClause = searchClause
      ? and(ownerClause, searchClause)
      : ownerClause;

    const [rows, [totalRow]] = await Promise.all([
      this.db.query.clientes.findMany({
        where: whereClause,
        with: { destinatarios: true, orcamentos: true },
        limit,
        offset,
        orderBy: (c: any, { desc }: any) => [desc(c.createdAt)],
      }),
      this.db.select({ value: count() }).from(clientes).where(whereClause),
    ]);

    const total = Number(totalRow?.value ?? 0);
    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: CreateClienteData): Promise<Cliente> {
    try {
      const [row] = await this.db
        .insert(clientes)
        .values({
          ownerId: data.ownerId,
          nome: data.nome,
          cnpj: data.cnpj.replace(/[^\d]/g, ''),
          email: data.email,
          telefone: data.telefone,
        })
        .returning();
      return row;
    } catch (err: any) {
      this.handleUniqueViolation(err, data);
      throw err;
    }
  }

  async update(
    id: number,
    ownerId: string,
    data: UpdateClienteData,
  ): Promise<Cliente> {
    try {
      const updateData: Record<string, any> = {};
      if (data.nome !== undefined) updateData.nome = data.nome;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.telefone !== undefined) updateData.telefone = data.telefone;
      if (data.cnpj !== undefined)
        updateData.cnpj = data.cnpj.replace(/[^\d]/g, '');
      updateData.updatedAt = new Date();

      const [row] = await this.db
        .update(clientes)
        .set(updateData)
        .where(and(eq(clientes.id, id), eq(clientes.ownerId, ownerId)))
        .returning();
      return row;
    } catch (err: any) {
      this.handleUniqueViolation(err, data);
      throw err;
    }
  }

  async delete(id: number, ownerId: string): Promise<void> {
    await this.db
      .delete(clientes)
      .where(and(eq(clientes.id, id), eq(clientes.ownerId, ownerId)));
  }

  async countOrcamentos(clienteId: number, ownerId: string): Promise<number> {
    const [row] = await this.db
      .select({ value: count() })
      .from(orcamentos)
      .innerJoin(clientes, eq(orcamentos.clienteId, clientes.id))
      .where(
        and(eq(orcamentos.clienteId, clienteId), eq(clientes.ownerId, ownerId)),
      );
    return Number(row?.value ?? 0);
  }

  private handleUniqueViolation(err: any, data: any): void {
    if (err.code === '23505') {
      if (err.constraint?.includes('email'))
        throw new EmailAlreadyExistsException(data.email ?? '');
      if (err.constraint?.includes('cnpj'))
        throw new CnpjAlreadyExistsException(data.cnpj ?? '');
    }
  }
}
