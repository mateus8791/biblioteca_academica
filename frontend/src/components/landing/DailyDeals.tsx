'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShoppingBag, Eye, Clock, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  id: number;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  capa_url?: string;
  quantidade_disponivel: number;
  preco: number;
  preco_promocional: number;
  promocao_ativa: boolean;
  sinopse?: string;
  desconto_percentual?: number;
  autores?: Array<{ id: number; nome: string }>;
  categorias?: Array<{ id: number; nome: string }>;
}

export default function DailyDeals() {
  const [deals, setDeals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/livros-promocao?limit=6');
        const data = await response.json();

        // Validar se data é um array
        if (Array.isArray(data)) {
          setDeals(data);
        } else if (data && Array.isArray(data.livros)) {
          // Se a API retornar um objeto com propriedade 'livros'
          setDeals(data.livros);
        } else {
          console.error('Resposta da API não é um array:', data);
          setDeals([]);
        }
      } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-300 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Ofertas do Dia
            </h2>
            <Flame className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Aproveite descontos imperdíveis por tempo limitado!
          </p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border-2 border-red-200"
          >
            <Clock className="w-6 h-6 text-red-600" />
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white px-3 py-2 rounded-lg min-w-[60px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-600 mt-1">horas</span>
              </div>
              <span className="text-red-600">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white px-3 py-2 rounded-lg min-w-[60px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-600 mt-1">min</span>
              </div>
              <span className="text-red-600">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white px-3 py-2 rounded-lg min-w-[60px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs text-gray-600 mt-1">seg</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full border-2 border-transparent hover:border-red-300 transition-all duration-300">
                {/* Featured Badge */}
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                      <TrendingDown className="w-4 h-4" />
                      {book.desconto_percentual || 0}% OFF
                    </div>
                    {book.quantidade_disponivel <= 5 && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Últimas unidades!
                      </div>
                    )}
                  </div>

                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {book.capa_url ? (
                      <Image
                        src={book.capa_url}
                        alt={book.titulo}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="text-6xl mb-2">📚</div>
                          <p className="text-sm text-gray-500 font-medium line-clamp-3">
                            {book.titulo}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 gap-3">
                      <Link
                        href={`/alugar-livro/${book.id}`}
                        className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0"
                      >
                        <Eye className="w-5 h-5" />
                        Ver Detalhes
                      </Link>
                      <Link
                        href={`/alugar-livro/${book.id}`}
                        className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Alugar
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-2 min-h-[3.5rem]">
                    {book.titulo}
                  </h3>

                  {book.autores && book.autores.length > 0 && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                      por {book.autores.map(a => a.nome).join(', ')}
                    </p>
                  )}

                  {/* Categories */}
                  {book.categorias && book.categorias.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.categorias.slice(0, 2).map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {cat.nome}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">
                        De {formatPrice(book.preco)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Por apenas</span>
                        <div className="text-3xl font-bold text-green-600">
                          {formatPrice(book.preco_promocional)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Economize</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(book.preco - book.preco_promocional)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {book.quantidade_disponivel > 0 ? (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ {book.quantidade_disponivel} em estoque
                        </p>
                        {book.quantidade_disponivel <= 5 && (
                          <p className="text-sm text-orange-600 font-bold animate-pulse">
                            Corre!
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600 font-medium">✗ Esgotado</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Deals Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/loja?filter=promocao"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            <Flame className="w-6 h-6" />
            Ver Todas as Ofertas
            <Flame className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
