import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCliente } from '../../hooks/useClientes';

export function ClienteNovoPage() {
  const navigate      = useNavigate();
  const createCliente = useCreateCliente();

  const [form, setForm] = useState({ nome: '', cnpj: '', email: '', telefone: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createCliente.mutateAsync(form);
      navigate('/clientes');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(['nome', 'cnpj', 'email', 'telefone'] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={createCliente.isPending} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {createCliente.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
