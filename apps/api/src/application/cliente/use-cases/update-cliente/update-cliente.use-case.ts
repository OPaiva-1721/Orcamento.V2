import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '@orcamento/shared-types';
import { IClienteRepository, CLIENTE_REPOSITORY } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { ClienteNotFoundException } from '../../../../domain/cliente/exceptions/cliente-not-found.exception';
import { CnpjVO } from '../../../../domain/cliente/value-objects/cnpj.value-object';
import { UpdateClienteDto } from './update-cliente.dto';

@Injectable()
export class UpdateClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY) private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(id: number, dto: UpdateClienteDto, ownerId: string): Promise<Cliente> {
    const existing = await this.clienteRepo.findById(id, ownerId);
    if (!existing) throw new ClienteNotFoundException(id);

    const updateData: any = {};
    if (dto.nome     !== undefined) updateData.nome     = dto.nome;
    if (dto.telefone !== undefined) updateData.telefone = dto.telefone;
    if (dto.email    !== undefined) updateData.email    = dto.email.toLowerCase().trim();
    if (dto.cnpj     !== undefined) updateData.cnpj     = CnpjVO.create(dto.cnpj).value;

    return this.clienteRepo.update(id, ownerId, updateData);
  }
}
