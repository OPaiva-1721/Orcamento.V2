import { Cliente, CreateClienteData, UpdateClienteData, ClienteFilters, PaginatedResponse } from '@orcamento/shared-types';

export interface IClienteRepository {
  findById(id: number, ownerId: string): Promise<Cliente | null>;
  findByEmail(email: string, ownerId: string): Promise<Cliente | null>;
  findAll(filters: ClienteFilters): Promise<PaginatedResponse<Cliente>>;
  create(data: CreateClienteData): Promise<Cliente>;
  update(id: number, ownerId: string, data: UpdateClienteData): Promise<Cliente>;
  delete(id: number, ownerId: string): Promise<void>;
  countOrcamentos(clienteId: number, ownerId: string): Promise<number>;
}

export const CLIENTE_REPOSITORY = 'CLIENTE_REPOSITORY';
