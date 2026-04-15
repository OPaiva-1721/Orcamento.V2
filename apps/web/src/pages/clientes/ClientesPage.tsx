import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useClientes, useDeleteCliente } from '../../hooks/useClientes';

export function ClientesPage() {
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  const { data, isLoading }   = useClientes({ q: search || undefined, page });
  const deleteCliente         = useDeleteCliente();

  async function handleDelete(id: number, nome: string) {
    if (!confirm(`Deletar "${nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteCliente.mutateAsync(id);
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Link
          to="/clientes/novo"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Novo Cliente
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{c.nome}</div>
                <div className="text-xs text-gray-500">{c.email} • {c.telefone}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/clientes/${c.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(c.id, c.nome)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {data?.data.length === 0 && (
            <div className="text-center py-10 text-gray-500">Nenhum cliente encontrado.</div>
          )}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-40">Anterior</button>
          <span className="px-3 py-1 text-sm">{page} / {data.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === data.totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-40">Próximo</button>
        </div>
      )}
    </div>
  );
}
