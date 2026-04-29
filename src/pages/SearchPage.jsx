import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fuzzyMatch } from '../lib/utils';
import { useBookmarks, docKey } from '../hooks/useBookmarks';
import ReaderPage from './ReaderPage';

const CATEGORIES = [
  { value: 'all', label: 'Tất cả chuyên mục' },
  { value: 'hinh-su', label: 'Hình sự' },
  { value: 'to-tung-hinh-su', label: 'Tố tụng Hình sự' },
  { value: 'huong-dan-dieu-tra', label: 'Hướng dẫn điều tra' },
  { value: 'khac', label: 'Khác' },
];

export default function SearchPage() {
  const { user, documents, logActivity } = useApp();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAuthority, setFilterAuthority] = useState('all');
  const [results, setResults] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Danh sách cơ quan phát hành duy nhất từ dữ liệu
  const authorities = useMemo(() => {
    const list = [...new Set(documents.map(d => (d.issuing_authority || '').trim()).filter(Boolean))].sort();
    return list;
  }, [documents]);

  const hasFilters = filterCategory !== 'all' || filterAuthority !== 'all';
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (!hasQuery && !hasFilters) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      let docs = documents;

      // Lọc theo chuyên mục
      if (filterCategory !== 'all') {
        const catItem = CATEGORIES.find(c => c.value === filterCategory);
        docs = docs.filter(d => {
          const slug = (d.category || '').trim().toLowerCase();
          const label = (d.categoryLabel || '').trim().toLowerCase();
          return slug === filterCategory || label === (catItem?.label || '').toLowerCase();
        });
      }

      // Lọc theo cơ quan phát hành
      if (filterAuthority !== 'all') {
        docs = docs.filter(d => (d.issuing_authority || '').trim() === filterAuthority);
      }

      // Tìm kiếm từ khóa
      if (hasQuery) {
        const q = query.trim().toLowerCase();
        docs = docs.map(doc => {
          let score = 0;
          if (fuzzyMatch(doc.title, q)) score += 10;
          if (fuzzyMatch(doc.issue_number, q)) score += 8;
          if (fuzzyMatch(doc.issuing_authority, q)) score += 5;
          if (fuzzyMatch(doc.summary, q)) score += 2;
          return { ...doc, score };
        }).filter(d => d.score > 0).sort((a, b) => b.score - a.score);
      } else {
        // Chỉ có filter, không có từ khóa — sắp xếp theo ngày
        docs = [...docs].sort((a, b) =>
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
      }

      setResults(docs);
      setIsSearching(false);

      if (hasQuery && query.trim().length >= 3) {
        logActivity(user.id, 'SEARCH', query.trim());
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, filterCategory, filterAuthority, documents, user, logActivity]);

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
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="p-4 max-w-[800px] mx-auto">
          <div className="relative mb-3">
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

          {/* Bộ lọc nâng cao */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className={`p-2 rounded-lg border text-xs font-bold outline-none cursor-pointer transition-all
                ${filterCategory !== 'all' ? 'bg-forest text-white border-forest' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <select
              value={filterAuthority}
              onChange={e => setFilterAuthority(e.target.value)}
              className={`p-2 rounded-lg border text-xs font-bold outline-none cursor-pointer transition-all flex-1 min-w-0
                ${filterAuthority !== 'all' ? 'bg-forest text-white border-forest' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <option value="all">Tất cả cơ quan</option>
              {authorities.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            {(hasFilters) && (
              <button
                onClick={() => { setFilterCategory('all'); setFilterAuthority('all'); }}
                className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-500 text-xs font-bold cursor-pointer hover:bg-red-100 transition-all shrink-0"
              >
                Xoá lọc ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-[20px_16px]">
        <div className="max-w-[800px] mx-auto">
          {isSearching && (
            <div className="text-center text-forest p-5 text-sm font-bold tracking-widest animate-pulse">ĐANG TÌM KIẾM...</div>
          )}

          {!isSearching && (hasQuery || hasFilters) && results.length === 0 && (
            <div className="text-center text-slate-400 p-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-4xl mb-3">📄</div>
              Không tìm thấy kết quả phù hợp
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
                className="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer transition-all hover:border-forest/40 hover:shadow-lg hover:shadow-slate-200/50 relative"
              >
                {/* Bookmark button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(docKey(doc)); }}
                  className={`absolute top-4 right-4 text-xl bg-transparent border-none cursor-pointer transition-colors leading-none
                    ${isBookmarked(docKey(doc)) ? 'text-gold' : 'text-slate-200 hover:text-gold/60'}`}
                  title={isBookmarked(docKey(doc)) ? 'Bỏ ghim' : 'Ghim văn bản'}
                >★</button>

                <div className="pr-8">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-forest/10 text-forest text-[10px] font-bold px-2 py-0.5 rounded">
                      {doc.categoryLabel}
                    </span>
                    {doc.drive_link && (
                      <span className="bg-gold/10 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded">📎 File</span>
                    )}
                  </div>
                  <h3 className="m-0 text-forest-dark text-base font-bold leading-snug mb-2">{doc.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <div className="text-[12px] text-slate-700 font-bold">{doc.issue_number || 'Chưa có số'}</div>
                    {doc.issuing_authority && (
                      <div className="text-[12px] text-slate-500 flex items-center gap-1.5 font-bold">
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        {doc.issuing_authority}
                      </div>
                    )}
                    {doc.doc_date && (
                      <div className="text-[12px] text-slate-500 flex items-center gap-1.5 font-bold">
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        {new Date(doc.doc_date).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                  {doc.summary && (
                    <p className="m-0 text-[13px] text-slate-600 leading-relaxed font-medium line-clamp-2">{doc.summary}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!hasQuery && !hasFilters && (
            <div className="text-center p-12">
              <div className="text-5xl opacity-10 mb-4">📚</div>
              <h3 className="text-slate-400 font-bold m-0 tracking-wide">Tra cứu nhanh chóng, chính xác</h3>
              <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-widest opacity-60">Nhập từ khóa hoặc chọn bộ lọc bên trên</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
