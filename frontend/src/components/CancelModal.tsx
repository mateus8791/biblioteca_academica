// Arquivo: frontend/src/components/CancelModal.tsx
'use client';

import { XCircle, X } from 'lucide-react';

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
    // Overlay escuro que cobre a tela inteira
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      {/* Caixa do Modal */}
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-auto relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900">Tem certeza?</h2>
            <p className="text-gray-600 mt-2 text-sm">
                Você está prestes a cancelar sua reserva para o livro: <br/>
                <strong className="font-semibold">{title}</strong>.
            </p>
            <p className="text-xs text-gray-500 mt-1">Esta ação não pode ser desfeita.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {isSubmitting ? 'Cancelando...' : 'Sim, Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}
