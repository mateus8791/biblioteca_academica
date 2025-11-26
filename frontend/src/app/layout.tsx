'use client'; // <-- 1. Adicionado no topo para corrigir o erro de hooks

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Caminho para o seu AuthContext
import { NotificationProvider } from '../contexts/NotificationContext'; // Provider de notificações
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 2. Caminho relativo ajustado para o SupportButton
import SupportButton from './admin/emprestimos/components/SupportButton';

// 3. Caminho com alias (padrão) para o NotificationPopup (certifique-se que ele está em src/components/)
import NotificationPopup from '@/components/NotificationPopup';

// 4. HeartbeatProvider para rastreamento de sessão
import HeartbeatProvider from '@/components/HeartbeatProvider';

const inter = Inter({ subsets: ['latin'] });

// 4. Definimos a metadata como um objeto (não exportamos mais como const)
//    pois este arquivo agora é um Client Component.
const metadataObject: Metadata = {
  title: 'BiblioTech',
  description: 'Seu sistema de gerenciamento de biblioteca',
};

// --- Componente Cliente Interno ---
function LayoutContent({ children }: { children: React.ReactNode }) {
  // 5. Corrigido: usa 'usuario' e 'tipo_usuario' (como no seu AuthContext)
  // 6. Adicionado 'loading' para evitar pop-up antes do usuário carregar
  const { usuario, notifications, loading } = useAuth();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    // 7. Verifica 'loading' antes de mostrar o pop-up
    if (
        !loading && // Apenas quando o carregamento do usuário terminar
        usuario &&
        usuario.tipo_usuario === 'aluno' &&
        notifications &&
        (notifications.overdueBooks > 0 || notifications.showInactivityWarning)
       ) {
      const dismissedKey = `notification_dismissed_${usuario.id}`;
      const isDismissed = sessionStorage.getItem(dismissedKey);

      if (!isDismissed) {
        setShowNotificationPopup(true);
      }
    } else if (!loading) {
      // Se não estiver carregando e as condições não forem atendidas (ex: deslogado), esconde o pop-up
      setShowNotificationPopup(false);
    }
  }, [notifications, usuario, loading]); // 8. Adicionado 'loading' às dependências

  const handleCloseNotification = () => {
    setShowNotificationPopup(false);
    if (usuario) { // 5. Corrigido: usa 'usuario'
      const dismissedKey = `notification_dismissed_${usuario.id}`;
      sessionStorage.setItem(dismissedKey, 'true');
    }
  };
  
  // 9. Mostra um estado de carregamento enquanto o AuthContext verifica o usuário
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* 5. Corrigido: usa 'usuario' e 'tipo_usuario' */}
      {usuario && usuario.tipo_usuario === 'aluno' && <SupportButton />}
      
      {/* 5. Corrigido: usa 'usuario' */}
      {usuario && notifications && (
        <NotificationPopup
          isOpen={showNotificationPopup}
          onClose={handleCloseNotification}
          overdueCount={notifications.overdueBooks}
          daysInactive={notifications.daysInactive}
          showInactivityWarning={notifications.showInactivityWarning}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

// --- RootLayout (continua sendo o layout principal) ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR">
      {/* 4. Adicionamos a metadata manualmente no <head> */}
      <head>
         <title>{String(metadataObject.title)}</title>
         <meta name="description" content={metadataObject.description || ''} />
         {/* Adicione o link do favicon se necessário */}
         {/* <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <HeartbeatProvider>
            <NotificationProvider>
              <LayoutContent>{children}</LayoutContent>
            </NotificationProvider>
          </HeartbeatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
