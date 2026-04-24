import React from 'react';

export default function ToastContainer({ toasts }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  
  const colors = {
    success: 'bg-green-900 border-l-4 border-green-400',
    error: 'bg-red-900 border-l-4 border-red-400',
    info: 'bg-blue-900 border-l-4 border-blue-400',
    warning: 'bg-amber-900 border-l-4 border-amber-400',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-[340px]">
      {toasts.map(t => (
        <div key={t.id} className={`text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] animate-slide-in ${colors[t.type] || colors.info}`}>
          <span className="text-base">{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
