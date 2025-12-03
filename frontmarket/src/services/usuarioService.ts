import api from "./api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone: string;
  onibusId?: number; 
}

export interface UsuarioRequest {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  senha?: string;
  role: string;
  telefone: string;
  onibusId?: number; 
}

export interface UsuarioRequestEdicao {
  id?: number;
  nome: string;
  cpf?: string;
  email: string;
  role?: string;
  telefone: string;
  onibusId?: number;
}

export interface RecuperarSenhaDto {
  email: string;
}

export interface RegistrarNovaSenhaDto {
  email: string;
  senha: string;
  token: string;
}

export async function buscarUsuariosDaEquipe(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>("/usuarios/equipe"); 
  return response.data;
}

export async function buscarUsuarioLogado(): Promise<Usuario> {
  const response = await api.get<Usuario>("/usuarios/me");
  return response.data;
}

export async function buscarUsuarioPorId(id: number | string): Promise<Usuario> {
  const response = await api.get<Usuario>(`/usuarios/${id}`);
  return response.data;
}

export async function cadastrarUsuario(usuario: UsuarioRequest): Promise<Usuario> {
  const payload = {
      ...usuario,
      onibusId: usuario.onibusId ? Number(usuario.onibusId) : undefined
  };
  const response = await api.post<Usuario>("/usuarios", payload);
  return response.data;
}

export async function editarUsuario(usuario: UsuarioRequestEdicao): Promise<Usuario> {
    const payload = {
      ...usuario,
      onibusId: usuario.onibusId ? Number(usuario.onibusId) : undefined
  };
  const response = await api.put<Usuario>("/usuarios/editar", payload); 
  return response.data;
}

export async function deletarUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`); 
}

export async function recuperarSenha(data: RecuperarSenhaDto): Promise<void> {
  await api.post("/auth/esquecisenha", data);
}

export async function registrarNovaSenha(data: RegistrarNovaSenhaDto): Promise<void> {
  await api.post("/auth/registrarnovasenha", data);
}