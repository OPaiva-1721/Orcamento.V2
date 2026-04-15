import { DomainException } from '../../shared/exceptions/domain.exception';

export class DestinatarioNotFoundException extends DomainException {
  constructor(id: number) {
    super(`Destinatário com ID ${id} não foi encontrado`);
  }
}
