import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useDestinatarios, useDeleteDestinatario } from '../../hooks/useDestinatarios';

export function DestinatariosPage() {
  const { data, isLoading } = useDestinatarios({ limit: 50 });
  const deleteDestinatario  = useDeleteDestinatario();

  async function handleDelete(id: number, nome: string) {
    if (!confirm(`Deletar "${nome}"?`)) return;
    try { await deleteDestinatario.mutateAsync(id); }
    catch (err: any) { alert(err.message); }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Destinatários</h1>
        <Link to="/destinatarios/novo" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Novo
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {data?.data.map((d) => (
            <div key={d.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{d.nome}</div>
                <div className="text-xs text-gray-500">{d.email} • {d.cliente?.nome}</div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/destinatarios/${d.id}`} className="p-2 text-gray-400 hover:text-blue-600">
                  <Pencil size={15} />
                </Link>
                <button onClick={() => handleDelete(d.id, d.nome)} className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {data?.data.length === 0 && <div className="text-center py-10 text-gray-500">Nenhum destinatário encontrado.</div>}
        </div>
      )}
    </div>
  );
}
