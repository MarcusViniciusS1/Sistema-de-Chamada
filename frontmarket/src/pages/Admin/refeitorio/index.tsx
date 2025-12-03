import { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import type { Aluno } from '../../../types/bolt';
import { buscarAlunos } from '../../../services/alunoService';

export default function ModuloRefeitorio() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
      buscarAlunos().then(setAlunos).catch(console.error);
  }, []);

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
         <h3><ChefHat className="me-2"/>Refeitório</h3>
         <p>Total de alunos presentes: {alunos.filter(a => a.statusEmbarque === 'embarcou').length}</p>
      </div>
    </div>
  );
}