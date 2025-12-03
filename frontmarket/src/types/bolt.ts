// Tipos e interfaces do sistema BOLT
export interface Aluno {
  id: number;
  idString: string;
  nomeCompleto: string;
  sexo: 'masculino' | 'feminino';
  idade: number;
  paradaId: number;
  paradaNome: string;
  onibusId: number;
  onibusNome: string;
  enderecoResidencial: string;
  tipoAlimentar: 'sem_restricao' | 'vegetariano' | 'diabetico' | 'pastoso' | 'outro';
  alergia?: string;
  deficiencia?: string;
  statusEmbarque: 'aguardando' | 'embarcou' | 'faltou' | 'fora_padrao';
}

export interface AlunoRequest {
  idString: string;
  nomeCompleto: string;
  sexo: 'masculino' | 'feminino';
  idade: number;
  paradaId: number;
  enderecoResidencial: string;
  tipoAlimentar: 'sem_restricao' | 'vegetariano' | 'diabetico' | 'pastoso' | 'outro';
  alergia: string;
  deficiencia: string;
}

export interface Parada {
  id: number;
  idString: string; 
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  ordem: number;
  onibusId: number;
  alunosEsperados: number;
}

export interface ParadaDetalheRequest {
    nome: string;
    endereco: string;
    latitude: number;
    longitude: number;
}

export interface Onibus {
  id: number;
  idString: string;
  nome: string;
  motorista: string;
  placa: string;
  cor: string;
  quantidadeParadas: number; 
  capacidadeMaxima: number;
  suporteDeficiencia: boolean;
  paradaAtual: number; 
  rota?: Parada[];
}

export interface OnibusRequest {
    idString: string;
    nome: string;
    motorista: string;
    placa: string;
    cor: string;
    capacidadeMaxima: number;
    suporteDeficiencia: boolean;
    rota: ParadaDetalheRequest[];
}

export interface RegistroRequest {
    alunoId: number;
    status: 'embarcou' | 'faltou' | 'fora_padrao';
    motivo?: string;
}

export interface RegistroEmbarque {
  id: number;
  alunoNome: string;
  status: 'embarcou' | 'faltou' | 'fora_padrao';
  timestamp: string;
  motivo?: string;
  paradaNome: string;
}// Tipos e interfaces do sistema BOLT
export interface Aluno {
  id: number;
  idString: string;
  nomeCompleto: string;
  sexo: 'masculino' | 'feminino';
  idade: number;
  paradaId: number;
  paradaNome: string;
  onibusId: number;
  onibusNome: string;
  enderecoResidencial: string;
  tipoAlimentar: 'sem_restricao' | 'vegetariano' | 'diabetico' | 'pastoso' | 'outro';
  alergia?: string;
  deficiencia?: string;
  statusEmbarque: 'aguardando' | 'embarcou' | 'faltou' | 'fora_padrao';
}

export interface AlunoRequest {
  idString: string;
  nomeCompleto: string;
  sexo: 'masculino' | 'feminino';
  idade: number;
  paradaId: number;
  enderecoResidencial: string;
  tipoAlimentar: 'sem_restricao' | 'vegetariano' | 'diabetico' | 'pastoso' | 'outro';
  alergia: string;
  deficiencia: string;
}

export interface Parada {
  id: number;
  idString: string; 
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  ordem: number;
  onibusId: number;
  alunosEsperados: number;
}

export interface ParadaDetalheRequest {
    nome: string;
    endereco: string;
    latitude: number;
    longitude: number;
}

export interface Onibus {
  id: number;
  idString: string;
  nome: string;
  motorista: string;
  placa: string;
  cor: string;
  quantidadeParadas: number; 
  capacidadeMaxima: number;
  suporteDeficiencia: boolean;
  paradaAtual: number; 
  rota?: Parada[];
}

export interface OnibusRequest {
    idString: string;
    nome: string;
    motorista: string;
    placa: string;
    cor: string;
    capacidadeMaxima: number;
    suporteDeficiencia: boolean;
    rota: ParadaDetalheRequest[];
}

export interface RegistroRequest {
    alunoId: number;
    status: 'embarcou' | 'faltou' | 'fora_padrao';
    motivo?: string;
}

export interface RegistroEmbarque {
  id: number;
  alunoNome: string;
  status: 'embarcou' | 'faltou' | 'fora_padrao';
  timestamp: string;
  motivo?: string;
  paradaNome: string;
}