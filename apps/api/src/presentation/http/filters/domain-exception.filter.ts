import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../../domain/shared/exceptions/domain.exception';

const STATUS_MAP: Record<string, number> = {
  ClienteNotFoundException: 404,
  DestinatarioNotFoundException: 404,
  OrcamentoNotFoundException: 404,
  ResourceNotFoundException: 404,
  ForbiddenResourceException: 403,
  ClienteHasOrcamentosException: 409,
  DestinatarioHasOrcamentosException: 409,
  CnpjAlreadyExistsException: 409,
  EmailAlreadyExistsException: 409,
  EmailAlreadyInUseException: 409,
  InvalidCnpjException: 422,
  InvalidStatusException: 422,
  DataTerminoRequiredException: 422,
  DestinatarioNotBelongsToClienteException: 422,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = STATUS_MAP[exception.constructor.name] ?? 400;

    response.status(status).json({
      success: false,
      error: exception.message,
      code: exception.constructor.name,
    });
  }
}
