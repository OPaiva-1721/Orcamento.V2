import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import { formatCurrency, formatDate } from '../lib/utils';
import type { DashboardStats } from '@orcamento/shared-types';

export function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn:  () => api.get('/dashboard/stats'),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Clientes',      value: data?.totalClientes      ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Orçamentos',    value: data?.totalOrcamentos    ?? 0, color: 'bg-purple-50 text-purple-700' },
    { label: 'Aprovados',     value: data?.totalOrcamentosAprovados ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Destinatários', value: data?.totalDestinatarios ?? 0, color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
        <div className="text-sm text-green-700 font-medium">Valor Total Aprovado</div>
        <div className="text-2xl font-bold text-green-800 mt-1">
          {formatCurrency(data?.valorTotalAprovado ?? 0)}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Orçamentos Recentes</h2>
        <div className="space-y-2">
          {data?.recentOrcamentos?.map((o) => (
            <div key={o.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-gray-900">{o.descricao}</div>
                <div className="text-xs text-gray-500">{o.cliente?.nome} • {formatDate(o.dataInicio)}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">{formatCurrency(o.preco)}</div>
                <span className="text-xs text-gray-500">{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
