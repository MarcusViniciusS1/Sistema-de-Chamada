import React, { useEffect, useState } from 'react';
import { UserPlus, Save, X } from 'lucide-react';
import type { AlunoRequest, Parada } from '../../../types/bolt'; // <-- CORREÇÃO: import type
import { cadastrarAluno } from '../../../services/alunoService';
import { buscarParadas } from '../../../services/onibusService';

export default function CadastroAluno() {
  // const navigate = useNavigate(); // Removido pois não estava sendo usado na versão anterior
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const [aluno, setAluno] = useState<AlunoRequest>({
    idString: '',
    nomeCompleto: '',
    sexo: 'masculino',
    idade: 6,
    paradaId: 0,
    enderecoResidencial: '',
    tipoAlimentar: 'sem_restricao',
    alergia: '',
    deficiencia: '',
  });

  useEffect(() => {
    buscarParadas().then(setParadas).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (aluno.paradaId === 0) {
        alert("Selecione uma parada válida.");
        setLoading(false);
        return;
    }

    try {
      await cadastrarAluno({ ...aluno, paradaId: Number(aluno.paradaId) });
      setMostrarSucesso(true);
      
      setTimeout(() => {
        setMostrarSucesso(false);
        limparFormulario();
        setLoading(false);
      }, 3000);
      
    } catch (error: any) {
        console.error(error);
        const msg = error.response?.data || "Erro ao cadastrar aluno.";
        alert(typeof msg === "string" ? msg : JSON.stringify(msg));
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setAluno(prev => ({...prev, [name]: value as any}));
  };

  const limparFormulario = () => {
    setAluno({
      idString: '',
      nomeCompleto: '',
      sexo: 'masculino',
      idade: 6,
      paradaId: 0,
      enderecoResidencial: '',
      tipoAlimentar: 'sem_restricao',
      alergia: '',
      deficiencia: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card border-0 shadow-sm rounded p-6">
        <div className="d-flex align-items-center space-x-2 mb-4 border-bottom pb-3">
          <div className="p-2 bg-primary rounded">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl fw-bold text-dark mb-0">Cadastro de Aluno</h1>
            <p className="text-sm text-muted mb-0">Adicione um novo aluno ao sistema BOLT</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">ID do Aluno *</label>
              <input type="text" name="idString" value={aluno.idString} onChange={handleChange} className="form-control" placeholder="Ex: joao_001" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Nome Completo *</label>
              <input type="text" name="nomeCompleto" value={aluno.nomeCompleto} onChange={handleChange} className="form-control" placeholder="Digite o nome completo" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Sexo *</label>
              <select name="sexo" value={aluno.sexo} onChange={handleChange} className="form-select" required>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Idade *</label>
              <input type="number" name="idade" min="3" max="30" value={aluno.idade} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Parada de Embarque *</label>
              <select name="paradaId" value={aluno.paradaId} onChange={handleChange} className="form-select" required>
                <option value="0">Selecione uma parada</option>
                {paradas.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.onibusId ? `Onibus ID: ${p.onibusId}` : 'N/A'})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Tipo Alimentar *</label>
              <select name="tipoAlimentar" value={aluno.tipoAlimentar} onChange={handleChange} className="form-select" required>
                <option value="sem_restricao">Sem restrição</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="diabetico">Diabético</option>
                <option value="pastoso">Pastoso</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold text-dark small">Endereço Residencial *</label>
              <input type="text" name="enderecoResidencial" value={aluno.enderecoResidencial} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Alergias</label>
              <input type="text" name="alergia" value={aluno.alergia} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Deficiência</label>
              <input type="text" name="deficiencia" value={aluno.deficiencia} onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="d-flex gap-3 pt-4 border-top">
            <button type="button" onClick={limparFormulario} className="btn btn-light border">
              <X className="w-4 h-4 me-1" size={16} /> Limpar
            </button>
            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
              <Save className="w-4 h-4 me-1" size={16} /> {loading ? "Cadastrando..." : "Cadastrar Aluno"}
            </button>
          </div>
        </form>

        {mostrarSucesso && (
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <div className="w-14 h-14 bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '50px', height: '50px'}}>
                    <Save className="w-7 h-7 text-white" size={24} />
                  </div>
                  <h3 className="text-lg fw-bold text-dark mb-2">Aluno Cadastrado!</h3>
                  <p className="text-sm text-muted">O aluno foi adicionado com sucesso ao sistema.</p>
                  <button type="button" className="btn btn-success mt-3" onClick={() => setMostrarSucesso(false)}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}