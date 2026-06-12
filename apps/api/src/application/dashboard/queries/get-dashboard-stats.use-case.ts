import { Inject, Injectable } from '@nestjs/common';
import { DashboardStats } from '@orcamento/shared-types';
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
      this.orcamentoRepo.findAll({ ownerId, status: 'Aprovado', limit: 100 }),
    ]);

    const valorTotalAprovado = aprovados.data.reduce(
      (sum, o) => sum + o.preco,
      0,
    );

    return {
      totalClientes: clientes.total,
      totalOrcamentos: orcamentos.total,
      totalOrcamentosAprovados: aprovados.total,
      totalDestinatarios: destinatarios.total,
      valorTotalAprovado,
      recentOrcamentos: orcamentos.data,
    };
  }
}
