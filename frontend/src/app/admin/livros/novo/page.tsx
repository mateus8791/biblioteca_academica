// Arquivo: frontend/src/app/admin/livros/novo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/services/api';
import { BookPlus, Eraser } from 'lucide-react';

export default function NovoLivroPage() {
  // Estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    ano_publicacao: '',
    num_paginas: '',
    sinopse: '',
    capa_url: '',
    autor_nome: '',      // Campo de texto simples para o nome do autor
    categoria_nome: '', // Campo de texto simples para o nome da categoria
  });

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  // Função única para atualizar qualquer campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const limparFormulario = () => {
    setFormData({
      titulo: '', isbn: '', ano_publicacao: '', num_paginas: '', sinopse: '', capa_url: '', autor_nome: '', categoria_nome: ''
    });
    setErro('');
    setSucesso('');
  };

  // Envia os dados para a API inteligente do backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso('');

    // O payload agora envia os nomes, que o backend vai processar
    const dadosParaEnviar = {
      ...formData,
      ano_publicacao: parseInt(formData.ano_publicacao) || null,
      num_paginas: parseInt(formData.num_paginas) || null,
    };

    try {
      await api.post('/livros', dadosParaEnviar);
      setSucesso('Livro cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/catalogo');
      }, 1500);
    } catch (error: any) {
      const msgErro = error.response?.data?.mensagem || "Erro desconhecido ao cadastrar.";
      setErro(msgErro);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Cadastrar Novo Livro</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos de texto do livro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título do Livro" required className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          {/* Campos de texto para Autor e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="autor_nome" value={formData.autor_nome} onChange={handleChange} placeholder="Nome do Autor" required className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="categoria_nome" value={formData.categoria_nome} onChange={handleChange} placeholder="Nome da Categoria" required className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="number" name="ano_publicacao" value={formData.ano_publicacao} onChange={handleChange} placeholder="Ano de Publicação" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="number" name="num_paginas" value={formData.num_paginas} onChange={handleChange} placeholder="Nº de Páginas" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <input type="text" name="capa_url" value={formData.capa_url} onChange={handleChange} placeholder="URL da Imagem da Capa" className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <textarea name="sinopse" value={formData.sinopse} onChange={handleChange} placeholder="Sinopse..." rows={4} className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          
          {/* Mensagens de Feedback */}
          {erro && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{erro}</p>}
          {sucesso && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center">{sucesso}</p>}
          
          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={limparFormulario} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
              <Eraser size={18} /> Limpar
            </button>
            <button type="submit" disabled={enviando} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
              <BookPlus size={18} /> {enviando ? 'Cadastrando...' : 'Cadastrar Livro'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
