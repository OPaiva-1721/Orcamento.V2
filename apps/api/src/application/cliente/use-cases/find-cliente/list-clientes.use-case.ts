import { Inject, Injectable } from '@nestjs/common';
import {
  ClienteFilters,
  PaginatedResponse,
  Cliente,
} from '@orcamento/shared-types';
import {
  IClienteRepository,
  CLIENTE_REPOSITORY,
} from '../../../../domain/cliente/repositories/cliente.repository.interface';

@Injectable()
export class ListClientesUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(filters: ClienteFilters): Promise<PaginatedResponse<Cliente>> {
    return this.clienteRepo.findAll(filters);
  }
}
