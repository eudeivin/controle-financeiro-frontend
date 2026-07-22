import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import type { ResumoMensal, Transacao } from "../types";
import NovaTransacaoModal from './NovaTransacaoModal';
import { deletarTransacao } from '../api/transacaoService';
import Sidebar from './Sidebar';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

interface GastoPorCategoria {
  categoriaNome: string;
  total: number;
}

function Dashboard() {
  const [resumo, setResumo] = useState<ResumoMensal | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<GastoPorCategoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const nome = localStorage.getItem("nome");

  const carregarDados = useCallback(async () => {
    try {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + 1;

      const [resumoRes, transacoesRes, gastosRes] = await Promise.all([
        api.get<ResumoMensal>(`/relatorios/resumo?ano=${ano}&mes=${mes}`),
        api.get<Transacao[]>("/transacoes"),
        api.get<GastoPorCategoria[]>(`/relatorios/gastos-por-categoria?ano=${ano}&mes=${mes}`),
      ]);

      setResumo(resumoRes.data);
      setTransacoes(transacoesRes.data);
      setGastosPorCategoria(gastosRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados(); // eslint-disable-line
  }, [carregarDados]);

  async function handleExcluirTransacao(id: number) {
    if (!confirm('Tem certeza que deseja excluir essa transação?')) return;

    try {
      await deletarTransacao(id);
      carregarDados();
    } catch {
      alert('Erro ao excluir transação');
    }
  }

  if (carregando) {
    return <p className="text-center mt-12 text-gray-400 bg-gray-950 min-h-screen pt-12">Carregando...</p>;
  }

  const maiorGasto = gastosPorCategoria.length > 0
    ? Math.max(...gastosPorCategoria.map((g) => g.total))
    : 0;

  const totalGastoCategorias = gastosPorCategoria.reduce((acc, g) => acc + g.total, 0);
  const categoriaTop = gastosPorCategoria.length > 0
    ? gastosPorCategoria.reduce((max, g) => (g.total > max.total ? g : max), gastosPorCategoria[0])
    : null;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Olá,</p>
            <h1 className="text-2xl font-semibold text-white">{nome}</h1>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Nova Transação
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            {resumo && (
              <div className="bg-gray-900 border border-gray-800 text-white rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Saldo atual</p>
                  <p className="text-3xl font-semibold mb-4">
                    R$ {resumo.saldo.toFixed(2)}
                  </p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-green-400">↑ R$ {resumo.totalReceitas.toFixed(2)}</span>
                    <span className="text-red-400">↓ R$ {resumo.totalDespesas.toFixed(2)}</span>
                  </div>
                </div>

                <div className="w-32 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { v: resumo.totalDespesas },
                        { v: resumo.saldo * 0.7 },
                        { v: resumo.totalReceitas * 0.5 },
                        { v: resumo.saldo * 0.9 },
                        { v: resumo.saldo },
                      ]}
                    >
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#a3e635"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {resumo && gastosPorCategoria.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-6 items-center">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'gasto', value: resumo.totalDespesas },
                          { name: 'restante', value: Math.max(resumo.totalReceitas - resumo.totalDespesas, 0) },
                        ]}
                        dataKey="value"
                        innerRadius={38}
                        outerRadius={54}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        <Cell fill="#a3e635" />
                        <Cell fill="#27272a" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">Gasto</span>
                    <span className="text-sm font-semibold text-white">
                      {resumo.totalReceitas > 0
                        ? Math.round((resumo.totalDespesas / resumo.totalReceitas) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-300 mb-3">Gastos por categoria</p>
                  <div className="flex flex-col gap-3">
                    {gastosPorCategoria.map((g) => (
                      <div key={g.categoriaNome}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{g.categoriaNome}</span>
                          <span className="text-gray-500">R$ {g.total.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(g.total / maiorGasto) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="font-medium text-white">Transações recentes</h2>
              </div>

              {transacoes.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">Nenhuma transação cadastrada ainda.</p>
              ) : (
                <div>
                  {transacoes.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-5 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            t.tipo === "RECEITA" ? "bg-green-500/15" : "bg-red-500/15"
                          }`}
                        >
                          {t.tipo === "RECEITA" ? (
                            <ArrowUpRight size={16} className="text-green-400" />
                          ) : (
                            <ArrowDownRight size={16} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-200">{t.descricao}</p>
                          <p className="text-xs text-gray-500">{t.categoriaNome} · {t.data}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${t.tipo === "RECEITA" ? "text-green-400" : "text-red-400"}`}>
                          {t.tipo === "RECEITA" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleExcluirTransacao(t.id)}
                          className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-medium text-gray-300 mb-4">Resumo rápido</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-gray-500">Transações no mês</p>
                  <p className="text-xl font-semibold text-white">{transacoes.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total em despesas</p>
                  <p className="text-xl font-semibold text-white">R$ {totalGastoCategorias.toFixed(2)}</p>
                </div>
                {categoriaTop && (
                  <div>
                    <p className="text-xs text-gray-500">Maior gasto</p>
                    <p className="text-sm font-medium text-white">{categoriaTop.categoriaNome}</p>
                    <p className="text-xs text-gray-500">R$ {categoriaTop.total.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-medium text-gray-300 mb-3">Dica</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cadastre suas categorias antes de lançar transações para manter tudo organizado por tipo de gasto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {modalAberto && (
        <NovaTransacaoModal
          onFechar={() => setModalAberto(false)}
          onSucesso={carregarDados}
        />
      )}
    </div>
  );
}

export default Dashboard;