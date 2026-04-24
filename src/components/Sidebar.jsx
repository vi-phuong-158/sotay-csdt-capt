import React from 'react';

export default function Sidebar({ activeNav, setActiveNav, onLogout, user, open, onClose }) {
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
        <div className="p-[18px_16px] border-b border-gold/10 flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] shrink-0">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path d="M20 2 L36 8 L36 20 C36 29 29 36 20 39 C11 36 4 29 4 20 L4 8 Z" fill="#1e3a8a" stroke="#FFD700" strokeWidth="1.5"/>
              <path d="M20 5 L33 10 L33 20 C33 27.5 27 34 20 37 C13 34 7 27.5 7 20 L7 10 Z" fill="#0a2318" stroke="#FFD700" strokeWidth="0.5"/>
              <text x="20" y="24" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold" fontFamily="serif">★</text>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gold text-xs font-extrabold tracking-wide">CẨM NANG</div>
            <div className="text-white/50 text-[10px]">Pháp luật &amp; Nghiệp vụ</div>
          </div>
          {/* Close btn – hidden on desktop via CSS */}
          <button className="hamburger-btn bg-white/5 border-none text-white/60 w-8 h-8 rounded-lg cursor-pointer text-base flex items-center justify-center hover:bg-white/10" onClick={onClose}>✕</button>
        </div>

        {/* User card */}
        {user && (
          <div className="p-[12px_14px] border-b border-white/5 flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-navy to-blue-500 flex items-center justify-center text-[15px] font-extrabold text-white shrink-0">
              {user.full_name?.charAt(user.full_name.lastIndexOf(' ')+1) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-bold truncate">{user.full_name}</div>
              <div className="text-white/45 text-[10px] truncate">{user.unit}</div>
            </div>
            {user.role === 'admin' && (
              <span className="bg-gold text-forest-dark text-[9px] font-extrabold px-[7px] py-[2px] rounded shrink-0">ADMIN</span>
            )}
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
                  background: active ? 'rgba(255,215,0,0.12)' : 'transparent',
                  color: active ? '#FFD700' : 'rgba(255,255,255,0.72)',
                  fontWeight: active ? 700 : 400, fontSize:14,
                  borderLeft: active ? '3px solid #FFD700' : '3px solid transparent',
                }}>
                <span className="text-lg w-[22px] text-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-[10px_8px] border-t border-white/5">
          <button onClick={onLogout}
            className="flex items-center gap-2.5 p-[11px_14px] rounded-lg border-none w-full bg-crimson-light/20 text-red-300 cursor-pointer text-[13px] font-semibold transition-colors hover:bg-crimson-light/40">
            <span>🚪</span> Đăng xuất
          </button>
          <div className="text-white/20 text-[10px] text-center mt-2">v2.1 — Bảo mật CẤP MẬT</div>
        </div>
      </aside>
    </>
  );
}
