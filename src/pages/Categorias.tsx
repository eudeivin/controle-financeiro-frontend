import { useCallback, useEffect, useState } from 'react';
import type { Categoria } from '../types';
import { listarCategorias, criarCategoria, deletarCategoria } from '../api/categoriaService';
import Sidebar from './Sidebar';

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const dados = await listarCategorias();
      setCategorias(dados);
    } catch {
      setErro('Erro ao carregar categorias');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar(); // eslint-disable-line
  }, [carregar]);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Digite um nome para a categoria');
      return;
    }

    try {
      await criarCategoria(nome, tipo);
      setNome('');
      carregar();
    } catch {
      setErro('Erro ao criar categoria');
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm('Tem certeza que deseja excluir essa categoria?')) return;

    try {
      await deletarCategoria(id);
      carregar();
    } catch {
      setErro('Erro ao excluir categoria (pode estar em uso por transações)');
    }
  }

  const receitas = categorias.filter((c) => c.tipo === 'RECEITA');
  const despesas = categorias.filter((c) => c.tipo === 'DESPESA');

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-white mb-6">Categorias</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-medium text-gray-300 mb-3">Nova categoria</p>
              <form onSubmit={handleCriar} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
                />
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'RECEITA' | 'DESPESA')}
                  className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="DESPESA">Despesa</option>
                  <option value="RECEITA">Receita</option>
                </select>
                <button
                  type="submit"
                  className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Adicionar
                </button>
              </form>
              {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}
            </div>

            {carregando ? (
              <p className="text-gray-500 text-sm">Carregando...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <h2 className="text-sm font-medium text-green-400">Receitas</h2>
                  </div>
                  {receitas.length === 0 ? (
                    <p className="p-4 text-xs text-gray-600">Nenhuma categoria ainda.</p>
                  ) : (
                    receitas.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                      >
                        <span className="text-sm text-gray-200">{cat.nome}</span>
                        <button
                          onClick={() => handleExcluir(cat.id)}
                          className="text-xs text-gray-500 hover:text-red-400"
                        >
                          Excluir
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <h2 className="text-sm font-medium text-red-400">Despesas</h2>
                  </div>
                  {despesas.length === 0 ? (
                    <p className="p-4 text-xs text-gray-600">Nenhuma categoria ainda.</p>
                  ) : (
                    despesas.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                      >
                        <span className="text-sm text-gray-200">{cat.nome}</span>
                        <button
                          onClick={() => handleExcluir(cat.id)}
                          className="text-xs text-gray-500 hover:text-red-400"
                        >
                          Excluir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-medium text-gray-300 mb-4">Resumo</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total de categorias</p>
                  <p className="text-xl font-semibold text-white">{categorias.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Categorias de receita</p>
                  <p className="text-xl font-semibold text-green-400">{receitas.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Categorias de despesa</p>
                  <p className="text-xl font-semibold text-red-400">{despesas.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categorias;