import React from 'react';
import { IoSparkles } from 'react-icons/io5';
import { FaFire } from 'react-icons/fa';
import { LivroSwipe } from '@/services/comunidade';
import CardSwipeLivro from '@/components/CardSwipeLivro';

interface DiscoverySectionProps {
  livroAtual: LivroSwipe | undefined;
  livroAtualIndex: number;
  totalLivros: number;
  loading: boolean;
  error: string;
  onSwipeLeft: (livroId: string) => void;
  onSwipeRight: (livroId: string) => void;
  onAvaliar: (livro: LivroSwipe) => void;
  onReload: () => void;
}

export default function DiscoverySection({
  livroAtual,
  livroAtualIndex,
  totalLivros,
  loading,
  error,
  onSwipeLeft,
  onSwipeRight,
  onAvaliar,
  onReload,
}: DiscoverySectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl">
          <IoSparkles size={28} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-neutral-900">Descubra Novos Livros</h2>
          <p className="text-neutral-600">
            Livro {livroAtualIndex + 1} de {totalLivros} • Troca automática a cada 10s
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
          </div>
          <p className="text-neutral-700 text-xl font-bold">Carregando livros...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-12 text-center">
          <p className="text-red-800 text-xl font-bold mb-4">❌ Erro</p>
          <p className="text-red-600 mb-6 font-mono text-sm">{error}</p>
          <button
            onClick={onReload}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      ) : livroAtual ? (
        <CardSwipeLivro livro={livroAtual} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} onAvaliar={onAvaliar} />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-neutral-300">
          <div className="bg-neutral-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaFire size={64} className="text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">Você viu todos os livros disponíveis!</h3>
          <p className="text-neutral-600 mb-6">Volte mais tarde para descobrir novas recomendações personalizadas.</p>
          <button
            onClick={onReload}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Recarregar Recomendações
          </button>
        </div>
      )}
    </section>
  );
}
