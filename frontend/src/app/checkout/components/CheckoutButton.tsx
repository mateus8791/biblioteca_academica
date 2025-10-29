// Arquivo: frontend/src/app/checkout/components/CheckoutButton.tsx
// (ou frontend/src/app/checkout/CheckoutButton.tsx se não criou a subpasta)

import React from 'react';

interface CheckoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'lg'; // Adicionamos a opção de tamanho
  children: React.ReactNode;
}

const CheckoutButton = React.forwardRef<HTMLButtonElement, CheckoutButtonProps>(
  ({ className, size = 'default', children, ...props }, ref) => {

    // --- Estilos Base Tailwind ---
    const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // --- Estilos por Variante (ex: default, outline, etc. - simplificado para default) ---
    const variantStyle = "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90";

    // --- Estilos por Tamanho ---
    let sizeStyle = "h-10 px-4 py-2"; // default
    if (size === 'lg') {
      sizeStyle = "h-11 rounded-md px-8 text-lg"; // Ajustado para ser maior
    }

    // Combina as classes Tailwind
    const combinedClassName = `${baseStyle} ${variantStyle} ${sizeStyle} ${className || ''}`;

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CheckoutButton.displayName = "CheckoutButton";

export default CheckoutButton;