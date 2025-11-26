'use client';

import React from 'react';
import { FaStar, FaHeart, FaComment } from 'react-icons/fa';
import { AvaliacaoLivro } from '@/services/comunidade';

interface CardAvaliacaoLivroProps {
  avaliacao: AvaliacaoLivro;
  onClick?: () => void;
}

const CardAvaliacaoLivro: React.FC<CardAvaliacaoLivroProps> = ({ avaliacao, onClick }) => {
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

  const renderEstrelas = (nota: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <FaStar
            key={estrela}
            size={16}
            className={`${
              estrela <= nota
                ? 'text-accent-yellow-400 fill-accent-yellow-400'
                : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md border-2 border-neutral-200 overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all cursor-pointer group"
    >
      {/* Header com Usuário e Livro */}
      <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center justify-between gap-4">
          {/* Usuário */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {avaliacao.usuario.foto_url ? (
              <img
                src={avaliacao.usuario.foto_url}
                alt={avaliacao.usuario.nome}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-white shadow-md flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {avaliacao.usuario.nome.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-neutral-900 truncate">
                {avaliacao.usuario.nome}
              </h4>
              <p className="text-xs text-neutral-600">
                {formatarData(avaliacao.data_criacao)}
              </p>
            </div>
          </div>

          {/* Capa do Livro */}
          {avaliacao.livro.capa_url && (
            <img
              src={avaliacao.livro.capa_url}
              alt={avaliacao.livro.titulo}
              className="w-16 h-24 object-cover rounded-lg shadow-lg flex-shrink-0 border-2 border-white group-hover:scale-105 transition-transform"
            />
          )}
        </div>
      </div>

      {/* Conteúdo da Avaliação */}
      <div className="p-4">
        {/* Título do Livro */}
        <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-1">
          {avaliacao.livro.titulo}
        </h3>

        {/* Nota */}
        <div className="flex items-center gap-2 mb-3">
          {renderEstrelas(avaliacao.nota)}
          <span className="text-sm font-bold text-neutral-700">{avaliacao.nota}.0</span>
        </div>

        {/* Comentário */}
        <p className="text-neutral-700 leading-relaxed line-clamp-3 mb-4">
          {avaliacao.comentario}
        </p>

        {/* Interações */}
        {avaliacao.interacoes && (
          <div className="flex items-center gap-4 pt-3 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-600">
              <FaHeart size={14} className="text-red-400" />
              <span className="text-sm font-semibold">
                {avaliacao.interacoes.total_curtidas}
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <FaComment size={14} className="text-primary-500" />
              <span className="text-sm font-semibold">
                {avaliacao.interacoes.total_respostas}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardAvaliacaoLivro;
