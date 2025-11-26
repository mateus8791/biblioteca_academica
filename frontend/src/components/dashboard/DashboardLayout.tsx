/**
 * =====================================================
 * LAYOUT: Dashboard
 * =====================================================
 * Layout principal com sidebar dinâmica baseada no tipo de usuário
 * Renderiza a sidebar correta para cada tipo de usuário
 * =====================================================
 */

'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarAluno } from './SidebarAluno';
import { SidebarBibliotecario } from './SidebarBibliotecario';
import { SidebarAdmin } from './SidebarAdmin';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();

  // Seleciona a sidebar apropriada baseada no tipo de usuário
  const renderSidebar = () => {
    // Admin - Sidebar com todas as opções
    if (usuario?.tipo_usuario === 'admin') {
      return <SidebarAdmin />;
    }

    // Bibliotecário - Sidebar com acesso a livros, empréstimos e relatórios
    if (usuario?.tipo_usuario === 'bibliotecario') {
      return <SidebarBibliotecario />;
    }

    // Aluno - Sidebar simples
    return <SidebarAluno />;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Menu Lateral Dinâmico */}
      {renderSidebar()}

      {/* Conteúdo Principal da Página */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;