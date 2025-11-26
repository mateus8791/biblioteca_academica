'use client';

import React from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { LivroSwipe } from '@/services/comunidade';

interface CardSwipeLivroProps {
  livro: LivroSwipe;
  onSwipeLeft?: (livroId: string) => void;
  onSwipeRight?: (livroId: string) => void;
  onAvaliar?: (livro: LivroSwipe) => void;
}

const CardSwipeLivro: React.FC<CardSwipeLivroProps> = ({
  livro,
  onSwipeLeft,
  onSwipeRight,
  onAvaliar,
}) => {
  const renderEstrelas = (media: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <Star
            key={estrela}
            size={16}
            className={`${
              estrela <= Math.round(media)
                ? 'fill-accent-yellow-400 text-accent-yellow-400'
                : 'text-white/40'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Card Principal */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Lado Esquerdo - Imagem da Capa */}
          <div className="relative h-[600px] overflow-hidden">
            <img
              src={livro.capa_url || '/placeholder-book.png'}
              alt={livro.titulo}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Badge de Rating no Topo */}
            {livro.estatisticas && livro.estatisticas.total_avaliacoes > 0 && (
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2">
                {renderEstrelas(livro.estatisticas.media_notas)}
                <span className="text-white font-bold text-sm">
                  {livro.estatisticas.media_notas.toFixed(1)}
                </span>
              </div>
            )}

            {/* Botões de Ação sobre a Imagem - Parte Inferior */}
            <div className="absolute bottom-6 left-0 right-0 px-6">
              <div className="flex justify-center items-center gap-4">
                {/* Botão Não Curtir */}
                <button
                  onClick={() => onSwipeLeft?.(livro.id)}
                  className="group bg-white/90 hover:bg-red-500 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                  title="Não tenho interesse"
                >
                  <ThumbsDown
                    size={28}
                    className="text-red-500 group-hover:text-white transition-colors"
                    strokeWidth={2.5}
                  />
                </button>

                {/* Botão Avaliar */}
                <button
                  onClick={() => {
                    onAvaliar?.(livro);
                    // Avançar para o próximo livro ao abrir modal de avaliação
                    onSwipeRight?.(livro.id);
                  }}
                  className="group bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-full px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                  title="Escrever avaliação"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={24} className="text-white" strokeWidth={2.5} />
                    <span className="text-white font-bold text-sm">Avaliar</span>
                  </div>
                </button>

                {/* Botão Curtir */}
                <button
                  onClick={() => onSwipeRight?.(livro.id)}
                  className="group bg-white/90 hover:bg-green-500 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                  title="Quero ler"
                >
                  <ThumbsUp
                    size={28}
                    className="text-green-500 group-hover:text-white transition-colors"
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Lado Direito - Informações do Livro */}
          <div className="flex flex-col p-8 bg-gradient-to-br from-neutral-50 to-neutral-100">
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-neutral-900 mb-2 leading-tight">
                {livro.titulo}
              </h2>

              {/* Autores */}
              {livro.autores && (
                <p className="text-lg font-semibold text-neutral-600 mb-2">
                  por {livro.autores}
                </p>
              )}

              {/* Ano de Publicação */}
              {livro.ano_publicacao && (
                <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold border-2 border-primary-200">
                  📅 {livro.ano_publicacao}
                </span>
              )}
            </div>

            {/* Resumo IA */}
            <div className="flex-grow">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-neutral-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 mb-1 uppercase tracking-wide">
                      Resumo por IA
                    </h3>
                  </div>
                </div>
                <p className="text-base text-neutral-700 leading-relaxed">
                  {livro.resumo || 'Resumo não disponível.'}
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            {livro.estatisticas && livro.estatisticas.total_avaliacoes > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-neutral-200">
                <div className="flex items-center justify-center gap-2 text-neutral-600">
                  <Star size={20} className="fill-accent-yellow-400 text-accent-yellow-400" />
                  <p className="text-sm font-semibold">
                    <span className="font-black text-lg text-neutral-900">
                      {livro.estatisticas.total_avaliacoes}
                    </span>{' '}
                    {livro.estatisticas.total_avaliacoes === 1 ? 'pessoa avaliou' : 'pessoas avaliaram'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instruções */}
      <p className="text-center text-sm text-neutral-500 mt-6 font-medium">
        <span className="inline-flex items-center gap-2">
          <ThumbsDown size={16} className="text-red-500" />
          Não curtir
        </span>
        <span className="mx-4">•</span>
        <span className="inline-flex items-center gap-2">
          <MessageSquare size={16} className="text-primary-500" />
          Avaliar
        </span>
        <span className="mx-4">•</span>
        <span className="inline-flex items-center gap-2">
          <ThumbsUp size={16} className="text-green-500" />
          Curtir
        </span>
      </p>
    </div>
  );
};

export default CardSwipeLivro;
