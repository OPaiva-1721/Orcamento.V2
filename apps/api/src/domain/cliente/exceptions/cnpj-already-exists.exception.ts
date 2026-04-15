import { DomainException } from '../../shared/exceptions/domain.exception';

export class CnpjAlreadyExistsException extends DomainException {
  constructor(cnpj: string) {
    super(`Já existe um cliente cadastrado com o CNPJ ${cnpj}`);
  }
}
