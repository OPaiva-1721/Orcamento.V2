import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDestinatario, useUpdateDestinatario } from '../../hooks/useDestinatarios';
import { useClientes } from '../../hooks/useClientes';

export function DestinatarioEditarPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { data: destinatario, isLoading } = useDestinatario(Number(id));
  const updateDestinatario = useUpdateDestinatario();
  const { data: clientes } = useClientes({ limit: 100 });

  const [nome,      setNome]      = useState('');
  const [email,     setEmail]     = useState('');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (destinatario) {
      setNome(destinatario.nome);
      setEmail(destinatario.email);
      setClienteId(destinatario.clienteId);
    }
  }, [destinatario]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await updateDestinatario.mutateAsync({ id: Number(id), data: { nome, email, clienteId: clienteId as number } });
      navigate('/destinatarios');
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (isLoading) return <div className="p-6 text-gray-500">Carregando...</div>;
  if (!destinatario) return <div className="p-6 text-red-500">Destinatário não encontrado.</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Destinatário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select value={clienteId} onChange={(e) => setClienteId(Number(e.target.value))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Selecione um cliente</option>
            {clientes?.data.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancelar</button>
          <button type="submit" disabled={updateDestinatario.isPending} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {updateDestinatario.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
