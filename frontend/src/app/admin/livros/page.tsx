// Arquivo: frontend/src/app/admin/livros/page.tsx (Versão final e corrigida)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, BookOpen, Trash2, Pencil } from 'lucide-react';
import api from '../../../services/api';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';

// --- Interface correta para receber todos os dados da API ---
interface Livro {
  id: string; // ID é UUID (string)
  titulo: string;
  autores_nomes: string | null; // O backend envia no plural
  isbn: string | null;
  quantidade_disponivel: number;
  capa_url: string | null;
  data_cadastro: string; // Adicionamos a data de cadastro
}

export default function AdminLivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [livroParaDeletar, setLivroParaDeletar] = useState<Livro | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchLivros = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/livros');
      setLivros(response.data);
    } catch (err) {
      console.error('Falha ao buscar livros:', err);
      setError('Não foi possível carregar os livros. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleDelete = async () => {
    if (!livroParaDeletar) return;
    try {
      await api.delete(`/livros/${livroParaDeletar.id}`);
      setDeleteModalOpen(false);
      setLivroParaDeletar(null);
      fetchLivros(); 
    } catch (err) {
      console.error('Falha ao deletar o livro:', err);
      setError('Não foi possível excluir o livro.');
    }
  };

  const openDeleteModal = (livro: Livro) => {
    setLivroParaDeletar(livro);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
              Gerenciamento de Livros
            </h1>
            <Link href="/admin/livros/novo">
              <button className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                <PlusCircle className="w-5 h-5 mr-2" />
                Adicionar Novo Livro
              </button>
            </Link>
          </div>

          {loading && <p className="text-center text-gray-500">Carregando livros...</p>}
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* --- Colunas da Tabela com todas as informações --- */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capa</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor(es)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd. Disp.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {livros.length > 0 ? (
                    livros.map((livro) => (
                      <tr key={livro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex-shrink-0 h-16 w-12 bg-gray-200 flex items-center justify-center rounded">
                            {livro.capa_url ? (
                              <Image src={livro.capa_url} alt={`Capa de ${livro.titulo}`} width={48} height={64} className="object-cover h-16 w-12 rounded"/>
                            ) : (
                              <BookOpen className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{livro.titulo}</td>
                        {/* Usando a propriedade correta 'autores_nomes' */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{livro.autores_nomes || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{livro.isbn || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-700">{livro.quantidade_disponivel}</td>
                        {/* Adicionando a célula da data de cadastro */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{livro.data_cadastro}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link href={`/admin/livros/editar/${livro.id}`} passHref>
                             <button className="p-2 text-gray-400 hover:text-blue-600" aria-label="Editar">
                               <Pencil className="w-5 h-5" />
                             </button>
                          </Link>
                          <button onClick={() => openDeleteModal(livro)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Deletar">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Colspan atualizado para 7 colunas
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">Nenhum livro cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} itemName={livroParaDeletar?.titulo || ''}/>
    </>
  );
}