import { EmailEnviado } from '@orcamento/shared-types';

export interface UpsertEmailEnviadoData {
  orcamentoId: number;
  destinatarioId: number;
  status: 'Enviado' | 'Falhou' | 'Pendente';
}

export interface IEmailEnviadoRepository {
  upsert(data: UpsertEmailEnviadoData): Promise<EmailEnviado>;
  findByOrcamento(orcamentoId: number): Promise<EmailEnviado[]>;
}

export const EMAIL_ENVIADO_REPOSITORY = 'EMAIL_ENVIADO_REPOSITORY';
