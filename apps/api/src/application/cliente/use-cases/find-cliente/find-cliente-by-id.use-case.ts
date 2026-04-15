import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '@orcamento/shared-types';
import { IClienteRepository, CLIENTE_REPOSITORY } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { ClienteNotFoundException } from '../../../../domain/cliente/exceptions/cliente-not-found.exception';

@Injectable()
export class FindClienteByIdUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY) private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepo.findById(id);
    if (!cliente) throw new ClienteNotFoundException(id);
    return cliente;
  }
}
