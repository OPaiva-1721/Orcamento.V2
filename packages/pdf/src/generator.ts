import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

export interface OrcamentoParaPDF {
  id: number;
  descricao: string;
  preco: number;
  formaPagamento: boolean;
  cliente: { nome: string };
}

/** Identidade da empresa emissora — configurável por tenant/ambiente. */
export interface CompanyInfo {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  ie?: string;
  telefone: string;
  contato?: string;
  endereco: string;
  bairro: string;
  cidade: string;
  rodapeRazao: string;
}

/**
 * Valores padrão (preservam a identidade atual). Em produção devem ser
 * sobrescritos via configuração — ver PdfLibService no apps/api.
 */
export const DEFAULT_COMPANY: CompanyInfo = {
  nome: 'ÁGUIA SOLUÇÕES',
  razaoSocial: 'ÁGUIA SOLUÇÕES INDUSTRIAIS LTDA.',
  cnpj: '53.956.317/0001-62',
  ie: '91054587-60',
  telefone: '(44) 9 9828-0425',
  contato: 'Robson Neves',
  endereco: 'RUA LUIZ DONIN, 3366',
  bairro: 'JARDIM PROGRESSO',
  cidade: 'PALOTINA-PR',
  rodapeRazao: 'Águia Soluções em Montagens e Manutenções Industriais Ltda.',
};

/** Converte top% CSS em coordenada Y do PDF (sistema invertido) */
function cssTopToPdfY(percentTop: number, pageHeight: number): number {
  return pageHeight - pageHeight * (percentTop / 100);
}

/**
 * Gera o PDF padrão de um orçamento.
 * @param orcamento - dados do orçamento
 * @param logoPath - caminho absoluto para o arquivo de logo (opcional)
 */
