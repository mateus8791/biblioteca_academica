/**
 * =====================================================
 * PÁGINA: Dashboard Administrativo
 * =====================================================
 * Hub central para administradores com visão geral
 * do sistema, estatísticas e acesso rápido.
 *
 * Acesso: SuperAdmin e Bibliotecários
 * =====================================================
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import {
  FiUsers,
  FiBook,
  FiShield,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp
} from 'react-icons/fi';

interface DashboardStats {
  totalUsuarios: number;
  totalLivros: number;
  sessoesAtivas: number;
  loginsHoje: number;
  totalRoles: number;
  usuariosBloqueados: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { usuario, isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Verifica autenticação e nível de acesso
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (!loading && usuario && usuario.accessLevel === 'aluno') {
      router.push('/catalogo'); // Alunos não têm acesso ao admin
    }
  }, [loading, isAuthenticated, usuario, router]);

  // Carrega estatísticas
  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingStats(true);

        // Buscar estatísticas de diferentes endpoints
        const [usersRes, booksRes, logsRes, rolesRes] = await Promise.all([
          api.get('/usuarios'),
          api.get('/livros'),
          api.get('/admin/access-logs/stats'),
          api.get('/admin/roles')
        ]);

        const statsData: DashboardStats = {
          totalUsuarios: usersRes.data?.usuarios?.length || 0,
          totalLivros: booksRes.data?.length || 0,
          sessoesAtivas: logsRes.data?.estatisticas?.sessoesAtivas || 0,
          loginsHoje: logsRes.data?.estatisticas?.hoje?.total_hoje || 0,
          totalRoles: rolesRes.data?.total || 0,
          usuariosBloqueados: 0 // TODO: Implementar endpoint
        };

        setStats(statsData);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [isAuthenticated]);

  if (loading || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo de volta, <span className="font-semibold">{usuario.nome}</span>
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Usuários */}
        <StatCard
          title="Total de Usuários"
          value={stats?.totalUsuarios || 0}
          icon={<FiUsers className="w-6 h-6" />}
          color="blue"
          loading={loadingStats}
          link="/admin/usuarios"
        />

        {/* Total de Livros */}
        <StatCard
          title="Total de Livros"
          value={stats?.totalLivros || 0}
          icon={<FiBook className="w-6 h-6" />}
          color="green"
          loading={loadingStats}
          link="/admin/livros"
        />

        {/* Sessões Ativas */}
        <StatCard
          title="Sessões Ativas"
          value={stats?.sessoesAtivas || 0}
          icon={<FiActivity className="w-6 h-6" />}
          color="purple"
          loading={loadingStats}
          link="/admin/logs-acesso"
        />

        {/* Logins Hoje */}
        <StatCard
          title="Logins Hoje"
          value={stats?.loginsHoje || 0}
          icon={<FiClock className="w-6 h-6" />}
          color="orange"
          loading={loadingStats}
          link="/admin/logs-acesso"
        />
      </div>

      {/* Grid de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acesso Rápido */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" />
            Acesso Rápido
          </h2>
          <div className="space-y-3">
            <QuickAccessButton
              title="Gerenciar Permissões"
              description="Criar e editar grupos de permissão"
              icon={<FiShield />}
              link="/admin/permissoes"
              color="purple"
            />
            <QuickAccessButton
              title="Logs de Acesso"
              description="Visualizar sessões e auditoria"
              icon={<FiActivity />}
              link="/admin/logs-acesso"
              color="blue"
            />
            <QuickAccessButton
              title="Gerenciar Usuários"
              description="Bloquear, atribuir roles e notificar"
              icon={<FiUsers />}
              link="/admin/usuarios"
              color="green"
            />
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sistema RBAC</h2>
          <div className="space-y-4">
            <InfoRow
              label="Grupos de Permissão"
              value={stats?.totalRoles || 0}
              icon={<FiShield className="text-purple-600" />}
            />
            <InfoRow
              label="Usuários Bloqueados"
              value={stats?.usuariosBloqueados || 0}
              icon={<FiXCircle className="text-red-600" />}
            />
            <InfoRow
              label="Sessões Ativas"
              value={stats?.sessoesAtivas || 0}
              icon={<FiCheckCircle className="text-green-600" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== COMPONENTES AUXILIARES =====

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  loading?: boolean;
  link?: string;
}

function StatCard({ title, value, icon, color, loading, link }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  const router = useRouter();

  const handleClick = () => {
    if (link) router.push(link);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-md p-6 ${link ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      {loading ? (
        <div className="mt-2 h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
      )}
    </div>
  );
}

interface QuickAccessButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: 'blue' | 'green' | 'purple';
}

function QuickAccessButton({ title, description, icon, link, color }: QuickAccessButtonProps) {
  const router = useRouter();

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
  };

  return (
    <button
      onClick={() => router.push(link)}
      className="w-full group flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className={`p-3 rounded-lg ${colorClasses[color]} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}

interface InfoRowProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  );
}
