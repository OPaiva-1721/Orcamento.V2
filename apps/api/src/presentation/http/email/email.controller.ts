import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';
import { SendOrcamentoEmailUseCase } from '../../../application/email/use-cases/send-orcamento-email/send-orcamento-email.use-case';

class SendEmailDto {
  @IsNotEmpty() @IsInt() @Min(1)
  orcamentoId: number;

  @IsArray() @IsInt({ each: true })
  destinatarioIds: number[];
}

@Controller('enviar-email')
export class EmailController {
  constructor(private readonly sendEmail: SendOrcamentoEmailUseCase) {}

  @Post()
  @HttpCode(200)
  send(@Body() body: SendEmailDto) {
    return this.sendEmail.execute(body);
  }
}
