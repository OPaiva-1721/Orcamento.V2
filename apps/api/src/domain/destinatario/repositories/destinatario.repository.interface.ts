import { Destinatario, CreateDestinatarioData, UpdateDestinatarioData, DestinatarioFilters, PaginatedResponse } from '@orcamento/shared-types';

export interface IDestinatarioRepository {
  findById(id: number, ownerId: string): Promise<Destinatario | null>;
  findByEmailAndCliente(email: string, clienteId: number, ownerId: string): Promise<Destinatario | null>;
  findAll(filters: DestinatarioFilters): Promise<PaginatedResponse<Destinatario>>;
  findByIds(ids: number[], ownerId: string): Promise<Destinatario[]>;
  create(data: CreateDestinatarioData, ownerId: string): Promise<Destinatario>;
  update(id: number, ownerId: string, data: UpdateDestinatarioData): Promise<Destinatario>;
  delete(id: number, ownerId: string): Promise<void>;
  countOrcamentos(destinatarioId: number, ownerId: string): Promise<number>;
}

export const DESTINATARIO_REPOSITORY = 'DESTINATARIO_REPOSITORY';
