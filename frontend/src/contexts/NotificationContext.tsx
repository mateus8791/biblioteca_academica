/**
 * =====================================================
 * CONTEXT: Notificações
 * =====================================================
 * Gerenciamento de estado global para notificações
 * Polling automático, cache e sincronização
 * =====================================================
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationContextType } from '@/types/notification';
import { useAuth } from './AuthContext';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const POLLING_INTERVAL = 30000; // 30 segundos
const MAX_NOTIFICATIONS = 50; // Limite de notificações em memória

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { usuario, token } = useAuth();

  // Contagem de não lidas
  const unreadCount = notifications.filter(n => !n.lida).length;

  /**
   * Busca notificações do backend (ou mock se API não existir)
   */
  const fetchNotifications = useCallback(async () => {
    if (!usuario || !token) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Quando a API estiver implementada, descomentar:
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Erro ao buscar notificações');
      // }
      //
      // const data = await response.json();
      // setNotifications(data.slice(0, MAX_NOTIFICATIONS));

      // MOCK: Dados de exemplo enquanto a API não existe
      const mockNotifications: Notification[] = [
        {
          id: 1,
          destinatarioId: usuario.id,
          tipo: 'sistema',
          assunto: 'Livro disponível para retirada',
          mensagem: 'O livro "Clean Code" que você reservou está disponível para retirada na biblioteca.',
          status: 'delivered',
          criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
          categoria: 'reserva',
          lida: false,
        },
        {
          id: 2,
          destinatarioId: usuario.id,
          tipo: 'sistema',
          assunto: 'Prazo de devolução próximo',
          mensagem: 'O livro "JavaScript: The Good Parts" deve ser devolvido em 2 dias.',
          status: 'delivered',
          criadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
          categoria: 'emprestimo',
          lida: false,
        },
        {
          id: 3,
          destinatarioId: usuario.id,
          tipo: 'sistema',
          assunto: 'Nova conquista desbloqueada!',
          mensagem: 'Parabéns! Você desbloqueou a conquista "Leitor Assíduo" por ler 10 livros este mês.',
          status: 'delivered',
          criadoEm: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
          categoria: 'conquista',
          lida: true,
        },
        {
          id: 4,
          destinatarioId: usuario.id,
          tipo: 'sistema',
          assunto: 'Livro atrasado',
          mensagem: 'O livro "Design Patterns" está com 3 dias de atraso. Por favor, realize a devolução.',
          status: 'delivered',
          criadoEm: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
          categoria: 'multa',
          lida: false,
        },
        {
          id: 5,
          destinatarioId: usuario.id,
          tipo: 'sistema',
          assunto: 'Novos livros no catálogo',
          mensagem: 'Foram adicionados 15 novos títulos de programação ao catálogo. Confira!',
          status: 'delivered',
          criadoEm: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
          categoria: 'aviso',
          lida: true,
        },
      ];

      // Filtra apenas as notificações do usuário atual
      const userNotifications = mockNotifications
        .filter(n => n.destinatarioId === usuario.id)
        .slice(0, MAX_NOTIFICATIONS);

      setNotifications(userNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar notificações:', err);
    } finally {
      setLoading(false);
    }
  }, [usuario, token]);

  /**
   * Marca uma notificação como lida
   */
  const markAsRead = useCallback(async (id: number) => {
    try {
      // TODO: Quando a API estiver implementada, descomentar:
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Atualiza localmente
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, lida: true, status: 'read' as const } : n))
      );
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  }, [token]);

  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // TODO: Quando a API estiver implementada, descomentar:
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Atualiza localmente
      setNotifications(prev =>
        prev.map(n => ({ ...n, lida: true, status: 'read' as const }))
      );
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  }, [token]);

  /**
   * Deleta uma notificação
   */
  const deleteNotification = useCallback(async (id: number) => {
    try {
      // TODO: Quando a API estiver implementada, descomentar:
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Remove localmente
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
    }
  }, [token]);

  /**
   * Limpa todas as notificações
   */
  const clearAll = useCallback(async () => {
    try {
      // TODO: Quando a API estiver implementada, descomentar:
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/clear-all`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // Limpa localmente
      setNotifications([]);
    } catch (err) {
      console.error('Erro ao limpar notificações:', err);
    }
  }, [token]);

  // Busca inicial e polling
  useEffect(() => {
    if (usuario && token) {
      fetchNotifications();

      // Polling a cada 30 segundos
      const interval = setInterval(fetchNotifications, POLLING_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [usuario, token, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
