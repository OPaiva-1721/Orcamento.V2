import { Inject, Injectable } from '@nestjs/common';
import { statusHistory, type Database } from '@orcamento/db';
import { IStatusHistoryRepository } from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';

@Injectable()
export class StatusHistoryDrizzleRepository implements IStatusHistoryRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: Database) {}

  async create(entry: {
    orcamentoId: number;
    status: string;
    observacao?: string;
  }): Promise<void> {
    await this.db.insert(statusHistory).values({
      orcamentoId: entry.orcamentoId,
      status: entry.status,
      observacao: entry.observacao,
    });
  }
}
