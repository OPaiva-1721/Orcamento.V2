import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrcamento } from '../../hooks/useOrcamentos';
import { useClientes } from '../../hooks/useClientes';
import { useDestinatarios } from '../../hooks/useDestinatarios';
import type { OrcamentoStatus } from '@orcamento/shared-types';

const STATUSES: OrcamentoStatus[] = ['Pendente', 'Aprovado', 'Rejeitado', 'Cancelado', 'Em Andamento', 'Concluído'];

export function OrcamentoNovoPage() {
  const navigate         = useNavigate();
  const createOrcamento  = useCreateOrcamento();

  const [clienteId,       setClienteId]       = useState<number | ''>('');
  const [destinatarioIds, setDestinatarioIds] = useState<number[]>([]);
  const [descricao,       setDescricao]       = useState('');
  const [preco,           setPreco]           = useState('');
  const [status,          setStatus]          = useState<OrcamentoStatus>('Pendente');
  const [formaPagamento,  setFormaPagamento]  = useState(false);
  const [dataInicio,      setDataInicio]      = useState('');
  const [dataTermino,     setDataTermino]     = useState('');
  const [error,           setError]           = useState('');

  const { data: clientes }      = useClientes({ limit: 100 });
  const { data: destinatarios } = useDestinatarios({ clienteId: clienteId || undefined, limit: 100 });

  useEffect(() => { setDestinatarioIds([]); }, [clienteId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createOrcamento.mutateAsync({
        descricao,
        preco:          parseFloat(preco),
        status,
        formaPagamento,
        dataInicio:     new Date(dataInicio),
        dataTermino:    dataTermino ? new Date(dataTermino) : undefined,
        clienteId:      clienteId as number,
        destinatarioIds,
      });
      navigate('/orcamentos');
    } catch (err: any) {
      setError(err.message);
    }
  }

  function toggleDestinatario(id: number) {
    setDestinatarioIds((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Orçamento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select value={clienteId} onChange={(e) => setClienteId(Number(e.target.value))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione um cliente</option>
            {clientes?.data.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input type="number" step="0.01" min="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrcamentoStatus)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
            <input type="date" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formaPagamento} onChange={(e) => setFormaPagamento(e.target.checked)} className="rounded" />
            <span className="text-sm text-gray-700">7 dias após vencimento da nota</span>
          </label>
        </div>

        {clienteId && destinatarios?.data && destinatarios.data.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destinatários</label>
            <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {destinatarios.data.map((d) => (
                <label key={d.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" checked={destinatarioIds.includes(d.id)} onChange={() => toggleDestinatario(d.id)} />
                  <span className="text-sm">{d.nome} — {d.email}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Cancelar</button>
          <button type="submit" disabled={createOrcamento.isPending} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {createOrcamento.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
