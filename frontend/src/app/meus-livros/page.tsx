// Arquivo: frontend/src/app/meus-livros/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/services/api';
import { LoaderCircle, XCircle, RefreshCcw, Calendar, AlertTriangle, Book, History } from 'lucide-react';
import Image from 'next/image';
import CancelModal from '@/components/CancelModal'; // 1. Importa nosso novo modal de cancelamento

// Define a "forma" de um livro que vem da nossa API de "Meus Livros"
interface MyBook {
  id: string; // ID do empréstimo ou da reserva
  tipo: 'emprestimo' | 'reserva';
  titulo: string;
  capa_url: string | null;
  autor_nome: string;
  data_emprestimo?: string;
  data_devolucao_prevista?: string;
  data_reserva?: string;
  data_expiracao?: string;
}

export default function MeusLivrosPage() {
  const [meusLivros, setMeusLivros] = useState<MyBook[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 2. Novos estados para controlar o modal de cancelamento
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookToCancel, setBookToCancel] = useState<MyBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Busca os dados da API quando a página carrega
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setCarregando(true);
        const response = await api.get('/meus-livros');
        setMeusLivros(response.data);
      } catch (error) {
        console.error("Erro ao buscar 'Meus Livros':", error);
        setErro("Não foi possível carregar seus livros.");
      } finally {
        setCarregando(false);
      }
    };
    fetchMyBooks();
  }, []);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // 3. Funções para controlar o modal de cancelamento
  const handleOpenCancelModal = (livro: MyBook) => {
    setBookToCancel(livro);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setBookToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!bookToCancel) return;
    setIsSubmitting(true);
    try {
      // Chama a API de cancelamento que criamos
      await api.put(`/reservas/${bookToCancel.id}/cancelar`);
      // Remove o livro da lista na tela, em tempo real
      setMeusLivros(prev => prev.filter(livro => livro.id !== bookToCancel.id));
      alert('Reserva cancelada com sucesso!');
      handleCloseCancelModal();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert('Falha ao cancelar a reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente interno para renderizar cada card de livro
  const BookItemCard = ({ livro }: { livro: MyBook }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image 
          src={livro.capa_url || '/covers/placeholder-icon.png'} 
          alt={`Capa do livro ${livro.titulo}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{livro.titulo}</h3>
        <p className="text-sm text-gray-500 mb-4">{livro.autor_nome}</p>

        <div className="mt-auto space-y-3 text-sm">
          {livro.tipo === 'reserva' ? (
            <div className="bg-blue-100 text-blue-800 p-3 rounded-md text-center">
              <p className="font-semibold">STATUS: RESERVADO</p>
              <p>Retirar até: <span className="font-bold">{formatDate(livro.data_expiracao)}</span></p>
            </div>
          ) : (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-center">
              <p className="font-semibold">STATUS: EMPRESTADO</p>
              <p>Devolver até: <span className="font-bold">{formatDate(livro.data_devolucao_prevista)}</span></p>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
            {/* 4. O botão agora abre o modal, se for uma reserva */}
            <button 
              onClick={() => handleOpenCancelModal(livro)}
              disabled={livro.tipo !== 'reserva'}
              className="flex items-center justify-center gap-2 p-2 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                <XCircle size={14} /> Cancelar
            </button>
            <button className="flex items-center justify-center gap-2 p-2 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition-colors">
                <RefreshCcw size={14} /> Renovar
            </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (carregando) {
      return (
        <div className="text-center text-gray-500 flex items-center justify-center p-10">
          <LoaderCircle className="animate-spin mr-2" /> Carregando seus livros...
        </div>
      );
    }
    if (erro) {
      return (
        <div className="text-center text-red-500 bg-red-50 p-10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="mr-2" /> {erro}
        </div>
      );
    }
    if (meusLivros.length === 0) {
        return (
            <div className="text-center text-gray-500 p-10 bg-white rounded-lg shadow-sm">
                <Book size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold">Nenhum livro com você</h3>
                <p>Você não possui livros reservados ou emprestados no momento.</p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meusLivros.map((livro) => <BookItemCard key={livro.id} livro={livro} />)}
        </div>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Livros</h1>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
              <Calendar size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-700">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Empréstimos e Reservas Atuais</h2>
          {renderContent()}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><History size={24}/>Histórico de Leitura</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500">Em breve, aqui será exibida a lista de todos os livros que você já leu.</p>
          </div>
        </div>
      </DashboardLayout>

      {/* 5. Renderiza nosso novo modal de cancelamento */}
      {bookToCancel && (
        <CancelModal
          isOpen={isCancelModalOpen}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
          title={bookToCancel.titulo}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
