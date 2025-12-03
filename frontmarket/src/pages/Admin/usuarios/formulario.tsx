import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { 
  cadastrarUsuario, 
  buscarUsuarioPorId,
  editarUsuario, 
  type UsuarioRequest 
} from "../../../services/usuarioService";
import { buscarOnibus } from "../../../services/onibusService";
import { Onibus } from "../../../types/bolt";

export default function FormularioUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
  const isAdmin = usuarioLogado?.role === 'ADMIN';

  const [onibus, setOnibus] = useState<Onibus[]>([]);

  const [form, setForm] = useState<UsuarioRequest>({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    telefone: "",
    role: "USER",
    onibusId: undefined // Alterado
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setLoading(true);
      // Carrega lista de ônibus para vincular
      try {
          const listaOnibus = await buscarOnibus();
          setOnibus(listaOnibus);
      } catch (err) {
          console.log("Erro ao carregar ônibus.");
      }

      if (id) {
        const usuario = await buscarUsuarioPorId(id);
        setForm({
          id: usuario.id,
          nome: usuario.nome,
          cpf: "", 
          email: usuario.email,
          senha: "",
          telefone: usuario.telefone,
          role: usuario.role,
          onibusId: usuario.onibusId // Alterado
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
        setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { 
          ...form, 
          onibusId: form.onibusId ? Number(form.onibusId) : undefined // Alterado
      };

      if (id) {
        await editarUsuario(payload);
        alert("Usuário atualizado com sucesso!");
      } else {
        await cadastrarUsuario(payload);
        alert("Novo membro cadastrado com sucesso!");
      }
      
      navigate("/usuarios");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data || "Erro ao salvar usuário.";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return <div className="text-center p-5">Carregando dados...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h3 className="fw-bold text-dark mb-0">
            {id ? "Editar Usuário" : "Novo Membro"}
          </h3>
          <button onClick={() => navigate("/usuarios")} className="btn btn-outline-secondary btn-sm">
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nome Completo</label>
              <input type="text" name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">CPF</label>
              <input 
                type="text" 
                name="cpf" 
                className="form-control" 
                value={form.cpf} 
                onChange={handleChange} 
                required={!id} 
                placeholder={id ? "Não alterável" : "000.000.000-00"} 
                disabled={!!id} 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">E-mail Corporativo</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Telefone</label>
              <input type="text" name="telefone" className="form-control" value={form.telefone} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Senha {id && <span className="text-muted fw-normal">(Vazio para manter)</span>}
              </label>
              <input 
                type="password" 
                name="senha" 
                className="form-control" 
                value={form.senha || ""} 
                onChange={handleChange} 
                required={!id} 
                placeholder="******"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Perfil de Acesso</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="USER">Usuário Comum</option>
                <option value="COORDENADOR_PORTA">Coordenador de Porta</option>
                <option value="REFEITORIO">Refeitório</option>
                <option value="COORDENADORA">Coordenadora de Ônibus</option>
                {isAdmin && <option value="ADMIN">Administrador</option>}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Ônibus Vinculado (Apenas para Coordenadoras)</label>
              <select 
                name="onibusId" 
                className="form-select" 
                value={form.onibusId || ""} 
                onChange={handleChange}
              >
                <option value="">Nenhum Ônibus</option>
                {onibus.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.nome} ({o.placa})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-light me-2" onClick={() => navigate("/usuarios")}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success px-4" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}