import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cadastrarUsuario, type UsuarioRequest } from "../../../services/usuarioService";
import { buscarOnibus } from "../../../services/onibusService";
import type { Onibus } from "../../../types/bolt"; // <-- CORREÇÃO: import type

export default function CadastrarUsuario() {
  const navigate = useNavigate();
  const [onibusList, setOnibusList] = useState<Onibus[]>([]);

  const [formData, setFormData] = useState<UsuarioRequest>({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
    role: "USER",
    onibusId: undefined
  });

  useEffect(() => {
    buscarOnibus()
      .then(setOnibusList)
      .catch(err => console.log("Não foi possível carregar ônibus públicos:", err));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = { 
          ...formData, 
          onibusId: formData.onibusId ? Number(formData.onibusId) : undefined 
      };
      
      await cadastrarUsuario(payload);
      alert("Cadastro realizado! Faça login.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data || "Erro ao cadastrar. Verifique o CPF/E-mail.";
      alert(msg);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <h3 className="fw-bold text-dark">Criar conta BOLT</h3>
        <p className="text-secondary">Preencha os dados para continuar</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">NOME</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-control bg-light border-0 p-3" required placeholder="Seu nome completo" style={{borderRadius: "10px"}}/>
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="form-control bg-light border-0 p-3" placeholder="000.000.000-00" required style={{borderRadius: "10px"}}/>
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">EMAIL</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-light border-0 p-3" placeholder="seu@email.com" required style={{borderRadius: "10px"}}/>
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">SENHA</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} className="form-control bg-light border-0 p-3" placeholder="******" required style={{borderRadius: "10px"}}/>
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">TELEFONE</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="form-control bg-light border-0 p-3" placeholder="(00) 00000-0000" required style={{borderRadius: "10px"}}/>
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary small fw-bold">ÔNIBUS (OPCIONAL)</label>
          <select name="onibusId" className="form-select bg-light border-0 p-3" value={formData.onibusId || ""} onChange={handleChange} style={{borderRadius: "10px"}}>
            <option value="">Selecione seu ônibus (se aplicável)...</option>
            {onibusList.map(o => (
              <option key={o.id} value={o.id}>{o.nome} - {o.placa}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-sm" style={{borderRadius: "12px"}}>
          Cadastrar
        </button>
        
        <div className="text-center mt-3">
            <button type="button" onClick={() => navigate("/")} className="btn btn-link text-decoration-none text-muted">Voltar ao Login</button>
        </div>
      </form>
    </>
  );
}