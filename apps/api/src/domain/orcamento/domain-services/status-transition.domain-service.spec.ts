import { ORCAMENTO_STATUS } from '@orcamento/shared-types';
import { StatusTransitionDomainService } from './status-transition.domain-service';
import { OrcamentoStatusVO } from '../value-objects/orcamento-status.value-object';

describe('StatusTransitionDomainService (RN-01)', () => {
  const service = new StatusTransitionDomainService();

  it('quando "Concluído", persiste "Aprovado" e registra 2 entradas no histórico', () => {
    const requested = OrcamentoStatusVO.create(ORCAMENTO_STATUS.CONCLUIDO);

    const result = service.computeTransition(requested, 'atualizacao');

    expect(result.persistedStatus.value).toBe(ORCAMENTO_STATUS.APROVADO);
    expect(result.historyEntries).toHaveLength(2);
    expect(result.historyEntries[0].status).toBe(ORCAMENTO_STATUS.CONCLUIDO);
    expect(result.historyEntries[1].status).toBe(ORCAMENTO_STATUS.APROVADO);
  });

  it('para status comum, persiste o próprio status com 1 entrada', () => {
    const requested = OrcamentoStatusVO.create(ORCAMENTO_STATUS.PENDENTE);

    const result = service.computeTransition(requested, 'atualizacao');

    expect(result.persistedStatus.value).toBe(ORCAMENTO_STATUS.PENDENTE);
    expect(result.historyEntries).toHaveLength(1);
    expect(result.historyEntries[0].status).toBe(ORCAMENTO_STATUS.PENDENTE);
  });

  it('usa observação de criação no contexto "criacao"', () => {
    const requested = OrcamentoStatusVO.create(ORCAMENTO_STATUS.PENDENTE);

    const result = service.computeTransition(requested, 'criacao');

    expect(result.historyEntries[0].observacao).toBe('Orçamento criado');
  });

  it('usa observação de atualização no contexto "atualizacao"', () => {
    const requested = OrcamentoStatusVO.create(ORCAMENTO_STATUS.REJEITADO);

    const result = service.computeTransition(requested, 'atualizacao');

    expect(result.historyEntries[0].observacao).toBe('Status atualizado');
  });
});
