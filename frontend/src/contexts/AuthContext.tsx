'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
// O caminho relativo '../services/api' está correto, assumindo que api.ts está em 'src/services/'
import api from '../services/api'; 

// --- Interface correta para o seu Usuário ---
interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'aluno' | 'bibliotecario' | 'admin';
  foto_url: string | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<any>; // Retorna os perfis
  loginWithId: (id: string, profile: 'aluno' | 'bibliotecario') => Promise<Usuario | null>;
  logout: () => void;
}

// O contexto é criado aqui, mas NÃO é exportado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// O Provider é exportado
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
          logout(); // Limpa se os dados estiverem corrompidos
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/auth/login', { email, senha });
    const { usuario: userData, token, perfis } = data; 
    localStorage.setItem('bibliotech_token', token);
    localStorage.setItem('bibliotech_usuario', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUsuario(userData);
    return perfis; 
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

// --- CORREÇÃO ESTÁ AQUI ---
// Esta é a exportação que faltava no seu arquivo salvo.
// O 'page.tsx' (no Canvas) importa 'useAuth', então este arquivo DEVE exportá-lo.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

