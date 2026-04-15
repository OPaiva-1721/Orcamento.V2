import { Global, Module } from '@nestjs/common';
import { PdfLibService } from './pdf-lib.service';

@Global()
@Module({
  providers: [PdfLibService],
  exports: [PdfLibService],
})
export class PdfLibModule {}
