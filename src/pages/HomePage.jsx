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
    { value: 'nghiep-vu', label: 'Nghiệp vụ Điều tra' },
    { value: 'tham-nhung', label: 'Phòng chống tham nhũng' },
    { value: 'hanh-chinh', label: 'Hành chính' },
    { value: 'dan-su', label: 'Dân sự' },
    { value: 'khac', label: 'Khác' },
  ];
  const stats = [
    { label: 'Văn bản', value: documents.length, icon: '📚', color: 'text-gold' },
    { label: 'Điều khoản', value: documents.reduce((s, d) => s + d.content.chapters.reduce((cs, c) => cs + c.articles.length, 0), 0), icon: '📄', color: 'text-accent-green' },
    { label: 'Danh mục', value: 4, icon: '🗂', color: 'text-accent-blue' },
    { label: 'Cập nhật', value: '2026', icon: '🕐', color: 'text-accent-amber' },
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
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest to-navy rounded-[14px] p-[24px_20px] mb-5 text-white relative overflow-hidden">
        <div className="absolute -right-[30px] -top-[30px] w-[150px] h-[150px] rounded-full bg-gold/5 pointer-events-none"></div>
        <div className="text-[11px] text-gold/80 tracking-wide uppercase mb-1.5 font-semibold">Hệ thống Tra cứu Nội bộ</div>
        <h1 className="text-xl font-extrabold m-0 mb-1.5 leading-snug">
          Chào, {user?.full_name?.split(' ').slice(-2).join(' ')}
        </h1>
        <p className="text-white/65 text-[13px] m-0 mb-[18px] leading-relaxed">
          {user?.unit}
        </p>
        <button onClick={() => setActiveNav('search')}
          className="p-[10px_20px] rounded-lg bg-gold text-forest-dark border-none font-extrabold text-sm cursor-pointer">
          🔍 Bắt đầu tra cứu
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 rounded-lg p-[14px_10px] border border-white/10 text-center">
            <div className="text-[22px] mb-0.5">{s.icon}</div>
            <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-white/45 mt-px font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Document List */}
      <div className="bg-white/5 rounded-xl border border-gold/10 overflow-hidden mb-4">
        <div className="p-[16px] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="font-bold text-sm text-gold">
            📄 Danh sách văn bản
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="p-1.5 rounded bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-gold cursor-pointer [&>option]:bg-[#0a2318] [&>option]:text-white"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value)}
              className="p-1.5 rounded bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-gold cursor-pointer [&>option]:bg-[#0a2318] [&>option]:text-white"
            >
              <option value="desc">Mới cập nhật</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
            <div key={doc.id} onClick={() => handleOpenDoc(doc)}
              className={`p-[14px_16px] border-none bg-transparent cursor-pointer text-left flex items-start gap-3 transition-colors hover:bg-gold/5
                ${i < filteredDocs.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="text-[20px] shrink-0 mt-0.5">📄</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-white mb-1 truncate">{doc.title}</div>
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="bg-navy px-1.5 py-0.5 rounded text-white font-semibold">{doc.categoryLabel || 'Khác'}</span>
                  <span className="text-white/40">{doc.issue_number}</span>
                  <span className="text-gold/60">• Cập nhật: {formatDate(doc.updatedAt || doc.created_at)}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-white/50 text-sm">
              Không có văn bản nào trong chuyên mục này.
            </div>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div className="p-[12px_14px] bg-gold/5 border border-gold/20 rounded-lg flex gap-2.5 items-start">
        <span className="text-base shrink-0">🔒</span>
        <p className="text-xs text-gold/80 m-0 leading-relaxed">
          <strong>Bảo mật thông tin:</strong> Mọi hoạt động tra cứu đều được ghi lại và giám sát. Nghiêm cấm chia sẻ thông tin ra ngoài phạm vi cho phép.
        </p>
      </div>
    </div>
  );
}
