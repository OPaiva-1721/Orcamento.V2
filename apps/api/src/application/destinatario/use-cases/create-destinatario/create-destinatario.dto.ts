import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateDestinatarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsInt()
  @Min(1)
  clienteId: number;
}
