import React, { useState } from 'react';
import Modal from './Modal';
import { useApp } from '../context/AppContext';

const NOTEBOOK_URL = 'https://notebooklm.google.com/notebook/53536c72-fb38-4b28-a622-435079600f14';

export default function Sidebar({ activeNav, setActiveNav, onLogout, user, open, onClose }) {
  const { newDocsCount } = useApp();
  const [showAIModal, setShowAIModal] = useState(false);
  const navItems = [
    { id: 'home',   icon: '🏠', label: 'Trang chủ' },
    { id: 'search', icon: '🔍', label: 'Tra cứu văn bản' },
    ...(user?.role === 'admin' ? [{ id: 'admin', icon: '⚙️', label: 'Quản trị hệ thống' }] : []),
  ];

  const handleNav = (id) => { setActiveNav(id); onClose(); };

  return (
    <>
      {/* Overlay (mobile only via CSS) */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
        {/* Logo */}
        <div className="p-[18px_16px] border-b border-forest/10 bg-forest-light flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gold text-xs font-extrabold tracking-wide">CẨM NANG</div>
            <div className="text-white/70 text-[10px] font-bold">Pháp luật &amp; Nghiệp vụ</div>
          </div>
          {/* Close btn – hidden on desktop via CSS */}
          <button className="hamburger-btn bg-white/10 border-none text-white/60 w-8 h-8 rounded-lg cursor-pointer text-base flex items-center justify-center hover:bg-white/20" onClick={onClose}>✕</button>
        </div>

        {/* User card */}
        {user && (
          <div className="p-[12px_14px] border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
            <div className="w-[38px] h-[38px] rounded-full bg-forest flex items-center justify-center text-[15px] font-extrabold text-gold shrink-0 border border-gold/20">
              {user.full_name?.charAt(user.full_name.lastIndexOf(' ')+1) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-800 text-xs font-bold truncate">{user.full_name}</div>
              <div className="text-slate-500 text-[10px] truncate">{user.unit}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-[10px_8px] flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} className="nav-item flex items-center gap-3 p-[11px_14px] rounded-lg cursor-pointer transition-all border-none w-full text-left"
                onClick={() => handleNav(item.id)}
                style={{
                  background: active ? '#f0fdf4' : 'transparent',
                  color: active ? '#166534' : '#1e293b',
                  fontWeight: active ? 800 : 600, fontSize:14,
                  borderLeft: active ? '4px solid #166534' : '4px solid transparent',
                }}>
                <span className="relative text-lg w-[22px] text-center">
                  {item.icon}
                  {item.id === 'home' && newDocsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                      {newDocsCount > 9 ? '9+' : newDocsCount}
                    </span>
                  )}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.id === 'home' && newDocsCount > 0 && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">Mới</span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-slate-100" />

          {/* Sổ tay AI */}
          <button
            onClick={() => { setShowAIModal(true); onClose(); }}
            className="flex items-center gap-3 p-[11px_14px] rounded-lg transition-all border-none w-full text-left cursor-pointer group"
            style={{ borderLeft: '4px solid transparent', fontSize: 14, fontWeight: 600, color: '#1e293b', background: 'transparent' }}
          >
            <span className="text-lg w-[22px] text-center">🤖</span>
            <span className="flex-1">Sổ tay AI</span>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-forest transition-colors">↗</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-[10px_8px] border-t border-slate-100">
          <button onClick={onLogout}
            className="flex items-center gap-2.5 p-[11px_14px] rounded-lg border-none w-full bg-red-50 text-red-600 cursor-pointer text-[13px] font-semibold transition-colors hover:bg-red-100">
            <span>🚪</span> Đăng xuất
          </button>
          <div className="text-slate-400 text-[10px] text-center mt-2 font-medium"></div>
        </div>
      </aside>
      {showAIModal && (
        <Modal title="🤖 Sổ tay AI" onClose={() => setShowAIModal(false)}>
          <div className="flex flex-col gap-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <p className="m-0 text-sm text-amber-800 leading-relaxed font-medium">
                Tính năng này sử dụng <strong>Google NotebookLM</strong>. Bạn cần đăng nhập tài khoản Google trên trình duyệt trước khi truy cập.
              </p>
            </div>
            <p className="m-0 text-sm text-slate-500 leading-relaxed">
              Sổ tay AI tổng hợp và trả lời câu hỏi dựa trên toàn bộ văn bản pháp luật đã được nạp vào hệ thống.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 p-3 rounded-xl bg-slate-100 text-slate-600 font-bold border-none cursor-pointer hover:bg-slate-200 transition-all text-sm"
              >
                Huỷ
              </button>
              <a
                href={NOTEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowAIModal(false)}
                className="flex-[2] p-3 rounded-xl bg-forest text-gold font-bold no-underline text-center cursor-pointer hover:bg-forest/90 transition-all text-sm"
              >
                Đã hiểu, mở Sổ tay AI ↗
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
