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
  findById(id: number): Promise<Orcamento | null>;
  findAll(filters: OrcamentoFilters): Promise<PaginatedResponse<Orcamento>>;
  create(data: CreateOrcamentoWithHistory): Promise<Orcamento>;
  update(id: number, data: UpdateOrcamentoWithHistory): Promise<Orcamento>;
  delete(id: number): Promise<void>;
  setDestinatarios(orcamentoId: number, destinatarioIds: number[]): Promise<void>;
  countByClienteId(clienteId: number): Promise<number>;
}

export const ORCAMENTO_REPOSITORY = 'ORCAMENTO_REPOSITORY';
export const STATUS_HISTORY_REPOSITORY = 'STATUS_HISTORY_REPOSITORY';
