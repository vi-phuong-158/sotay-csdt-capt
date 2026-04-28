import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../lib/utils';
import ReaderPage from './ReaderPage';

export default function HomePage({ setActiveNav }) {
  const { user, documents, logActivity } = useApp();
  
  const [activeDoc, setActiveDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = mới nhất, 'asc' = cũ nhất

  const CATEGORIES = [
    { value: 'all', label: 'Tất cả chuyên mục' },
    { value: 'hinh-su', label: 'Hình sự' },
    { value: 'to-tung-hinh-su', label: 'Tố tụng Hình sự' },
    { value: 'huong-dan-dieu-tra', label: 'Hướng dẫn điều tra' },
    { value: 'khac', label: 'Khác' },
  ];
  const stats = [
    { label: 'TỔNG SỐ VĂN BẢN', value: documents.length, icon: '📄', color: 'border-forest', bgColor: 'bg-forest/5' },
    { label: 'ĐIỀU LUẬT', value: documents.reduce((s, d) => s + d.content.chapters.reduce((cs, c) => cs + c.articles.length, 0), 0), icon: '📒', color: 'border-gold', bgColor: 'bg-gold/5' },
    { label: 'CHUYÊN MỤC', value: 4, icon: '🗂', color: 'border-blue-500', bgColor: 'bg-blue-50' },
    { label: 'CẬP NHẬT MỚI', value: '2026', icon: '⏰', color: 'border-orange-500', bgColor: 'bg-orange-50' },
  ];
  
  const filteredDocs = useMemo(() => {
    let result = documents;
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.created_at || 0).getTime();
      const dateB = new Date(b.updatedAt || b.created_at || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [documents, selectedCategory, sortOrder]);

  const handleOpenDoc = (doc) => {
    logActivity(user.id, 'VIEW_DOC', doc.id);
    setActiveDoc(doc);
  };

  if (activeDoc) {
    return <ReaderPage doc={activeDoc} searchTerm="" onBack={() => setActiveDoc(null)} />;
  }

  return (
    <div className="p-[20px_16px] max-w-[860px] mx-auto animate-fade-up">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3 z-0" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-forest m-0 mb-3 tracking-tight">
            Chào, {user?.full_name?.split(' ').slice(-2).join(' ')}
          </h1>
          <p className="text-slate-600 text-base m-0 mb-8 max-w-md leading-relaxed font-bold">
            Cổng thông tin tra cứu văn bản quy phạm pháp luật nội bộ.
          </p>

          <div className="flex gap-2 max-w-md bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-forest/50 transition-colors">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Nhập từ khóa, số hiệu..." 
                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                onFocus={() => setActiveNav('search')}
              />
            </div>
            <button 
              onClick={() => setActiveNav('search')}
              className="px-6 py-2.5 rounded-lg bg-gold text-forest font-bold text-sm shadow-md shadow-gold/20 hover:bg-gold/90 transition-all active:scale-95"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h2 className="text-lg font-bold text-slate-800 m-0">Tổng quan hệ thống</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-xl p-6 border-t-4 ${s.color} shadow-sm border-x border-b border-slate-100 flex items-center justify-between`}>
            <div>
              <div className="text-3xl font-black text-slate-900 mb-1">{s.value.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
            </div>
            <div className={`w-12 h-12 rounded-lg ${s.bgColor} flex items-center justify-center text-2xl`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/30">
          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <span className="text-lg">📄</span> Danh sách văn bản
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold outline-none focus:border-forest/50 cursor-pointer shadow-sm"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold outline-none focus:border-forest/50 cursor-pointer shadow-sm"
            >
              <option value="desc">Mới cập nhật</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col bg-white">
          {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
            <div key={doc.id} onClick={() => handleOpenDoc(doc)}
              className={`p-[16px_20px] border-none bg-transparent cursor-pointer text-left flex items-center gap-4 transition-all hover:bg-slate-50
                ${i < filteredDocs.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-slate-800 mb-0.5 truncate">{doc.title}</div>
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-forest font-bold">{doc.categoryLabel || 'Khác'}</span>
                  <span className="text-slate-600 font-bold">{doc.issue_number}</span>
                  <span className="text-slate-500 font-bold">• {formatDate(doc.updatedAt || doc.created_at)}</span>
                </div>
              </div>
              <div className="text-slate-300">❯</div>
            </div>
          )) : (
            <div className="p-8 text-center text-white/50 text-sm">
              Không có văn bản nào trong chuyên mục này.
            </div>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 items-start mt-4 mb-8">
        <span className="text-lg shrink-0">🛡️</span>
        <p className="text-[12px] text-emerald-800 m-0 leading-relaxed font-medium">
          <strong>Bảo mật thông tin:</strong> Mọi hoạt động tra cứu đều được ghi lại và giám sát. Nghiêm cấm chia sẻ thông tin ra ngoài phạm vi cho phép.
        </p>
      </div>
    </div>
  );
}
