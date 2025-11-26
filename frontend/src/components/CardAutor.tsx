'use client';

import React from 'react';
import { Star, BookOpen, MessageSquare, User } from 'lucide-react';
import { Autor } from '@/services/comunidade';

interface CardAutorProps {
  autor: Autor;
  onClick?: () => void;
}

const CardAutor: React.FC<CardAutorProps> = ({ autor, onClick }) => {
  const renderEstrelas = (media: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <Star
            key={estrela}
            size={14}
            className={`${
              estrela <= Math.round(media)
                ? 'fill-accent-yellow-500 text-accent-yellow-500'
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
      className="group bg-white rounded-2xl shadow-md border-2 border-neutral-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:border-primary-400 transition-all duration-300 cursor-pointer"
    >
      {/* Foto do Autor */}
      <div className="relative h-56 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {autor.foto_url ? (
          <img
            src={autor.foto_url}
            alt={autor.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300">
            <User size={80} className="text-white opacity-50" />
          </div>
        )}

        {/* Badge de Nacionalidade */}
        {autor.nacionalidade && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-lg">
            {autor.nacionalidade}
          </div>
        )}

        {/* Overlay de Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Informações do Autor */}
      <div className="p-5">
        {/* Nome */}
        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {autor.nome}
        </h3>

        {/* Biografia (Preview) */}
        {autor.biografia && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
            {autor.biografia}
          </p>
        )}

        {/* Estatísticas */}
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderEstrelas(autor.estatisticas?.media_notas || 0)}
              <span className="text-sm font-bold text-neutral-700">
                {autor.estatisticas?.media_notas?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              {autor.estatisticas?.total_avaliacoes || 0} avaliações
            </span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {/* Livros */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-2.5 flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg">
                <BookOpen size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Livros</p>
                <p className="text-lg font-black text-primary-700">
                  {autor.estatisticas?.total_livros || 0}
                </p>
              </div>
            </div>

            {/* Avaliações */}
            <div className="bg-gradient-to-br from-accent-yellow-50 to-accent-yellow-100 rounded-lg p-2.5 flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg">
                <MessageSquare size={16} className="text-accent-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Reviews</p>
                <p className="text-lg font-black text-accent-yellow-700">
                  {autor.estatisticas?.total_avaliacoes || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="mt-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-2.5 rounded-xl font-bold text-sm group-hover:from-primary-600 group-hover:to-primary-700 transition-all shadow-lg group-hover:shadow-xl">
            Ver Detalhes
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardAutor;
