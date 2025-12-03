import api from "./api";
import { Onibus, OnibusRequest, Parada, ParadaDetalheRequest } from "../types/bolt";

export async function buscarOnibus(): Promise<Onibus[]> {
  const response = await api.get<Onibus[]>("/onibus");
  return response.data;
}

export async function buscarOnibusPorId(id: number | string): Promise<Onibus> {
  const response = await api.get<Onibus>(`/onibus/${id}`);
  return response.data;
}

export async function buscarRotasDoOnibus(id: number | string): Promise<Parada[]> {
  const response = await api.get<Parada[]>(`/onibus/${id}/rotas`);
  return response.data;
}

export async function salvarOnibus(data: OnibusRequest, id?: number): Promise<Onibus> {
  const payload = {
      ...data,
      rota: data.rota as ParadaDetalheRequest[]
  };
    
  if (id) {
    const response = await api.put<Onibus>(`/onibus/${id}`, payload);
    return response.data;
  }
  const response = await api.post<Onibus>("/onibus/cadastro", payload);
  return response.data;
}

export async function atualizarParadaAtual(id: number, novaParadaIndex: number): Promise<Onibus> {
    const response = await api.put<Onibus>(`/onibus/${id}/paradaAtual?index=${novaParadaIndex}`);
    return response.data;
}

export async function deletarOnibus(id: number): Promise<void> {
  await api.delete(`/onibus/${id}`);
}

export async function buscarParadas(): Promise<Parada[]> {
  // Rota auxiliar para cadastro de alunos
  const response = await api.get<Parada[]>("/paradas"); 
  return response.data;
}