import React, { useState, useMemo, useEffect } from 'react';
import { ChefHat, Users, AlertTriangle, Filter } from 'lucide-react';
import { Aluno } from '../../../types/bolt';
import { buscarAlunos } from '../../../services/alunoService';

export default function ModuloRefeitorio() {
  const [filtroTipoAlimentar, setFiltroTipoAlimentar] = useState('todos');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarAlunos().then(setAlunos).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Filtra apenas alunos que embarcaram (estão na escola)
  const alunosPresentes = useMemo(() => {
    return alunos.filter(a => a.statusEmbarque === 'embarcou');
  }, [alunos]);

  const resumoAlimentar = useMemo(() => {
    const resumo = {
      sem_restricao: 0,
      vegetariano: 0,
      diabetico: 0,
      pastoso: 0,
      outro: 0,
      total: 0
    } as any; // Usando any para facilitar o acesso por string

    alunosPresentes.forEach(aluno => {
      resumo[aluno.tipoAlimentar] = (resumo[aluno.tipoAlimentar] || 0) + 1;
      resumo.total++;
    });

    return resumo;
  }, [alunosPresentes]);

  const alunosFiltrados = useMemo(() => {
    if (filtroTipoAlimentar === 'todos') {
      return alunosPresentes;
    }
    return alunosPresentes.filter(a => a.tipoAlimentar === filtroTipoAlimentar);
  }, [alunosPresentes, filtroTipoAlimentar]);

  const alunosComRestricoes = useMemo(() => {
    return alunosPresentes.filter(a => a.alergia || a.deficiencia || a.tipoAlimentar !== 'sem_restricao');
  }, [alunosPresentes]);

  const getStatusColorClass = (tipoAlimentar: string) => {
    switch (tipoAlimentar) {
      case 'sem_restricao': return 'border-success bg-success-subtle';
      case 'vegetariano': return 'border-info bg-info-subtle';
      case 'diabetico': return 'border-danger bg-danger-subtle';
      case 'pastoso': return 'border-primary bg-primary-subtle';
      default: return 'border-secondary bg-secondary-subtle';
    }
  };

  const getBadgeClass = (tipoAlimentar: string) => {
    switch (tipoAlimentar) {
      case 'sem_restricao': return 'bg-success text-white';
      case 'vegetariano': return 'bg-info text-dark';
      case 'diabetico': return 'bg-danger text-white';
      case 'pastoso': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  };

  if (loading) {
      return <div className="text-center p-5">Carregando dados do refeitório...</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="card border-0 shadow-sm rounded p-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 bg-warning rounded">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl fw-bold text-dark mb-0">Módulo Refeitório</h1>
            <p className="text-sm text-muted mb-0">Controle alimentar dos alunos presentes</p>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Card Total Presentes */}
        <div className="col-2">
            <div className="card border-2 border-primary rounded p-3 text-center h-100">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" size={24} />
              <p className="text-2xl fw-bold text-primary mb-0">{resumoAlimentar.total}</p>
              <p className="text-xs text-dark fw-bold mb-0">Total Presentes</p>
            </div>
        </div>
        
        {/* Cards por Tipo de Dieta */}
        {Object.keys(resumoAlimentar).filter(k => k !== 'total').map(tipo => (
             <div className="col-2" key={tipo}>
                <div className={`card border-2 ${getStatusColorClass(tipo)} rounded p-3 text-center h-100`}>
                  <ChefHat className="w-6 h-6 text-dark mx-auto mb-1" size={24} style={{opacity: 0.5}} />
                  <p className="text-2xl fw-bold text-dark mb-0">{resumoAlimentar[tipo]}</p>
                  <p className="text-xs text-dark fw-bold mb-0">{tipo.replace('_', ' ').charAt(0).toUpperCase() + tipo.replace('_', ' ').slice(1)}</p>
                </div>
            </div>
        ))}

        {/* Card Restrições Especiais */}
        <div className="col-2">
            <div className="card border-2 border-danger rounded p-3 text-center h-100">
              <AlertTriangle className="w-6 h-6 text-danger mx-auto mb-1" size={24} />
              <p className="text-2xl fw-bold text-danger mb-0">{alunosComRestricoes.length}</p>
              <p className="text-xs text-dark fw-bold mb-0">Com Restrições</p>
            </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded p-4">
        <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-3">
          <Filter className="w-5 h-5 text-muted" size={18} />
          <h2 className="text-base fw-bold text-dark mb-0">Filtrar por Tipo Alimentar</h2>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroTipoAlimentar('todos')}
            className={`btn btn-sm px-4 fw-bold ${filtroTipoAlimentar === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            Todos ({resumoAlimentar.total})
          </button>
          {Object.keys(resumoAlimentar).filter(k => k !== 'total').map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipoAlimentar(tipo)}
                className={`btn btn-sm px-4 fw-bold ${filtroTipoAlimentar === tipo ? getBadgeClass(tipo) : 'btn-outline-secondary'}`}
              >
                {tipo.replace('_', ' ').charAt(0).toUpperCase() + tipo.replace('_', ' ').slice(1)} ({resumoAlimentar[tipo]})
              </button>
          ))}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded p-4">
        <h2 className="text-base fw-bold text-dark mb-3">
          Lista de Alunos Presentes
          {filtroTipoAlimentar !== 'todos' && ` - ${filtroTipoAlimentar.replace('_', ' ').charAt(0).toUpperCase() + filtroTipoAlimentar.replace('_', ' ').slice(1)}`}
          <span className="text-muted"> ({alunosFiltrados.length})</span>
        </h2>

        {alunosFiltrados.length === 0 ? (
          <p className="text-muted text-center py-4 text-sm">
            Nenhum aluno presente com este filtro.
          </p>
        ) : (
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '450px' }}>
            {alunosFiltrados.map(aluno => (
              <div
                key={aluno.id}
                className={`p-3 rounded border-2 ${getStatusColorClass(aluno.tipoAlimentar)}`}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="fw-bold text-dark text-sm mb-0">{aluno.nomeCompleto}</h3>
                      <span className={`badge rounded-pill px-3 ${getBadgeClass(aluno.tipoAlimentar)}`}>
                        {aluno.tipoAlimentar.replace('_', ' ').charAt(0).toUpperCase() + aluno.tipoAlimentar.replace('_', ' ').slice(1)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-1 text-sm">
                      <span className="text-dark fw-medium">
                        {aluno.sexo === 'masculino' ? 'M' : 'F'} &bull; {aluno.idade} anos
                      </span>

                      {aluno.alergia && (
                        <span className="badge bg-warning-subtle text-warning">
                          Alergia: {aluno.alergia}
                        </span>
                      )}

                      {aluno.deficiencia && (
                        <span className="badge bg-primary-subtle text-primary">
                          {aluno.deficiencia}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {alunosComRestricoes.length > 0 && (
        <div className="card border-0 shadow-sm rounded p-4">
          <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
            <AlertTriangle className="w-5 h-5 text-danger" size={18} />
            <h2 className="text-base fw-bold text-dark mb-0">
              Atenção Especial ({alunosComRestricoes.length} alunos)
            </h2>
          </div>

          <div className="bg-danger-subtle border-2 border-danger rounded p-3">
            <p className="text-danger fw-bold mb-2 text-sm">
              Alunos que requerem cuidados especiais na alimentação:
            </p>

            <div className="space-y-2">
              {alunosComRestricoes.map(aluno => (
                <div key={aluno.id} className="d-flex align-items-center justify-content-between p-2 bg-white border-2 border-secondary rounded">
                  <span className="fw-bold text-dark text-sm">{aluno.nomeCompleto}</span>
                  <div className="d-flex gap-2">
                    {aluno.alergia && (
                      <span className="badge bg-danger-subtle text-danger">
                        Alergia: {aluno.alergia}
                      </span>
                    )}
                    {aluno.deficiencia && (
                      <span className="badge bg-primary-subtle text-primary">
                        {aluno.deficiencia}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}