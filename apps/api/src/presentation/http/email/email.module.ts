import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { SendOrcamentoEmailUseCase } from '../../../application/email/use-cases/send-orcamento-email/send-orcamento-email.use-case';
import { OrcamentoCreatedHandler } from '../../../application/email/event-handlers/orcamento-created.handler';
import { OrcamentoDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/orcamento.drizzle.repository';
import { EmailEnviadoDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/email-enviado.drizzle.repository';
import { ORCAMENTO_REPOSITORY } from '../../../domain/orcamento/repositories/orcamento.repository.interface';
import { EMAIL_ENVIADO_REPOSITORY } from '../../../domain/email/repositories/email-enviado.repository.interface';

@Module({
  controllers: [EmailController],
  providers: [
    SendOrcamentoEmailUseCase,
    OrcamentoCreatedHandler,
    { provide: ORCAMENTO_REPOSITORY,    useClass: OrcamentoDrizzleRepository },
    { provide: EMAIL_ENVIADO_REPOSITORY, useClass: EmailEnviadoDrizzleRepository },
  ],
})
export class EmailModule {}
