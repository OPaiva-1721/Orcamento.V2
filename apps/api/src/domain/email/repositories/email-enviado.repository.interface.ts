import { EmailEnviado, EmailStatus } from '@orcamento/shared-types';

export interface UpsertEmailEnviadoData {
  orcamentoId: number;
  destinatarioId: number;
  status: EmailStatus;
}

export interface IEmailEnviadoRepository {
  upsert(data: UpsertEmailEnviadoData): Promise<EmailEnviado>;
  findByOrcamento(orcamentoId: number): Promise<EmailEnviado[]>;
}

export const EMAIL_ENVIADO_REPOSITORY = 'EMAIL_ENVIADO_REPOSITORY';
