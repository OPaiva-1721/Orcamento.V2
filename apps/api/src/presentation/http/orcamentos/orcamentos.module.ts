import { Module } from '@nestjs/common';
import { OrcamentosController } from './orcamentos.controller';
import { CreateOrcamentoUseCase } from '../../../application/orcamento/use-cases/create-orcamento/create-orcamento.use-case';
import { UpdateOrcamentoUseCase } from '../../../application/orcamento/use-cases/update-orcamento/update-orcamento.use-case';
import { DeleteOrcamentoUseCase } from '../../../application/orcamento/use-cases/delete-orcamento/delete-orcamento.use-case';
import { FindOrcamentoByIdUseCase } from '../../../application/orcamento/use-cases/find-orcamento/find-orcamento-by-id.use-case';
import { ListOrcamentosUseCase } from '../../../application/orcamento/use-cases/find-orcamento/list-orcamentos.use-case';
import { StatusTransitionDomainService } from '../../../domain/orcamento/domain-services/status-transition.domain-service';
import { OrcamentoDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/orcamento.drizzle.repository';
import { DestinatarioDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/destinatario.drizzle.repository';
import { ClienteDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/cliente.drizzle.repository';
import { ORCAMENTO_REPOSITORY } from '../../../domain/orcamento/repositories/orcamento.repository.interface';
import { DESTINATARIO_REPOSITORY } from '../../../domain/destinatario/repositories/destinatario.repository.interface';
import { CLIENTE_REPOSITORY } from '../../../domain/cliente/repositories/cliente.repository.interface';

@Module({
  controllers: [OrcamentosController],
  providers: [
    CreateOrcamentoUseCase,
    UpdateOrcamentoUseCase,
    DeleteOrcamentoUseCase,
    FindOrcamentoByIdUseCase,
    ListOrcamentosUseCase,
    StatusTransitionDomainService,
    { provide: ORCAMENTO_REPOSITORY, useClass: OrcamentoDrizzleRepository },
    {
      provide: DESTINATARIO_REPOSITORY,
      useClass: DestinatarioDrizzleRepository,
    },
    { provide: CLIENTE_REPOSITORY, useClass: ClienteDrizzleRepository },
  ],
})
export class OrcamentosModule {}
