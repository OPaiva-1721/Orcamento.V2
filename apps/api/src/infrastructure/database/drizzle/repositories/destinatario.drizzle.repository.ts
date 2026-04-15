import { Inject, Injectable } from '@nestjs/common';
import { eq, count, inArray, and, sql } from 'drizzle-orm';
import { destinatarios, orcamentosDestinatarios } from '@orcamento/db';
import { Destinatario, CreateDestinatarioData, UpdateDestinatarioData, DestinatarioFilters, PaginatedResponse } from '@orcamento/shared-types';
import { IDestinatarioRepository } from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';
import { EmailAlreadyInUseException } from '../../../../domain/destinatario/exceptions/email-already-in-use.exception';

@Injectable()
export class DestinatarioDrizzleRepository implements IDestinatarioRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: any) {}

  async findById(id: number): Promise<Destinatario | null> {
    const row = await this.db.query.destinatarios.findFirst({
      where: eq(destinatarios.id, id),
      with: { cliente: true },
    });
    return row ?? null;
  }

  async findByEmailAndCliente(email: string, clienteId: number): Promise<Destinatario | null> {
    const row = await this.db.query.destinatarios.findFirst({
      where: and(
        eq(destinatarios.email, email),
        eq(destinatarios.clienteId, clienteId),
      ),
    });
    return row ?? null;
  }

  async findAll(filters: DestinatarioFilters): Promise<PaginatedResponse<Destinatario>> {
    const page  = filters.page  ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    const whereClause = filters.clienteId
      ? eq(destinatarios.clienteId, filters.clienteId)
      : undefined;

    const [rows, [totalRow]] = await Promise.all([
      this.db.query.destinatarios.findMany({
        where: whereClause,
        with: { cliente: true },
        limit,
        offset,
        orderBy: (d: any, { desc }: any) => [desc(d.createdAt)],
      }),
      this.db.select({ value: count() }).from(destinatarios).where(whereClause ?? sql`1=1`),
    ]);

    const total = Number(totalRow?.value ?? 0);
    return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByIds(ids: number[]): Promise<Destinatario[]> {
    if (ids.length === 0) return [];
    return this.db.query.destinatarios.findMany({
      where: inArray(destinatarios.id, ids),
    });
  }

  async create(data: CreateDestinatarioData): Promise<Destinatario> {
    try {
      const [row] = await this.db
        .insert(destinatarios)
        .values({ nome: data.nome, email: data.email, clienteId: data.clienteId })
        .returning();
      return row;
    } catch (err: any) {
      if (err.code === '23505') throw new EmailAlreadyInUseException(data.email);
      throw err;
    }
  }

  async update(id: number, data: UpdateDestinatarioData): Promise<Destinatario> {
    try {
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (data.nome      !== undefined) updateData.nome      = data.nome;
      if (data.email     !== undefined) updateData.email     = data.email;
      if (data.clienteId !== undefined) updateData.clienteId = data.clienteId;

      const [row] = await this.db
        .update(destinatarios)
        .set(updateData)
        .where(eq(destinatarios.id, id))
        .returning();
      return row;
    } catch (err: any) {
      if (err.code === '23505') throw new EmailAlreadyInUseException(data.email ?? '');
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(destinatarios).where(eq(destinatarios.id, id));
  }

  async countOrcamentos(destinatarioId: number): Promise<number> {
    const [row] = await this.db
      .select({ value: count() })
      .from(orcamentosDestinatarios)
      .where(eq(orcamentosDestinatarios.destinatarioId, destinatarioId));
    return Number(row?.value ?? 0);
  }
}
