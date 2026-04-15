import { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OrcamentoStatus } from '@orcamento/shared-types';

const VALID_STATUSES: OrcamentoStatus[] = [
  'Pendente', 'Aprovado', 'Rejeitado', 'Cancelado', 'Em Andamento', 'Concluído',
];

export class UpdateOrcamentoDto {
  @IsOptional() @IsString()
  descricao?: string;

  @IsOptional() @IsNumber() @Min(0.01)
  preco?: number;

  @IsOptional() @IsIn(VALID_STATUSES)
  status?: OrcamentoStatus;

  @IsOptional() @IsBoolean()
  formaPagamento?: boolean;

  @IsOptional() @IsDateString()
  dataInicio?: string;

  @IsOptional() @IsDateString()
  dataTermino?: string;

  @IsOptional() @IsInt() @Min(1)
  clienteId?: number;

  @IsOptional() @IsArray() @IsInt({ each: true })
  destinatarioIds?: number[];
}
