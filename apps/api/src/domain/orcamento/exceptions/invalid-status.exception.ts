import { DomainException } from '../../shared/exceptions/domain.exception';

export class InvalidStatusException extends DomainException {
  constructor(status: string) {
    super(
      `Status inválido: "${status}". ` +
      `Valores permitidos: Pendente, Aprovado, Rejeitado, Cancelado, Em Andamento, Concluído`,
    );
  }
}
