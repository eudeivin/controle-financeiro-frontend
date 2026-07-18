import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import type { ResumoMensal, Transacao } from "../types";
import NovaTransacaoModal from './NovaTransacaoModal';
import { deletarTransacao } from '../api/transacaoService';


function Dashboard() {
  const [resumo, setResumo] = useState<ResumoMensal | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);

  const nome = localStorage.getItem("nome");

  const carregarDados = useCallback(async () => {
    try {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + 1;

      const [resumoRes, transacoesRes] = await Promise.all([
        api.get<ResumoMensal>(`/relatorios/resumo?ano=${ano}&mes=${mes}`),
        api.get<Transacao[]>("/transacoes"),
      ]);

      setResumo(resumoRes.data);
      setTransacoes(transacoesRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados(); // eslint-disable-line
  }, [carregarDados]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    navigate("/login");
  }

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
    return <p style={{ textAlign: "center", marginTop: 50 }}>Carregando...</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Olá, {nome}!</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setModalAberto(true)}>+ Nova Transação</button>
          <button onClick={() => navigate("/categorias")}>Categorias</button>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </div>

      {resumo && (
        <div style={{ display: "flex", gap: 20, margin: "20px 0" }}>
          <div
            style={{
              flex: 1,
              padding: 15,
              background: "#e8f5e9",
              borderRadius: 8,
            }}
          >
            <strong>Receitas</strong>
            <p style={{ fontSize: 20 }}>R$ {resumo.totalReceitas.toFixed(2)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: 15,
              background: "#ffebee",
              borderRadius: 8,
            }}
          >
            <strong>Despesas</strong>
            <p style={{ fontSize: 20 }}>R$ {resumo.totalDespesas.toFixed(2)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: 15,
              background: "#e3f2fd",
              borderRadius: 8,
            }}
          >
            <strong>Saldo</strong>
            <p style={{ fontSize: 20 }}>R$ {resumo.saldo.toFixed(2)}</p>
          </div>
        </div>
      )}

      <h2>Transações recentes</h2>
      {transacoes.length === 0 ? (
        <p>Nenhuma transação cadastrada ainda.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
              <th style={{ padding: 8 }}>Descrição</th>
              <th style={{ padding: 8 }}>Categoria</th>
              <th style={{ padding: 8 }}>Data</th>
              <th style={{ padding: 8 }}>Valor</th>
              <th style={{ padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{t.descricao}</td>
                <td style={{ padding: 8 }}>{t.categoriaNome}</td>
                <td style={{ padding: 8 }}>{t.data}</td>
                <td
                  style={{
                    padding: 8,
                    color: t.tipo === "RECEITA" ? "green" : "red",
                  }}
                >
                  {t.tipo === "RECEITA" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                </td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleExcluirTransacao(t.id)} style={{ color: "red" }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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