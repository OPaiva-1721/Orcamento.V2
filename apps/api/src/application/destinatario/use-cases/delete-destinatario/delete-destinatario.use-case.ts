import { Inject, Injectable } from '@nestjs/common';
import {
  IDestinatarioRepository,
  DESTINATARIO_REPOSITORY,
} from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import { DestinatarioNotFoundException } from '../../../../domain/destinatario/exceptions/destinatario-not-found.exception';
import { DestinatarioHasOrcamentosException } from '../../../../domain/destinatario/exceptions/destinatario-has-orcamentos.exception';

@Injectable()
export class DeleteDestinatarioUseCase {
  constructor(
    @Inject(DESTINATARIO_REPOSITORY)
    private readonly destRepo: IDestinatarioRepository,
  ) {}

  async execute(id: number, ownerId: string): Promise<void> {
    const existing = await this.destRepo.findById(id, ownerId);
    if (!existing) throw new DestinatarioNotFoundException(id);

    const orcamentoCount = await this.destRepo.countOrcamentos(id, ownerId);
    if (orcamentoCount > 0) throw new DestinatarioHasOrcamentosException(id);

    await this.destRepo.delete(id, ownerId);
  }
}
