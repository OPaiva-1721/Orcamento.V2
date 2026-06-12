import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  OrcamentoStatus,
  ORCAMENTO_STATUS_VALUES,
} from '@orcamento/shared-types';

export class CreateOrcamentoDto {
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  descricao: string;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  preco: number;

  @IsOptional()
  @IsIn(ORCAMENTO_STATUS_VALUES, { message: 'Status inválido' })
  status?: OrcamentoStatus;

  @IsBoolean({ message: 'formaPagamento deve ser booleano' })
  formaPagamento: boolean;

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString()
  dataInicio: string;

  @IsOptional()
  @IsDateString()
  dataTermino?: string;

  @IsInt()
  @Min(1)
  clienteId: number;

  @IsArray()
  @IsInt({ each: true })
  destinatarioIds: number[];
}
