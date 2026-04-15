import { DomainException } from '../../shared/exceptions/domain.exception';

export class OrcamentoNotFoundException extends DomainException {
  constructor(id: number) {
    super(`Orçamento com ID ${id} não foi encontrado`);
  }
}
