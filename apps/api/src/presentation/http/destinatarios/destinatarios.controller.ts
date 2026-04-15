import {
  Body, Controller, Delete, Get, HttpCode,
  Param, ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { CreateDestinatarioUseCase } from '../../../application/destinatario/use-cases/create-destinatario/create-destinatario.use-case';
import { DeleteDestinatarioUseCase } from '../../../application/destinatario/use-cases/delete-destinatario/delete-destinatario.use-case';
import { CreateDestinatarioDto } from '../../../application/destinatario/use-cases/create-destinatario/create-destinatario.dto';
import { IDestinatarioRepository, DESTINATARIO_REPOSITORY } from '../../../domain/destinatario/repositories/destinatario.repository.interface';
import { Inject } from '@nestjs/common';

@Controller('destinatarios')
export class DestinatariosController {
  constructor(
    private readonly createDestinatario: CreateDestinatarioUseCase,
    private readonly deleteDestinatario: DeleteDestinatarioUseCase,
    @Inject(DESTINATARIO_REPOSITORY) private readonly destRepo: IDestinatarioRepository,
  ) {}

  @Get()
  list(
    @Query('clienteId') clienteId?: string,
    @Query('page')      page?: string,
    @Query('limit')     limit?: string,
  ) {
    return this.destRepo.findAll({
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      page:      page      ? parseInt(page)      : undefined,
      limit:     limit     ? parseInt(limit)     : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateDestinatarioDto) {
    return this.createDestinatario.execute(body);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.destRepo.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteDestinatario.execute(id);
  }
}
