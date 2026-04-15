import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { Cliente, CreateClienteData, UpdateClienteData, PaginatedResponse } from '@orcamento/shared-types';

export function useClientes(params?: { q?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.q)     query.set('q',     params.q);
  if (params?.page)  query.set('page',  String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  return useQuery<PaginatedResponse<Cliente>>({
    queryKey: ['clientes', params],
    queryFn:  () => api.get(`/clientes?${query}`),
  });
}

export function useCliente(id: number) {
  return useQuery<Cliente>({
    queryKey: ['clientes', id],
    queryFn:  () => api.get(`/clientes/${id}`),
    enabled:  !!id,
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation<Cliente, Error, CreateClienteData>({
    mutationFn: (data) => api.post('/clientes', data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['clientes'] }),
  });
}

export function useUpdateCliente() {
  const qc = useQueryClient();
  return useMutation<Cliente, Error, { id: number; data: UpdateClienteData }>({
    mutationFn: ({ id, data }) => api.put(`/clientes/${id}`, data),
    onSuccess:  (_r, { id }) => qc.invalidateQueries({ queryKey: ['clientes', id] }),
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/clientes/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['clientes'] }),
  });
}
