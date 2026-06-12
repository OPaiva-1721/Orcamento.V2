import { DomainException } from './domain.exception';

/**
 * Lançada quando o usuário referencia um recurso que existe mas não lhe
 * pertence (ex.: anexar destinatário de outro owner). Mapeada para HTTP 403.
 */
export class ForbiddenResourceException extends DomainException {
  constructor(message = 'Recurso não pertence ao usuário') {
    super(message);
  }
}
