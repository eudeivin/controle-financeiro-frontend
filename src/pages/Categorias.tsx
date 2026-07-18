import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Categoria } from '../types';
import { listarCategorias, criarCategoria, deletarCategoria } from '../api/categoriaService';

function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

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

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 20 }}>
        ← Voltar
      </button>

      <h1>Minhas Categorias</h1>

      <form onSubmit={handleCriar} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as 'RECEITA' | 'DESPESA')}
          style={{ padding: 8 }}
        >
          <option value="DESPESA">Despesa</option>
          <option value="RECEITA">Receita</option>
        </select>
        <button type="submit" style={{ padding: 8 }}>
          Adicionar
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categorias.map((cat) => (
            <li
              key={cat.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                borderBottom: '1px solid #eee',
              }}
            >
              <span>
                {cat.nome}{' '}
                <span
                  style={{
                    fontSize: 12,
                    color: cat.tipo === 'RECEITA' ? 'green' : 'red',
                    marginLeft: 8,
                  }}
                >
                  {cat.tipo}
                </span>
              </span>
              <button onClick={() => handleExcluir(cat.id)} style={{ color: 'red' }}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Categorias;