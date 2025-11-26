'use client';

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { avaliarLivro, AvaliacaoLivro } from '@/services/comunidade';

interface ModalAvaliarLivroProps {
  livroId: string;
  livroTitulo: string;
  livroCapa?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (avaliacao: AvaliacaoLivro) => void;
}

const ModalAvaliarLivro: React.FC<ModalAvaliarLivroProps> = ({
  livroId,
  livroTitulo,
  livroCapa,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [nota, setNota] = useState(0);
  const [notaHover, setNotaHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nota === 0) {
      setErro('Por favor, selecione uma nota de 1 a 5 estrelas');
      return;
    }

    if (!comentario.trim()) {
      setErro('Por favor, escreva um comentário sobre o livro');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      const response = await avaliarLivro(livroId, nota, comentario);
      if (response.success) {
        onSuccess(response.data.avaliacao);
        // Resetar formulário
        setNota(0);
        setComentario('');
        onClose();
      }
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      setErro(error?.response?.data?.error || 'Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    if (!enviando) {
      setNota(0);
      setComentario('');
      setErro('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-2xl font-black">Avaliar Livro</h2>
          <button
            onClick={handleClose}
            disabled={enviando}
            className="p-2 hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
            aria-label="Fechar"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Informações do Livro */}
          <div className="flex items-center gap-4 mb-6 bg-neutral-50 rounded-2xl p-4">
            {livroCapa && (
              <img
                src={livroCapa}
                alt={livroTitulo}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-neutral-900">{livroTitulo}</h3>
              <p className="text-sm text-neutral-600">Compartilhe sua opinião com a comunidade</p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seletor de Nota */}
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-3">
                Sua Nota
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    type="button"
                    onClick={() => setNota(estrela)}
                    onMouseEnter={() => setNotaHover(estrela)}
                    onMouseLeave={() => setNotaHover(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                  >
                    <FaStar
                      size={40}
                      className={`transition-colors ${
                        estrela <= (notaHover || nota)
                          ? 'text-accent-yellow-400 fill-accent-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
                {nota > 0 && (
                  <span className="ml-3 text-2xl font-black text-neutral-900">{nota}.0</span>
                )}
              </div>
            </div>

            {/* Campo de Comentário */}
            <div>
              <label htmlFor="comentario" className="block text-sm font-bold text-neutral-900 mb-3">
                Seu Comentário
              </label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="O que você achou deste livro? Compartilhe sua experiência de leitura..."
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none text-neutral-900 placeholder:text-neutral-400"
                rows={6}
                disabled={enviando}
              />
              <p className="text-xs text-neutral-500 mt-2">
                {comentario.length} caracteres
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <p className="text-red-800 font-semibold text-sm">{erro}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={enviando}
                className="px-6 py-3 text-neutral-700 font-bold rounded-xl hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || nota === 0 || !comentario.trim()}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? 'Enviando...' : 'Publicar Avaliação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliarLivro;
