import { Destinatario, CreateDestinatarioData, UpdateDestinatarioData, DestinatarioFilters, PaginatedResponse } from '@orcamento/shared-types';

export interface IDestinatarioRepository {
  findById(id: number): Promise<Destinatario | null>;
  findByEmailAndCliente(email: string, clienteId: number): Promise<Destinatario | null>;
  findAll(filters: DestinatarioFilters): Promise<PaginatedResponse<Destinatario>>;
  findByIds(ids: number[]): Promise<Destinatario[]>;
  create(data: CreateDestinatarioData): Promise<Destinatario>;
  update(id: number, data: UpdateDestinatarioData): Promise<Destinatario>;
  delete(id: number): Promise<void>;
  countOrcamentos(destinatarioId: number): Promise<number>;
}

export const DESTINATARIO_REPOSITORY = 'DESTINATARIO_REPOSITORY';
