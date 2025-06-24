// Arquivo: frontend/src/contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api'; 

// --- CORREÇÃO AQUI: Adicionamos foto_url à interface Usuario ---
interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'bibliotecario' | 'admin';
  foto_url: string | null; // <-- NOVO CAMPO
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<any>; // Retorna os perfis
  loginWithId: (id: string, profile: 'aluno' | 'bibliotecario') => Promise<Usuario | null>;
  logout: () => void;
}

// O resto do arquivo continua o mesmo...
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem('bibliotech_token');
      const userJson = localStorage.getItem('bibliotech_usuario');
      if (token && userJson) {
        try {
          setUsuario(JSON.parse(userJson));
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, senha });
    const { usuario: userData, token, perfis } = data; // Assumindo que a API retorna perfis
    localStorage.setItem('bibliotech_token', token);
    localStorage.setItem('bibliotech_usuario', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(userData);
    return perfis; // Retorna os perfis para a página de login decidir o que fazer
  };

  const loginWithId = async (id: string, profile: 'aluno' | 'bibliotecario') => {
    const { data } = await api.post('/auth/login-id', { id, profile });
    const { usuario: userData, token } = data;
    localStorage.setItem('bibliotech_token', token);
    localStorage.setItem('bibliotech_usuario', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(userData);
    return userData;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('bibliotech_token');
    localStorage.removeItem('bibliotech_usuario');
    delete api.defaults.headers.common['Authorization'];
    router.push('/');
  };

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, loading, login, loginWithId, logout }}>
      {children}
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