import { OrcamentoStatus } from '@orcamento/shared-types';
import { InvalidStatusException } from '../exceptions/invalid-status.exception';

const VALID_STATUSES: OrcamentoStatus[] = [
  'Pendente',
  'Aprovado',
  'Rejeitado',
  'Cancelado',
  'Em Andamento',
  'Concluído',
];

export class OrcamentoStatusVO {
  readonly value: OrcamentoStatus;

  private constructor(value: OrcamentoStatus) {
    this.value = value;
  }

  static create(raw: string): OrcamentoStatusVO {
    if (!VALID_STATUSES.includes(raw as OrcamentoStatus)) {
      throw new InvalidStatusException(raw);
    }
    return new OrcamentoStatusVO(raw as OrcamentoStatus);
  }

  static pendente(): OrcamentoStatusVO {
    return new OrcamentoStatusVO('Pendente');
  }

  isConcluido(): boolean {
    return this.value === 'Concluído';
  }

  isAprovado(): boolean {
    return this.value === 'Aprovado';
  }

  equals(other: OrcamentoStatusVO): boolean {
    return this.value === other.value;
  }
}
