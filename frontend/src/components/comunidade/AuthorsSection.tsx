import React from 'react';
import { HiTrendingUp } from 'react-icons/hi';
import { FaUsers } from 'react-icons/fa';
import { Autor } from '@/services/comunidade';
import CardAutor from '@/components/CardAutor';

interface AuthorsSectionProps {
  autores: Autor[];
  loading: boolean;
}

export default function AuthorsSection({ autores, loading }: AuthorsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-accent-yellow-100 to-accent-yellow-200 p-3 rounded-xl">
          <HiTrendingUp size={28} className="text-accent-yellow-700" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-neutral-900">Autores em Destaque</h2>
          <p className="text-neutral-600">Explore e avalie seus autores favoritos</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-neutral-200 rounded-2xl h-[450px] animate-pulse" />
          ))}
        </div>
      ) : autores.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-neutral-300">
          <div className="bg-neutral-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUsers size={48} className="text-neutral-400" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">Nenhum autor encontrado</h3>
          <p className="text-neutral-600">Cadastre autores para começar a construir a comunidade.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {autores.map((autor) => (
            <CardAutor
              key={autor.id}
              autor={autor}
              onClick={() => {
                console.log('🖱️ [CLICK] Usuário clicou no autor:', autor.nome);
                alert(`Em breve: Detalhes de ${autor.nome}`);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
