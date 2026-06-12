import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  OrcamentoStatus,
  ORCAMENTO_STATUS_VALUES,
} from '@orcamento/shared-types';

export class UpdateOrcamentoDto {
  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  preco?: number;

  @IsOptional()
  @IsIn(ORCAMENTO_STATUS_VALUES)
  status?: OrcamentoStatus;

  @IsOptional()
  @IsBoolean()
  formaPagamento?: boolean;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataTermino?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  clienteId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  destinatarioIds?: number[];
}
