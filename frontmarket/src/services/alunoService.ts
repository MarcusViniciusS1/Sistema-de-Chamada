import api from "./api";
import { Aluno, AlunoRequest, RegistroRequest, RegistroEmbarque } from "../types/bolt";

export async function buscarAlunos(): Promise<Aluno[]> {
  const response = await api.get<Aluno[]>("/alunos");
  return response.data;
}

export async function buscarAlunosDoOnibus(onibusId: number | string): Promise<Aluno[]> {
  const response = await api.get<Aluno[]>(`/alunos/onibus/${onibusId}`);
  return response.data;
}

export async function buscarAlunoPorIdString(idString: string): Promise<Aluno> {
  const response = await api.get<Aluno>(`/alunos/idstring/${idString}`);
  return response.data;
}

export async function cadastrarAluno(data: AlunoRequest): Promise<Aluno> {
  const response = await api.post<Aluno>("/alunos", data);
  return response.data;
}

export async function registrarEmbarque(data: RegistroRequest): Promise<RegistroEmbarque> {
    const response = await api.post<RegistroEmbarque>("/registros/embarque", data);
    return response.data;
}