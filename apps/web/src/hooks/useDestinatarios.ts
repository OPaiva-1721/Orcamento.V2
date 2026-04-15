import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { Destinatario, CreateDestinatarioData, UpdateDestinatarioData, PaginatedResponse } from '@orcamento/shared-types';

export function useDestinatarios(params?: { clienteId?: number; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.clienteId) query.set('clienteId', String(params.clienteId));
  if (params?.page)      query.set('page',      String(params.page));
  if (params?.limit)     query.set('limit',     String(params.limit));

  return useQuery<PaginatedResponse<Destinatario>>({
    queryKey: ['destinatarios', params],
    queryFn:  () => api.get(`/destinatarios?${query}`),
  });
}

export function useDestinatario(id: number) {
  return useQuery<Destinatario>({
    queryKey: ['destinatarios', id],
    queryFn:  () => api.get(`/destinatarios/${id}`),
    enabled:  !!id,
  });
}

export function useCreateDestinatario() {
  const qc = useQueryClient();
  return useMutation<Destinatario, Error, CreateDestinatarioData>({
    mutationFn: (data) => api.post('/destinatarios', data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['destinatarios'] }),
  });
}

export function useUpdateDestinatario() {
  const qc = useQueryClient();
  return useMutation<Destinatario, Error, { id: number; data: UpdateDestinatarioData }>({
    mutationFn: ({ id, data }) => api.put(`/destinatarios/${id}`, data),
    onSuccess:  (_r, { id }) => {
      qc.invalidateQueries({ queryKey: ['destinatarios'] });
      qc.invalidateQueries({ queryKey: ['destinatarios', id] });
    },
  });
}

export function useDeleteDestinatario() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/destinatarios/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['destinatarios'] }),
  });
}
