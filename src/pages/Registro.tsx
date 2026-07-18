import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import type { AuthResponse } from "../types";

function Registro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post<AuthResponse>("/auth/registrar", {
        nome,
        email,
        senha,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nome", response.data.nome);
      navigate("/dashboard");
    } catch {
      setErro("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>Criar Conta</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  );
}

export default Registro;
