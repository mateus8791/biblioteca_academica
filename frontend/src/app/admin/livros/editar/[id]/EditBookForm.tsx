// Arquivo: frontend/src/app/admin/livros/editar/[id]/EditBookForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import api from '@/services/api';
import { Save } from 'lucide-react';

interface Autor { id: string; nome: string; }
interface Categoria { id: string; nome: string; }
interface OptionType { value: string; label: string; }

// --- Interface atualizada para receber a quantidade ---
interface BookData {
  id: string;
  titulo: string;
  isbn: string | null;
  ano_publicacao: number | null;
  num_paginas: number | null;
  sinopse: string | null;
  capa_url: string | null;
  quantidade_disponivel: number | null; // <-- NOVO CAMPO
  autores_ids: string[];
  categorias_ids: string[];
}

interface EditBookFormProps {
  initialBookData: BookData;
  autores: Autor[];
  categorias: Categoria[];
}

export default function EditBookForm({ initialBookData, autores, categorias }: EditBookFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    isbn: '',
    ano_publicacao: '',
    num_paginas: '',
    sinopse: '',
    capa_url: '',
    quantidade_disponivel: '', // <-- NOVO CAMPO NO ESTADO
  });
  
  const autorOptions: OptionType[] = autores.map(a => ({ value: a.id, label: a.nome }));
  const categoriaOptions: OptionType[] = categorias.map(c => ({ value: c.id, label: c.nome }));

  const [autoresSelecionados, setAutoresSelecionados] = useState<readonly OptionType[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<readonly OptionType[]>([]);
  
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialBookData) {
      setFormData({
        titulo: initialBookData.titulo || '',
        isbn: initialBookData.isbn || '',
        ano_publicacao: initialBookData.ano_publicacao?.toString() || '',
        num_paginas: initialBookData.num_paginas?.toString() || '',
        sinopse: initialBookData.sinopse || '',
        capa_url: initialBookData.capa_url || '',
        quantidade_disponivel: initialBookData.quantidade_disponivel?.toString() || '0', // <-- POPULA O NOVO CAMPO
      });
      setAutoresSelecionados(autorOptions.filter(opt => initialBookData.autores_ids?.includes(opt.value)));
      setCategoriasSelecionadas(categoriaOptions.filter(opt => initialBookData.categorias_ids?.includes(opt.value)));
    }
  }, [initialBookData, autorOptions, categoriaOptions]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.currentTarget.name]: e.currentTarget.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso('');
    
    const dadosParaEnviar = {
      ...formData,
      ano_publicacao: Number(formData.ano_publicacao) || null,
      num_paginas: Number(formData.num_paginas) || null,
      quantidade_disponivel: Number(formData.quantidade_disponivel) || 0, // <-- ENVIA O NOVO CAMPO
      autores_ids: autoresSelecionados.map(a => a.value),
      categorias_ids: categoriasSelecionadas.map(c => c.value),
    };

    try {
      await api.put(`/livros/${initialBookData.id}`, dadosParaEnviar);
      setSucesso('Livro atualizado com sucesso!');
      // Não redireciona imediatamente para o usuário ver a mensagem
      setTimeout(() => router.push('/admin/livros'), 2000); 
    } catch (error: any) {
      setErro(error.response?.data?.message || "Erro desconhecido ao atualizar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar Livro</h1>
      <p className="mb-6 text-gray-500 border-b pb-4">Alterando dados de: <strong>{initialBookData.titulo}</strong></p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título do Livro" required className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input type="number" name="ano_publicacao" value={formData.ano_publicacao} onChange={handleChange} placeholder="Ano de Publicação" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="number" name="num_paginas" value={formData.num_paginas} onChange={handleChange} placeholder="Nº de Páginas" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          {/* --- Adicionamos o novo campo de quantidade --- */}
          <input type="number" name="quantidade_disponivel" value={formData.quantidade_disponivel} onChange={handleChange} placeholder="Qtd. Disponível" required min="0" className="p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="text" name="capa_url" value={formData.capa_url} onChange={handleChange} placeholder="URL da Imagem da Capa" className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        <textarea name="sinopse" value={formData.sinopse} onChange={handleChange} placeholder="Sinopse do Livro..." rows={4} className="w-full p-3 border-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Autores</label>
            <Select isMulti options={autorOptions} value={autoresSelecionados} onChange={setAutoresSelecionados} placeholder="Selecione..." noOptionsMessage={() => "Nenhum autor"} className="text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
            <Select isMulti options={categoriaOptions} value={categoriasSelecionadas} onChange={setCategoriasSelecionadas} placeholder="Selecione..." noOptionsMessage={() => "Nenhuma categoria"} className="text-black" />
          </div>
        </div>
        {erro && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center">{sucesso}</p>}
        <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={() => router.push('/admin/livros')} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={enviando} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300">
              <Save size={18} /> {enviando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
      </form>
    </div>
  );
}