// frontend/src/app/test-notification/page.tsx
'use client';

import React, { useState } from 'react';
import NotificationPopup from '@/components/NotificationPopup';

export default function TestNotificationPage() {
  const [scenario, setScenario] = useState<string>('');

  const scenarios = {
    overdue: {
      isOpen: true,
      overdueCount: 3,
      daysInactive: null,
      showInactivityWarning: false,
    },
    inactivity: {
      isOpen: true,
      overdueCount: 0,
      daysInactive: 15,
      showInactivityWarning: true,
    },
    both: {
      isOpen: true,
      overdueCount: 2,
      daysInactive: 10,
      showInactivityWarning: true,
    },
    oneOverdue: {
      isOpen: true,
      overdueCount: 1,
      daysInactive: null,
      showInactivityWarning: false,
    },
    oneDay: {
      isOpen: true,
      overdueCount: 0,
      daysInactive: 1,
      showInactivityWarning: true,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Teste do NotificationPopup</h1>
        
        <div className="space-y-3">
          <button
            onClick={() => setScenario('overdue')}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Cenário: Livros Atrasados (3)
          </button>
          
          <button
            onClick={() => setScenario('inactivity')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cenário: Inatividade (15 dias)
          </button>
          
          <button
            onClick={() => setScenario('both')}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Cenário: Ambos (2 atrasados + 10 dias inativo)
          </button>
          
          <button
            onClick={() => setScenario('oneOverdue')}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Cenário: 1 Livro Atrasado (teste singular)
          </button>
          
          <button
            onClick={() => setScenario('oneDay')}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Cenário: 1 Dia Inativo (teste singular)
          </button>
          
          <button
            onClick={() => setScenario('')}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Fechar Popup
          </button>
        </div>

        {/* Informações do cenário atual */}
        {scenario && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Cenário Atual:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(scenarios[scenario as keyof typeof scenarios], null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Renderiza o popup baseado no cenário selecionado */}
      {scenario && (
        <NotificationPopup
          {...scenarios[scenario as keyof typeof scenarios]}
          onClose={() => setScenario('')}
        />
      )}
    </div>
  );
}