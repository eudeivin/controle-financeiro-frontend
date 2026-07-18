import api from './api';
import type { Categoria } from '../types';

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await api.get<Categoria[]>('/categorias');
  return response.data;
}

export async function criarCategoria(nome: string, tipo: 'RECEITA' | 'DESPESA'): Promise<Categoria> {
  const response = await api.post<Categoria>('/categorias', { nome, tipo });
  return response.data;
}

export async function deletarCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}