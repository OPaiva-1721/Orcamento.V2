import { DomainException } from '../../shared/exceptions/domain.exception';

export class InvalidCnpjException extends DomainException {
  constructor(cnpj: string) {
    super(`CNPJ inválido: ${cnpj}`);
  }
}
