// Arquivo: frontend/src/components/dashboard/DashboardLayout.tsx
import React from 'react';
import { Sidebar } from './Sidebar'; // Importa o menu que acabamos de criar

// Este é o "molde" para nossas dashboards.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Menu Lateral (Sidebar) */}
      <Sidebar />

      {/* Conteúdo Principal da Página */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;