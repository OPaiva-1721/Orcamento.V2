import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { CreateClienteUseCase } from '../../../application/cliente/use-cases/create-cliente/create-cliente.use-case';
import { UpdateClienteUseCase } from '../../../application/cliente/use-cases/update-cliente/update-cliente.use-case';
import { DeleteClienteUseCase } from '../../../application/cliente/use-cases/delete-cliente/delete-cliente.use-case';
import { FindClienteByIdUseCase } from '../../../application/cliente/use-cases/find-cliente/find-cliente-by-id.use-case';
import { ListClientesUseCase } from '../../../application/cliente/use-cases/find-cliente/list-clientes.use-case';
import { ClienteDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/cliente.drizzle.repository';
import { CLIENTE_REPOSITORY } from '../../../domain/cliente/repositories/cliente.repository.interface';

@Module({
  controllers: [ClientesController],
  providers: [
    CreateClienteUseCase,
    UpdateClienteUseCase,
    DeleteClienteUseCase,
    FindClienteByIdUseCase,
    ListClientesUseCase,
    { provide: CLIENTE_REPOSITORY, useClass: ClienteDrizzleRepository },
  ],
  exports: [CLIENTE_REPOSITORY],
})
export class ClientesModule {}
