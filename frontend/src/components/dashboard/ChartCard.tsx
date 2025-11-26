'use client';

import React, { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  subtitle,
  action,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div>
          {action || (
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
