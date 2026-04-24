import React from 'react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4">
      <div className="bg-forest rounded-xl p-6 w-full max-w-[420px] border border-gold/20 shadow-[0_24px_48px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="m-0 text-base font-bold text-gold">{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none text-lg cursor-pointer text-white/50 hover:text-white/80">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
