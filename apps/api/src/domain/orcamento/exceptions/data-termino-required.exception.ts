import { DomainException } from '../../shared/exceptions/domain.exception';

export class DataTerminoRequiredException extends DomainException {
  constructor() {
    super('A data de término é obrigatória quando o status for "Concluído"');
  }
}
