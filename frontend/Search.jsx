// Search.jsx - Dark theme: nền xanh đậm + chữ vàng

const { useState: useStS, useEffect: useEffS, useRef: useRefS } = React;

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'hinh-su', label: 'Hình sự' },
  { id: 'to-tung-hinh-su', label: 'Tố tụng Hình sự' },
  { id: 'nghiep-vu', label: 'Nghiệp vụ Điều tra' },
  { id: 'tham-nhung', label: 'Phòng chống Tham nhũng' },
];

// Tất cả dùng tông vàng/trắng trên nền xanh — đồng nhất
const CAT_META = {
  'hinh-su':        { icon:'⚖️', accent:'#f87171' },
  'to-tung-hinh-su':{ icon:'📜', accent:'#60a5fa' },
  'nghiep-vu':      { icon:'🔬', accent:'#6ee7b7' },
  'tham-nhung':     { icon:'🛡️', accent:'#fbbf24' },
};

function SearchPage({ onOpenDoc }) {
  const { user, logActivity } = useApp();
  const [query, setQuery] = useStS('');
  const [category, setCategory] = useStS('all');
  const [results, setResults] = useStS(window.MOCK_DOCUMENTS);
  const [searching, setSearching] = useStS(false);
  const loggedQuery = useRefS('');
  const debounceRef = useRefS(null);

  useEffS(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query, category), 320);
    return () => clearTimeout(debounceRef.current);
  }, [query, category]);

  function doSearch(q, cat) {
    setSearching(true);
    setTimeout(() => {
      let filtered = window.MOCK_DOCUMENTS;
      if (cat !== 'all') filtered = filtered.filter(d => d.category === cat);
      if (q.trim()) {
        filtered = filtered.filter(d =>
          window.fuzzyMatch(d.title, q) ||
          window.fuzzyMatch(d.issue_number, q) ||
          window.fuzzyMatch(d.summary, q)
        );
        if (q.trim() !== loggedQuery.current && q.trim().length >= 2) {
          logActivity(user.id, 'SEARCH', q.trim());
          loggedQuery.current = q.trim();
        }
      }
      setResults(filtered);
      setSearching(false);
    }, 180);
  }

  const handleOpenDoc = (doc) => {
    logActivity(user.id, 'VIEW_DOC', doc.id);
    onOpenDoc(doc);
  };

  return (
    <div style={{ padding:'20px 16px', maxWidth:860, margin:'0 auto' }}>

      {/* Search bar */}
      <div style={{ marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Tìm kiếm văn bản, số ký hiệu, nội dung... (hỗ trợ không dấu)"
            style={{
              width:'100%', padding:'13px 42px 13px 46px', borderRadius:10, boxSizing:'border-box',
              border:'1.5px solid rgba(255,215,0,0.3)', fontSize:14, outline:'none',
              background:'rgba(255,255,255,0.06)', color:'#fff',
              boxShadow:'inset 0 1px 4px rgba(0,0,0,0.2)',
              transition:'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor='rgba(255,215,0,0.8)'}
            onBlur={e => e.target.style.borderColor='rgba(255,215,0,0.3)'}
          />
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:18, opacity:0.6 }}>
            {searching ? '⏳' : '🔍'}
          </span>
          {query && (
            <button onClick={() => setQuery('')}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'50%', width:22, height:22, cursor:'pointer', fontSize:12, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          )}
        </div>

        {/* Gợi ý */}
        {!query && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:10 }}>
            {['tội giết người', 'hỏi cung', 'vật chứng', 'tham nhũng', 'khởi tố', 'ma túy'].map(kw => (
              <button key={kw} onClick={() => setQuery(kw)}
                style={{ padding:'5px 13px', borderRadius:20, border:'1px solid rgba(255,215,0,0.35)', background:'rgba(255,215,0,0.08)', color:'#FFD700', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,215,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,215,0,0.08)'; }}>
                {kw}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Danh mục */}
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {CATEGORIES.map(c => {
          const active = category === c.id;
          return (
            <button key={c.id} onClick={() => setCategory(c.id)}
              style={{
                padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s',
                border: active ? '1.5px solid #FFD700' : '1.5px solid rgba(255,255,255,0.2)',
                background: active ? '#FFD700' : 'rgba(255,255,255,0.06)',
                color: active ? '#0a2318' : 'rgba(255,255,255,0.75)',
              }}>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Đếm kết quả */}
      <div style={{ marginBottom:12, color:'rgba(255,215,0,0.8)', fontSize:13, fontWeight:600 }}>
        {query
          ? `Tìm thấy ${results.length} văn bản cho "${query}"`
          : `${results.length} văn bản trong hệ thống`}
      </div>

      {/* Danh sách */}
      {results.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize:44, marginBottom:10 }}>📂</div>
          <div style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.6)' }}>Không tìm thấy văn bản phù hợp</div>
          <div style={{ fontSize:12, marginTop:6 }}>Thử từ khóa khác hoặc bỏ dấu tiếng Việt</div>
        </div>
      ) : (
        <div style={{ display:'grid', gap:10 }}>
          {results.map(doc => {
            const meta = CAT_META[doc.category] || { icon:'📄', accent:'#FFD700' };
            return (
              <div key={doc.id} onClick={() => handleOpenDoc(doc)}
                style={{
                  background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'16px 18px',
                  cursor:'pointer', transition:'all 0.2s',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderLeft:'4px solid ' + meta.accent,
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.transform=''; }}>

                {/* Badge + số hiệu */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{
                    padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700,
                    background: meta.accent + '22', color: meta.accent,
                    border:'1px solid ' + meta.accent + '55',
                  }}>
                    {meta.icon} {doc.categoryLabel}
                  </span>
                  <span style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>{doc.issue_number}</span>
                  <span style={{ marginLeft:'auto', fontSize:11, color:'rgba(255,255,255,0.35)' }}>Cập nhật: {doc.updatedAt}</span>
                </div>

                {/* Tiêu đề */}
                <h3 style={{ margin:'0 0 6px', fontSize:15, fontWeight:700, color:'#FFD700', lineHeight:1.4 }}>
                  {highlightMatch(doc.title, query)}
                </h3>

                {/* Tóm tắt */}
                <p style={{
                  margin:'0 0 10px', fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.65,
                  display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                }}>
                  {doc.summary}
                </p>

                {/* Footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
                  <div style={{ display:'flex', gap:12, fontSize:11, color:'rgba(255,255,255,0.4)' }}>
                    <span>📑 {doc.content.chapters.length} chương</span>
                    <span>📄 {doc.content.chapters.reduce((s,c) => s+c.articles.length, 0)} điều</span>
                  </div>
                  <span style={{ fontSize:12, color:'#FFD700', fontWeight:600 }}>Xem chi tiết →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  try {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((p, i) =>
      regex.test(p)
        ? <mark key={i} style={{ background:'#FFD700', color:'#0a2318', borderRadius:2, padding:'0 1px' }}>{p}</mark>
        : p
    );
  } catch { return text; }
}

Object.assign(window, { SearchPage });
