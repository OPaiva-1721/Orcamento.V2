import { Module } from '@nestjs/common';
import { DestinatariosController } from './destinatarios.controller';
import { CreateDestinatarioUseCase } from '../../../application/destinatario/use-cases/create-destinatario/create-destinatario.use-case';
import { DeleteDestinatarioUseCase } from '../../../application/destinatario/use-cases/delete-destinatario/delete-destinatario.use-case';
import { DestinatarioDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/destinatario.drizzle.repository';
import { ClienteDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/cliente.drizzle.repository';
import { DESTINATARIO_REPOSITORY } from '../../../domain/destinatario/repositories/destinatario.repository.interface';
import { CLIENTE_REPOSITORY } from '../../../domain/cliente/repositories/cliente.repository.interface';

@Module({
  controllers: [DestinatariosController],
  providers: [
    CreateDestinatarioUseCase,
    DeleteDestinatarioUseCase,
    {
      provide: DESTINATARIO_REPOSITORY,
      useClass: DestinatarioDrizzleRepository,
    },
    { provide: CLIENTE_REPOSITORY, useClass: ClienteDrizzleRepository },
  ],
  exports: [DESTINATARIO_REPOSITORY],
})
export class DestinatariosModule {}
