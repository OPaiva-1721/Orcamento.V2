import { Inject, Injectable } from '@nestjs/common';
import { Orcamento } from '@orcamento/shared-types';
import { IOrcamentoRepository, ORCAMENTO_REPOSITORY } from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import { OrcamentoNotFoundException } from '../../../../domain/orcamento/exceptions/orcamento-not-found.exception';

@Injectable()
export class FindOrcamentoByIdUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY) private readonly orcamentoRepo: IOrcamentoRepository,
  ) {}

  async execute(id: number, ownerId: string): Promise<Orcamento> {
    const orcamento = await this.orcamentoRepo.findById(id, ownerId);
    if (!orcamento) throw new OrcamentoNotFoundException(id);
    return orcamento;
  }
}
