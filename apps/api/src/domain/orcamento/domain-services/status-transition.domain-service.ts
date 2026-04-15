import { Injectable } from '@nestjs/common';
import { OrcamentoStatusVO } from '../value-objects/orcamento-status.value-object';

export interface NewStatusHistoryEntry {
  status: string;
  observacao: string;
}

export interface StatusTransitionResult {
  /** Status que será efetivamente persistido no banco */
  persistedStatus: OrcamentoStatusVO;
  /** Entradas a inserir no StatusHistory */
  historyEntries: NewStatusHistoryEntry[];
}

/**
 * Serviço de domínio que encapsula a regra de transição de status.
 *
 * Regra de negócio RN-01:
 *   Quando o status solicitado for "Concluído", o sistema persiste "Aprovado"
 *   e registra DUAS entradas no StatusHistory:
 *     1. "Concluído" — intenção original do usuário
 *     2. "Aprovado"  — status automaticamente aplicado pelo sistema
 */
@Injectable()
export class StatusTransitionDomainService {
  computeTransition(
    requested: OrcamentoStatusVO,
    context: 'criacao' | 'atualizacao' = 'atualizacao',
  ): StatusTransitionResult {
    const baseObservacao =
      context === 'criacao' ? 'Orçamento criado' : 'Status atualizado';

    if (requested.isConcluido()) {
      return {
        persistedStatus: OrcamentoStatusVO.create('Aprovado'),
        historyEntries: [
          { status: 'Concluído', observacao: baseObservacao },
          {
            status: 'Aprovado',
            observacao: 'Status automaticamente aprovado por estar concluído',
          },
        ],
      };
    }

    return {
      persistedStatus: requested,
      historyEntries: [{ status: requested.value, observacao: baseObservacao }],
    };
  }
}
