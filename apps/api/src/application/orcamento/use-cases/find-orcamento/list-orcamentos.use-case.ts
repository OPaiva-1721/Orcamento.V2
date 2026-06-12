import { Inject, Injectable } from '@nestjs/common';
import {
  OrcamentoFilters,
  PaginatedResponse,
  Orcamento,
} from '@orcamento/shared-types';
import {
  IOrcamentoRepository,
  ORCAMENTO_REPOSITORY,
} from '../../../../domain/orcamento/repositories/orcamento.repository.interface';

@Injectable()
export class ListOrcamentosUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY)
    private readonly orcamentoRepo: IOrcamentoRepository,
  ) {}

  async execute(
    filters: OrcamentoFilters,
  ): Promise<PaginatedResponse<Orcamento>> {
    return this.orcamentoRepo.findAll(filters);
  }
}
