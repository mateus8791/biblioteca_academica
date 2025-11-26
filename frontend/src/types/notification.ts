/**
 * =====================================================
 * TYPES: Notificações
 * =====================================================
 * Definições de tipos para o sistema de notificações
 * =====================================================
 */

export type NotificationType = 'email' | 'whatsapp' | 'sistema';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read' | 'unread';
export type NotificationCategory = 'emprestimo' | 'reserva' | 'multa' | 'conquista' | 'aviso' | 'sistema';

export interface Notification {
  id: number;
  enviadoPor?: string;
  enviadoPorNome?: string;
  enviadoPorEmail?: string;
  destinatarioId: string;
  destinatarioNome?: string;
  destinatarioEmail?: string;
  tipo: NotificationType;
  assunto?: string;
  mensagem: string;
  status: NotificationStatus;
  erro?: string;
  enviadoEm?: string;
  entregueEm?: string;
  criadoEm: string;
  atualizadoEm?: string;
  categoria?: NotificationCategory;
  lida?: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
}
