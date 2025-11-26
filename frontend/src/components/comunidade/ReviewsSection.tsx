import React from 'react';
import { MdStars } from 'react-icons/md';
import { AvaliacaoLivro } from '@/services/comunidade';
import CardAvaliacaoLivro from '@/components/CardAvaliacaoLivro';

interface ReviewsSectionProps {
  avaliacoes: AvaliacaoLivro[];
}

export default function ReviewsSection({ avaliacoes }: ReviewsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-accent-yellow-100 to-accent-yellow-200 p-3 rounded-xl">
          <MdStars size={28} className="text-accent-yellow-700" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-neutral-900">Avaliações da Comunidade</h2>
          <p className="text-neutral-600">Veja o que outros leitores estão comentando</p>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-neutral-300">
          <div className="bg-neutral-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdStars size={48} className="text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">Nenhuma avaliação ainda</h3>
          <p className="text-neutral-600">Seja o primeiro a avaliar um livro!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avaliacoes.map((avaliacao) => (
            <CardAvaliacaoLivro
              key={avaliacao.id}
              avaliacao={avaliacao}
              onClick={() => console.log('Clicou na avaliação:', avaliacao.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
