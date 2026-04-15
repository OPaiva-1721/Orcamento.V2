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
    @Query('q')     q?: string,
    @Query('page')  page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listClientes.execute({
      q,
      page:  page  ? parseInt(page)  : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateClienteDto) {
    return this.createCliente.execute(body);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.findClienteById.execute(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClienteDto,
  ) {
    return this.updateCliente.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteCliente.execute(id);
  }
}
