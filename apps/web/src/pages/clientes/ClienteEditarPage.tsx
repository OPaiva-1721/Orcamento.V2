import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCliente, useUpdateCliente } from '../../hooks/useClientes';

export function ClienteEditarPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { data: cliente, isLoading } = useCliente(Number(id));
  const updateCliente = useUpdateCliente();

  const [nome,     setNome]     = useState('');
  const [cnpj,     setCnpj]     = useState('');
  const [email,    setEmail]    = useState('');
  const [telefone, setTelefone] = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setCnpj(cliente.cnpj);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
    }
  }, [cliente]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await updateCliente.mutateAsync({ id: Number(id), data: { nome, cnpj, email, telefone } });
      navigate('/clientes');
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (isLoading) return <div className="p-6 text-gray-500">Carregando...</div>;
  if (!cliente)  return <div className="p-6 text-red-500">Cliente não encontrado.</div>;

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
          <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancelar</button>
          <button type="submit" disabled={updateCliente.isPending} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {updateCliente.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
