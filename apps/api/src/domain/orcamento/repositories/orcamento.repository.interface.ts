import { Orcamento, CreateOrcamentoData, UpdateOrcamentoData, OrcamentoFilters, PaginatedResponse } from '@orcamento/shared-types';

export interface CreateOrcamentoWithHistory extends CreateOrcamentoData {
  initialHistoryEntries: Array<{ status: string; observacao: string }>;
}

export interface UpdateOrcamentoWithHistory extends UpdateOrcamentoData {
  newHistoryEntries?: Array<{ status: string; observacao: string }>;
}

export interface IStatusHistoryRepository {
  create(entry: { orcamentoId: number; status: string; observacao?: string }): Promise<void>;
}

export interface IOrcamentoRepository {
  findById(id: number, ownerId: string): Promise<Orcamento | null>;
  findAll(filters: OrcamentoFilters): Promise<PaginatedResponse<Orcamento>>;
  create(data: CreateOrcamentoWithHistory, ownerId: string): Promise<Orcamento>;
  update(id: number, ownerId: string, data: UpdateOrcamentoWithHistory): Promise<Orcamento>;
  delete(id: number, ownerId: string): Promise<void>;
  setDestinatarios(orcamentoId: number, destinatarioIds: number[], ownerId: string): Promise<void>;
  countByClienteId(clienteId: number, ownerId: string): Promise<number>;
}

export const ORCAMENTO_REPOSITORY = 'ORCAMENTO_REPOSITORY';
export const STATUS_HISTORY_REPOSITORY = 'STATUS_HISTORY_REPOSITORY';
