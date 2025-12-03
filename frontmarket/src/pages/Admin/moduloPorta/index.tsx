import React, { useState, useEffect } from 'react';
import { Shield, Search, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import type { Aluno } from '../../../types/bolt';

export default function ModuloPorta() {
  const [alunoId, setAlunoId] = useState('');
  const [loading, setLoading] = useState(false);
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
    // Hook de inicialização
  }, []);

  // MOCK para simular busca
  async function buscarAlunoSimulado(id: string): Promise<Aluno | undefined> {
      const localAlunos: Aluno[] = [
          { id: 1, idString: 'joao_001', nomeCompleto: 'João Pedro Silva', sexo: 'masculino', idade: 8, paradaId: 1, paradaNome: 'Centro', onibusId: 1, onibusNome: 'Esperança', enderecoResidencial: 'Rua Flores', tipoAlimentar: 'sem_restricao', statusEmbarque: 'aguardando' },
          { id: 2, idString: 'maria_002', nomeCompleto: 'Maria Clara Santos', sexo: 'feminino', idade: 10, paradaId: 1, paradaNome: 'Centro', onibusId: 1, onibusNome: 'Esperança', enderecoResidencial: 'Av Brasil', tipoAlimentar: 'vegetariano', alergia: 'Lactose', statusEmbarque: 'aguardando' }
      ];
      return localAlunos.find(a => a.idString === id || a.nomeCompleto.toLowerCase().includes(id.toLowerCase()));
  }

  const verificarAluno = async () => {
    if (!alunoId.trim()) return;

    setLoading(true);
    const aluno = await buscarAlunoSimulado(alunoId);
    const agora = new Date().toLocaleTimeString('pt-BR');

    if (!aluno) {
      // CORREÇÃO: Usando 'tipo' em vez de 'type'
      setResultado({ tipo: 'nao_encontrado', mensagem: `Aluno "${alunoId}" não encontrado.` });
      setHistorico(prev => [...prev, { aluno: alunoId, hora: agora, status: 'erro' }]);
    } else {
        const jaPresente = historico.some(h => h.aluno === aluno.nomeCompleto && h.status === 'presente');
        if (aluno.statusEmbarque === 'embarcou' || jaPresente) {
            // CORREÇÃO: Usando 'tipo'
            setResultado({ tipo: 'ja_presente', aluno, mensagem: `${aluno.nomeCompleto} já está presente.` });
            setHistorico(prev => [...prev, { aluno: aluno.nomeCompleto, hora: agora, status: 'ja_presente' }]);
        } else {
            // CORREÇÃO: Usando 'tipo'
            setResultado({ tipo: 'sucesso', aluno, mensagem: `Entrada de ${aluno.nomeCompleto} registrada.` });
            setHistorico(prev => [...prev, { aluno: aluno.nomeCompleto, hora: agora, status: 'presente' }]);
        }
    }
    setAlunoId('');
    setLoading(false);
    // CORREÇÃO: Usando 'tipo'
    setTimeout(() => setResultado({ tipo: null, mensagem: '' }), 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') verificarAluno();
  };

  // Helper para ícones do histórico
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente': return <CheckCircle className="text-success" size={18} />;
      case 'ja_presente': return <AlertCircle className="text-warning" size={18} />;
      case 'erro': return <XCircle className="text-danger" size={18} />;
      default: return <Clock className="text-muted" size={18} />;
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center space-x-2 mb-4 border-bottom pb-3">
          <Shield className="w-6 h-6 text-primary me-2" />
          <div>
            <h1 className="text-xl fw-bold text-dark mb-0">Módulo da Porta</h1>
            <p className="text-sm text-muted mb-0">Controle de entrada</p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-4 text-center p-3 bg-success-subtle border border-success rounded">
             <p className="text-xl fw-bold text-success mb-0">{historico.filter(h => h.status === 'presente').length}</p>
             <p className="text-xs fw-bold text-dark mb-0">Entradas</p>
          </div>
          <div className="col-4 text-center p-3 bg-warning-subtle border border-warning rounded">
             <p className="text-xl fw-bold text-warning mb-0">{historico.filter(h => h.status === 'ja_presente').length}</p>
             <p className="text-xs fw-bold text-dark mb-0">Já presentes</p>
          </div>
          <div className="col-4 text-center p-3 bg-danger-subtle border border-danger rounded">
             <p className="text-xl fw-bold text-danger mb-0">{historico.filter(h => h.status === 'erro').length}</p>
             <p className="text-xs fw-bold text-dark mb-0">Erros</p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm rounded p-4 mt-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-base fw-bold text-dark mb-4">Verificar Aluno</h2>
        <div className="d-flex gap-2">
            <input 
                className="form-control" 
                placeholder="Digite ID ou Nome" 
                value={alunoId} 
                onChange={e => setAlunoId(e.target.value)} 
                onKeyPress={handleKeyPress}
                autoFocus 
            />
            <button className="btn btn-primary d-flex align-items-center" onClick={verificarAluno} disabled={loading || !alunoId.trim()}>
                <Search size={18} className="me-2"/> Verificar
            </button>
        </div>

        {resultado.tipo && (
             <div className={`mt-3 p-3 rounded border ${resultado.tipo === 'sucesso' ? 'bg-success-subtle border-success' : resultado.tipo === 'ja_presente' ? 'bg-warning-subtle border-warning' : 'bg-danger-subtle border-danger'}`}>
                 <p className="fw-bold mb-0">{resultado.mensagem}</p>
             </div>
        )}

        <div className="mt-4">
          <h2 className="text-base fw-bold text-dark mb-3">Histórico</h2>
          <div className="space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {historico.slice().reverse().map((r, i) => (
                <div key={i} className="p-3 rounded border d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    {getStatusIcon(r.status)}
                    <span className="fw-bold">{r.aluno}</span>
                  </div>
                  <span className="text-muted small">{r.hora}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}