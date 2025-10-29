'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api'; // Verifique se o caminho está correto

// --- Interface Usuario ---
interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'bibliotecario' | 'admin';
  foto_url: string | null;
}

// --- Interface NotificationData (para dados da API de notificações) ---
// Esta interface define a estrutura dos dados das notificações
interface NotificationData {
  overdueBooks: number;
  daysInactive: number | null;
  showInactivityWarning: boolean;
}

// --- Interface AuthContextType (adicionado 'notifications') ---
interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  notifications: NotificationData | null; // <-- CORREÇÃO: Propriedade adicionada
  login: (email: string, senha: string) => Promise<any>;
  loginWithId: (id: string, profile: 'aluno' | 'bibliotecario') => Promise<Usuario | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationData | null>(null); // <-- Novo estado
  const router = useRouter();

  // Função para buscar notificações no backend
  const checkNotifications = async () => {
    const token = localStorage.getItem('bibliotech_token');
    if (!token) return; // Não busca se não estiver logado

    try {
      // A rota '/notifications/check' usa o token para identificar o usuário no backend
      const response = await api.get<NotificationData>('/notifications/check');
      // Guarda as notificações apenas se houver algo a mostrar
      if (response.data && (response.data.overdueBooks > 0 || response.data.showInactivityWarning)) {
          setNotifications(response.data);
      } else {
          setNotifications(null); // Limpa se não houver avisos
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setNotifications(null); // Limpa em caso de erro
    }
  };

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('bibliotech_token');
      const userJson = localStorage.getItem('bibliotech_usuario');
      if (token && userJson) {
        try {
          const loadedUser: Usuario = JSON.parse(userJson);
          setUsuario(loadedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Busca notificações ao carregar usuário, mas APENAS se for aluno
          if (loadedUser.tipo_usuario === 'aluno') {
            await checkNotifications();
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          logout(); // Limpa dados corrompidos
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // O logout não precisa estar na dependência aqui

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, senha });
    const { usuario: userData, token, perfis } = data;
    localStorage.setItem('bibliotech_token', token);
    localStorage.setItem('bibliotech_usuario', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(userData);

    // Limpa notificações antigas, reseta o dismiss da sessão e busca novas (se aluno)
    setNotifications(null);
    if(userData) {
      sessionStorage.removeItem(`notification_dismissed_${userData.id}`);
    }
    if (userData.tipo_usuario === 'aluno') {
      await checkNotifications();
    }
    return perfis;
  };

  const loginWithId = async (id: string, profile: 'aluno' | 'bibliotecario') => {
    const { data } = await api.post('/auth/login-id', { id, profile });
    const { usuario: userData, token } = data;
    localStorage.setItem('bibliotech_token', token);
    localStorage.setItem('bibliotech_usuario', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(userData);

    // Limpa notificações antigas, reseta o dismiss da sessão e busca novas (se aluno)
    setNotifications(null);
    if(userData) {
      sessionStorage.removeItem(`notification_dismissed_${userData.id}`);
    }
    if (userData.tipo_usuario === 'aluno') {
      await checkNotifications();
    }
    return userData;
  };

  const logout = () => {
    const userId = usuario?.id;
    setUsuario(null);
    setNotifications(null); // Limpa notificações no logout
    localStorage.removeItem('bibliotech_token');
    localStorage.removeItem('bibliotech_usuario');
    if (userId) {
      sessionStorage.removeItem(`notification_dismissed_${userId}`); // Limpa o dismiss da sessão
    }
    delete api.defaults.headers.common['Authorization'];
    router.push('/');
  };

  const isAuthenticated = !!usuario;

  return (
    // Adiciona 'notifications' ao valor do contexto
    <AuthContext.Provider value={{ usuario, isAuthenticated, loading, login, loginWithId, logout, notifications }}>
      {!loading ? children : null} {/* Renderiza children apenas quando o loading inicial terminar */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

