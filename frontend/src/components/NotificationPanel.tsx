/**
 * =====================================================
 * COMPONENT: NotificationPanel
 * =====================================================
 * Painel deslizante de notificações com design moderno
 * Animações suaves, categorias coloridas, interativo
 * =====================================================
 */

'use client';

import React, { useEffect } from 'react';
import { X, Check, Trash2, CheckCheck, Bell, BookOpen, Award, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationCategory } from '@/types/notification';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Retorna ícone e cor baseado na categoria da notificação
 */
const getCategoryConfig = (categoria?: NotificationCategory) => {
  switch (categoria) {
    case 'emprestimo':
      return {
        icon: BookOpen,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
      };
    case 'reserva':
      return {
        icon: BookOpen,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-800',
      };
    case 'multa':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800',
      };
    case 'conquista':
      return {
        icon: Award,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
      };
    case 'aviso':
      return {
        icon: Info,
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200 dark:border-purple-800',
      };
    default:
      return {
        icon: Bell,
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        iconColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-200 dark:border-gray-700',
      };
  }
};

/**
 * Formata timestamp relativo (ex: "2 horas atrás")
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

/**
 * Item individual de notificação
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const config = getCategoryConfig(notification.categoria);
  const IconComponent = config.icon;

  return (
    <div
      className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-200 hover:shadow-md ${
        notification.lida ? 'opacity-70' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Ícone da categoria */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {notification.assunto}
            </h4>
            {!notification.lida && (
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {notification.mensagem}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(notification.criadoEm)}
            </span>

            {/* Ações */}
            <div className="flex gap-1">
              {!notification.lida && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Marcar como lida"
                >
                  <Check className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                title="Deletar"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Painel principal de notificações
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  // Bloqueia scroll do body quando o painel está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fecha com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Painel deslizante */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Notificações</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-100">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </span>
              <button
                onClick={markAllAsRead}
                className="text-xs text-white hover:text-blue-100 flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100vh-140px)]">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Você está em dia! Não há notificações no momento.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>

        {/* Rodapé */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={clearAll}
              className="w-full py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
            >
              Limpar todas as notificações
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
