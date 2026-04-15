import { DomainException } from '../../shared/exceptions/domain.exception';

export class EmailAlreadyInUseException extends DomainException {
  constructor(email: string) {
    super(`Já existe um destinatário com o e-mail ${email} para este cliente`);
  }
}
