import { Inject, Injectable } from '@nestjs/common';
import { IDestinatarioRepository, DESTINATARIO_REPOSITORY } from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import { DestinatarioNotFoundException } from '../../../../domain/destinatario/exceptions/destinatario-not-found.exception';
import { DestinatarioHasOrcamentosException } from '../../../../domain/destinatario/exceptions/destinatario-has-orcamentos.exception';

@Injectable()
export class DeleteDestinatarioUseCase {
  constructor(
    @Inject(DESTINATARIO_REPOSITORY) private readonly destRepo: IDestinatarioRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.destRepo.findById(id);
    if (!existing) throw new DestinatarioNotFoundException(id);

    // RN-11: não deletar destinatário com orçamentos associados
    const orcamentoCount = await this.destRepo.countOrcamentos(id);
    if (orcamentoCount > 0) throw new DestinatarioHasOrcamentosException(id);

    await this.destRepo.delete(id);
  }
}
