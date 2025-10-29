// Arquivo: frontend/src/app/(store)/loja/page.tsx
'use client';

import { useEffect, useState } from "react";
import { listBooks } from "@/lib/api/books.adapter";
import { ProductCard } from "@/components/store/ProductCard";
import api from "@/services/api";

// Tipos exibidos no frontend
interface Category {
  category_id: number;
  name: string;
  descricao?: string;
}

interface Author {
  author_id: number;
  name: string;
}

export default function LojaPage() {
  const [books, setBooks] = useState<import('@/types/book').Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<import('@/types/book').Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // filtros
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title-asc");

  // --- Helpers para buscar categorias/autores no backend --------------------

  // Aceita diferentes formatos vindos da API e normaliza para {category_id, name}
  function normalizeCategories(rows: any[]): Category[] {
    if (!Array.isArray(rows)) return [];
    return rows.map((r, i) => ({
      category_id:
        Number(r?.category_id ?? r?.id ?? r?.categoria_id ?? i + 1) || (i + 1),
      name: String(r?.name ?? r?.nome ?? r?.titulo ?? "Categoria"),
      descricao: r?.descricao ?? r?.description ?? undefined,
    }));
  }

  // Aceita diferentes formatos vindos da API e normaliza para {author_id, name}
  function normalizeAuthors(rows: any[]): Author[] {
    if (!Array.isArray(rows)) return [];
    return rows.map((r, i) => ({
      author_id:
        Number(r?.author_id ?? r?.id ?? r?.autor_id ?? i + 1) || (i + 1),
      name: String(r?.name ?? r?.nome ?? "Autor"),
    }));
  }

  async function fetchCategoriesFromBackend(): Promise<Category[]> {
    try {
      // ajuste aqui caso sua rota seja diferente (ex.: '/categorias/listar')
      const res = await api.get("/categorias");
      return normalizeCategories(res.data);
    } catch {
      return [];
    }
  }

  async function fetchAuthorsFromBackend(): Promise<Author[]> {
    try {
      // ajuste aqui caso sua rota seja diferente (ex.: '/autores/listar')
      const res = await api.get("/autores");
      return normalizeAuthors(res.data);
    } catch {
      return [];
    }
  }

  // Deriva categorias/autores dos próprios livros (fallback)
  function deriveFacets(booksData: import('@/types/book').Book[]) {
    let catId = 1, autId = 1;
    const catSet = new Map<string, number>();
    const autSet = new Map<string, number>();

    for (const b of booksData) {
      const catNames =
        b.categorias?.map(c => c.nome) ??
        (b.categorias_nomes?.split(",").map((s: string) => s.trim()).filter(Boolean) ?? []);
      const autNames =
        b.autores?.map(a => a.nome) ??
        (b.autores_nomes?.split(",").map((s: string) => s.trim()).filter(Boolean) ?? []);

      for (const nome of catNames) if (!catSet.has(nome)) catSet.set(nome, catId++);
      for (const nome of autNames) if (!autSet.has(nome)) autSet.set(nome, autId++);
    }

    const categoriesArr: Category[] = Array.from(catSet, ([name, id]) => ({ category_id: id, name }));
    const authorsArr: Author[] = Array.from(autSet, ([name, id]) => ({ author_id: id, name }));
    return { categoriesArr, authorsArr };
  }

  // -------------------------------------------------------------------------

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // Livros (usa seu adapter com axios/baseURL já configurado)
        const booksData = await listBooks();
        if (!alive) return;

        // Busca no backend Express (rotas reais), sem usar /api do Next:
        let [cats, auts] = await Promise.all([
          fetchCategoriesFromBackend(),
          fetchAuthorsFromBackend(),
        ]);

        // Se backend não devolver nada, derivamos dos livros (fallback)
        if (!cats.length || !auts.length) {
          const d = deriveFacets(booksData);
          if (!cats.length) cats = d.categoriesArr;
          if (!auts.length) auts = d.authorsArr;
        }

        setBooks(booksData ?? []);
        setFilteredBooks(booksData ?? []);
        setCategories(cats);
        setAuthors(auts);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Falha ao carregar dados");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // aplica filtros/ordenação
  useEffect(() => {
    let result = [...books];

    if (selectedCategory !== null) {
      const categoryName = categories.find(c => c.category_id === selectedCategory)?.name;
      if (categoryName) {
        result = result.filter(book => {
          const names =
            book.categorias?.map(c => c.nome) ??
            (book.categorias_nomes?.split(",").map((s: string) => s.trim()) ?? []);
          return names.includes(categoryName);
        });
      }
    }

    if (selectedAuthor !== null) {
      const authorName = authors.find(a => a.author_id === selectedAuthor)?.name;
      if (authorName) {
        result = result.filter(book => {
          const names =
            book.autores?.map(a => a.nome) ??
            (book.autores_nomes?.split(",").map((s: string) => s.trim()) ?? []);
          return names.includes(authorName);
        });
      }
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book =>
        (book.titulo ?? "").toLowerCase().includes(term) ||
        (book.autores_nomes ?? "").toLowerCase().includes(term) ||
        (book.isbn ?? "").toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case "title-asc":
        result.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
        break;
      case "title-desc":
        result.sort((a, b) => (b.titulo || '').localeCompare(a.titulo || ''));
        break;
      case "year-desc":
        result.sort((a, b) => (b.ano_publicacao || 0) - (a.ano_publicacao || 0));
        break;
      case "year-asc":
        result.sort((a, b) => (a.ano_publicacao || 0) - (b.ano_publicacao || 0));
        break;
      case "available":
        result.sort((a, b) => (b.quantidade_disponivel || 0) - (a.quantidade_disponivel || 0));
        break;
    }

    setFilteredBooks(result);
  }, [books, selectedCategory, selectedAuthor, searchTerm, sortBy, categories, authors]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedAuthor(null);
    setSearchTerm("");
    setSortBy("title-asc");
  };

  const hasActiveFilters = selectedCategory !== null || selectedAuthor !== null || searchTerm.trim() !== "";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando biblioteca...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar</h3>
          <p className="text-red-600">{err}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ... seu header/hero permanece igual ... */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={selectedCategory ?? ""}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                <select
                  value={selectedAuthor ?? ""}
                  onChange={(e) => setSelectedAuthor(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Todos os autores</option>
                  {authors.map((author) => (
                    <option key={author.author_id} value={author.author_id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
                <option value="year-desc">Ano (Mais recente)</option>
                <option value="year-asc">Ano (Mais antigo)</option>
                <option value="available">Disponibilidade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">Nenhum livro encontrado.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {filteredBooks.map((book, idx) => {
              const safeKey =
                Number.isFinite(Number(book.id)) && book.id !== null
                  ? `book-${book.id}`
                  : `book-fallback-${idx}`;
              return <ProductCard key={safeKey} book={book} />;
            })}
          </div>
        )}
      </div>

      {/* seção destaque (igual ao seu) */}
    </main>
  );
}
