// Arquivo: frontend/src/components/ReservationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { BookMarked, X, Calendar } from 'lucide-react';

// Define as propriedades (props) que o nosso modal vai receber
interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dataRetirada: string) => void;
  bookTitle: string;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function ReservationModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  isSubmitting,
  errorMessage,
}: ReservationModalProps) {
  const [dataRetirada, setDataRetirada] = useState('');

  // Limpa o campo de texto toda vez que o modal for aberto
  useEffect(() => {
    if (isOpen) {
      setDataRetirada('');
    }
  }, [isOpen]);

  // Não renderiza nada se não estiver aberto
  if (!isOpen) {
    return null;
  }
  
  const handleConfirmClick = () => {
    // Validação simples para garantir que uma data foi selecionada
    if (!dataRetirada) {
      alert('Por favor, selecione uma data para a retirada.');
      return;
    }
    onConfirm(dataRetirada);
  };

  // Calcula a data mínima para retirada (amanhã)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Começa a partir de amanhã
    return today.toISOString().split('T')[0];
  };

  return (
    // Overlay escuro que cobre a tela inteira
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      {/* Caixa do Modal */}
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BookMarked className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Confirmar Reserva</h2>
            <p className="text-gray-600">Complete os dados para retirar seu livro.</p>
          </div>
        </div>

        <div className="my-6 text-sm text-gray-700 space-y-4">
          <p>
            Você está reservando o livro: <strong className="font-bold text-gray-900">{bookTitle}</strong>.
          </p>
          <div>
            <label htmlFor="dataRetirada" className="block font-medium text-gray-700 mb-1">
              Escolha a data de retirada
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="dataRetirada"
                type="date"
                value={dataRetirada}
                onChange={(e) => setDataRetirada(e.target.value)}
                min={getMinDate()} // Impede que o usuário selecione uma data no passado
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">A reserva ficará ativa até o final do dia selecionado.</p>
          </div>

          {/* Exibe a mensagem de erro, se houver */}
          {errorMessage && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={isSubmitting || !dataRetirada}
            className="py-2 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
}
