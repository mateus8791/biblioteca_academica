// Serviço de API para livros lidos pelo usuário
import api from './api';

export interface LivroLido {
  id: number;
  titulo: string;
  autor: string;
  capa_url?: string;
  isbn?: string;
  data_leitura?: string;
  minha_avaliacao?: {
    id: number;
    nota: number;
    comentario: string;
    data_criacao: string;
  };
  estatisticas?: {
    media_notas: string;
    total_avaliacoes: number;
  };
}

export interface LivrosLidosResponse {
  success: boolean;
  data: {
    livros: LivroLido[];
    total: number;
  };
}

export const buscarMeusLivrosLidos = async (): Promise<LivrosLidosResponse> => {
  try {
    const response = await api.get<LivrosLidosResponse>('/usuarios/meus-livros-lidos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros lidos:', error);
    throw error;
  }
};
