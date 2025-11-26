// Serviço de API para funcionalidades de Comunidade
import api from './api';

// =====================================================
// INTERFACES - USUÁRIOS ATIVOS
// =====================================================

export interface UsuarioAtivo {
  id: string;
  nome: string;
  foto_url: string | null;
  online: boolean;
  ultima_atividade?: string;
}

export interface UsuariosAtivosResponse {
  success: boolean;
  data: {
    usuarios: UsuarioAtivo[];
    total_online: number;
  };
}

// =====================================================
// INTERFACES - AUTORES
// =====================================================

export interface Autor {
  id: string;
  nome: string;
  biografia?: string;
  foto_url?: string;
  nacionalidade?: string;
  data_nascimento?: string;
  estatisticas?: {
    total_avaliacoes: number;
    media_notas: number;
    total_livros: number;
  };
}

export interface AvaliacaoAutor {
  id: number;
  autor_id: string;
  usuario_id: string;
  nota: number;
  comentario: string;
  data_criacao: string;
  usuario: {
    id: string;
    nome: string;
    foto_url?: string;
  };
  interacoes?: {
    total_curtidas: number;
    total_respostas: number;
  };
}

export interface LivroAutor {
  id: string;
  titulo: string;
  capa_url?: string;
  ano_publicacao?: number;
}

// =====================================================
// INTERFACES - SWIPE
// =====================================================

export interface LivroSwipe {
  id: string;
  titulo: string;
  capa_url?: string;
  ano_publicacao?: number;
  autores?: string;
  resumo?: string;
  estatisticas?: {
    media_notas: number;
    total_avaliacoes: number;
  };
}

// =====================================================
// INTERFACES - RESPOSTAS
// =====================================================

export interface RespostaComentario {
  id: number;
  tipo_comentario: 'livro' | 'autor';
  comentario_id: number;
  usuario_id: string;
  texto: string;
  data_criacao: string;
  usuario: {
    id: string;
    nome: string;
    foto_url?: string;
  };
}

// =====================================================
// INTERFACES - RESPONSES
// =====================================================

export interface AutoresResponse {
  success: boolean;
  data: {
    autores: Autor[];
    paginacao: {
      pagina_atual: number;
      total_paginas: number;
      total_itens: number;
    };
  };
}

export interface AutorDetalhesResponse {
  success: boolean;
  data: {
    autor: Autor;
    avaliacoes: AvaliacaoAutor[];
    livros: LivroAutor[];
  };
}

export interface LivrosSwipeResponse {
  success: boolean;
  data: {
    livros: LivroSwipe[];
  };
}

export interface CurtidasResponse {
  success: boolean;
  data: {
    total_curtidas: number;
    curtido_por_usuario: boolean;
  };
}

export interface RespostasResponse {
  success: boolean;
  data: {
    respostas: RespostaComentario[];
  };
}

// =====================================================
// FUNÇÕES - USUÁRIOS ATIVOS
// =====================================================

/**
 * Busca usuários ativos/online baseado em access_logs
 */
