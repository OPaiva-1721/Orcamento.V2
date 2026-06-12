import { Inject, Injectable } from '@nestjs/common';
import { Orcamento, OrcamentoStatus } from '@orcamento/shared-types';
import {
  IOrcamentoRepository,
  ORCAMENTO_REPOSITORY,
} from '../../../../domain/orcamento/repositories/orcamento.repository.interface';
import {
  IDestinatarioRepository,
  DESTINATARIO_REPOSITORY,
} from '../../../../domain/destinatario/repositories/destinatario.repository.interface';
import { StatusTransitionDomainService } from '../../../../domain/orcamento/domain-services/status-transition.domain-service';
import { OrcamentoStatusVO } from '../../../../domain/orcamento/value-objects/orcamento-status.value-object';
import { OrcamentoNotFoundException } from '../../../../domain/orcamento/exceptions/orcamento-not-found.exception';
import { DataTerminoRequiredException } from '../../../../domain/orcamento/exceptions/data-termino-required.exception';
import { DestinatarioNotBelongsToClienteException } from '../../../../domain/orcamento/exceptions/destinatario-not-belongs-to-cliente.exception';
import { UpdateOrcamentoDto } from './update-orcamento.dto';

@Injectable()
export class UpdateOrcamentoUseCase {
  constructor(
    @Inject(ORCAMENTO_REPOSITORY)
    private readonly orcamentoRepo: IOrcamentoRepository,
    @Inject(DESTINATARIO_REPOSITORY)
    private readonly destRepo: IDestinatarioRepository,
    private readonly statusTransition: StatusTransitionDomainService,
  ) {}

  async execute(
    id: number,
    dto: UpdateOrcamentoDto,
    ownerId: string,
  ): Promise<Orcamento> {
    const existing = await this.orcamentoRepo.findById(id, ownerId);
    if (!existing) throw new OrcamentoNotFoundException(id);

    const clienteId = dto.clienteId ?? existing.clienteId;
    let historyEntries:
      | Array<{ status: string; observacao: string }>
      | undefined;
    let finalStatus: OrcamentoStatus | undefined;

    // Calcular transição de status se mudou (RN-01)
    if (dto.status !== undefined) {
      const requestedStatus = OrcamentoStatusVO.create(dto.status);

      // RN-03: dataTermino obrigatória se Concluído
      const dataTermino = dto.dataTermino ?? existing.dataTermino?.toString();
      if (requestedStatus.isConcluido() && !dataTermino) {
        throw new DataTerminoRequiredException();
      }

      const transition = this.statusTransition.computeTransition(
        requestedStatus,
        'atualizacao',
      );
      finalStatus = transition.persistedStatus.value;
      historyEntries = transition.historyEntries;
    }

    // Validar destinatários se alterados (RN-05)
    if (dto.destinatarioIds !== undefined && dto.destinatarioIds.length > 0) {
      const found = await this.destRepo.findByIds(dto.destinatarioIds, ownerId);
      for (const dest of found) {
        if (dest.clienteId !== clienteId) {
          throw new DestinatarioNotBelongsToClienteException(
            dest.id,
            clienteId,
          );
        }
      }
    }

    return this.orcamentoRepo.update(id, ownerId, {
      descricao: dto.descricao,
      preco: dto.preco,
      status: finalStatus,
      formaPagamento: dto.formaPagamento,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : undefined,
      dataTermino: dto.dataTermino ? new Date(dto.dataTermino) : undefined,
      clienteId: dto.clienteId,
      destinatarioIds: dto.destinatarioIds,
      newHistoryEntries: historyEntries,
    });
  }
}
