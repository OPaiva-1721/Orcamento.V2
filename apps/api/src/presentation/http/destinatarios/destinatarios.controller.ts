import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDestinatarioUseCase } from '../../../application/destinatario/use-cases/create-destinatario/create-destinatario.use-case';
import { DeleteDestinatarioUseCase } from '../../../application/destinatario/use-cases/delete-destinatario/delete-destinatario.use-case';
import { CreateDestinatarioDto } from '../../../application/destinatario/use-cases/create-destinatario/create-destinatario.dto';
import {
  IDestinatarioRepository,
  DESTINATARIO_REPOSITORY,
} from '../../../domain/destinatario/repositories/destinatario.repository.interface';
import { DestinatarioNotFoundException } from '../../../domain/destinatario/exceptions/destinatario-not-found.exception';
import { Inject } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DecodedFirebaseToken } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';

@Controller('destinatarios')
export class DestinatariosController {
  constructor(
    private readonly createDestinatario: CreateDestinatarioUseCase,
    private readonly deleteDestinatario: DeleteDestinatarioUseCase,
    @Inject(DESTINATARIO_REPOSITORY)
    private readonly destRepo: IDestinatarioRepository,
  ) {}

  @Get()
  list(
    @CurrentUser() user: DecodedFirebaseToken,
    @Query('clienteId') clienteId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.destRepo.findAll({
      ownerId: user.uid,
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post()
  @HttpCode(201)
  create(
    @Body() body: CreateDestinatarioDto,
    @CurrentUser() user: DecodedFirebaseToken,
  ) {
    return this.createDestinatario.execute(body, user.uid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: DecodedFirebaseToken,
  ) {
    const dest = await this.destRepo.findById(id, user.uid);
    if (!dest) throw new DestinatarioNotFoundException(id);
    return dest;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: DecodedFirebaseToken,
  ) {
    return this.deleteDestinatario.execute(id, user.uid);
  }
}