export const buscarUsuariosAtivos = async (limit: number = 20): Promise<UsuariosAtivosResponse> => {
  try {
    const response = await api.get<UsuariosAtivosResponse>(`/comunidade/usuarios-ativos?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários ativos:', error);
    throw error;
  }
};

// =====================================================
// FUNÇÕES - AUTORES
// =====================================================

/**
 * Busca todos os autores com estatísticas
 */
export const buscarAutores = async (page: number = 1, limit: number = 20): Promise<AutoresResponse> => {
  try {
    const response = await api.get<AutoresResponse>(`/comunidade/autores?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um autor específico
 */
export const buscarAutor = async (id: string): Promise<AutorDetalhesResponse> => {
  try {
    const response = await api.get<AutorDetalhesResponse>(`/comunidade/autores/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar autor:', error);
    throw error;
  }
};

/**
 * Cria uma avaliação para um autor
 */
export const avaliarAutor = async (
  autorId: string,
  nota: number,
  comentario: string
): Promise<{ success: boolean; data: { avaliacao: AvaliacaoAutor } }> => {
  try {
    const response = await api.post(`/comunidade/autores/${autorId}/avaliacoes`, {
      nota,
      comentario,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao avaliar autor:', error);
    throw error;
  }
};

// =====================================================
// FUNÇÕES - SWIPE (Descoberta de Livros)
// =====================================================

/**
 * Busca livros para a funcionalidade de swipe/descoberta
 */
export const buscarLivrosSwipe = async (limit: number = 10): Promise<LivrosSwipeResponse> => {
  try {
    const response = await api.get<LivrosSwipeResponse>(`/comunidade/livros/swipe?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros para swipe:', error);
    throw error;
  }
};

// =====================================================
// FUNÇÕES - CURTIDAS
// =====================================================

/**
 * Curtir ou descurtir um comentário
 */
export const curtirComentario = async (
  tipo: 'livro' | 'autor',
  comentarioId: number
): Promise<{ success: boolean; data: { curtido: boolean; mensagem: string } }> => {
  try {
    const response = await api.post(`/comunidade/comentarios/${tipo}/${comentarioId}/curtir`);
    return response.data;
  } catch (error) {
    console.error('Erro ao curtir comentário:', error);
    throw error;
  }
};

/**
 * Buscar curtidas de um comentário
 */
export const buscarCurtidas = async (
  tipo: 'livro' | 'autor',
  comentarioId: number
): Promise<CurtidasResponse> => {
  try {
    const response = await api.get<CurtidasResponse>(
      `/comunidade/comentarios/${tipo}/${comentarioId}/curtidas`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar curtidas:', error);
    throw error;
  }
};

// =====================================================
// FUNÇÕES - RESPOSTAS
// =====================================================

/**
 * Criar resposta a um comentário
 */
export const responderComentario = async (
  tipo: 'livro' | 'autor',
  comentarioId: number,
  texto: string
): Promise<{ success: boolean; data: { resposta: RespostaComentario } }> => {
  try {
    const response = await api.post(`/comunidade/comentarios/${tipo}/${comentarioId}/respostas`, {
      texto,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao responder comentário:', error);
    throw error;
  }
};

/**
 * Buscar respostas de um comentário
 */
export const buscarRespostas = async (
  tipo: 'livro' | 'autor',
  comentarioId: number
): Promise<RespostasResponse> => {
  try {
    const response = await api.get<RespostasResponse>(
      `/comunidade/comentarios/${tipo}/${comentarioId}/respostas`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    throw error;
  }
};

// =====================================================
// INTERFACES - AVALIAÇÕES DE LIVROS
// =====================================================

export interface AvaliacaoLivro {
  id: number;
  livro_id: string;
  usuario_id: string;
  nota: number;
  comentario: string;
  data_criacao: string;
  usuario: {
    id: string;
    nome: string;
    foto_url?: string;
  };
  livro: {
    id: string;
    titulo: string;
    capa_url?: string;
  };
  interacoes?: {
    total_curtidas: number;
    total_respostas: number;
  };
}

export interface AvaliacoesLivrosResponse {
  success: boolean;
  data: {
    avaliacoes: AvaliacaoLivro[];
  };
}

export interface EstatisticasComunidade {
  total_usuarios: number;
  total_livros: number;
  total_avaliacoes: number;
  usuarios_online: number;
}

export interface EstatisticasResponse {
  success: boolean;
  data: EstatisticasComunidade;
}

// =====================================================
// FUNÇÕES - AVALIAÇÕES DE LIVROS
// =====================================================

/**
 * Busca avaliações recentes de livros
 */
export const buscarAvaliacoesLivros = async (limit: number = 20): Promise<AvaliacoesLivrosResponse> => {
  try {
    const response = await api.get<AvaliacoesLivrosResponse>(`/comunidade/livros/avaliacoes?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliações de livros:', error);
    throw error;
  }
};

/**
 * Criar avaliação de livro
 */
export const avaliarLivro = async (
  livroId: string,
  nota: number,
  comentario: string
): Promise<{ success: boolean; data: { avaliacao: AvaliacaoLivro } }> => {
  try {
    const response = await api.post(`/comunidade/livros/${livroId}/avaliacoes`, {
      nota,
      comentario,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao avaliar livro:', error);
    throw error;
  }
};

/**
 * Buscar estatísticas da comunidade
 */
export const buscarEstatisticas = async (): Promise<EstatisticasResponse> => {
  try {
    const response = await api.get<EstatisticasResponse>('/comunidade/estatisticas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};
