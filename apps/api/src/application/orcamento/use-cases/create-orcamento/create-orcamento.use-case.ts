import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Orcamento } from '@orcamento/shared-types';
import { IOrcamentoRepository, ORCAMENTO_REPOSITORY } from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import { IClienteRepository, CLIENTE_REPOSITORY } from '../../../../domain/cliente/repositories/cliente.repository.interface';
import { IDestinatarioRepository, DESTINATARIO_REPOSITORY } from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import { StatusTransitionDomainService } from '../../../../domain/orcamento/domain-services/status-transition.domain-service';
import { OrcamentoStatusVO } from '../../../../domain/orcamento/value-objects/orcamento-status.value-object';
import { ClienteNotFoundException } from '../../../../domain/cliente/exceptions/cliente-not-found.exception';
import { DataTerminoRequiredException } from '../../../../domain/orcamento/exceptions/data-termino-required.exception';
import { DestinatarioNotBelongsToClienteException } from '../../../../domain/orcamento/exceptions/destinatario-not-belongs-to-cliente.exception';
import { OrcamentoCreatedEvent } from '../../../../domain/orcamento/events/orcamento-created.event';
import { CreateOrcamentoDto } from './create-orcamento.dto';

@Injectable()
export class CreateOrcamentoUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY) private readonly orcamentoRepo: IOrcamentoRepository,
    @Inject(CLIENTE_REPOSITORY)   private readonly clienteRepo: IClienteRepository,
    @Inject(DESTINATARIO_REPOSITORY) private readonly destRepo: IDestinatarioRepository,
    private readonly statusTransition: StatusTransitionDomainService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateOrcamentoDto, ownerId: string): Promise<Orcamento> {
    // 1. Validar cliente pertence ao owner
    const cliente = await this.clienteRepo.findById(dto.clienteId, ownerId);
    if (!cliente) throw new ClienteNotFoundException(dto.clienteId);

    // 2. Calcular transição de status (RN-01)
    const requestedStatus = OrcamentoStatusVO.create(dto.status ?? 'Pendente');

    // RN-03: dataTermino obrigatória se Concluído
    if (requestedStatus.isConcluido() && !dto.dataTermino) {
      throw new DataTerminoRequiredException();
    }

    const transition = this.statusTransition.computeTransition(requestedStatus, 'criacao');

    // 3. Validar destinatários (RN-05: devem pertencer ao cliente)
    if (dto.destinatarioIds.length > 0) {
      const found = await this.destRepo.findByIds(dto.destinatarioIds, ownerId);
      for (const dest of found) {
        if (dest.clienteId !== dto.clienteId) {
          throw new DestinatarioNotBelongsToClienteException(dest.id, dto.clienteId);
        }
      }
      if (found.length !== dto.destinatarioIds.length) {
        const foundIds = found.map((d) => d.id);
        const missing = dto.destinatarioIds.find((id) => !foundIds.includes(id));
        throw new DestinatarioNotBelongsToClienteException(missing!, dto.clienteId);
      }
    }

    // 4. Persistir
    const orcamento = await this.orcamentoRepo.create({
      descricao:      dto.descricao,
      preco:          dto.preco,
      status:         transition.persistedStatus.value,
      formaPagamento: dto.formaPagamento,
      dataInicio:     new Date(dto.dataInicio),
      dataTermino:    dto.dataTermino ? new Date(dto.dataTermino) : undefined,
      clienteId:      dto.clienteId,
      destinatarioIds: dto.destinatarioIds,
      initialHistoryEntries: transition.historyEntries,
    }, ownerId);

    // 5. Disparar evento de domínio (RN-02: auto-email via handler)
    this.eventEmitter.emit(
      'orcamento.created',
      new OrcamentoCreatedEvent(orcamento.id, dto.destinatarioIds, ownerId),
    );

    return orcamento;
  }
}
