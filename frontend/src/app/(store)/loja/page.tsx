'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  BookOpen,
  User,
  Sparkles,
  TrendingUp,
  Filter,
  X,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Autor {
  id: string;
  nome: string;
  foto_url?: string;
  nacionalidade?: string;
  total_livros: number;
}

interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  total_livros: number;
}

interface Livro {
  id: string;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  capa_url?: string;
  quantidade_disponivel: number;
  preco: string;
  preco_promocional?: string;
  promocao_ativa: boolean;
  autores: { id: string; nome: string; foto_url?: string }[];
  categorias: { id: string; nome: string }[];
}

export default function LojaPage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [autorSelecionado, setAutorSelecionado] = useState<string | null>(null);

  // Carrossel de autores
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const carouselRef = useRef<NodeJS.Timeout | null>(null);

  // Carrossel de banners
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerCarouselRef = useRef<NodeJS.Timeout | null>(null);

  const banners = [
    {
      image: '/banner-promocao.png',
      title: 'Descubra Clássicos da Literatura',
      subtitle: 'De Sherlock Holmes a obras acadêmicas renomadas',
      buttonText: 'Explorar Acervo',
      gradient: 'from-blue-600/90 via-purple-600/80 to-transparent',
      align: 'left' as const
    },
    {
      image: '/banner-lancamentos.png',
      title: 'Conhecimento ao seu Alcance',
      subtitle: 'Alugue livros de qualidade com preços acessíveis',
      buttonText: 'Ver Catálogo',
      gradient: 'from-orange-600/90 via-red-600/80 to-transparent',
      align: 'left' as const
    },
    {
      image: '/banner-publicacao.png',
      title: 'Literatura que Transforma',
      subtitle: 'Grandes autores e histórias inesquecíveis',
      buttonText: 'Começar Agora',
      gradient: 'from-green-600/90 via-teal-600/80 to-transparent',
      align: 'left' as const
    }
  ];

  // Carregar autores
  useEffect(() => {
    fetch('http://localhost:3001/api/public/autores')
      .then(res => res.json())
      .then(data => setAutores(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Erro ao carregar autores:', err);
        setAutores([]);
      });
  }, []);

  // Carregar categorias
  useEffect(() => {
    fetch('http://localhost:3001/api/public/categorias')
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Erro ao carregar categorias:', err);
        setCategorias([]);
      });
  }, []);

  // Carregar livros
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (categoriaSelecionada) params.append('categoria', categoriaSelecionada);
    if (autorSelecionado) params.append('autor', autorSelecionado);
    if (searchTerm) params.append('search', searchTerm);
    // Removido o limit para mostrar todos os livros
    // params.append('limit', '50');

    fetch(`http://localhost:3001/api/public/livros?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLivros(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar livros:', err);
        setLivros([]);
        setLoading(false);
      });
  }, [categoriaSelecionada, autorSelecionado, searchTerm]);

  // Auto-scroll do carrossel de autores
  useEffect(() => {
    if (autores.length > 0) {
      carouselRef.current = setInterval(() => {
        setCurrentAuthorIndex((prev) => (prev + 1) % Math.ceil(autores.length / 6));
      }, 5000); // Muda a cada 5 segundos

      return () => {
        if (carouselRef.current) clearInterval(carouselRef.current);
      };
    }
  }, [autores.length]);

  // Auto-scroll do carrossel de banners
  useEffect(() => {
    bannerCarouselRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000); // Muda a cada 6 segundos

    return () => {
      if (bannerCarouselRef.current) clearInterval(bannerCarouselRef.current);
    };
  }, [banners.length]);

  const limparFiltros = () => {
    setCategoriaSelecionada(null);
    setAutorSelecionado(null);
    setSearchTerm('');
  };

  const nextAuthors = () => {
    setCurrentAuthorIndex((prev) => (prev + 1) % Math.ceil(autores.length / 6));
  };

  const prevAuthors = () => {
    setCurrentAuthorIndex((prev) => (prev - 1 + Math.ceil(autores.length / 6)) % Math.ceil(autores.length / 6));
  };

  const autoresVisiveis = autores.slice(currentAuthorIndex * 6, (currentAuthorIndex + 1) * 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Banner Principal com Imagem de Fundo */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-900">
          <img
            src="/banner-hero.jpg"
            alt="Banner Principal"
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center text-white">
          {/* Título Principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-cyan-300" />
              <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl">
                Nossa Loja
              </h1>
              <Sparkles className="w-10 h-10 text-cyan-300" />
            </div>
            <p className="text-3xl md:text-4xl font-bold drop-shadow-lg">
              Alugue livros acadêmicos de qualidade
            </p>
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md"
          >
            Mais de {livros.length} títulos disponíveis com autores renomados e preços acessíveis
          </motion.p>

          {/* Busca */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-full bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-cyan-300">{livros.length}</div>
              <div className="text-sm">Livros Disponíveis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-300">{autores.length}</div>
              <div className="text-sm">Autores Renomados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-pink-300">{categorias.length}</div>
              <div className="text-sm">Categorias</div>
            </div>
          </motion.div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Seção de Editoras Parceiras */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Editoras Parceiras
            </h2>
            <p className="text-gray-600">
              Trabalhamos com as principais editoras do mercado
            </p>
          </div>

          {/* Grid de Logos de Editoras - Linha Única */}
          <div className="flex items-center justify-center gap-16 opacity-80 hover:opacity-100 transition-all duration-500">
            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/atlas.png"
                alt="Editora Atlas"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/saraiva.png"
                alt="Saraiva"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/record.png"
                alt="Record"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/companhia-das-letras.png"
                alt="Companhia das Letras"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/globo.png"
                alt="Editora Globo"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <div className="relative w-44 h-24 hover:scale-110 transition-transform">
              <img
                src="/logos/editoras/rocco.png"
                alt="Rocco"
                className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Banners - Estilo 2 Colunas */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center min-h-[500px] relative">
            {/* Coluna da Esquerda - Conteúdo Textual */}
            <div className="relative">
              {banners.map((banner, index) => (
                <div
                  key={`text-${index}`}
                  className={`transition-opacity duration-1000 ease-in-out ${
                    index === currentBannerIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-xl text-gray-700 mb-8">
                    {banner.subtitle}
                  </p>
                  <button className="bg-blue-900 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-all hover:scale-105 shadow-lg mb-8">
                    {banner.buttonText}
                  </button>

                  {/* Badge especial para o primeiro banner */}
                  {index === 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Clássicos da</span>
                      <div className="text-2xl font-bold text-gray-900">Literatura Mundial</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Coluna da Direita - Imagem */}
            <div className="relative">
              {banners.map((banner, index) => (
                <div
                  key={`image-${index}`}
                  className={`transition-opacity duration-1000 ease-in-out ${
                    index === currentBannerIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Botões de navegação */}
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Carrossel de Autores em Destaque */}
      {autores.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Autores em Destaque
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Conheça os autores renomados do nosso acervo
                </p>
              </motion.div>
            </div>

            {/* Carrossel */}
            <div className="relative">
              {/* Botão Anterior */}
              <button
                onClick={prevAuthors}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Autores */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
                {autoresVisiveis.map((autor, index) => (
                  <motion.button
                    key={autor.id}
                    onClick={() => {
                      setAutorSelecionado(autor.id);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className={`group text-center relative ${
                      autorSelecionado === autor.id ? 'ring-4 ring-blue-500 rounded-3xl p-3 bg-blue-50' : ''
                    }`}
                  >
                    {/* Badge de selecionado */}
                    {autorSelecionado === autor.id && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    )}

                    <div className="mb-4 relative">
                      {autor.foto_url ? (
                        <div className="relative inline-block">
                          <img
                            src={autor.foto_url}
                            alt={autor.nome}
                            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-xl group-hover:shadow-2xl transition-all group-hover:border-blue-400"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center border-4 border-white shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-110">
                          <User className="w-14 h-14 text-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {autor.nome}
                    </h3>

                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
                      <BookOpen className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                      <p className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">
                        {autor.total_livros} {autor.total_livros === 1 ? 'livro' : 'livros'}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Botão Próximo */}
              <button
                onClick={nextAuthors}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicadores modernos */}
            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: Math.ceil(autores.length / 6) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAuthorIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentAuthorIndex
                      ? 'bg-blue-600 w-12'
                      : 'bg-gray-300 w-2 hover:bg-gray-400 hover:w-4'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Filtros e Categorias */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Categorias */}
        {categorias.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Filter className="w-6 h-6 text-blue-600" />
              Explorar por Categoria
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCategoriaSelecionada(null)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  !categoriaSelecionada
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSelecionada(cat.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    categoriaSelecionada === cat.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {cat.nome}
                  <span className="ml-2 text-sm opacity-75">({cat.total_livros})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filtros Ativos */}
        {(categoriaSelecionada || autorSelecionado || searchTerm) && (
          <div className="mb-8 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Filtros ativos:</span>
            {categoriaSelecionada && (
              <button
                onClick={() => setCategoriaSelecionada(null)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200"
              >
                {categorias.find(c => c.id === categoriaSelecionada)?.nome}
                <X className="w-4 h-4" />
              </button>
            )}
            {autorSelecionado && (
              <button
                onClick={() => setAutorSelecionado(null)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200"
              >
                {autores.find(a => a.id === autorSelecionado)?.nome}
                <X className="w-4 h-4" />
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium hover:bg-cyan-200"
              >
                "{searchTerm}"
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={limparFiltros}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Limpar todos
            </button>
          </div>
        )}

        {/* Grid de Livros */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Carregando...' : `${livros.length} ${livros.length === 1 ? 'livro encontrado' : 'livros encontrados'}`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : livros.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Nenhum livro encontrado</h3>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou fazer uma nova busca</p>
            <button
              onClick={limparFiltros}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver todos os livros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {livros.map((livro, index) => (
              <motion.div
                key={livro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link href={`/alugar-livro/${livro.id}`}>
                  {/* Capa */}
                  <div className="relative mb-4 rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="aspect-[2/3]">
                      {livro.capa_url ? (
                        <img
                          src={livro.capa_url}
                          alt={livro.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Overlay no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-0 right-0 px-4">
                        <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                          Alugar
                        </button>
                      </div>
                    </div>

                    {/* Badge de promoção */}
                    {livro.promocao_ativa && livro.preco_promocional && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          OFERTA
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {livro.titulo}
                    </h3>

                    {livro.autores && livro.autores.length > 0 && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {livro.autores.map(a => a.nome).join(', ')}
                      </p>
                    )}

                    {/* Preço */}
                    {livro.promocao_ativa && livro.preco_promocional ? (
                      <div>
                        <span className="text-xs text-gray-400 line-through block">
                          R$ {parseFloat(livro.preco).toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          R$ {parseFloat(livro.preco_promocional).toFixed(2)}
                          <span className="text-xs text-gray-500 font-normal">/dia</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">
                        R$ {parseFloat(livro.preco).toFixed(2)}
                        <span className="text-xs text-gray-500 font-normal">/dia</span>
                      </span>
                    )}

                    {/* Disponibilidade */}
                    {livro.quantidade_disponivel > 0 ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{livro.quantidade_disponivel} disponíveis</span>
                      </div>
                    ) : (
                      <div className="text-xs text-red-600 mt-1">Indisponível</div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Seção "Por que alugar conosco?" */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que alugar conosco?
            </h2>
            <p className="text-lg text-gray-600">
              Vantagens exclusivas para você aproveitar ao máximo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-blue-100 text-center"
            >
              <div className="w-20 h-20 mb-6 mx-auto flex items-center justify-center">
                <img
                  src="/icon-acervo.png"
                  alt="Acervo Atualizado"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Acervo Atualizado
              </h3>
              <p className="text-gray-600">
                Novos títulos adicionados mensalmente com os melhores autores nacionais e internacionais
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-purple-100 text-center"
            >
              <div className="w-20 h-20 mb-6 mx-auto flex items-center justify-center">
                <img
                  src="/icon-preco.png"
                  alt="Preços Acessíveis"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Preços Acessíveis
              </h3>
              <p className="text-gray-600">
                Valores justos e promocionais para você ter acesso ao conhecimento sem pesar no bolso
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-green-100 text-center"
            >
              <div className="w-20 h-20 mb-6 mx-auto flex items-center justify-center">
                <img
                  src="/icon-periodo.png"
                  alt="Períodos Flexíveis"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Períodos Flexíveis
              </h3>
              <p className="text-gray-600">
                Escolha o período que melhor se adapta às suas necessidades de estudo ou leitura
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
