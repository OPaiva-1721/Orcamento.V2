import { Inject, Injectable } from '@nestjs/common';
import { IClienteRepository, CLIENTE_REPOSITORY } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { ClienteNotFoundException } from '../../../../domain/cliente/exceptions/cliente-not-found.exception';
import { ClienteHasOrcamentosException } from '../../../../domain/cliente/exceptions/cliente-has-orcamentos.exception';

@Injectable()
export class DeleteClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY) private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.clienteRepo.findById(id);
    if (!existing) throw new ClienteNotFoundException(id);

    // RN-08: não deletar cliente com orçamentos associados
    const orcamentoCount = await this.clienteRepo.countOrcamentos(id);
    if (orcamentoCount > 0) throw new ClienteHasOrcamentosException(id);

    await this.clienteRepo.delete(id);
  }
}
