import { Cliente, CreateClienteData, UpdateClienteData, ClienteFilters, PaginatedResponse } from '@orcamento/shared-types';

export interface IClienteRepository {
  findById(id: number): Promise<Cliente | null>;
  findByEmail(email: string): Promise<Cliente | null>;
  findAll(filters: ClienteFilters): Promise<PaginatedResponse<Cliente>>;
  create(data: CreateClienteData): Promise<Cliente>;
  update(id: number, data: UpdateClienteData): Promise<Cliente>;
  delete(id: number): Promise<void>;
  countOrcamentos(clienteId: number): Promise<number>;
}

export const CLIENTE_REPOSITORY = 'CLIENTE_REPOSITORY';
