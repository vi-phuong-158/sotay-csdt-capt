import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import AdminPage from './AdminPage';

export default function MainApp() {
  const { user, logout, loading } = useApp();
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a2318]">
        <div className="flex flex-col items-center gap-4 text-gold">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin-fast" />
          <div className="font-bold tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a2318] flex relative overflow-hidden">
      <Sidebar 
        user={user} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-[248px] bg-gradient-to-br from-[#0a2318] to-[#0d2d1e] transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-3 border-b border-white/5 bg-[#0a2318]/95 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex-shrink-0">
               <svg viewBox="0 0 40 40" className="w-full h-full">
                  <path d="M20 2 L36 8 L36 20 C36 29 29 36 20 39 C11 36 4 29 4 20 L4 8 Z" fill="#1e3a8a" stroke="#FFD700" strokeWidth="1.5"/>
                  <path d="M20 5 L33 10 L33 20 C33 27.5 27 34 20 37 C13 34 7 27.5 7 20 L7 10 Z" fill="#0a2318" stroke="#FFD700" strokeWidth="0.5"/>
                  <text x="20" y="24" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold" fontFamily="serif">★</text>
                </svg>
            </div>
            <div>
              <div className="text-gold text-[11px] font-extrabold uppercase">Cẩm nang</div>
              <div className="text-white/50 text-[9px]">Pháp luật & Nghiệp vụ</div>
            </div>
          </div>
          
          <button 
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-transparent border-none text-white cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto relative">
          {activeNav === 'home' && <HomePage setActiveNav={setActiveNav} />}
          {activeNav === 'search' && <SearchPage />}
          {activeNav === 'admin' && <AdminPage />}
        </div>
      </main>
    </div>
  );
}
