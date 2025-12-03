import React, { useEffect, useState, useMemo } from 'react';
import { Bus, Users, AlertTriangle, CheckCircle, ChefHat, Shield } from 'lucide-react';
import { buscarAlunos } from '../../../services/alunoService';
import { buscarOnibus } from '../../../services/onibusService';
import { Aluno, Onibus } from '../../../types/bolt';

export default function Dashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      buscarAlunos(), 
      buscarOnibus()  
    ]).then(([alunosData, onibusData]) => {
      setAlunos(alunosData);
      setOnibus(onibusData);
    }).catch(error => {
        console.error("Erro ao carregar dados do sistema:", error);
    }).finally(() => setLoading(false));
  }, []);

  const totalAlunos = alunos.length;
  const alunosEmbarcados = useMemo(() => alunos.filter(a => a.statusEmbarque === 'embarcou').length, [alunos]);
  const alunosFaltaram = useMemo(() => alunos.filter(a => a.statusEmbarque === 'faltou').length, [alunos]);
  const alunosAguardando = useMemo(() => totalAlunos - alunosEmbarcados - alunosFaltaram, [totalAlunos, alunosEmbarcados, alunosFaltaram]);
  
  const alunosComRestricao = useMemo(() => 
    alunos.filter(a => a.statusEmbarque === 'embarcou' && (a.alergia || a.deficiencia || a.tipoAlimentar !== 'sem_restricao'))
  , [alunos]);


  const KpiCard = ({ title, value, Icon, color, bgColor }: any) => (
    <div className="col-md-3">
      <div className="card h-100 p-4 border-0 shadow-sm">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-xs fw-bold text-muted mb-1">{title}</p>
            <h3 className="fw-bold text-dark mb-0" style={{ color: color }}>{value}</h3>
          </div>
          <div className={`p-3 rounded-circle`} style={{ backgroundColor: bgColor }}>
            <Icon className="w-6 h-6" size={24} style={{ color: color }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-5">Carregando dados do sistema...</div>;
  }
  
  const alunosAguardandoComponent = alunos
      .filter(a => a.statusEmbarque === 'aguardando')
      .slice(0, 5) 
      .map(aluno => (
          <div key={aluno.id} className="p-2 bg-yellow-100 border-2 border-yellow-300 rounded mb-2">
              <p className="font-bold text-sm text-gray-800">{aluno.nomeCompleto}</p>
              <p className="text-xs text-muted">Ônibus: {aluno.onibusNome || 'N/A'}</p>
          </div>
      ));

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-white border-2 border-gray-300 rounded p-4 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Dashboard - Sistema de Chamada BOLT
        </h2>
        <p className="text-gray-600 text-sm">
          Acompanhamento em tempo real do transporte e refeitório
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="row g-4 mb-4">
        <KpiCard title="Total de Alunos" value={totalAlunos} Icon={Users} color="#3b82f6" bgColor="#eff6ff" />
        <KpiCard title="Embarcaram" value={alunosEmbarcados} Icon={CheckCircle} color="#10b981" bgColor="#ecfdf5" />
        <KpiCard title="Faltaram" value={alunosFaltaram} Icon={AlertTriangle} color="#ef4444" bgColor="#fef2f2" />
        <KpiCard title="Aguardando" value={alunosAguardando} Icon={Bus} color="#f59e0b" bgColor="#fffbeb" />
      </div>
      
      <div className="row g-4">
        
        {/* Coluna 1: Status dos Ônibus */}
        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 h-100">
                <h3 className="text-lg fw-bold text-gray-800 mb-3">Status dos Ônibus ({onibus.length})</h3>
                <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {onibus.length === 0 ? (
                        <p className="text-center text-muted py-3">Nenhum ônibus cadastrado no sistema.</p>
                    ) : (
                        onibus.map((bus) => {
                            const progresso = (bus.paradaAtual / bus.quantidadeParadas) * 100;
                            const alunosPresentes = alunos.filter(a => a.statusEmbarque === 'embarcou' && a.onibusId === bus.id).length;
                            const alunosTotais = alunos.filter(a => a.onibusId === bus.id).length;

                            return (
                                <div key={bus.id} className="border-2 border-gray-300 bg-light rounded p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h4 className="fw-bold text-gray-800">{bus.nome} ({bus.placa})</h4>
                                        <p className="text-xs text-muted">Motorista: {bus.motorista}</p>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-1">
                                        Alunos: {alunosPresentes} / {alunosTotais} (Capacidade: {bus.capacidadeMaxima})
                                    </p>
                                    <div className="w-100 bg-gray-300 rounded h-2">
                                      <div className="bg-primary h-2 rounded" style={{ width: `${progresso}%` }}></div>
                                    </div>
                                    <p className="text-xs text-muted mt-1">
                                      Próxima Parada: Parada {bus.paradaAtual} / {bus.quantidadeParadas}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>

        {/* Coluna 2: Alunos em Destaque */}
        <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 mb-4">
                <h3 className="text-lg fw-bold text-danger mb-3 d-flex align-items-center">
                    <AlertTriangle className="w-5 h-5 me-2" size={20} />
                    Restrições Alimentares ({alunosComRestricao.length})
                </h3>
                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '200px' }}>
                    {alunosComRestricao.length === 0 ? (
                        <p className="text-center text-muted py-3">Nenhum aluno presente com restrições.</p>
                    ) : (
                        alunosComRestricao.map(aluno => (
                            <div key={aluno.id} className="p-2 bg-orange-50 border-2 border-orange-300 rounded">
                                <p className="fw-bold text-sm text-gray-800">{aluno.nomeCompleto}</p>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {aluno.alergia && <span className="badge bg-danger-subtle text-danger">Alergia: {aluno.alergia}</span>}
                                    {aluno.deficiencia && <span className="badge bg-primary-subtle text-primary">Deficiência: {aluno.deficiencia}</span>}
                                    {aluno.tipoAlimentar !== 'sem_restricao' && <span className="badge bg-warning-subtle text-warning">Dieta: {aluno.tipoAlimentar}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <div className="card border-0 shadow-sm p-4">
                <h3 className="text-lg fw-bold text-dark mb-3 d-flex align-items-center">
                    <Shield className="w-5 h-5 me-2" size={20} />
                    Próximos a Embarcar ({alunosAguardando})
                </h3>
                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '200px' }}>
                    {alunosAguardando === 0 ? (
                        <p className="text-center text-muted py-3">Todos os alunos esperados embarcaram.</p>
                    ) : (
                        alunosAguardandoComponent
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}