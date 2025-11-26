'use client';

/**
 * Dashboard do Bibliotecário
 * Página inicial após login como bibliotecário
 */

export default function BibliotecarioDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Bibliotecário</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao painel de gerenciamento da biblioteca
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Acesso Rápido */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
          <div className="space-y-3">
            <a
              href="/bibliotecario/emprestimos"
              className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-blue-900">Gerenciar Empréstimos</span>
            </a>
            <a
              href="/bibliotecario/livros"
              className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-green-900">Gerenciar Livros</span>
            </a>
            <a
              href="/bibliotecario/usuarios"
              className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-purple-900">Gerenciar Usuários</span>
            </a>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
          <p className="text-gray-600">
            Use o menu lateral para navegar entre as diferentes funcionalidades disponíveis.
          </p>
        </div>

        {/* Relatórios */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios</h3>
          <a
            href="/bibliotecario/relatorios"
            className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <span className="font-medium text-orange-900">Ver Relatórios</span>
          </a>
        </div>
      </div>
    </div>
  );
}
