import {
  OrcamentoStatus,
  ORCAMENTO_STATUS,
  ORCAMENTO_STATUS_VALUES,
} from '@orcamento/shared-types';
import { InvalidStatusException } from '../exceptions/invalid-status.exception';

const VALID_STATUSES: OrcamentoStatus[] = ORCAMENTO_STATUS_VALUES;

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
    return new OrcamentoStatusVO(ORCAMENTO_STATUS.PENDENTE);
  }

  isConcluido(): boolean {
    return this.value === ORCAMENTO_STATUS.CONCLUIDO;
  }

  isAprovado(): boolean {
    return this.value === ORCAMENTO_STATUS.APROVADO;
  }

  equals(other: OrcamentoStatusVO): boolean {
    return this.value === other.value;
  }
}
