import { Inject, Injectable } from '@nestjs/common';
import { Destinatario } from '@orcamento/shared-types';
import {
  IDestinatarioRepository,
  DESTINATARIO_REPOSITORY,
} from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import {
  IClienteRepository,
  CLIENTE_REPOSITORY,
} from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { ClienteNotFoundException } from '../../../../domain/cliente/exceptions/cliente-not-found.exception';
import { CreateDestinatarioDto } from './create-destinatario.dto';

@Injectable()
export class CreateDestinatarioUseCase {
  constructor(
    @Inject(DESTINATARIO_REPOSITORY)
    private readonly destRepo: IDestinatarioRepository,
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(
    dto: CreateDestinatarioDto,
    ownerId: string,
  ): Promise<Destinatario> {
    const cliente = await this.clienteRepo.findById(dto.clienteId, ownerId);
    if (!cliente) throw new ClienteNotFoundException(dto.clienteId);

    return this.destRepo.create(
      {
        nome: dto.nome,
        email: dto.email.toLowerCase().trim(),
        clienteId: dto.clienteId,
      },
      ownerId,
    );
  }
}
