import type { ReactNode } from 'react';
import '../globals.css';

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
