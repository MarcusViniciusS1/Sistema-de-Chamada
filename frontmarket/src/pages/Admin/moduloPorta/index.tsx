import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Search, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { buscarAlunos, buscarAlunoPorIdString } from '../../../services/alunoService';
import { Aluno } from '../../../types/bolt';

// NOTE: Para simular o funcionamento sem um endpoint de registro, estamos apenas atualizando
// a lista de alunos local. Em produção, buscarAlunoPorIdString precisaria retornar o status atualizado.

const ModuloPorta: React.FC = () => {
  const [alunoId, setAlunoId] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [resultado, setResultado] = useState<{
    tipo: 'sucesso' | 'ja_presente' | 'nao_encontrado' | null;
    aluno?: Aluno;
    mensagem: string;
  }>({ tipo: null, mensagem: '' });

  const [historico, setHistorico] = useState<{
    aluno: string;
    hora: string;
    status: 'presente' | 'ja_presente' | 'erro';
  }[]>([]);

  useEffect(() => {
    // Em produção, buscarAlunos aqui traria a lista inicial, mas manteremos o estado simples
    // para a simulação de marcar presença.
    // buscarAlunos().then(setAlunos); 
  }, []);
  
  // MOCK: Para simular o comportamento de buscar o aluno no DB/API
  async function buscarAlunoSimulado(id: string): Promise<Aluno | undefined> {
      try {
          // Em um projeto real, faria uma chamada:
          // return await buscarAlunoPorIdString(id); 
          
          // MOCK SIMPLIFICADO: Simula busca em dados internos para manter a funcionalidade.
          const localAlunos: Aluno[] = [
             { id: 1, idString: 'joao_001', nomeCompleto: 'João Pedro Silva', sexo: 'masculino', idade: 8, paradaId: 1, paradaNome: 'Centro', onibusId: 1, onibusNome: 'Esperança', enderecoResidencial: 'Rua Flores', tipoAlimentar: 'sem_restricao', statusEmbarque: 'aguardando' },
             { id: 2, idString: 'maria_002', nomeCompleto: 'Maria Clara Santos', sexo: 'feminino', idade: 10, paradaId: 1, paradaNome: 'Centro', onibusId: 1, onibusNome: 'Esperança', enderecoResidencial: 'Av Brasil', tipoAlimentar: 'vegetariano', alergia: 'Lactose', statusEmbarque: 'aguardando' }
          ];

          return localAlunos.find(a => 
              a.idString === id || 
              a.nomeCompleto.toLowerCase().includes(id.toLowerCase())
          );
      } catch {
          return undefined;
      }
  }


  const verificarAluno = async () => {
    if (!alunoId.trim()) return;

    setLoading(true);
    const aluno = await buscarAlunoSimulado(alunoId); // MOCK: buscará o aluno

    const agora = new Date().toLocaleTimeString('pt-BR');

    if (!aluno) {
      setResultado({
        tipo: 'nao_encontrado',
        mensagem: `Aluno "${alunoId}" não encontrado no sistema.`
      });
      setHistorico(prev => [...prev, {
        aluno: alunoId,
        hora: agora,
        status: 'erro'
      }]);
    } else {
        // MOCK: Simula a busca no histórico local para evitar chamadas de estado complexas
        const jaPresenteNoHistorico = historico.some(h => h.aluno === aluno.nomeCompleto && h.status === 'presente');

        if (aluno.statusEmbarque === 'embarcou' || jaPresenteNoHistorico) {
            setResultado({
                tipo: 'ja_presente',
                aluno,
                mensagem: `${aluno.nomeCompleto} já está marcado como presente (Via Ônibus ou Porta).`
            });
            setHistorico(prev => [...prev, {
                aluno: aluno.nomeCompleto,
                hora: agora,
                status: 'ja_presente'
            }]);
        } else {
            // Sucesso: Marcar como presente (API CALL necessária em produção)
            // Em produção: chamar a API de registro de embarque/porta
            // Ex: await registrarEmbarque({ alunoId: aluno.id, status: 'embarcou', motivo: 'Porta' });

            aluno.statusEmbarque = 'embarcou'; // Apenas para simular a mudança de estado visual
            setResultado({
                tipo: 'sucesso',
                aluno,
                mensagem: `${aluno.nomeCompleto} marcado como presente com sucesso!`
            });
            setHistorico(prev => [...prev, {
                aluno: aluno.nomeCompleto,
                hora: agora,
                status: 'presente'
            }]);
        }
    }

    setAlunoId('');
    setLoading(false);
    
    // Limpar resultado após 5 segundos
    setTimeout(() => {
      setResultado({ tipo: null, mensagem: '' });
    }, 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verificarAluno();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'ja_presente':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'erro':
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return <Clock className="w-5 h-5 text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente':
        return 'bg-success-subtle border-success';
      case 'ja_presente':
        return 'bg-warning-subtle border-warning';
      case 'erro':
        return 'bg-danger-subtle border-danger';
      default:
        return 'bg-light border-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center space-x-2 mb-4 border-bottom pb-3">
          <div className="p-2 bg-primary rounded">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl fw-bold text-dark mb-0">Módulo da Porta</h1>
            <p className="text-sm text-muted mb-0">Controle de entrada dos alunos na escola</p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="text-center p-3 bg-success-subtle border-2 border-success rounded">
              <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
              <p className="text-xl fw-bold text-success mb-0">
                {historico.filter(h => h.status === 'presente').length}
              </p>
              <p className="text-xs text-dark fw-bold mb-0">Presenças hoje</p>
            </div>
          </div>
          <div className="col-4">
            <div className="text-center p-3 bg-warning-subtle border-2 border-warning rounded">
              <AlertCircle className="w-6 h-6 text-warning mx-auto mb-1" />
              <p className="text-xl fw-bold text-warning mb-0">
                {historico.filter(h => h.status === 'ja_presente').length}
              </p>
              <p className="text-xs text-dark fw-bold mb-0">Já presentes</p>
            </div>
          </div>
          <div className="col-4">
            <div className="text-center p-3 bg-danger-subtle border-2 border-danger rounded">
              <XCircle className="w-6 h-6 text-danger mx-auto mb-1" />
              <p className="text-xl fw-bold text-danger mb-0">
                {historico.filter(h => h.status === 'erro').length}
              </p>
              <p className="text-xs text-dark fw-bold mb-0">Erros</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm rounded p-4 mt-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-base fw-bold text-dark mb-4">Verificar Aluno</h2>

        <div className="d-flex space-x-3 mb-4">
          <div className="flex-grow-1">
            <label className="form-label fw-bold text-dark small">
              ID ou Nome do Aluno
            </label>
            <input
              type="text"
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-control p-3"
              placeholder="Digite o ID ou nome do aluno"
              autoFocus
            />
          </div>
          <button
            onClick={verificarAluno}
            disabled={!alunoId.trim() || loading}
            className="btn btn-primary d-flex align-items-center fw-bold mt-4"
            style={{ height: '50px' }}
          >
            <Search className="w-5 h-5 me-2" size={18} />
            <span>{loading ? 'Buscando...' : 'Verificar'}</span>
          </button>
        </div>

        {resultado.tipo && (
          <div className={`p-4 rounded border-2 ${
            resultado.tipo === 'sucesso' ? 'bg-success-subtle border-success' :
            resultado.tipo === 'ja_presente' ? 'bg-warning-subtle border-warning' :
            'bg-danger-subtle border-danger'
          }`}>
            <div className="d-flex align-items-center gap-3">
              {resultado.tipo === 'sucesso' && <CheckCircle className="w-6 h-6 text-success" size={24} />}
              {resultado.tipo === 'ja_presente' && <AlertCircle className="w-6 h-6 text-warning" size={24} />}
              {resultado.tipo === 'nao_encontrado' && <XCircle className="w-6 h-6 text-danger" size={24} />}

              <div>
                <p className={`text-base fw-bold mb-0 ${
                  resultado.tipo === 'sucesso' ? 'text-success' :
                  resultado.tipo === 'ja_presente' ? 'text-warning' :
                  'text-danger'
                }`}>
                  {resultado.mensagem}
                </p>

                {resultado.aluno && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-dark mb-0">
                      **Idade:** {resultado.aluno.idade} anos &bull; **Sexo:** {resultado.aluno.sexo}
                    </p>
                    <p className="text-sm text-dark mb-0">
                      **Alimentação:** {resultado.aluno.tipoAlimentar}
                      {resultado.aluno.alergia && ` &bull; Alergia: ${resultado.aluno.alergia}`}
                    </p>
                    {resultado.aluno.deficiencia && (
                      <p className="text-sm text-dark mb-0">
                        **Necessidade especial:** {resultado.aluno.deficiencia}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-light border-2 border-secondary rounded">
          <h3 className="fw-bold text-primary mb-2 text-sm">Dicas de Uso:</h3>
          <ul className="text-xs text-dark space-y-1 mb-0">
            <li>• Digite o ID completo do aluno (ex: joao_001)</li>
            <li>• Ou digite parte do nome completo</li>
            <li>• Pressione Enter ou clique em Verificar</li>
            <li>• O sistema marcará automaticamente a presença na porta</li>
          </ul>
        </div>
      </div>

      <div className="card shadow-sm rounded p-4 mt-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-base fw-bold text-dark mb-3">Histórico de Hoje</h2>

        {historico.length === 0 ? (
          <p className="text-muted text-center py-4 text-sm">Nenhum registro ainda hoje.</p>
        ) : (
          <div className="space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {historico.slice().reverse().map((registro, index) => (
              <div
                key={index}
                className={`p-3 rounded border-2 ${getStatusColor(registro.status)} d-flex align-items-center justify-content-between`}
              >
                <div className="d-flex align-items-center gap-2">
                  {getStatusIcon(registro.status)}
                  <span className="fw-bold text-dark text-sm">{registro.aluno}</span>
                </div>
                <span className="text-xs text-dark fw-bold">{registro.hora}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}