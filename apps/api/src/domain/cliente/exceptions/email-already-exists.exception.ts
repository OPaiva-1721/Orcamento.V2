import { DomainException } from '../../shared/exceptions/domain.exception';

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`Já existe um cliente cadastrado com o e-mail ${email}`);
  }
}
