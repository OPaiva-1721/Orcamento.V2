import { Inject, Injectable } from '@nestjs/common';
import { eq, count, inArray, and, sql } from 'drizzle-orm';
import { orcamentos, orcamentosDestinatarios, statusHistory } from '@orcamento/db';
import { Orcamento, OrcamentoFilters, PaginatedResponse } from '@orcamento/shared-types';
import {
  IOrcamentoRepository,
  CreateOrcamentoWithHistory,
  UpdateOrcamentoWithHistory,
} from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';

@Injectable()
export class OrcamentoDrizzleRepository implements IOrcamentoRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: any) {}

  async findById(id: number): Promise<Orcamento | null> {
    const row = await this.db.query.orcamentos.findFirst({
      where: eq(orcamentos.id, id),
      with: {
        cliente: true,
        destinatarios: { with: { destinatario: true } },
        emailsEnviados: { with: { destinatario: true } },
        statusHistory:  true,
      },
    });
    if (!row) return null;
    return this.mapRow(row);
  }

  async findAll(filters: OrcamentoFilters): Promise<PaginatedResponse<Orcamento>> {
    const page   = filters.page  ?? 1;
    const limit  = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (filters.clienteId) conditions.push(eq(orcamentos.clienteId, filters.clienteId));
    if (filters.status)    conditions.push(eq(orcamentos.status, filters.status));
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [rows, [totalRow]] = await Promise.all([
      this.db.query.orcamentos.findMany({
        where: whereClause,
        with: {
          cliente: true,
          destinatarios: { with: { destinatario: true } },
          emailsEnviados: { with: { destinatario: true } },
          statusHistory: true,
        },
        limit,
        offset,
        orderBy: (o: any, { desc }: any) => [desc(o.createdAt)],
      }),
      this.db.select({ value: count() }).from(orcamentos).where(whereClause ?? sql`1=1`),
    ]);

    const total = Number(totalRow?.value ?? 0);
    return {
      data: rows.map((r: any) => this.mapRow(r)),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: CreateOrcamentoWithHistory): Promise<Orcamento> {
    return this.db.transaction(async (tx: any) => {
      const [row] = await tx
        .insert(orcamentos)
        .values({
          descricao:      data.descricao,
          preco:          data.preco,
          status:         data.status ?? 'Pendente',
          formaPagamento: data.formaPagamento,
          dataInicio:     new Date(data.dataInicio),
          dataTermino:    data.dataTermino ? new Date(data.dataTermino) : null,
          clienteId:      data.clienteId,
        })
        .returning();

      // Associar destinatários
      if (data.destinatarioIds?.length) {
        await tx.insert(orcamentosDestinatarios).values(
          data.destinatarioIds.map((did) => ({ orcamentoId: row.id, destinatarioId: did })),
        );
      }

      // Inserir histórico de status inicial
      if (data.initialHistoryEntries?.length) {
        await tx.insert(statusHistory).values(
          data.initialHistoryEntries.map((e) => ({
            orcamentoId: row.id,
            status:      e.status,
            observacao:  e.observacao,
          })),
        );
      }

      return this.findById(row.id) as Promise<Orcamento>;
    });
  }

  async update(id: number, data: UpdateOrcamentoWithHistory): Promise<Orcamento> {
    return this.db.transaction(async (tx: any) => {
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (data.descricao      !== undefined) updateData.descricao      = data.descricao;
      if (data.preco          !== undefined) updateData.preco          = data.preco;
      if (data.status         !== undefined) updateData.status         = data.status;
      if (data.formaPagamento !== undefined) updateData.formaPagamento = data.formaPagamento;
      if (data.dataInicio     !== undefined) updateData.dataInicio     = new Date(data.dataInicio);
      if (data.dataTermino    !== undefined) updateData.dataTermino    = data.dataTermino ? new Date(data.dataTermino) : null;
      if (data.clienteId      !== undefined) updateData.clienteId      = data.clienteId;

      await tx.update(orcamentos).set(updateData).where(eq(orcamentos.id, id));

      // Atualizar destinatários (substitui todos)
      if (data.destinatarioIds !== undefined) {
        await tx.delete(orcamentosDestinatarios).where(eq(orcamentosDestinatarios.orcamentoId, id));
        if (data.destinatarioIds.length) {
          await tx.insert(orcamentosDestinatarios).values(
            data.destinatarioIds.map((did) => ({ orcamentoId: id, destinatarioId: did })),
          );
        }
      }

      // Inserir novos entries de histórico
      if (data.newHistoryEntries?.length) {
        await tx.insert(statusHistory).values(
          data.newHistoryEntries.map((e) => ({
            orcamentoId: id,
            status:      e.status,
            observacao:  e.observacao,
          })),
        );
      }

      return this.findById(id) as Promise<Orcamento>;
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(orcamentos).where(eq(orcamentos.id, id));
  }

  async setDestinatarios(orcamentoId: number, destinatarioIds: number[]): Promise<void> {
    await this.db.transaction(async (tx: any) => {
      await tx.delete(orcamentosDestinatarios).where(eq(orcamentosDestinatarios.orcamentoId, orcamentoId));
      if (destinatarioIds.length) {
        await tx.insert(orcamentosDestinatarios).values(
          destinatarioIds.map((did) => ({ orcamentoId, destinatarioId: did })),
        );
      }
    });
  }

  async countByClienteId(clienteId: number): Promise<number> {
    const [row] = await this.db
      .select({ value: count() })
      .from(orcamentos)
      .where(eq(orcamentos.clienteId, clienteId));
    return Number(row?.value ?? 0);
  }

  /** Flatten M:N junction rows into plain Destinatario array */
  private mapRow(row: any): Orcamento {
    return {
      ...row,
      destinatarios: row.destinatarios?.map((jn: any) => jn.destinatario) ?? [],
      emailsEnviados: row.emailsEnviados ?? [],
      statusHistory: row.statusHistory ?? [],
    };
  }
}
