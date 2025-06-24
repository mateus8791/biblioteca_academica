// Arquivo: frontend/src/app/admin/usuarios/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/services/api'; // <-- AQUI ESTÁ A CORREÇÃO
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { useDebounce } from '@/hooks/useDebounce';

// ... (o resto do arquivo continua exatamente o mesmo)
// Interface para os dados do usuário
interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'bibliotecario' | 'admin';
  foto_url: string | null;
  data_cadastro: string;
  tem_reserva_ativa: boolean;
}

export default function GerenciamentoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Estados para o modal de exclusão
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      if (filterType) {
        params.append('tipo', filterType);
      }

      const response = await api.get(`/usuarios?${params.toString()}`);
      setUsuarios(response.data);
    } catch (err) {
      console.error('Falha ao buscar usuários:', err);
      setError('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filterType]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleDelete = async () => {
    if (!usuarioParaDeletar) return;
    try {
      await api.delete(`/usuarios/${usuarioParaDeletar.id}`);
      setDeleteModalOpen(false);
      setUsuarioParaDeletar(null);
      fetchUsuarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Não foi possível excluir o usuário.');
    }
  };

  const openDeleteModal = (usuario: Usuario) => {
    setUsuarioParaDeletar(usuario);
    setDeleteModalOpen(true);
  };
  
  const getTipoUsuarioTraduzido = (tipo: string) => {
    const traducoes = {
      aluno: 'Aluno',
      bibliotecario: 'Bibliotecário',
      admin: 'Admin'
    };
    return traducoes[tipo as keyof typeof traducoes] || tipo;
  }

  return (
    <>
      <DashboardLayout>
        <main className="flex-1 p-6 lg:p-8 bg-gray-50">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Usuários</h1>
            <Link href="/admin/usuarios/novo">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
                <Plus className="w-5 h-5" />
                Adicionar Usuário
              </button>
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="aluno">Aluno</option>
                <option value="bibliotecario">Bibliotecário</option>
                <option value="admin">Admin</option>
              </select>
              <input 
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
          </div>
          
          {loading && <p className="text-center py-10">Buscando...</p>}
          {error && <p className="text-center py-10 text-red-600 bg-red-100 rounded-lg">{error}</p>}

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {usuarios.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas Ativas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((usuario) => (
                          <tr key={usuario.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <Image
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={usuario.foto_url || '/avatar-placeholder.png'}
                                    alt={`Foto de ${usuario.nome}`}
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                                  <div className="text-sm text-gray-500">{usuario.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {usuario.tem_reserva_ativa ? (
                                <span className="flex items-center text-sm font-semibold text-yellow-800">
                                  <CheckCircle className="w-4 h-4 mr-1.5 text-yellow-600" />
                                  Sim
                                </span>
                              ) : (
                                <span className="flex items-center text-sm text-gray-500">
                                  <XCircle className="w-4 h-4 mr-1.5" />
                                  Não
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  usuario.tipo_usuario === 'bibliotecario' || usuario.tipo_usuario === 'admin'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                {getTipoUsuarioTraduzido(usuario.tipo_usuario)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.data_cadastro}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600" aria-label="Editar" title="Editar (em breve)">
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button onClick={() => openDeleteModal(usuario)} className="p-2 text-gray-400 hover:text-red-600" aria-label="Deletar">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                     <p>Nenhum usuário encontrado.</p>
                     <p className="text-sm mt-1">Tente ajustar seus filtros de busca.</p>
                  </div>
                )}
            </div>
          )}
        </main>
      </DashboardLayout>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={usuarioParaDeletar?.nome || ''}
      />
    </>
  );
}