import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import type { AuthResponse } from '../types';
import { Wallet } from 'lucide-react';

function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post<AuthResponse>('/auth/registrar', { nome, email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nome', response.data.nome);
      navigate('/dashboard');
    } catch {
      setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-lime-400 flex items-center justify-center mb-4">
            <Wallet size={20} className="text-black" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-white text-center">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">Comece a organizar suas finanças</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 md:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {erro && <p className="text-red-400 text-sm">{erro}</p>}

            <button
              type="submit"
              className="bg-lime-400 hover:bg-lime-300 text-black font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              Cadastrar
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-lime-400 hover:text-lime-300">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;