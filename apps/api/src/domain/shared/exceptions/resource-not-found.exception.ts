import { DomainException } from './domain.exception';

/**
 * Lançada quando o recurso alvo da operação não é encontrado para o owner
 * atual. Não revela existência entre tenants. Mapeada para HTTP 404.
 */
export class ResourceNotFoundException extends DomainException {
  constructor(message = 'Recurso não encontrado') {
    super(message);
  }
}
