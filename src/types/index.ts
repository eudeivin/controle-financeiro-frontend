export interface AuthResponse {
  token: string;
  usuarioId: number;
  nome: string;
  email: string;
}

export interface Categoria {
  id: number;
  nome: string;
  tipo: 'RECEITA' | 'DESPESA';
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'RECEITA' | 'DESPESA';
  categoriaNome: string;
}

export interface ResumoMensal {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}