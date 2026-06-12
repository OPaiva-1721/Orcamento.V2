import { Inject, Injectable } from '@nestjs/common';
import { DashboardStats, ORCAMENTO_STATUS } from '@orcamento/shared-types';
import {
  IOrcamentoRepository,
  ORCAMENTO_REPOSITORY,
} from '../../../domain/orcamento/repositories/orcamento.repository.interface';
import {
  IClienteRepository,
  CLIENTE_REPOSITORY,
} from '../../../domain/cliente/repositories/cliente.repository.interface';
import {
  IDestinatarioRepository,
  DESTINATARIO_REPOSITORY,
} from '../../../domain/destinatario/repositories/destinatario.repository.interface';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY)
    private readonly orcamentoRepo: IOrcamentoRepository,
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepo: IClienteRepository,
    @Inject(DESTINATARIO_REPOSITORY)
    private readonly destRepo: IDestinatarioRepository,
  ) {}

  async execute(ownerId: string): Promise<DashboardStats> {
    const [clientes, destinatarios, orcamentos, aprovados] = await Promise.all([
      this.clienteRepo.findAll({ ownerId, limit: 1 }),
      this.destRepo.findAll({ ownerId, limit: 1 }),
      this.orcamentoRepo.findAll({ ownerId, limit: 5 }),
      // COUNT + SUM agregados no banco — sem teto artificial de 100 registros
      this.orcamentoRepo.getStatusAggregate(ownerId, ORCAMENTO_STATUS.APROVADO),
    ]);

    return {
      totalClientes: clientes.total,
      totalOrcamentos: orcamentos.total,
      totalOrcamentosAprovados: aprovados.total,
      totalDestinatarios: destinatarios.total,
      valorTotalAprovado: aprovados.valorTotal,
      recentOrcamentos: orcamentos.data,
    };
  }
}
