// Arquivo: frontend/src/components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BookOpen,      // Catálogo
  Library,       // Meus Livros (agora não usado no label, mas mantido o ícone se precisar)
  BookMarked,    // Reservas
  Users,         // Gerenciar Usuários
  BarChart3,     // Relatórios
  User,          // Meu Perfil
  LogOut,        // Sair
  Award,         // Ícone para Conquistas
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Componente reutilizável para cada item do menu
const NavLink = ({ href, icon: Icon, label, onClick }: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const content = (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </div>
  );
  
  return href ? <Link href={href}>{content}</Link> : <button onClick={onClick} className="w-full text-left">{content}</button>;
};

// Componente principal do Menu
export const Sidebar = () => {
  const { usuario, logout } = useAuth();
  
  // Menu do Aluno
  const navLinksAluno = [
    { href: '/catalogo', icon: BookOpen, label: 'Catálogo' },
    { href: '/minhas-conquistas', icon: Award, label: 'Minhas Conquistas' },
    // --- AQUI ESTÁ A CORREÇÃO ---
    // O link "Minhas Reservas" agora aponta para a página de empréstimos "/meus-livros"
    { href: '/meus-livros', icon: BookMarked, label: 'Minhas Reservas' }, 
    { href: '/perfil', icon: User, label: 'Meu Perfil' },
  ];

  // Menu do Bibliotecário/Admin
  const navLinksBibliotecario = [
    { href: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/admin/livros', icon: BookOpen, label: 'Gerenciar Livros' },
    { href: '/admin/emprestimos', icon: BookMarked, label: 'Gerenciar Empréstimos' },
    { href: '/admin/usuarios', icon: Users, label: 'Gerenciar Usuários' },
    { href: '/perfil', icon: User, label: 'Meu Perfil' },
  ];

  const linksParaMostrar =
    usuario?.tipo_usuario === 'bibliotecario' || usuario?.tipo_usuario === 'admin'
      ? navLinksBibliotecario
      : navLinksAluno;

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center p-4 border-b border-gray-700 h-20">
        <Image src="/logo.png" alt="Logo Bibliotech" width={40} height={40} />
        <h2 className="text-2xl font-bold ml-3">Bibliotech</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {linksParaMostrar.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <NavLink
          href="" 
          icon={LogOut}
          label="Sair"
          onClick={logout}
        />
      </div>
    </aside>
  );
};