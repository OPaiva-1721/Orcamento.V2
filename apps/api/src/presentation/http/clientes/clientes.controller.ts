import {
  Body, Controller, Delete, Get, HttpCode,
  Param, ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { CreateClienteUseCase } from '../../../application/cliente/use-cases/create-cliente/create-cliente.use-case';
import { UpdateClienteUseCase } from '../../../application/cliente/use-cases/update-cliente/update-cliente.use-case';
import { DeleteClienteUseCase } from '../../../application/cliente/use-cases/delete-cliente/delete-cliente.use-case';
import { FindClienteByIdUseCase } from '../../../application/cliente/use-cases/find-cliente/find-cliente-by-id.use-case';
import { ListClientesUseCase } from '../../../application/cliente/use-cases/find-cliente/list-clientes.use-case';
import { CreateClienteDto } from '../../../application/cliente/use-cases/create-cliente/create-cliente.dto';
import { UpdateClienteDto } from '../../../application/cliente/use-cases/update-cliente/update-cliente.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DecodedFirebaseToken } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';

@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly createCliente:    CreateClienteUseCase,
    private readonly updateCliente:    UpdateClienteUseCase,
    private readonly deleteCliente:    DeleteClienteUseCase,
    private readonly findClienteById:  FindClienteByIdUseCase,
    private readonly listClientes:     ListClientesUseCase,
  ) {}

  @Get()
  list(
    @CurrentUser() user: DecodedFirebaseToken,
    @Query('q')     q?: string,
    @Query('page')  page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listClientes.execute({
      ownerId: user.uid,
      q,
      page:  page  ? parseInt(page)  : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateClienteDto, @CurrentUser() user: DecodedFirebaseToken) {
    return this.createCliente.execute(body, user.uid);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: DecodedFirebaseToken) {
    return this.findClienteById.execute(id, user.uid);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClienteDto,
    @CurrentUser() user: DecodedFirebaseToken,
  ) {
    return this.updateCliente.execute(id, body, user.uid);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: DecodedFirebaseToken) {
    return this.deleteCliente.execute(id, user.uid);
  }
}
