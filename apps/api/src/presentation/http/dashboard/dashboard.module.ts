import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { GetDashboardStatsUseCase } from '../../../application/dashboard/queries/get-dashboard-stats.use-case';
import { OrcamentoDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/orcamento.drizzle.repository';
import { ClienteDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/cliente.drizzle.repository';
import { DestinatarioDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/destinatario.drizzle.repository';
import { ORCAMENTO_REPOSITORY } from '../../../domain/orcamento/repositories/orcamento.repository.interface';
import { CLIENTE_REPOSITORY } from '../../../domain/cliente/repositories/cliente.repository.interface';
import { DESTINATARIO_REPOSITORY } from '../../../domain/destinatario/repositories/destinatario.repository.interface';

@Module({
  controllers: [DashboardController],
  providers: [
    GetDashboardStatsUseCase,
    { provide: ORCAMENTO_REPOSITORY,    useClass: OrcamentoDrizzleRepository },
    { provide: CLIENTE_REPOSITORY,      useClass: ClienteDrizzleRepository },
    { provide: DESTINATARIO_REPOSITORY, useClass: DestinatarioDrizzleRepository },
  ],
})
export class DashboardModule {}
