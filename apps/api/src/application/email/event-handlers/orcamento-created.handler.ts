import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrcamentoCreatedEvent } from '../../../domain/orcamento/events/orcamento-created.event';
import { SendOrcamentoEmailUseCase } from '../use-cases/send-orcamento-email/send-orcamento-email.use-case';

/**
 * Handler que substitui o anti-padrão de auto-chamada HTTP (fetch to /api/enviar-email).
 * Escuta o evento 'orcamento.created' e dispara o envio de email via DI.
 */
@Injectable()
export class OrcamentoCreatedHandler {
  private readonly logger = new Logger(OrcamentoCreatedHandler.name);

  constructor(private readonly sendEmailUseCase: SendOrcamentoEmailUseCase) {}

  @OnEvent('orcamento.created', { async: true })
  async handle(event: OrcamentoCreatedEvent): Promise<void> {
    if (event.destinatarioIds.length === 0) return;

    this.logger.log(
      `OrcamentoCriado #${event.orcamentoId}: disparando envio de email para ${event.destinatarioIds.length} destinatário(s)`,
    );

    try {
      await this.sendEmailUseCase.execute(
        {
          orcamentoId: event.orcamentoId,
          destinatarioIds: event.destinatarioIds,
        },
        event.ownerId,
      );
    } catch (err: any) {
      // Falha no email não deve impedir a criação do orçamento (graceful degradation)
      this.logger.error(
        `Erro ao enviar emails para orçamento #${event.orcamentoId}: ${err.message}`,
      );
    }
  }
}
