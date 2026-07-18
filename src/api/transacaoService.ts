import api from './api';
import type { Transacao } from '../types';

export async function listarTransacoes(): Promise<Transacao[]> {
  const response = await api.get<Transacao[]>('/transacoes');
  return response.data;
}

export async function criarTransacao(dados: {
  descricao: string;
  valor: number;
  data: string;
  tipo: 'RECEITA' | 'DESPESA';
  categoriaId: number;
}): Promise<Transacao> {
  const response = await api.post<Transacao>('/transacoes', dados);
  return response.data;
}

export async function deletarTransacao(id: number): Promise<void> {
  await api.delete(`/transacoes/${id}`);
}