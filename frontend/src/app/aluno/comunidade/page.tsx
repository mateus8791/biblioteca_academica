'use client';

import React, { useState, useEffect } from 'react';
import {
  buscarAutores,
  buscarLivrosSwipe,
  buscarUsuariosAtivos,
  buscarAvaliacoesLivros,
  buscarEstatisticas,
  Autor,
  LivroSwipe,
  UsuarioAtivo,
  AvaliacaoLivro,
  EstatisticasComunidade,
} from '@/services/comunidade';
import ModalAvaliarLivro from '@/components/ModalAvaliarLivro';

// Importar componentes modulares
import HeroSection from '@/components/comunidade/HeroSection';
import StatsSection from '@/components/comunidade/StatsSection';
import ProgressSection from '@/components/comunidade/ProgressSection';
import DiscoverySection from '@/components/comunidade/DiscoverySection';
import ReviewsSection from '@/components/comunidade/ReviewsSection';
import AuthorsSection from '@/components/comunidade/AuthorsSection';

export default function ComunidadePage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [livrosSwipe, setLivrosSwipe] = useState<LivroSwipe[]>([]);
  const [livroAtualIndex, setLivroAtualIndex] = useState(0);
  const [usuariosAtivos, setUsuariosAtivos] = useState<UsuarioAtivo[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoLivro[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasComunidade>({
    total_usuarios: 0,
    total_livros: 0,
    total_avaliacoes: 0,
    usuarios_online: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de avaliação
  const [modalAberto, setModalAberto] = useState(false);
  const [livroParaAvaliar, setLivroParaAvaliar] = useState<{ id: string; titulo: string; capa?: string } | null>(null);

  const carregarDados = async () => {
    console.log('🔄 [COMUNIDADE] Iniciando carregamento de dados...');
    setLoading(true);
    setError('');

    try {
      // Carregar tudo em paralelo
      const [autoresRes, livrosRes, usuariosRes, avaliacoesRes, estatisticasRes] = await Promise.all([
        buscarAutores(1, 12),
        buscarLivrosSwipe(10),
        buscarUsuariosAtivos(20),
        buscarAvaliacoesLivros(12),
        buscarEstatisticas(),
      ]);

      if (autoresRes.success) {
        console.log(`✅ [AUTORES] ${autoresRes.data.autores.length} autores carregados`);
        setAutores(autoresRes.data.autores);
      }

      if (livrosRes.success) {
        console.log(`✅ [SWIPE] ${livrosRes.data.livros.length} livros carregados`);
        setLivrosSwipe(livrosRes.data.livros);
      }

      if (usuariosRes.success) {
        console.log(`✅ [USUARIOS] ${usuariosRes.data.usuarios.length} usuários carregados`);
        setUsuariosAtivos(usuariosRes.data.usuarios);
      }

      if (avaliacoesRes.success) {
        console.log(`✅ [AVALIACOES] ${avaliacoesRes.data.avaliacoes.length} avaliações carregadas`);
        setAvaliacoes(avaliacoesRes.data.avaliacoes);
      }

      if (estatisticasRes.success) {
        console.log('✅ [ESTATISTICAS] Estatísticas carregadas:', estatisticasRes.data);
        setEstatisticas(estatisticasRes.data);
      }

      console.log('✅ [COMUNIDADE] Todos os dados carregados com sucesso!');
    } catch (err: any) {
      const mensagemErro = err?.message || 'Erro desconhecido';
      console.error('❌ [COMUNIDADE] Erro ao carregar dados:', err);
      setError(`Erro ao carregar dados da comunidade: ${mensagemErro}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotação de livros (a cada 10 segundos)
  useEffect(() => {
    if (livrosSwipe.length === 0) return;

    const interval = setInterval(() => {
      setLivroAtualIndex((prev) => (prev + 1) % livrosSwipe.length);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [livrosSwipe]);

  useEffect(() => {
    console.log('🚀 [COMUNIDADE] Componente montado');
    carregarDados();

    return () => {
      console.log('🔚 [COMUNIDADE] Componente desmontado');
    };
  }, []);

  const handleSwipeLeft = (livroId: string) => {
    console.log('👎 [SWIPE] Usuário rejeitou livro:', livroId);
    proximoLivro();
  };

  const handleSwipeRight = (livroId: string) => {
    console.log('👍 [SWIPE] Usuário curtiu livro:', livroId);
    proximoLivro();
  };

  const proximoLivro = () => {
    setLivroAtualIndex((prev) => (prev + 1) % livrosSwipe.length);
  };

  const handleAvaliacaoSucesso = (novaAvaliacao: AvaliacaoLivro) => {
    console.log('✅ Nova avaliação criada:', novaAvaliacao);
    setAvaliacoes((prev) => [novaAvaliacao, ...prev]);
    // Atualizar estatísticas
    setEstatisticas((prev) => ({
      ...prev,
      total_avaliacoes: prev.total_avaliacoes + 1,
    }));
  };

  const livroAtual = livrosSwipe[livroAtualIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection usuariosAtivos={usuariosAtivos} estatisticas={estatisticas} />

      {/* Conteúdo Principal - Maior espaçamento */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Progress Section */}
        <ProgressSection estatisticas={estatisticas} />

        {/* Discovery Section */}
        <DiscoverySection
          livroAtual={livroAtual}
          livroAtualIndex={livroAtualIndex}
          totalLivros={livrosSwipe.length}
          loading={loading}
          error={error}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onAvaliar={(livro) => {
            setLivroParaAvaliar({
              id: livro.id,
              titulo: livro.titulo,
              capa: livro.capa_url,
            });
            setModalAberto(true);
          }}
          onReload={carregarDados}
        />

        {/* Reviews Section */}
        <ReviewsSection avaliacoes={avaliacoes} />

        {/* Authors Section */}
        <AuthorsSection autores={autores} loading={loading} />
      </div>

      {/* Modal de Avaliação */}
      {livroParaAvaliar && (
        <ModalAvaliarLivro
          livroId={livroParaAvaliar.id}
          livroTitulo={livroParaAvaliar.titulo}
          livroCapa={livroParaAvaliar.capa}
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          onSuccess={handleAvaliacaoSucesso}
        />
      )}
    </div>
  );
}
