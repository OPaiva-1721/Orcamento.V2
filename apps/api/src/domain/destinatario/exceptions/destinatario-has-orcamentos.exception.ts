import { DomainException } from '../../shared/exceptions/domain.exception';

export class DestinatarioHasOrcamentosException extends DomainException {
  constructor(destinatarioId: number) {
    super(
      `Não é possível deletar o destinatário ${destinatarioId} pois possui orçamentos associados. ` +
        `Remova-o dos orçamentos primeiro.`,
    );
  }
}
