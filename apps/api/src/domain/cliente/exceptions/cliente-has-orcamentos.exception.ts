import { DomainException } from '../../shared/exceptions/domain.exception';

export class ClienteHasOrcamentosException extends DomainException {
  constructor(clienteId: number) {
    super(
      `Não é possível deletar o cliente ${clienteId} pois possui orçamentos associados. ` +
      `Delete os orçamentos primeiro.`,
    );
  }
}