export async function gerarPDFOrcamento(
  orcamento: OrcamentoParaPDF,
  logoPath?: string,
  empresa: CompanyInfo = DEFAULT_COMPANY,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);

  // Fundo branco
  page.drawRectangle({ x: 0, y: 0, width, height, color: white });

  // Logo (opcional)
  const resolvedLogo = logoPath ?? path.resolve(process.cwd(), 'public', 'logoaguia.png');
  try {
    if (fs.existsSync(resolvedLogo)) {
      const logoBytes = fs.readFileSync(resolvedLogo);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, {
        x: width * 0.78,
        y: height - 12 - 160,
        width: width * 0.20,
        height: 160,
      });
    }
  } catch {
    // Logo não encontrado — continua sem ele
  }

  // Informações da empresa
  page.drawText(empresa.razaoSocial, {
    x: width * 0.0183, y: cssTopToPdfY(16.11, height), size: 28, font: boldFont, color: black,
  });
  page.drawText(`CNPJ: ${empresa.cnpj}`, {
    x: width * 0.0183, y: cssTopToPdfY(26.84, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`TELEFONE: ${empresa.telefone}`, {
    x: width * 0.0183, y: cssTopToPdfY(32.32, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`ENDEREÇO: ${empresa.endereco}`, {
    x: width * 0.0168, y: cssTopToPdfY(37.53, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`BAIRRO: ${empresa.bairro}`, {
    x: width * 0.0168, y: cssTopToPdfY(43.13, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`CIDADE: ${empresa.cidade}`, {
    x: width * 0.0183, y: cssTopToPdfY(48.6, height), size: 18, font: boldFont, color: black,
  });

  // Linha separadora
  page.drawLine({
    start: { x: width * 0.0168, y: cssTopToPdfY(55.47, height) },
    end: { x: width * 0.9961, y: cssTopToPdfY(55.47, height) },
    thickness: 2, color: black,
  });

  // Dados do orçamento
  page.drawText(`CLIENTE: ${orcamento.cliente.nome}`, {
    x: width * 0.0183, y: cssTopToPdfY(60.05, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`ORÇAMENTO: ${orcamento.id}`, {
    x: width * 0.0183, y: cssTopToPdfY(66.28, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`DESCRIÇÃO: ${orcamento.descricao}`, {
    x: width * 0.0168, y: cssTopToPdfY(77.35, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(
    `VALOR: R$ ${orcamento.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    { x: width * 0.0199, y: cssTopToPdfY(87.66, height), size: 18, font: boldFont, color: black },
  );

  const formaPagamento = orcamento.formaPagamento
    ? '7 DIAS APÓS VENCIMENTO DA NOTA'
    : 'À VISTA';
  page.drawText(`FORMA DE PAGAMENTO: ${formaPagamento}`, {
    x: width * 0.0183, y: cssTopToPdfY(93.38, height), size: 18, font: boldFont, color: black,
  });

  return Buffer.from(await pdfDoc.save());
}

/**
 * Gera PDF editável — mesmos dados, porém com campos em cinza claro
 * indicando que podem ser editados manualmente no leitor de PDF.
 */
export async function gerarPDFEditavel(
  orcamento: OrcamentoParaPDF,
  logoPath?: string,
  empresa: CompanyInfo = DEFAULT_COMPANY,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const lightGray = rgb(0.9, 0.9, 0.9);

  page.drawRectangle({ x: 0, y: 0, width, height, color: white });

  // Logo
  const resolvedLogo = logoPath ?? path.resolve(process.cwd(), 'public', 'logoaguia.png');
  try {
    if (fs.existsSync(resolvedLogo)) {
      const logoBytes = fs.readFileSync(resolvedLogo);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, {
        x: width * 0.78, y: height - 12 - 160, width: width * 0.20, height: 160,
      });
    }
  } catch { /* sem logo */ }

  // Cabeçalho empresa (não editável)
  page.drawText(empresa.razaoSocial, {
    x: width * 0.0183, y: cssTopToPdfY(16.11, height), size: 28, font: boldFont, color: black,
  });
  page.drawText(`CNPJ: ${empresa.cnpj}`, {
    x: width * 0.0183, y: cssTopToPdfY(26.84, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`TELEFONE: ${empresa.telefone}`, {
    x: width * 0.0183, y: cssTopToPdfY(32.32, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`ENDEREÇO: ${empresa.endereco}`, {
    x: width * 0.0168, y: cssTopToPdfY(37.53, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`BAIRRO: ${empresa.bairro}`, {
    x: width * 0.0168, y: cssTopToPdfY(43.13, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`CIDADE: ${empresa.cidade}`, {
    x: width * 0.0183, y: cssTopToPdfY(48.6, height), size: 18, font: boldFont, color: black,
  });

  page.drawLine({
    start: { x: width * 0.0168, y: cssTopToPdfY(55.47, height) },
    end: { x: width * 0.9961, y: cssTopToPdfY(55.47, height) },
    thickness: 2, color: black,
  });

  // Cliente e Orçamento (não editáveis)
  page.drawText(`CLIENTE: ${orcamento.cliente.nome}`, {
    x: width * 0.0183, y: cssTopToPdfY(60.05, height), size: 18, font: boldFont, color: black,
  });
  page.drawText(`ORÇAMENTO: ${orcamento.id}`, {
    x: width * 0.0183, y: cssTopToPdfY(66.28, height), size: 18, font: boldFont, color: black,
  });

  // Campos editáveis (fundo cinza claro)
  const fieldY77 = cssTopToPdfY(77.35, height);
  page.drawRectangle({ x: width * 0.0140, y: fieldY77 - 8, width: width * 0.97, height: 30, color: lightGray });
  page.drawText(`DESCRIÇÃO: ${orcamento.descricao}`, {
    x: width * 0.0168, y: fieldY77, size: 18, font: boldFont, color: black,
  });

  const fieldY87 = cssTopToPdfY(87.66, height);
  page.drawRectangle({ x: width * 0.0140, y: fieldY87 - 8, width: width * 0.97, height: 30, color: lightGray });
  page.drawText(
    `VALOR: R$ ${orcamento.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    { x: width * 0.0199, y: fieldY87, size: 18, font: boldFont, color: black },
  );

  const fieldY93 = cssTopToPdfY(93.38, height);
  const formaPagamento = orcamento.formaPagamento ? '7 DIAS APÓS VENCIMENTO DA NOTA' : 'À VISTA';
  page.drawRectangle({ x: width * 0.0140, y: fieldY93 - 8, width: width * 0.97, height: 30, color: lightGray });
  page.drawText(`FORMA DE PAGAMENTO: ${formaPagamento}`, {
    x: width * 0.0183, y: fieldY93, size: 18, font: boldFont, color: black,
  });

  // Instrução de rodapé
  page.drawText('INSTRUÇÕES: Campos destacados em cinza podem ser editados diretamente no PDF.', {
    x: width * 0.0183,
    y: cssTopToPdfY(98.5, height),
    size: 10,
    font: boldFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  return Buffer.from(await pdfDoc.save());
}

/** Template HTML para o e-mail com o orçamento em anexo */
export function gerarHTMLEmail(
  orcamento: OrcamentoParaPDF & { dataInicio: Date; dataTermino?: Date | null },
  destinatario: { nome: string },
  empresa: CompanyInfo = DEFAULT_COMPANY,
): string {
  const valorFormatado = orcamento.preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orçamento #${orcamento.id} - ${empresa.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 32px 24px; text-align: center; }
    .company-name { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px; }
    .orcamento-number { font-size: 14px; opacity: 0.85; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; margin-bottom: 20px; color: #111827; }
    .message { font-size: 15px; margin-bottom: 28px; color: #374151; line-height: 1.7; }
    .cta-section { margin: 28px 0; text-align: center; }
    .cta-text { font-size: 14px; color: #0369a1; margin-top: 12px; }
    .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .signature-text { font-size: 14px; color: #4b5563; margin-bottom: 6px; }
    .signature-name { font-weight: 600; color: #1f2937; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer-info { font-size: 12px; color: #6b7280; line-height: 1.5; margin-bottom: 4px; }
    @media only screen and (max-width: 600px) {
      .header, .content, .footer { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="company-name">${empresa.nome}</div>
      <div class="orcamento-number">Orçamento #${orcamento.id}</div>
    </div>
    <div class="content">
      <div class="greeting">Olá <strong>${destinatario.nome}</strong>,</div>
      <div class="message">
        Segue em anexo o orçamento solicitado para <strong>${orcamento.cliente.nome}</strong>.
        Todas as informações detalhadas estão no PDF abaixo.
      </div>
      <div class="cta-section">
        <p class="cta-text">Para mais informações ou esclarecimentos, entre em contato conosco.</p>
      </div>
      <div class="signature">
        <p class="signature-text">Atenciosamente,</p>
        <p class="signature-name">Equipe ${empresa.nome}</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-info"><strong>${empresa.rodapeRazao}</strong></div>
      <div class="footer-info">CNPJ: ${empresa.cnpj}${empresa.ie ? ` • IE: ${empresa.ie}` : ''}</div>
      <div class="footer-info">📞 ${empresa.telefone}${empresa.contato ? ` – ${empresa.contato}` : ''}</div>
      <div class="footer-info">📍 ${empresa.endereco} - ${empresa.bairro} - ${empresa.cidade}</div>
    </div>
  </div>
</body>
</html>`;
}
