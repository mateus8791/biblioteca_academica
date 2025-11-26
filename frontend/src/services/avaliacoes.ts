// Serviço de API para avaliações
import api from './api';
import {
  Avaliacao,
  AvaliacoesResponse,
  CriarAvaliacaoData,
  CriarAvaliacaoResponse
} from '@/types/avaliacao';

/**
 * Busca todas as avaliações de um livro específico
 */
export const buscarAvaliacoesLivro = async (
  livroId: number,
  page: number = 1,
  limit: number = 10
): Promise<AvaliacoesResponse> => {
  try {
    const response = await api.get<AvaliacoesResponse>(
      `/livros/${livroId}/avaliacoes`,
      {
        params: { page, limit }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

/**
 * Cria uma nova avaliação para um livro
 */
export const criarAvaliacao = async (
  livroId: number,
  dados: CriarAvaliacaoData
): Promise<CriarAvaliacaoResponse> => {
  try {
    const response = await api.post<CriarAvaliacaoResponse>(
      `/livros/${livroId}/avaliacoes`,
      dados
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar avaliação:', error);

    if (error.response?.status === 409) {
      return {
        success: false,
        error: 'Você já avaliou este livro'
      };
    } else if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Você precisa estar logado para avaliar'
      };
    } else if (error.response?.status === 400) {
      return {
        success: false,
        error: error.response.data.error || 'Dados inválidos'
      };
    }

    return {
      success: false,
      error: 'Erro ao enviar avaliação. Tente novamente.'
    };
  }
};

/**
 * Atualiza uma avaliação existente
 */
export const atualizarAvaliacao = async (
  avaliacaoId: number,
  dados: CriarAvaliacaoData
): Promise<CriarAvaliacaoResponse> => {
  try {
    const response = await api.put<CriarAvaliacaoResponse>(
      `/avaliacoes/${avaliacaoId}`,
      dados
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return {
      success: false,
      error: 'Erro ao atualizar avaliação. Tente novamente.'
    };
  }
};

/**
 * Deleta uma avaliação
 */
export const deletarAvaliacao = async (avaliacaoId: number): Promise<boolean> => {
  try {
    await api.delete(`/avaliacoes/${avaliacaoId}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return false;
  }
};
