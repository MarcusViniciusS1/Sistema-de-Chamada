// Adaptação de ModuloCoordenadoraOnibus.tsx (Base do BOLT)
import React, { useState, useEffect, useMemo } from 'react';
import { Bus, CheckCircle, XCircle, AlertCircle, MapPin, Users, ArrowRight, AlertTriangle } from 'lucide-react';
import { Aluno, Parada, Onibus, RegistroEmbarque, RegistroRequest } from '../../../types/bolt';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { buscarOnibusPorId, buscarRotasDoOnibus, atualizarParadaAtual } from '../../../services/onibusService';
import { buscarAlunosDoOnibus, marcarStatusAluno } from '../../../services/alunoService';

export default function ModuloCoordenadoraOnibus() {
  const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
  const onibusId = usuarioLogado?.onibusId;

  const [onibus, setOnibus] = useState<Onibus | null>(null);
  const [rota, setRota] = useState<Parada[]>([]);
  const [alunosOnibus, setAlunosOnibus] = useState<Aluno[]>([]);
  const [paradaAtualIndex, setParadaAtualIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!onibusId) return;

    setLoading(true);
    Promise.all([
      buscarOnibusPorId(onibusId),
      buscarAlunosDoOnibus(onibusId)
    ]).then(([onibusData, alunosData]) => {
      setOnibus(onibusData);
      setParadaAtualIndex(onibusData.paradaAtual || 0);

      // Busca a rota separadamente (API deve retornar a rota)
      buscarRotasDoOnibus(onibusId).then(rotaData => {
          setOnibus(prev => prev ? ({...prev, rota: rotaData}) : null);
          setRota(rotaData);
      }).catch(console.error);
      
      setAlunosOnibus(alunosData);
      
    }).catch(error => {
      console.error("Erro ao carregar dados do ônibus:", error);
    }).finally(() => setLoading(false));

  }, [onibusId]);

  const paradaAtual = rota[paradaAtualIndex];

  const alunosDaParada = useMemo(() => {
      if (!paradaAtual) return [];
      return alunosOnibus.filter(a => a.paradaId === paradaAtual.id);
  }, [alunosOnibus, paradaAtual]);


  const marcarPresenca = (aluno: Aluno, status: 'embarcou' | 'faltou', motivo?: string) => {
    // Implementação da chamada de API para registro e atualização de status
    // É necessário um endpoint para marcar o status do aluno e criar um registro.
    // Simulação:
    aluno.statusEmbarque = status;
    setAlunosOnibus([...alunosOnibus]); // Força re-render

    // Exemplo de payload para API (não implementado no backend ainda, mas necessário)
    // const registro: RegistroRequest = {
    //     alunoId: aluno.id,
    //     status: status,
    //     motivo: motivo
    // };
    // marcarStatusAluno(registro); 
  };

  const proximaParada = () => {
    if (onibus && paradaAtualIndex < onibus.quantidadeParadas - 1) {
      const novoIndex = paradaAtualIndex + 1;
      setParadaAtualIndex(novoIndex);
      // Aqui deveria chamar a API para atualizar a parada atual do ônibus
      // atualizarParadaAtual(onibus.id, novoIndex);
    }
  };

  // ... (funções paradaAnterior, getStatusAluno, etc.)

  if (!onibus || loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border rounded p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Carregando Módulo</h2>
          <p className="text-gray-600">{onibusId ? "Carregando dados do ônibus..." : "Você não está associada a nenhum ônibus."}</p>
        </div>
      </div>
    );
  }

  // ... (Restante da UI adaptada de ModuloCoordenadoraOnibus.tsx com os novos dados)
}