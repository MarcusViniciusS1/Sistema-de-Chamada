import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buscarOnibus, deletarOnibus } from "../../../services/onibusService";
import type { Onibus } from "../../../types/bolt"; // <-- CORREÇÃO
import { Bus, Trash2, Edit } from "lucide-react";

export default function ListaOnibus() {
  // ... (restante do código igual)
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await buscarOnibus();
      setOnibus(dados);
    } catch (error) {
      console.error("Erro ao carregar ônibus");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (window.confirm("⚠️ Atenção: Excluir um ônibus removerá todas as rotas e causará inconsistência nos alunos vinculados. Tem certeza?")) {
      try {
        await deletarOnibus(id);
        alert("Ônibus excluído com sucesso!");
        carregar();
      } catch (error) {
        alert("Erro ao excluir ônibus.");
      }
    }
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Gestão de Ônibus</h3>
          <p className="text-muted mb-0">Cadastro e administração dos veículos da APAE.</p>
        </div>
        <Link to="/onibus/novo" className="btn btn-primary shadow-sm px-4 py-2 d-flex align-items-center">
          <Bus className="me-2" size={18} />
          Novo Ônibus
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3">ID</th>
                  <th>Nome / Placa</th>
                  <th>Motorista</th>
                  <th>Capacidade</th>
                  <th>Paradas</th>
                  <th>Acessibilidade</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-5 text-muted">Carregando...</td></tr>
                ) : onibus.length > 0 ? (
                  onibus.map((o) => (
                    <tr key={o.id}>
                      <td className="ps-4 fw-bold text-secondary">#{o.id}</td>
                      <td className="fw-bold text-dark">
                          {o.nome} <span className="text-muted small">({o.placa})</span>
                      </td>
                      <td>{o.motorista}</td>
                      <td>{o.capacidadeMaxima}</td>
                      <td>{o.quantidadeParadas}</td>
                      <td>
                          <span className={`badge bg-${o.suporteDeficiencia ? 'success' : 'secondary'}`}>
                              {o.suporteDeficiencia ? 'Sim' : 'Não'}
                          </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button onClick={() => navigate(`/onibus/${o.id}/editar`)} className="btn btn-sm btn-outline-secondary px-3 d-flex align-items-center">
                            <Edit size={16} className="me-1" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(o.id)} 
                            className="btn btn-sm btn-outline-danger px-3 d-flex align-items-center"
                          >
                            <Trash2 size={16} className="me-1" /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center py-5 text-muted">Nenhum ônibus cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}