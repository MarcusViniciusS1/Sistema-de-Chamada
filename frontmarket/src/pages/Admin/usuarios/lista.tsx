import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { buscarUsuariosDaEquipe, deletarUsuario, type Usuario } from "../../../services/usuarioService";
import type { RootState } from "../../../redux/store";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const userRole = useSelector((state: RootState) => state.auth.usuario?.role);

  // Regra: Apenas Admin e Coordenadora podem gerenciar membros
  const podeGerenciar = userRole === 'ADMIN' || userRole === 'COORDENADORA';
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    carregarEquipe();
  }, []);

  async function carregarEquipe() {
    try {
      // Usa o novo endpoint de listagem inteligente
      const dados = await buscarUsuariosDaEquipe();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao carregar equipe:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!isAdmin) return; // Só ADMIN pode deletar
    
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await deletarUsuario(id);
        alert("Usuário removido!");
        carregarEquipe();
      } catch (error) {
        console.error(error);
        alert("Erro: Você não tem permissão ou ocorreu um erro no servidor.");
      }
    }
  }

  // Helpers visuais
  function getBadgeColor(role: string) {
      if (role === 'ADMIN') return 'bg-danger';
      if (role === 'COORDENADORA') return 'bg-primary';
      if (role === 'REFEITORIO') return 'bg-success';
      if (role === 'COORDENADOR_PORTA') return 'bg-warning';
      return 'bg-secondary';
  }

  function getRoleName(role: string) {
      if (role === 'ADMIN') return 'Administrador';
      if (role === 'COORDENADORA') return 'Coordenadora';
      if (role === 'REFEITORIO') return 'Refeitório';
      if (role === 'COORDENADOR_PORTA') return 'Portaria';
      return 'Funcionário';
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Gestão de Equipe BOLT</h3>
          <p className="text-muted mb-0">Membros com acesso à plataforma.</p>
        </div>
        
        {/* Botão Adicionar: Só aparece para Admin e Coordenadora */}
        {podeGerenciar && (
          <Link to="/usuarios/novo" className="btn btn-primary shadow-sm d-flex align-items-center px-4 py-2">
            <i className="bi bi-person-plus-fill me-2"></i> Adicionar Membro
          </Link>
        )}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3">Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Ônibus ID</th>
                  {podeGerenciar && <th className="text-end pe-4">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={podeGerenciar ? 5 : 4} className="text-center py-5 text-muted">Carregando...</td></tr>
                ) : usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 fw-bold">{u.nome}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 ${getBadgeColor(u.role)}`}>
                          {getRoleName(u.role)}
                        </span>
                      </td>
                      <td>{u.onibusId || 'N/A'}</td>
                      
                      {podeGerenciar && (
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-2">
                            <button onClick={() => navigate(`/usuarios/${u.id}/editar`)} className="btn btn-sm btn-outline-secondary px-3">
                              Editar
                            </button>
                            {isAdmin && (
                                <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-outline-danger px-3">
                                    Excluir
                                </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                   <tr><td colSpan={podeGerenciar ? 5 : 4} className="text-center py-5 text-muted">Nenhum membro encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}