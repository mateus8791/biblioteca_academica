// frontend/src/components/SupportButton.tsx
'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Usando react-icons para o ícone do WhatsApp

// Substitua pelo seu número de telefone completo (código do país + DDD + número, sem espaços ou símbolos)
const WHATSAPP_NUMBER = '5549999999999';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const SupportButton: React.FC = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-colors duration-200"
      aria-label="Contatar Suporte via WhatsApp"
    >
      <FaWhatsapp size={24} /> {/* Ícone do WhatsApp */}
    </a>
  );
};

export default SupportButton;