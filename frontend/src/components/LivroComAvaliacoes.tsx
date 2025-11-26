'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { buscarAvaliacoesLivro } from '@/services/avaliacoes';
import { Avaliacao } from '@/types/avaliacao';
import { LivroLido } from '@/services/livros';
import AvaliacaoModal from './AvaliacaoModal';

interface LivroComAvaliacoesProps {
  livro: LivroLido;
  onAvaliacaoCriada: () => void;
}

const LivroComAvaliacoes: React.FC<LivroComAvaliacoesProps> = ({
  livro,
  onAvaliacaoCriada
}) => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState<boolean>(false);
  const [mostrandoAvaliacoes, setMostrandoAvaliacoes] = useState<boolean>(false);
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  const carregarAvaliacoes = async () => {
    setLoadingAvaliacoes(true);
    try {
      const response = await buscarAvaliacoesLivro(livro.id, 1, 5);
      if (response.success) {
        setAvaliacoes(response.data.avaliacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  useEffect(() => {
    if (mostrandoAvaliacoes && avaliacoes.length === 0) {
      carregarAvaliacoes();
    }
  }, [mostrandoAvaliacoes]);

  const renderEstrelas = (nota: number, tamanho: number = 16) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <Star
            key={estrela}
            size={tamanho}
            className={`${
              estrela <= nota
                ? 'fill-accent-yellow-500 text-accent-yellow-500'
                : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffEmMs = agora.getTime() - data.getTime();
    const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    if (diffEmDias === 0) return 'Hoje';
    if (diffEmDias === 1) return 'Ontem';
    if (diffEmDias < 7) return `${diffEmDias} dias atrás`;
    if (diffEmDias < 30) return `${Math.floor(diffEmDias / 7)} semanas atrás`;

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleAvaliacaoSuccess = () => {
    carregarAvaliacoes();
    onAvaliacaoCriada();
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
      {/* Card Principal do Livro */}
      <div className="p-6 bg-gradient-to-br from-white via-neutral-50 to-primary-50/30">
        <div className="flex gap-6">
          {/* Capa do Livro */}
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
            <img
              src={livro.capa_url || '/placeholder-book.png'}
              alt={livro.titulo}
              className="relative w-32 h-44 object-cover rounded-lg shadow-xl ring-2 ring-white group-hover:shadow-2xl transition-shadow duration-300"
            />
            {/* Badge de Status */}
            {livro.minha_avaliacao ? (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Star size={12} className="fill-white" />
                Avaliado
              </div>
            ) : (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                Avaliar
              </div>
            )}
          </div>

          {/* Informações do Livro */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              {livro.titulo}
            </h3>
            <p className="text-base text-neutral-600 mb-4 font-medium">{livro.autor}</p>

            {/* Estatísticas da Comunidade com Cards Coloridos */}
            {livro.estatisticas && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-700 font-semibold mb-1">AVALIAÇÃO MÉDIA</p>
                      <div className="flex items-center gap-2">
                        {renderEstrelas(Math.round(parseFloat(livro.estatisticas.media_notas)), 16)}
                        <span className="text-lg font-bold text-blue-900">
                          {livro.estatisticas.media_notas}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-700 font-semibold mb-1">TOTAL DE AVALIAÇÕES</p>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-purple-600" />
                        <span className="text-lg font-bold text-purple-900">
                          {livro.estatisticas.total_avaliacoes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Minha Avaliação ou Botão para Avaliar */}
            {livro.minha_avaliacao ? (
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-green-800 tracking-wider bg-green-200 px-3 py-1 rounded-full">
                    ✓ MINHA AVALIAÇÃO
                  </span>
                  <div className="flex items-center gap-1">
                    {renderEstrelas(livro.minha_avaliacao.nota, 18)}
                  </div>
                </div>
                <p className="text-sm text-neutral-800 line-clamp-2 leading-relaxed">
                  {livro.minha_avaliacao.comentario}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setModalAberto(true)}
                className="bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 hover:from-primary-600 hover:via-primary-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Star size={18} className="fill-white" />
                Avaliar este livro agora
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Avaliações da Comunidade */}
      <div className="border-t-2 border-neutral-200 bg-gradient-to-br from-neutral-50 to-slate-50">
        <button
          onClick={() => setMostrandoAvaliacoes(!mostrandoAvaliacoes)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 transition-all duration-300 group/btn"
        >
          <div className="flex items-center gap-3 text-neutral-800 group-hover/btn:text-primary-700 transition-colors">
            <div className="bg-gradient-to-br from-primary-100 to-purple-100 p-2 rounded-lg group-hover/btn:from-primary-200 group-hover/btn:to-purple-200 transition-colors">
              <MessageSquare size={20} className="text-primary-600 group-hover/btn:text-primary-700" />
            </div>
            <span className="font-bold text-base">
              Avaliações da comunidade
              {livro.estatisticas && livro.estatisticas.total_avaliacoes > 0 && (
                <span className="ml-2 text-sm text-neutral-500">
                  ({livro.estatisticas.total_avaliacoes})
                </span>
              )}
            </span>
          </div>
          {mostrandoAvaliacoes ? (
            <ChevronUp size={24} className="text-primary-500 group-hover/btn:scale-110 transition-transform" />
          ) : (
            <ChevronDown size={24} className="text-neutral-400 group-hover/btn:scale-110 group-hover/btn:text-primary-500 transition-all" />
          )}
        </button>

        {/* Lista de Avaliações */}
        {mostrandoAvaliacoes && (
          <div className="px-6 pb-6 pt-2">
            {loadingAvaliacoes ? (
              <div className="text-center py-12 text-neutral-600">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
                <p className="mt-4 text-base font-medium">Carregando avaliações...</p>
              </div>
            ) : avaliacoes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-neutral-300">
                <MessageSquare size={56} className="text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-700 text-base font-semibold mb-1">
                  Nenhuma avaliação ainda
                </p>
                <p className="text-neutral-500 text-sm">
                  Seja o primeiro a compartilhar sua opinião!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao, index) => (
                  <div
                    key={avaliacao.id}
                    className="bg-white rounded-xl p-5 shadow-md border border-neutral-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {avaliacao.usuario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-base">
                            {avaliacao.usuario.nome}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                            {formatarData(avaliacao.data_criacao)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-br from-amber-50 to-yellow-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                        {renderEstrelas(avaliacao.nota, 16)}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                      {avaliacao.comentario}
                    </p>
                  </div>
                ))}

                {livro.estatisticas && livro.estatisticas.total_avaliacoes > 5 && (
                  <button
                    onClick={carregarAvaliacoes}
                    className="w-full text-center text-base bg-gradient-to-r from-primary-50 to-purple-50 hover:from-primary-100 hover:to-purple-100 border-2 border-primary-200 hover:border-primary-300 text-primary-700 hover:text-primary-800 font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Ver todas as {livro.estatisticas.total_avaliacoes} avaliações
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Avaliação */}
      <AvaliacaoModal
        livroId={livro.id}
        tituloLivro={livro.titulo}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleAvaliacaoSuccess}
      />
    </div>
  );
};

export default LivroComAvaliacoes;
