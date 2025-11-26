'use client';

import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { X } from 'lucide-react';
import { criarAvaliacao } from '@/services/avaliacoes';
import { CriarAvaliacaoData } from '@/types/avaliacao';

interface AvaliacaoModalProps {
  livroId: number;
  tituloLivro: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  avaliacaoExistente?: {
    nota: number;
    comentario: string;
  };
}

const LABELS_NOTAS = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Ok',
  4: 'Bom',
  5: 'Muito Bom'
};

const AvaliacaoModal: React.FC<AvaliacaoModalProps> = ({
  livroId,
  tituloLivro,
  isOpen,
  onClose,
  onSuccess,
  avaliacaoExistente
}) => {
  const [nota, setNota] = useState<number>(avaliacaoExistente?.nota || 3);
  const [comentario, setComentario] = useState<string>(avaliacaoExistente?.comentario || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const dados: CriarAvaliacaoData = {
      nota,
      comentario: comentario.trim()
    };

    try {
      const response = await criarAvaliacao(livroId, dados);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Erro ao enviar avaliação');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">
            Avaliar Livro
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Título do Livro */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm text-neutral-600">Você está avaliando:</p>
          <p className="text-lg font-semibold text-neutral-900 mt-1">{tituloLivro}</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seletor de Nota (Slider) */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Sua nota: <span className="text-accent-yellow-600 text-lg">{LABELS_NOTAS[nota as keyof typeof LABELS_NOTAS]}</span>
            </label>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5 mb-2"
              value={[nota]}
              onValueChange={(value) => setNota(value[0])}
              max={5}
              min={1}
              step={1}
              aria-label="Avaliação"
            >
              <Slider.Track className="bg-neutral-200 relative grow rounded-full h-2.5">
                <Slider.Range className="absolute bg-accent-yellow-500 rounded-full h-full transition-all" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-7 h-7 bg-white border-4 border-accent-yellow-500 rounded-full shadow-lg hover:bg-accent-yellow-50 focus:outline-none focus:ring-4 focus:ring-accent-yellow-200 transition-all cursor-grab active:cursor-grabbing hover:scale-110"
              />
            </Slider.Root>

            {/* Labels do Slider */}
            <div className="flex justify-between mt-3 px-1">
              {[1, 2, 3, 4, 5].map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setNota(valor)}
                  className={`text-xs sm:text-sm transition-all ${
                    nota === valor
                      ? 'text-accent-yellow-700 font-bold scale-110'
                      : 'text-neutral-500 hover:text-neutral-700 hover:scale-105'
                  }`}
                >
                  {LABELS_NOTAS[valor as keyof typeof LABELS_NOTAS]}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de Comentário */}
          <div>
            <label
              htmlFor="comentario"
              className="block text-sm font-semibold text-neutral-700 mb-2"
            >
              Seu comentário
            </label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Compartilhe sua opinião sobre este livro com a comunidade..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none text-neutral-900 placeholder-neutral-400"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-neutral-500">
                {comentario.length}/1000 caracteres
              </span>
              {comentario.length < 10 && comentario.length > 0 && (
                <span className="text-xs text-amber-600">
                  Mínimo recomendado: 10 caracteres
                </span>
              )}
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || comentario.trim().length === 0}
              className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Publicar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvaliacaoModal;
