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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ background: 'white', padding: 30, borderRadius: 8, width: 400 }}>
        <h2>Nova Transação</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>Tipo</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as 'RECEITA' | 'DESPESA');
                setCategoriaId('');
              }}
              style={{ width: '100%', padding: 8 }}
            >
              <option value="DESPESA">Despesa</option>
              <option value="RECEITA">Receita</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Valor</label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
              style={{ width: '100%', padding: 8 }}
            >
              <option value="">Selecione...</option>
              {categoriasFiltradas.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            {categoriasFiltradas.length === 0 && (
              <p style={{ fontSize: 12, color: '#888' }}>
                Nenhuma categoria de {tipo.toLowerCase()} cadastrada ainda.
              </p>
            )}
          </div>

          {erro && <p style={{ color: 'red' }}>{erro}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onFechar} style={{ flex: 1, padding: 10 }}>
              Cancelar
            </button>
            <button type="submit" style={{ flex: 1, padding: 10 }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovaTransacaoModal;