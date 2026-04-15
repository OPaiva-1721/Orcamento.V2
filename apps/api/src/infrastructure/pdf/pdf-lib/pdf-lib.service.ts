import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { gerarPDFOrcamento, gerarPDFEditavel, gerarHTMLEmail, OrcamentoParaPDF } from '@orcamento/pdf';

@Injectable()
export class PdfLibService {
  private readonly logoPath: string;

  constructor(private readonly config: ConfigService) {
    this.logoPath = path.resolve(process.cwd(), 'public', 'logoaguia.png');
  }

  async gerarPDF(orcamento: OrcamentoParaPDF): Promise<Buffer> {
    return gerarPDFOrcamento(orcamento, this.logoPath);
  }

  async gerarPDFEditavel(orcamento: OrcamentoParaPDF): Promise<Buffer> {
    return gerarPDFEditavel(orcamento, this.logoPath);
  }

  gerarHTMLEmail(
    orcamento: OrcamentoParaPDF & { dataInicio: Date; dataTermino?: Date | null },
    destinatario: { nome: string },
  ): string {
    return gerarHTMLEmail(orcamento, destinatario);
  }
}
