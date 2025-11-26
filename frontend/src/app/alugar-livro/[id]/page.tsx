'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  FileText,
  Star,
  TrendingUp,
  User,
  ShoppingBag,
  Clock,
  DollarSign,
  Package,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
  Heart,
  Share2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface Autor {
  id: number;
  nome: string;
  biografia?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  foto_url?: string;
}

interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

interface Livro {
  id: number;
  titulo: string;
  subtitulo?: string;
  isbn?: string;
  ano_publicacao?: number;
  num_paginas?: number;
  sinopse?: string;
  capa_url?: string;
  quantidade_disponivel: number;
  preco?: number;
  preco_promocional?: number;
  promocao_ativa: boolean;
  editora?: string;
  data_cadastro?: string;
  autores: Autor[];
  categorias: Categoria[];
}

export default function AlugarLivroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [livro, setLivro] = useState<Livro | null>(null);
  const [livrosRelacionados, setLivrosRelacionados] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [periodoAluguel, setPeriodoAluguel] = useState(7); // dias
  const [favorito, setFavorito] = useState(false);

  // Taxas de aluguel (por dia)
  const TAXA_DIARIA = 2.50; // R$ 2,50 por dia
  const TAXA_DESCONTO_SEMANAL = 0.15; // 15% de desconto para 7+ dias
  const TAXA_DESCONTO_MENSAL = 0.30; // 30% de desconto para 30+ dias

  useEffect(() => {
    if (id) {
      buscarLivro();
      buscarLivrosRelacionados();
    }
  }, [id]);

  const buscarLivro = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/public/livro/${id}`);

      if (!response.ok) {
        throw new Error('Livro não encontrado');
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Erro ao carregar dados do livro. Verifique se o backend está rodando.');
      }

      const data = await response.json();
      setLivro(data);
    } catch (err: any) {
      console.error('Erro ao buscar livro:', err);
      setError(err.message || 'Erro ao carregar livro');
    } finally {
      setLoading(false);
    }
  };

  const buscarLivrosRelacionados = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/public/livro/${id}/relacionados?limit=4`);
      if (response.ok) {
        const data = await response.json();
        setLivrosRelacionados(data);
      }
    } catch (err) {
      console.error('Erro ao buscar livros relacionados:', err);
    }
  };

  const calcularValorAluguel = () => {
    let valorBase = TAXA_DIARIA * periodoAluguel * quantidade;

    // Aplicar descontos por período
    if (periodoAluguel >= 30) {
      valorBase = valorBase * (1 - TAXA_DESCONTO_MENSAL);
    } else if (periodoAluguel >= 7) {
      valorBase = valorBase * (1 - TAXA_DESCONTO_SEMANAL);
    }

    return valorBase;
  };

  const handleAlugar = () => {
    if (!livro) return;

    // Redirecionar para checkout com dados do aluguel
    const dadosAluguel = {
      livro: {
        id: livro.id,
        titulo: livro.titulo,
        capa_url: livro.capa_url,
        autores: livro.autores.map(a => a.nome).join(', '),
      },
      quantidade,
      periodoAluguel,
      valorTotal: calcularValorAluguel(),
      taxaDiaria: TAXA_DIARIA,
    };

    localStorage.setItem('dadosAluguel', JSON.stringify(dadosAluguel));
    router.push('/checkout-aluguel');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando livro...</p>
        </div>
      </div>
    );
  }

  if (error || !livro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">{error || 'Livro não encontrado'}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Voltar para home
          </Link>
        </div>
      </div>
    );
  }

  const precoFinal = livro.promocao_ativa && livro.preco_promocional
    ? livro.preco_promocional
    : livro.preco;

  const desconto = livro.promocao_ativa && livro.preco && livro.preco_promocional
    ? Math.round(((livro.preco - livro.preco_promocional) / livro.preco) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFavorito(!favorito)}
                className={`p-2 rounded-full transition ${
                  favorito
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${favorito ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda - Capa e info rápida */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              {/* Capa do livro */}
              <div className="relative aspect-[2/3] mb-6 rounded-xl overflow-hidden bg-gray-100">
                {livro.capa_url ? (
                  <Image
                    src={livro.capa_url}
                    alt={livro.titulo}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-24 w-24 text-gray-300" />
                  </div>
                )}
                {livro.promocao_ativa && desconto > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{desconto}%
                  </div>
                )}
              </div>

              {/* Informações rápidas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ano
                  </span>
                  <span className="font-medium">{livro.ano_publicacao || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Páginas
                  </span>
                  <span className="font-medium">{livro.num_paginas || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Estoque
                  </span>
                  <span className={`font-medium ${livro.quantidade_disponivel > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {livro.quantidade_disponivel > 0
                      ? `${livro.quantidade_disponivel} disponível${livro.quantidade_disponivel > 1 ? 'is' : ''}`
                      : 'Indisponível'
                    }
                  </span>
                </div>

                {livro.isbn && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">ISBN</span>
                    <span className="font-mono text-sm">{livro.isbn}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Coluna central - Detalhes do livro */}
          <div className="lg:col-span-2 space-y-8">
            {/* Título e autor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {livro.titulo}
              </h1>
              {livro.subtitulo && (
                <p className="text-xl text-gray-600 mb-4">{livro.subtitulo}</p>
              )}

              {/* Autores com foto */}
              {livro.autores.length > 0 && (
                <div className="mt-6 space-y-4">
                  {livro.autores.map((autor) => (
                    <div key={autor.id} className="flex items-start gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {autor.foto_url ? (
                          <Image
                            src={autor.foto_url}
                            alt={autor.nome}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Autor</p>
                        <p className="text-lg font-semibold text-gray-900">{autor.nome}</p>
                        {autor.nacionalidade && (
                          <p className="text-sm text-gray-600">{autor.nacionalidade}</p>
                        )}
                        {autor.biografia && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {autor.biografia}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Categorias */}
              {livro.categorias.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Categorias:</p>
                  <div className="flex flex-wrap gap-2">
                    {livro.categorias.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {cat.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Avaliação (mock) */}
              <div className="mt-6 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8 - 127 avaliações)</span>
              </div>
            </motion.div>

            {/* Sinopse */}
            {livro.sinopse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sinopse</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {livro.sinopse}
                </p>
              </motion.div>
            )}

            {/* Painel de aluguel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-6">Alugue este livro</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantidade */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade
                  </label>
                  <select
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-300 transition"
                    disabled={livro.quantidade_disponivel === 0}
                  >
                    {Array.from({ length: Math.min(livro.quantidade_disponivel, 5) }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} livro{num > 1 ? 's' : ''}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Período */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Período de aluguel
                  </label>
                  <select
                    value={periodoAluguel}
                    onChange={(e) => setPeriodoAluguel(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-blue-300 transition"
                  >
                    <option value={7}>7 dias (15% desconto)</option>
                    <option value={14}>14 dias (15% desconto)</option>
                    <option value={30}>30 dias (30% desconto)</option>
                  </select>
                </div>
              </div>

              {/* Cálculo do valor */}
              <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Taxa diária (por livro)</span>
                  <span className="font-medium">R$ {TAXA_DIARIA.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Quantidade × Período</span>
                  <span className="font-medium">{quantidade} × {periodoAluguel} dias</span>
                </div>
                {periodoAluguel >= 7 && (
                  <div className="flex items-center justify-between mb-3 text-green-300">
                    <span className="text-sm flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Desconto aplicado
                    </span>
                    <span className="font-medium">
                      -{periodoAluguel >= 30 ? '30%' : '15%'}
                    </span>
                  </div>
                )}
                <div className="border-t border-white border-opacity-30 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Valor total</span>
                    <span className="text-3xl font-bold">
                      R$ {calcularValorAluguel().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de alugar */}
              <button
                onClick={handleAlugar}
                disabled={livro.quantidade_disponivel === 0}
                className="w-full mt-6 bg-white text-blue-600 font-bold py-4 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                {livro.quantidade_disponivel > 0 ? 'Alugar Agora' : 'Indisponível'}
              </button>

              {/* Benefícios */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Pagamento seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Renovação fácil</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm">Entrega rápida</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">Várias formas de pagamento</span>
                </div>
              </div>
            </motion.div>

            {/* Livros relacionados */}
            {livrosRelacionados.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Você também pode gostar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {livrosRelacionados.map((livroRel) => (
                    <Link
                      key={livroRel.id}
                      href={`/alugar-livro/${livroRel.id}`}
                      className="group"
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {livroRel.capa_url ? (
                          <Image
                            src={livroRel.capa_url}
                            alt={livroRel.titulo}
                            width={200}
                            height={300}
                            className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                        {livroRel.titulo}
                      </h3>
                      {livroRel.autores.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {livroRel.autores[0].nome}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
