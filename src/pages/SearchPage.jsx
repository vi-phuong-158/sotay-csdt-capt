import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fuzzyMatch } from '../lib/utils';
import ReaderPage from './ReaderPage';

export default function SearchPage() {
  const { user, documents, logActivity } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const hits = [];

      documents.forEach(doc => {
        let docScore = 0;
        const matches = [];

        // Metadata search
        if (fuzzyMatch(doc.title, q)) docScore += 10;
        if (fuzzyMatch(doc.issue_number, q)) docScore += 8;
        if (fuzzyMatch(doc.issuing_authority, q)) docScore += 5;
        if (fuzzyMatch(doc.summary, q)) docScore += 2;

        if (docScore > 0) {
          hits.push({
            ...doc,
            score: docScore
          });
        }
      });

      // Sắp xếp theo score giảm dần
      hits.sort((a, b) => b.score - a.score);
      setResults(hits);
      setIsSearching(false);
      
      // Log search (nếu query dài đủ)
      if (q.length >= 3) {
        logActivity(user.id, 'SEARCH', q);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, documents, user, logActivity]);

  const handleOpenDoc = (doc) => {
    logActivity(user.id, 'VIEW_DOC', doc.id);
    setActiveSearchTerm(query.trim());
    setActiveDoc(doc);
  };

  if (activeDoc) {
    return <ReaderPage doc={activeDoc} searchTerm={activeSearchTerm} onBack={() => setActiveDoc(null)} />;
  }

  return (
    <div className="flex flex-col h-full animate-fade-up">
      {/* Search Bar Fixed */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md p-[16px] border-b border-slate-200">
        <div className="relative max-w-[800px] mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ khóa, số hiệu văn bản..."
            className="w-full p-[14px_45px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[15px] outline-none shadow-sm focus:border-forest/50 focus:bg-white transition-all"
            autoFocus
          />
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[18px] text-slate-400">🔍</span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-[18px] top-1/2 -translate-y-1/2 bg-slate-200/50 w-6 h-6 rounded-full border-none text-slate-600 cursor-pointer flex items-center justify-center text-[10px] hover:bg-slate-200 transition-all"
            >✕</button>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-[20px_16px]">
        <div className="max-w-[800px] mx-auto">
          {isSearching && (
            <div className="text-center text-forest p-5 text-sm font-bold tracking-widest animate-pulse">ĐANG TÌM KIẾM...</div>
          )}
          
          {!isSearching && query && results.length === 0 && (
            <div className="text-center text-slate-400 p-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-4xl mb-3">📄</div>
              Không tìm thấy kết quả phù hợp cho "{query}"
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Tìm thấy {results.length} văn bản phù hợp
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results.map(doc => (
              <div
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer transition-all hover:border-forest/40 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="m-0 text-forest-dark text-base font-bold leading-snug">{doc.title}</h3>
                  <span className="shrink-0 bg-forest/10 text-forest text-[10px] font-bold px-[8px] py-[3px] rounded">
                    {doc.categoryLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  <div className="text-[12px] text-slate-700 font-bold">{doc.issue_number || 'Chưa có số'}</div>
                  <div className="text-[12px] text-slate-500 flex items-center gap-1.5 font-bold">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {doc.issuing_authority}
                  </div>
                  <div className="text-[12px] text-slate-500 flex items-center gap-1.5 font-bold">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {doc.doc_date ? new Date(doc.doc_date).toLocaleDateString('vi-VN') : '---'}
                  </div>
                </div>
                <p className="m-0 text-[13px] text-slate-800 leading-relaxed mb-4 font-medium">{doc.summary}</p>
                
                <p className="m-0 text-[13px] text-slate-800 leading-relaxed mb-1 font-medium">{doc.summary}</p>
              </div>
            ))}
          </div>

          {!query && (
            <div className="text-center p-12">
              <div className="text-5xl opacity-10 mb-4">📚</div>
              <h3 className="text-slate-400 font-bold m-0 tracking-wide">Tra cứu nhanh chóng, chính xác</h3>
              <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-widest opacity-60">Hỗ trợ tìm kiếm theo số hiệu hoặc nội dung</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
