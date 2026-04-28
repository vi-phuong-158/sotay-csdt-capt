import React from 'react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="m-0 text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="bg-slate-50 w-8 h-8 rounded-full border-none flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
