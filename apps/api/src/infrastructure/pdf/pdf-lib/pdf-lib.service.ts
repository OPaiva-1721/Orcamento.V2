import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import {
  gerarPDFOrcamento,
  gerarPDFEditavel,
  gerarHTMLEmail,
  OrcamentoParaPDF,
  CompanyInfo,
  DEFAULT_COMPANY,
} from '@orcamento/pdf';

@Injectable()
export class PdfLibService {
  private readonly logoPath: string;
  private readonly empresa: CompanyInfo;

  constructor(private readonly config: ConfigService) {
    // Identidade da empresa via configuração (fallback para o padrão atual)
    this.empresa = {
      nome: config.get<string>('COMPANY_NAME') ?? DEFAULT_COMPANY.nome,
      razaoSocial:
        config.get<string>('COMPANY_LEGAL_NAME') ?? DEFAULT_COMPANY.razaoSocial,
      cnpj: config.get<string>('COMPANY_CNPJ') ?? DEFAULT_COMPANY.cnpj,
      ie: config.get<string>('COMPANY_IE') ?? DEFAULT_COMPANY.ie,
      telefone: config.get<string>('COMPANY_PHONE') ?? DEFAULT_COMPANY.telefone,
      contato: config.get<string>('COMPANY_CONTACT') ?? DEFAULT_COMPANY.contato,
      endereco:
        config.get<string>('COMPANY_ADDRESS') ?? DEFAULT_COMPANY.endereco,
      bairro: config.get<string>('COMPANY_DISTRICT') ?? DEFAULT_COMPANY.bairro,
      cidade: config.get<string>('COMPANY_CITY') ?? DEFAULT_COMPANY.cidade,
      rodapeRazao:
        config.get<string>('COMPANY_FOOTER') ?? DEFAULT_COMPANY.rodapeRazao,
    };
    this.logoPath =
      config.get<string>('COMPANY_LOGO_PATH') ??
      path.resolve(process.cwd(), 'public', 'logoaguia.png');
  }

  /** Nome de exibição da empresa (usado, p.ex., no assunto do e-mail). */
  get companyName(): string {
    return this.empresa.nome;
  }

  async gerarPDF(orcamento: OrcamentoParaPDF): Promise<Buffer> {
    return gerarPDFOrcamento(orcamento, this.logoPath, this.empresa);
  }

  async gerarPDFEditavel(orcamento: OrcamentoParaPDF): Promise<Buffer> {
    return gerarPDFEditavel(orcamento, this.logoPath, this.empresa);
  }

  gerarHTMLEmail(
    orcamento: OrcamentoParaPDF & {
      dataInicio: Date;
      dataTermino?: Date | null;
    },
    destinatario: { nome: string },
  ): string {
    return gerarHTMLEmail(orcamento, destinatario, this.empresa);
  }
}
