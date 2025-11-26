'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Check,
  Clock,
  Package,
  CreditCard,
  Truck,
  Shield,
  BookOpen,
  Calendar
} from 'lucide-react';

interface Book {
  id: number;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  num_paginas?: number;
  sinopse?: string;
  capa_url?: string;
  quantidade_disponivel: number;
  preco?: number;
  preco_promocional?: number;
  promocao_ativa?: boolean;
  autores?: Array<{ id: number; nome: string }>;
  categorias?: Array<{ id: number; nome: string }>;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'buy' | 'rent'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/livros/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Erro ao carregar livro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getDiscountPercent = (preco: number, precoPromocional: number) => {
    return Math.round(((preco - precoPromocional) / preco) * 100);
  };

  const getCurrentPrice = () => {
    if (!book || !book.preco) return 0;
    if (book.promocao_ativa && book.preco_promocional) {
      return book.preco_promocional;
    }
    return book.preco;
  };

  const getTotalPrice = () => {
    return getCurrentPrice() * quantity;
  };

  const handleAddToCart = () => {
    // Implementar lógica de adicionar ao carrinho
    console.log('Adicionar ao carrinho:', { bookId: id, quantity, option: selectedOption });
  };

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.titulo,
          text: `Confira este livro: ${book.titulo}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Livro não encontrado</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <Link href="/" className="text-xl font-bold text-blue-600">
              Bibliotech
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Compartilhar"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Favoritar"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden">
                {book.capa_url ? (
                  <Image
                    src={book.capa_url}
                    alt={book.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center p-8">
                      <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">{book.titulo}</p>
                    </div>
                  </div>
                )}

                {book.promocao_ativa && book.preco && book.preco_promocional && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{getDiscountPercent(book.preco, book.preco_promocional)}% OFF
                  </div>
                )}
              </div>

              {/* Book Details Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {book.ano_publicacao && (
                  <div className="bg-white rounded-lg p-4 text-center shadow-md">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Ano</p>
                    <p className="font-bold text-gray-900">{book.ano_publicacao}</p>
                  </div>
                )}
                {book.num_paginas && (
                  <div className="bg-white rounded-lg p-4 text-center shadow-md">
                    <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Páginas</p>
                    <p className="font-bold text-gray-900">{book.num_paginas}</p>
                  </div>
                )}
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Estoque</p>
                  <p className="font-bold text-gray-900">{book.quantidade_disponivel}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Book Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Categories */}
            {book.categorias && book.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.categorias.map((cat) => (
                  <span
                    key={cat.id}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat.nome}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.titulo}</h1>

            {/* Authors */}
            {book.autores && book.autores.length > 0 && (
              <p className="text-xl text-gray-600 mb-6">
                por {book.autores.map((a) => a.nome).join(', ')}
              </p>
            )}

            {/* Rating (Mock) */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 avaliações)</span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              {book.preco && (
                <>
                  {book.promocao_ativa && book.preco_promocional ? (
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(book.preco)}
                        </span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                          ECONOMIZE {formatPrice(book.preco - book.preco_promocional)}
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-green-600">
                        {formatPrice(book.preco_promocional)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-blue-600">
                      {formatPrice(book.preco)}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    ou em até 3x sem juros no cartão
                  </p>
                </>
              )}
            </div>

            {/* Options: Buy or Rent */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="font-bold text-lg mb-4">Selecione uma opção:</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSelectedOption('buy')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedOption === 'buy'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Comprar</p>
                  <p className="text-xs text-gray-600">Livro físico</p>
                </button>
                <button
                  onClick={() => setSelectedOption('rent')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedOption === 'rent'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Alugar</p>
                  <p className="text-xs text-gray-600">Por 15 dias</p>
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade:
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(book.quantidade_disponivel, quantity + 1))
                    }
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 font-bold transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-auto">
                    {book.quantidade_disponivel} disponíveis
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={book.quantidade_disponivel === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {book.quantidade_disponivel === 0
                  ? 'Esgotado'
                  : 'Adicionar ao Carrinho'}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Frete Grátis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span>Parcelamento</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-5 h-5 text-green-600" />
                <span>Garantia</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="font-bold text-xl mb-4">Sinopse</h3>
              <p className="text-gray-700 leading-relaxed">
                {book.sinopse || 'Sinopse não disponível para este livro.'}
              </p>
            </div>

            {/* ISBN */}
            {book.isbn && (
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
