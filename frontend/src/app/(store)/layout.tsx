import type { ReactNode } from 'react';
import { SidebarStorefront } from '@/components/dashboard/SidebarStorefront';
import '../globals.css';

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SidebarStorefront />
      <div className="pl-64 min-h-screen bg-gray-50">{children}</div>
    </div>
  );
}
