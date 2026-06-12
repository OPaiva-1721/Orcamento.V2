import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '@orcamento/shared-types';
import {
  IClienteRepository,
  CLIENTE_REPOSITORY,
} from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { CnpjVO } from '../../../../domain/cliente/value-objects/cnpj.value-object';
import { CreateClienteDto } from './create-cliente.dto';

@Injectable()
export class CreateClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(dto: CreateClienteDto, ownerId: string): Promise<Cliente> {
    const cnpjVO = CnpjVO.create(dto.cnpj);

    return this.clienteRepo.create({
      ownerId,
      nome: dto.nome,
      cnpj: cnpjVO.value,
      email: dto.email.toLowerCase().trim(),
      telefone: dto.telefone,
    });
  }
}
