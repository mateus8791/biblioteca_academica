// Arquivo: frontend/src/components/CancelModal.tsx
'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

// Define as propriedades (props) que o nosso modal vai receber
interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isSubmitting: boolean;
}

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isSubmitting,
}: CancelModalProps) {
  // Não renderiza nada se não estiver aberto
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay com fundo embaçado (menos escuro, mais blur)
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-50 flex justify-center items-center p-4">
      {/* Caixa do Modal - Formato Retangular */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto relative animate-fade-in-up overflow-hidden">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
        >
          <X size={24} />
        </button>

        {/* Conteúdo Superior: Imagem à esquerda + Texto à direita */}
        <div className="flex items-center p-8 gap-6">
          {/* Imagem do Caranguejo à Esquerda */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/icons/crab.png"
                alt="Cancelar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Texto ao Centro/Direita */}
          <div className="flex-1 text-center md:text-left">
            {/* Título */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tem certeza?
            </h2>

            {/* Mensagem */}
            <p className="text-gray-600 text-base leading-relaxed mb-2">
              Você está prestes a cancelar sua reserva para o livro:
            </p>
            <p className="text-gray-900 font-semibold text-lg mb-3">
              {title}
            </p>
            <p className="text-sm text-gray-500">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        {/* Botões na Parte Inferior */}
        <div className="bg-gray-50 px-8 py-6 flex gap-3 justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed font-semibold transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Cancelando...' : 'Sim, Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}
