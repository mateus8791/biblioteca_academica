'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  id: number;
  titulo: string;
  isbn?: string;
  ano_publicacao?: number;
  capa_url?: string;
  quantidade_disponivel: number;
  preco?: number;
  preco_promocional?: number;
  promocao_ativa?: boolean;
  sinopse?: string;
  autores?: Array<{ id: number; nome: string }>;
  categorias?: Array<{ id: number; nome: string }>;
}

interface BookCarouselProps {
  title: string;
  subtitle?: string;
  apiEndpoint: string;
  limit?: number;
}

export default function BookCarousel({ title, subtitle, apiEndpoint, limit = 10 }: BookCarouselProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api${apiEndpoint}?limit=${limit}`);
        const data = await response.json();

        // Validate that data is an array
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error('Resposta da API não é um array:', data);
          setBooks([]);
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [apiEndpoint, limit]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= books.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, books.length - itemsPerView) : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getDiscountPercent = (preco: number, precoPromocional: number) => {
    return Math.round(((preco - precoPromocional) / preco) * 100);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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

  if (books.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {books.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white rounded-full p-3 shadow-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white rounded-full p-3 shadow-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Books Grid */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${(currentIndex * (100 / itemsPerView))}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(24 * (itemsPerView - 1)) / itemsPerView}px)` }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full group hover:shadow-2xl transition-shadow duration-300">
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

                      {/* Discount Badge */}
                      {book.promocao_ativa && book.preco && book.preco_promocional && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          -{getDiscountPercent(book.preco, book.preco_promocional)}%
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link
                          href={`/alugar-livro/${book.id}`}
                          className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
                          aria-label="Ver detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/alugar-livro/${book.id}`}
                          className="bg-white text-gray-900 p-3 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-300"
                          aria-label="Alugar livro"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                        {book.titulo}
                      </h3>

                      {book.autores && book.autores.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                          {book.autores.map(a => a.nome).join(', ')}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-auto">
                        {book.preco ? (
                          <div className="flex flex-col gap-1">
                            {book.promocao_ativa && book.preco_promocional ? (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(book.preco)}
                                </span>
                                <span className="text-xl font-bold text-green-600">
                                  {formatPrice(book.preco_promocional)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-blue-600">
                                {formatPrice(book.preco)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Consultar disponibilidade
                          </span>
                        )}
                      </div>

                      {/* Stock Info */}
                      {book.quantidade_disponivel > 0 ? (
                        <p className="text-xs text-green-600 mt-2">
                          {book.quantidade_disponivel} {book.quantidade_disponivel === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 mt-2">Esgotado</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {books.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(books.length / itemsPerView) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * itemsPerView)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerView) === idx
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Todos os Livros
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
