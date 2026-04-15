import { DomainException } from '../../shared/exceptions/domain.exception';

export class ClienteNotFoundException extends DomainException {
  constructor(id: number) {
    super(`Cliente com ID ${id} não foi encontrado`);
  }
}
