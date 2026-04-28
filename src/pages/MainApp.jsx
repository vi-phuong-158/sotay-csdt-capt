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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-forest">
          <div className="w-10 h-10 border-4 border-forest/10 border-t-forest rounded-full animate-spin-fast" />
          <div className="font-bold tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden text-slate-800">
      <Sidebar 
        user={user} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-[248px] bg-[#f8fafc] transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-3 border-b border-slate-200 bg-forest-light z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex-shrink-0">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-gold text-[11px] font-extrabold uppercase">Cẩm nang</div>
              <div className="text-white/70 text-[9px]">Pháp luật & Nghiệp vụ</div>
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
