import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;
}
