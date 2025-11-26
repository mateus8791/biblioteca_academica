import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { EstatisticasComunidade } from '@/services/comunidade';

interface ProgressSectionProps {
  estatisticas: EstatisticasComunidade;
}

export default function ProgressSection({ estatisticas }: ProgressSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Card Principal com Gradiente */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Lado Esquerdo - Ícone e Texto */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              <FaTrophy size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black mb-2">Seu Progresso</h2>
              <p className="text-purple-100 text-lg font-medium">Continue avaliando para subir de nível!</p>
            </div>
          </div>

          {/* Lado Direito - Cards de Estatísticas */}
          <div className="grid grid-cols-2 gap-5">
            {/* Card Avaliações */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className="text-5xl font-black mb-2">{estatisticas.total_avaliacoes}</p>
              <p className="text-sm text-purple-100 font-bold uppercase tracking-wider">Avaliações Totais</p>
            </div>

            {/* Card Livros */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
              <p className="text-5xl font-black mb-2">{estatisticas.total_livros}</p>
              <p className="text-sm text-purple-100 font-bold uppercase tracking-wider">Livros Disponíveis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
