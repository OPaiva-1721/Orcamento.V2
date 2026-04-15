import {
  Body, Controller, Delete, Get, HttpCode,
  Param, ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { CreateOrcamentoUseCase } from '../../../application/orcamento/use-cases/create-orcamento/create-orcamento.use-case';
import { UpdateOrcamentoUseCase } from '../../../application/orcamento/use-cases/update-orcamento/update-orcamento.use-case';
import { DeleteOrcamentoUseCase } from '../../../application/orcamento/use-cases/delete-orcamento/delete-orcamento.use-case';
import { FindOrcamentoByIdUseCase } from '../../../application/orcamento/use-cases/find-orcamento/find-orcamento-by-id.use-case';
import { ListOrcamentosUseCase } from '../../../application/orcamento/use-cases/find-orcamento/list-orcamentos.use-case';
import { CreateOrcamentoDto } from '../../../application/orcamento/use-cases/create-orcamento/create-orcamento.dto';
import { UpdateOrcamentoDto } from '../../../application/orcamento/use-cases/update-orcamento/update-orcamento.dto';

@Controller('orcamentos')
export class OrcamentosController {
  constructor(
    private readonly createOrcamento:   CreateOrcamentoUseCase,
    private readonly updateOrcamento:   UpdateOrcamentoUseCase,
    private readonly deleteOrcamento:   DeleteOrcamentoUseCase,
    private readonly findOrcamentoById: FindOrcamentoByIdUseCase,
    private readonly listOrcamentos:    ListOrcamentosUseCase,
  ) {}

  @Get()
  list(
    @Query('clienteId') clienteId?: string,
    @Query('status')    status?: string,
    @Query('page')      page?: string,
    @Query('limit')     limit?: string,
  ) {
    return this.listOrcamentos.execute({
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      status:    status as any,
      page:      page      ? parseInt(page)      : undefined,
      limit:     limit     ? parseInt(limit)     : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateOrcamentoDto) {
    return this.createOrcamento.execute(body);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.findOrcamentoById.execute(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrcamentoDto,
  ) {
    return this.updateOrcamento.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteOrcamento.execute(id);
  }
}
