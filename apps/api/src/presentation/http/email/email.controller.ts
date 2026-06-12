import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { SendOrcamentoEmailUseCase } from '../../../application/email/use-cases/send-orcamento-email/send-orcamento-email.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { DecodedFirebaseToken } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';

class SendEmailDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  orcamentoId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  destinatarioIds: number[];
}

@Controller('enviar-email')
export class EmailController {
  constructor(private readonly sendEmail: SendOrcamentoEmailUseCase) {}

  // Endpoint sensível (envia email + gera PDF): no máximo 5 req/min por IP
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post()
  @HttpCode(200)
  send(@Body() body: SendEmailDto, @CurrentUser() user: DecodedFirebaseToken) {
    return this.sendEmail.execute(body, user.uid);
  }
}
