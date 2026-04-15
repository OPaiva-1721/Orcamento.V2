import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Response } from 'express';
import { PdfLibService } from '../../../infrastructure/pdf/pdf-lib/pdf-lib.service';
import { IOrcamentoRepository, ORCAMENTO_REPOSITORY } from '../../../domain/orcamento/repositories/orcamento.repository.interface';
import { OrcamentoNotFoundException } from '../../../domain/orcamento/exceptions/orcamento-not-found.exception';
import { Inject } from '@nestjs/common';

class GerarPdfDto {
  @IsNotEmpty() @IsInt() @Min(1)
  orcamentoId: number;
}

@Controller()
export class PdfController {
  constructor(
    private readonly pdfService: PdfLibService,
    @Inject(ORCAMENTO_REPOSITORY) private readonly orcamentoRepo: IOrcamentoRepository,
  ) {}

  @Post('gerar-pdf')
  @HttpCode(200)
  async gerarPDF(@Body() body: GerarPdfDto, @Res() res: Response) {
    const orcamento = await this.orcamentoRepo.findById(body.orcamentoId);
    if (!orcamento) throw new OrcamentoNotFoundException(body.orcamentoId);

    const pdfBuffer = await this.pdfService.gerarPDF({
      id: orcamento.id,
      descricao: orcamento.descricao,
      preco: orcamento.preco,
      formaPagamento: orcamento.formaPagamento,
      cliente: { nome: orcamento.cliente!.nome },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="orcamento_aguia_${orcamento.id}.pdf"`);
    res.send(pdfBuffer);
  }

  @Post('gerar-pdf-editavel')
  @HttpCode(200)
  async gerarPDFEditavel(@Body() body: GerarPdfDto, @Res() res: Response) {
    const orcamento = await this.orcamentoRepo.findById(body.orcamentoId);
    if (!orcamento) throw new OrcamentoNotFoundException(body.orcamentoId);

    const pdfBuffer = await this.pdfService.gerarPDFEditavel({
      id: orcamento.id,
      descricao: orcamento.descricao,
      preco: orcamento.preco,
      formaPagamento: orcamento.formaPagamento,
      cliente: { nome: orcamento.cliente!.nome },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="orcamento_aguia_editavel_${orcamento.id}.pdf"`);
    res.send(pdfBuffer);
  }
}
