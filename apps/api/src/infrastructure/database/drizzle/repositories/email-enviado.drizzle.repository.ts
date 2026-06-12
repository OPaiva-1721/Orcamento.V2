import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { emailsEnviados } from '@orcamento/db';
import { EmailEnviado } from '@orcamento/shared-types';
import {
  IEmailEnviadoRepository,
  UpsertEmailEnviadoData,
} from '../../../../domain/email/repositories/email-enviado.repository.interface';
import { DRIZZLE_CONNECTION } from '../drizzle.constants';

@Injectable()
export class EmailEnviadoDrizzleRepository implements IEmailEnviadoRepository {
  constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: any) {}

  async upsert(data: UpsertEmailEnviadoData): Promise<EmailEnviado> {
    const [row] = await this.db
      .insert(emailsEnviados)
      .values({
        orcamentoId: data.orcamentoId,
        destinatarioId: data.destinatarioId,
        status: data.status,
        dataEnvio: new Date(),
      })
      .onConflictDoUpdate({
        target: [emailsEnviados.orcamentoId, emailsEnviados.destinatarioId],
        set: { status: data.status, dataEnvio: new Date() },
      })
      .returning();
    return row;
  }

  async findByOrcamento(orcamentoId: number): Promise<EmailEnviado[]> {
    return this.db.query.emailsEnviados.findMany({
      where: eq(emailsEnviados.orcamentoId, orcamentoId),
      with: { destinatario: true },
    });
  }
}
