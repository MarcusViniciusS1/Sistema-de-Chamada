import api from "./api";

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    role?: string;
    onibusId?: number; // Corrigido
    nome?: string;
}

export async function LoginNovo(loginRequest : LoginRequest): Promise<LoginResponse>{
    const response = await api.post<LoginResponse>( "/auth/login", loginRequest); 
    return response.data;
}