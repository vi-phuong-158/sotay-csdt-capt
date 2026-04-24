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

        // Tiêu đề & tóm tắt
        if (fuzzyMatch(doc.title, q)) docScore += 10;
        if (fuzzyMatch(doc.issue_number, q)) docScore += 5;
        if (fuzzyMatch(doc.summary, q)) docScore += 2;

        // Nội dung
        doc.content.chapters.forEach(ch => {
          if (fuzzyMatch(ch.title, q)) docScore += 3;
          ch.articles.forEach(art => {
            if (fuzzyMatch(art.title, q) || fuzzyMatch(art.text, q)) {
              docScore += 1;
              matches.push({ chTitle: ch.title, artTitle: art.title, text: art.text });
            }
          });
        });

        if (docScore > 0) {
          hits.push({
            ...doc,
            score: docScore,
            topMatches: matches.slice(0, 3)
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
      <div className="sticky top-0 z-10 bg-[#0a2318]/95 backdrop-blur-md p-[16px] border-b border-gold/10">
        <div className="relative max-w-[800px] mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ khóa (hỗ trợ tiếng Việt không dấu)..."
            className="w-full p-[14px_45px] rounded-full border border-gold/30 bg-white/5 text-white text-[15px] outline-none shadow-[0_4px_12px_rgba(0,0,0,0.2)] focus:border-gold/80 transition-colors"
            autoFocus
          />
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[18px] text-gold/60">🔍</span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-[18px] top-1/2 -translate-y-1/2 bg-white/10 w-6 h-6 rounded-full border-none text-white/80 cursor-pointer flex items-center justify-center text-xs hover:bg-white/20"
            >✕</button>
          )}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-[20px_16px]">
        <div className="max-w-[800px] mx-auto">
          {isSearching && (
            <div className="text-center text-gold/70 p-5 text-sm">Đang tìm kiếm...</div>
          )}
          
          {!isSearching && query && results.length === 0 && (
            <div className="text-center text-white/50 p-10 bg-white/5 rounded-xl border border-white/5">
              <div className="text-4xl mb-3">📄</div>
              Không tìm thấy kết quả phù hợp cho "{query}"
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="mb-4 text-xs font-semibold text-gold/70 uppercase tracking-wide">
              Tìm thấy {results.length} văn bản
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results.map(doc => (
              <div
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="bg-white/5 border border-white/10 rounded-xl p-[16px_18px] cursor-pointer transition-all hover:border-gold/40 hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="m-0 text-gold text-base font-bold leading-snug">{doc.title}</h3>
                  <span className="shrink-0 bg-navy text-white text-[10px] font-bold px-[8px] py-[3px] rounded">
                    {doc.categoryLabel}
                  </span>
                </div>
                <div className="text-[12px] text-white/60 mb-2 font-medium">{doc.issue_number}</div>
                <p className="m-0 text-[13px] text-white/80 leading-relaxed mb-3">{doc.summary}</p>
                
                {doc.topMatches.length > 0 && (
                  <div className="bg-[#05110c] rounded-lg p-3 border border-white/5">
                    <div className="text-[11px] font-bold text-accent-green mb-1.5 uppercase tracking-wide">Trích đoạn nổi bật</div>
                    {doc.topMatches.map((m, idx) => (
                      <div key={idx} className="mb-2 last:mb-0 pb-2 last:pb-0 border-b last:border-0 border-white/5">
                        <div className="text-[11px] font-semibold text-white/70 mb-1">{m.artTitle}</div>
                        <div className="text-[12px] text-white/50 line-clamp-2 italic leading-relaxed">
                          "{m.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!query && (
            <div className="text-center p-10">
              <div className="text-5xl opacity-20 mb-4">📚</div>
              <h3 className="text-gold/50 font-medium m-0">Tra cứu nhanh chóng, chính xác</h3>
              <p className="text-white/30 text-xs mt-2">Hỗ trợ tìm kiếm tiếng Việt không dấu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
