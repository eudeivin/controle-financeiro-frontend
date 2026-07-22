import { useEffect, useState } from 'react';
import type { Categoria } from '../types';
import { listarCategorias } from '../api/categoriaService';
import { criarTransacao } from '../api/transacaoService';

interface Props {
  onFechar: () => void;
  onSucesso: () => void;
}

function NovaTransacaoModal({ onFechar, onSucesso }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!descricao.trim() || !valor || !categoriaId) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      await criarTransacao({
        descricao,
        valor: parseFloat(valor),
        data,
        tipo,
        categoriaId: Number(categoriaId),
      });
      onSucesso();
      onFechar();
    } catch {
      setErro('Erro ao criar transação');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-white mb-5">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex bg-gray-950 border border-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setTipo('DESPESA');
                setCategoriaId('');
              }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tipo === 'DESPESA' ? 'bg-red-500/20 text-red-400' : 'text-gray-500'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('RECEITA');
                setCategoriaId('');
              }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tipo === 'RECEITA' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'
              }`}
            >
              Receita
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
              placeholder="Ex: Mercado"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Valor</label>
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
                placeholder="0,00"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
            >
              <option value="">Selecione...</option>
              {categoriasFiltradas.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {categoriasFiltradas.length === 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Nenhuma categoria de {tipo.toLowerCase()} cadastrada ainda.
              </p>
            )}
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-lime-400 hover:bg-lime-300 text-black py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaTransacaoModal;