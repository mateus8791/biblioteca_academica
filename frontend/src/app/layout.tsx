import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// 1. Importe o AuthProvider que criamos
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BiblioTech',
  description: 'Seu sistema de gerenciamento de biblioteca',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* 2. Envolva o {children} com o AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}