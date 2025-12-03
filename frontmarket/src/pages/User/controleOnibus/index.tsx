import { useState, useEffect, useMemo } from 'react';
import { Bus, CheckCircle, XCircle, AlertCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Aluno, Parada, Onibus, RegistroRequest } from '../../../types/bolt';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { buscarOnibusPorId, buscarRotasDoOnibus, atualizarParadaAtual } from '../../../services/onibusService';
import { buscarAlunos, registrarEmbarque } from '../../../services/alunoService';

interface AlunoSimulado extends Aluno {
    statusEmbarque: 'aguardando' | 'embarcou' | 'faltou' | 'fora_padrao';
}

export default function ModuloCoordenadoraOnibus() {
  const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
  const onibusId = usuarioLogado?.onibusId;

  const [onibus, setOnibus] = useState<Onibus | null>(null);
  const [rota, setRota] = useState<Parada[]>([]);
  const [alunosGeral, setAlunosGeral] = useState<AlunoSimulado[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForaPadrao, setMostrarForaPadrao] = useState(false);
  const [foraPadraoData, setForaPadraoData] = useState({ alunoId: 0, nome: '', motivo: '' });

  const alunosDoMeuOnibus = useMemo(() => alunosGeral.filter(a => a.onibusId === onibus?.id), [alunosGeral, onibus]);
  const paradaAtualIndex = onibus?.paradaAtual || 0;
  const paradaAtual = rota.find(p => p.ordem === paradaAtualIndex + 1);
  const alunosDaParada = useMemo(() => paradaAtual ? alunosDoMeuOnibus.filter(a => a.paradaId === paradaAtual.id) : [], [alunosDoMeuOnibus, paradaAtual]);

  useEffect(() => {
    if (!onibusId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([buscarOnibusPorId(onibusId), buscarAlunos()]).then(([o, a]) => {
      setOnibus(o); setAlunosGeral(a as AlunoSimulado[]);
      buscarRotasDoOnibus(o.id).then(setRota);
    }).finally(() => setLoading(false));
  }, [onibusId]);

  const marcarStatusAluno = (aluno: AlunoSimulado, status: 'embarcou' | 'faltou') => {
    const registro: RegistroRequest = { alunoId: aluno.id, status };
    registrarEmbarque(registro).then(() => {
        setAlunosGeral(prev => prev.map(a => a.id === aluno.id ? { ...a, statusEmbarque: status } : a));
    });
  };

  const registrarForaPadrao = () => {
     alert(`Registrando: ${foraPadraoData.nome} - ${foraPadraoData.motivo}`);
     setMostrarForaPadrao(false);
     setForaPadraoData({ alunoId: 0, nome: '', motivo: '' });
  };

  const proximaParada = () => {
    if (!onibus) return;
    atualizarParadaAtual(onibus.id, paradaAtualIndex + 1).then(setOnibus);
  };

  if (loading) return <div>Carregando...</div>;
  if (!onibus) return <div>Sem acesso.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="card border-0 shadow-sm rounded p-4">
        <div className="d-flex justify-content-between mb-3">
          <h1>{onibus.nome}</h1>
          <p>Monitora: {usuarioLogado?.nome}</p>
        </div>
        <div className="row text-center">
            <div className="col"><div className="p-2 border rounded"><Bus/> {onibus.capacidadeMaxima} Cap.</div></div>
            <div className="col"><div className="p-2 border rounded">Parada {paradaAtualIndex + 1}/{rota.length}</div></div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded p-4">
        <div className="d-flex justify-content-between mb-4">
           <h3>{paradaAtual?.nome || 'Fim da Rota'}</h3>
           <button onClick={proximaParada} className="btn btn-primary"><ArrowRight/> Próxima</button>
        </div>
        
        {/* Estatisticas da Parada */}
        <div className="row text-center mb-3">
             <div className="col text-success"><CheckCircle/> {alunosDaParada.filter(a => a.statusEmbarque === 'embarcou').length}</div>
             <div className="col text-danger"><XCircle/> {alunosDaParada.filter(a => a.statusEmbarque === 'faltou').length}</div>
             <div className="col text-warning"><AlertCircle/> {alunosDaParada.filter(a => a.statusEmbarque === 'aguardando').length}</div>
        </div>

        {/* Lista Alunos */}
        <ul className="list-group">
            {alunosDaParada.map(aluno => (
                <li key={aluno.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {aluno.nomeCompleto}
                    <div>
                        {aluno.statusEmbarque === 'aguardando' ? (
                            <>
                                <button onClick={() => marcarStatusAluno(aluno, 'embarcou')} className="btn btn-sm btn-success me-2">Embarcou</button>
                                <button onClick={() => marcarStatusAluno(aluno, 'faltou')} className="btn btn-sm btn-danger">Faltou</button>
                            </>
                        ) : <span className="badge bg-secondary">{aluno.statusEmbarque}</span>}
                    </div>
                </li>
            ))}
        </ul>
      </div>
      
      <button onClick={() => setMostrarForaPadrao(true)} className="btn btn-warning w-100"><AlertTriangle/> Registrar Fora do Padrão</button>

      {mostrarForaPadrao && (
          <div className="modal d-block bg-black bg-opacity-50">
              <div className="modal-dialog"><div className="modal-content p-4">
                  <input className="form-control mb-2" placeholder="Nome" value={foraPadraoData.nome} onChange={e => setForaPadraoData({...foraPadraoData, nome: e.target.value})} />
                  <input className="form-control mb-2" placeholder="Motivo" value={foraPadraoData.motivo} onChange={e => setForaPadraoData({...foraPadraoData, motivo: e.target.value})} />
                  <button onClick={registrarForaPadrao} className="btn btn-primary">Registrar</button>
                  <button onClick={() => setMostrarForaPadrao(false)} className="btn btn-secondary mt-2">Cancelar</button>
              </div></div>
          </div>
      )}
    </div>
  );
}