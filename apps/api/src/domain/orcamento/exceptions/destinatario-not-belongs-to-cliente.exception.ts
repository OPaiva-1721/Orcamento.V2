import { DomainException } from '../../shared/exceptions/domain.exception';

export class DestinatarioNotBelongsToClienteException extends DomainException {
  constructor(destinatarioId: number, clienteId: number) {
    super(
      `O destinatário ${destinatarioId} não pertence ao cliente ${clienteId}`,
    );
  }
}
