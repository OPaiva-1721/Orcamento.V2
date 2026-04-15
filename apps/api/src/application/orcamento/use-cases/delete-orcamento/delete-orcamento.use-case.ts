import { Inject, Injectable } from '@nestjs/common';
import { IOrcamentoRepository, ORCAMENTO_REPOSITORY } from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import { OrcamentoNotFoundException } from '../../../../domain/orcamento/exceptions/orcamento-not-found.exception';

@Injectable()
export class DeleteOrcamentoUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY) private readonly orcamentoRepo: IOrcamentoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.orcamentoRepo.findById(id);
    if (!existing) throw new OrcamentoNotFoundException(id);
    await this.orcamentoRepo.delete(id);
  }
}
