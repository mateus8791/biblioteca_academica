// Arquivo: frontend/src/app/catalogo/page.tsx (Banner corrigido e inteligente)
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, LoaderCircle, PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/services/api';
import BookCard from '@/components/BookCard';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

interface Livro {
  id: string;
  titulo: string;
  capa_url: string | null;
  autores_nomes: string | null;
}

export default function CatalogoPage() {
  const { usuario } = useAuth();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const termoBuscaDebounced = useDebounce(termoBusca, 500);

  const buscarLivros = useCallback(async () => {
    try {
      setCarregando(true);
      const params = new URLSearchParams();
      if (termoBuscaDebounced) {
        params.append('search', termoBuscaDebounced);
      }
      const response = await api.get(`/livros?${params.toString()}`);
      setLivros(response.data);
      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      setErro("Não foi possível carregar os livros.");
    } finally {
      setCarregando(false);
    }
  }, [termoBuscaDebounced]);

  useEffect(() => {
    buscarLivros();
  }, [buscarLivros]);

  const handleDeleteLivro = (idDoLivroApagado: string) => {
    setLivros(livrosAtuais => livrosAtuais.filter(livro => livro.id !== idDoLivroApagado));
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        
        {usuario && (
          <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
            <Image 
              src={usuario.foto_url || '/avatar-placeholder.png'} 
              alt={`Foto de ${usuario.nome}`}
              width={56}
              height={56}
              className="rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Boas-vindas, {usuario.nome.split(' ')[0]}!</h1>
              <p className="text-gray-500">Pronto para sua próxima aventura literária?</p>
            </div>
          </div>
        )}

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Busque por título ou autor..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {/* --- BANNER INTELIGENTE --- */}
        {/* Só aparece se a busca estiver vazia e não estiver carregando */}
        {!termoBusca && !carregando && (
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 mb-12 overflow-hidden text-white flex items-center min-h-[250px]">
                <div className="relative z-10 md:w-1/2">
                    <h2 className="text-sm uppercase tracking-widest text-amber-400 font-semibold">Leitura em Destaque</h2>
                    <h3 className="text-3xl md:text-5xl font-bold mt-2">Elementar, meu caro leitor</h3>
                    <p className="mt-4 text-gray-300 max-w-lg">Mergulhe nos mistérios de Baker Street com a coleção completa de Sherlock Holmes.</p>
                    {/* Botão funcional: ao clicar, ele define o termo de busca */}
                    <button 
                        onClick={() => setTermoBusca('Sherlock Holmes')}
                        className="mt-6 bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-transform hover:scale-105"
                    >
                        Ver coleção
                    </button>
                </div>
                
                <div className="absolute right-0 top-0 h-full w-full opacity-5 md:opacity-100 md:w-1/2 pointer-events-none">
                    <Image 
                        src="/covers/sherlock-profile.png" 
                        alt="Silhueta de Sherlock Holmes" 
                        fill 
                        style={{ objectFit: 'contain', objectPosition: 'bottom right' }}
                    />
                </div>
                 <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                    <Image 
                        src="/covers/sherlock-cover.jpg" 
                        alt="Capa do livro de Sherlock Holmes" 
                        width={150} 
                        height={220} 
                        className="rounded-lg shadow-2xl rotate-6"
                    />
                </div>
            </div>
        )}

        {/* Grid de Livros */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {/* O título muda se houver uma busca ativa */}
              {termoBusca ? `Resultados para "${termoBusca}"` : 'Nosso Acervo'}
            </h2>
            {usuario?.tipo_usuario === 'bibliotecario' && (
              <Link href="/admin/livros/novo" className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                <PlusCircle size={18} /> Adicionar Livro
              </Link>
            )}
          </div>
          {carregando ? (
            <div className="text-center text-gray-500 flex items-center justify-center p-10">
              <LoaderCircle className="animate-spin mr-2" /> Buscando...
            </div>
          ) : erro ? (
            <div className="text-center text-red-500 p-10">{erro}</div>
          ) : livros.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {livros.map(livro => (
                <BookCard key={livro.id} livro={{...livro, autores: livro.autores_nomes}} onDelete={handleDeleteLivro} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-10">Nenhum livro encontrado com os termos da sua busca.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}