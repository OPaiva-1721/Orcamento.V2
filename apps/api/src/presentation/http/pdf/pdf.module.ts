import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { OrcamentoDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/orcamento.drizzle.repository';
import { ORCAMENTO_REPOSITORY } from '../../../domain/orcamento/repositories/orcamento.repository.interface';

@Module({
  controllers: [PdfController],
  providers: [
    { provide: ORCAMENTO_REPOSITORY, useClass: OrcamentoDrizzleRepository },
  ],
})
export class PdfModule {}
