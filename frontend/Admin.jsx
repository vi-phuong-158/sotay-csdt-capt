// Admin.jsx - Quản lý tài khoản & Nhật ký hoạt động

const { useState: useStA, useMemo: useMemoA, useRef: useRefA } = React;

const ACTION_LABELS = {
  'LOGIN': { label:'Đăng nhập', color:'#065f46', bg:'#d1fae5', icon:'🔓' },
  'SEARCH': { label:'Tìm kiếm', color:'#1e3a8a', bg:'#dbeafe', icon:'🔍' },
  'VIEW_DOC': { label:'Xem văn bản', color:'#92400e', bg:'#fef3c7', icon:'📄' },
};

function AdminPage() {
  const { users, logs, addUser, deleteUser, resetPassword, showToast, documents, addDocument, deleteDocument } = useApp();
  const [tab, setTab] = useStA('users');
  const [showAddDoc, setShowAddDoc] = useStA(false);
  const [userSearch, setUserSearch] = useStA('');
  const [logSearch, setLogSearch] = useStA('');
  const [logAction, setLogAction] = useStA('all');
  const [showAddModal, setShowAddModal] = useStA(false);
  const [resetTarget, setResetTarget] = useStA(null);
  const [deleteTarget, setDeleteTarget] = useStA(null);
  const [newPass, setNewPass] = useStA('');

  const filteredUsers = useMemoA(() => {
    if (!userSearch.trim()) return users;
    return users.filter(u =>
      window.fuzzyMatch(u.full_name, userSearch) ||
      window.fuzzyMatch(u.username, userSearch) ||
      window.fuzzyMatch(u.unit, userSearch)
    );
  }, [users, userSearch]);

  const filteredLogs = useMemoA(() => {
    let l = logs;
    if (logAction !== 'all') l = l.filter(x => x.action === logAction);
    if (logSearch.trim()) l = l.filter(x =>
      window.fuzzyMatch(x.full_name, logSearch) || window.fuzzyMatch(x.username, logSearch) || window.fuzzyMatch(x.details, logSearch)
    );
    return l;
  }, [logs, logSearch, logAction]);

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
    } catch { return iso; }
  };

  const tabStyle = (active) => ({
    padding:'10px 20px', borderRadius:'8px 8px 0 0', border:'none', cursor:'pointer', fontWeight:700, fontSize:14,
    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
    color: active ? '#FFD700' : 'rgba(255,255,255,0.5)',
    borderBottom: active ? '3px solid #FFD700' : '3px solid transparent',
    transition:'all 0.15s',
  });

  return (
    <div style={{ padding:'20px', maxWidth:1000, margin:'0 auto', fontFamily:"'Be Vietnam Pro', sans-serif", color:'#e2f0e8' }}>
      {/* Header Admin */}
      <div style={{ background:'linear-gradient(135deg,#1a5c3d,#1e3a8a)', borderRadius:12, padding:'20px 24px', marginBottom:24, color:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, border:'1px solid rgba(255,215,0,0.15)' }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>⚙️ Bảng điều khiển Admin</h2>
          <p style={{ margin:'4px 0 0', opacity:0.75, fontSize:13 }}>Quản lý tài khoản & giám sát hoạt động hệ thống</p>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <div style={{ textAlign:'center', background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 16px' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#FFD700' }}>{users.length}</div>
            <div style={{ fontSize:11, opacity:0.8 }}>Tài khoản</div>
          </div>
          <div style={{ textAlign:'center', background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 16px' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#FFD700' }}>300</div>
            <div style={{ fontSize:11, opacity:0.8 }}>Giới hạn</div>
          </div>
          <div style={{ textAlign:'center', background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 16px' }}>
            <div style={{ fontSize:22, fontWeight:800, color:'#6ee7b7' }}>{logs.length}</div>
            <div style={{ fontSize:11, opacity:0.8 }}>Nhật ký</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:'1px solid rgba(255,215,0,0.15)', marginBottom:0, display:'flex', gap:4 }}>
        <button style={tabStyle(tab==='users')} onClick={() => setTab('users')}>👥 Tài khoản</button>
        <button style={tabStyle(tab==='docs')} onClick={() => setTab('docs')}>📚 Văn bản</button>
        <button style={tabStyle(tab==='logs')} onClick={() => setTab('logs')}>📋 Nhật ký</button>
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'0 12px 12px 12px', border:'1px solid rgba(255,255,255,0.08)', padding:'20px' }}>

        {/* === TAB USERS === */}
        {tab === 'users' && (
          <div>
            <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Tìm theo tên, username, đơn vị..."
                style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,215,0,0.25)', fontSize:14, outline:'none', background:'rgba(255,255,255,0.06)', color:'#fff' }}
                onFocus={e => e.target.style.borderColor='rgba(255,215,0,0.7)'}
                onBlur={e => e.target.style.borderColor='rgba(255,215,0,0.25)'} />
              <button onClick={() => setShowAddModal(true)}
                style={{ padding:'10px 18px', borderRadius:8, background:'#113a26', color:'#fff', border:'none', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap' }}>
                + Thêm tài khoản
              </button>
            </div>

            <div style={{ fontSize:12, color:'rgba(255,215,0,0.7)', marginBottom:12 }}>
              Hiển thị {filteredUsers.length}/{users.length} tài khoản — còn {300 - users.length} slot trống
            </div>

            {/* Progress bar */}
            <div style={{ background:'#f1f5f9', borderRadius:4, height:6, marginBottom:16, overflow:'hidden' }}>
              <div style={{ background:'linear-gradient(90deg,#113a26,#1e3a8a)', height:'100%', width: (users.length/300*100)+'%', borderRadius:4, transition:'width 0.5s' }}></div>
            </div>

            {/* Desktop table */}
            <div style={{ overflowX:'auto', display:'none' }} className="admin-table-desktop">
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'rgba(255,255,255,0.07)', borderBottom:'2px solid rgba(255,215,0,0.2)' }}>
                    {['Họ tên & Cấp bậc','Tên đăng nhập','Đơn vị','Vai trò','Đăng nhập cuối','Hành động'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'rgba(255,215,0,0.8)', fontWeight:700, whiteSpace:'nowrap', fontSize:12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px' }}><div style={{ fontWeight:600, color:'#FFD700' }}>{u.full_name}</div></td>
                      <td style={{ padding:'12px' }}><code style={{ background:'rgba(255,255,255,0.08)', padding:'2px 8px', borderRadius:4, fontSize:12, color:'#e2f0e8' }}>{u.username}</code></td>
                      <td style={{ padding:'12px', color:'rgba(255,255,255,0.55)', fontSize:12 }}>{u.unit}</td>
                      <td style={{ padding:'12px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background: u.role==='admin' ? '#7f1d1d33' : '#1e3a8a22', color: u.role==='admin' ? '#dc2626' : '#1e3a8a' }}>
                          {u.role === 'admin' ? '🛡 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td style={{ padding:'12px', fontSize:11, color:'rgba(255,255,255,0.4)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—'}</td>
                      <td style={{ padding:'12px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => { setResetTarget(u); setNewPass(''); }} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid #e2e8f0', background:'#fff', color:'#1e3a8a', fontSize:11, fontWeight:600, cursor:'pointer' }}>🔑 Reset</button>
                          {u.role !== 'admin' && <button onClick={() => setDeleteTarget(u)} style={{ padding:'5px 10px', borderRadius:6, border:'1px solid #fee2e2', background:'#fff', color:'#dc2626', fontSize:11, fontWeight:600, cursor:'pointer' }}>🗑 Xóa</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="admin-cards-mobile">
              {filteredUsers.map(u => (
                <div key={u.id} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'14px', marginBottom:10, borderLeft:'3px solid ' + (u.role==='admin' ? '#dc2626' : '#1e3a8a') }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, color:'#FFD700', fontSize:14 }}>{u.full_name}</div>
                      <code style={{ background:'#f1f5f9', padding:'2px 7px', borderRadius:4, fontSize:11, color:'#475569' }}>{u.username}</code>
                    </div>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background: u.role==='admin' ? '#7f1d1d33' : '#1e3a8a22', color: u.role==='admin' ? '#dc2626' : '#1e3a8a', whiteSpace:'nowrap' }}>
                      {u.role === 'admin' ? '🛡 Admin' : '👤 User'}
                    </span>
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>
                    {u.unit && <div>📍 {u.unit}</div>}
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2 }}>
                      Đăng nhập cuối: {u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—'}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => { setResetTarget(u); setNewPass(''); }}
                      style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid #e2e8f0', background:'rgba(30,58,138,0.3)', border:'1px solid rgba(96,165,250,0.3)', color:'#60a5fa', fontSize:12, fontWeight:600, cursor:'pointer' }}>🔑 Reset mật khẩu</button>
                    {u.role !== 'admin' && (
                      <button onClick={() => setDeleteTarget(u)}
                        style={{ flex:1, padding:'8px', borderRadius:8, border:'1px solid #fee2e2', background:'rgba(127,29,29,0.3)', color:'#f87171', fontSize:12, fontWeight:600, cursor:'pointer' }}>🗑 Xóa</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <style>{`
              @media (min-width: 641px) {
                .admin-table-desktop { display: block !important; }
                .admin-cards-mobile { display: none; }
              }
              @media (max-width: 640px) {
                .admin-table-desktop { display: none !important; }
                .admin-cards-mobile { display: block; }
              }
            `}</style>
          </div>
        )}

        {/* === TAB DOCS === */}
        {tab === 'docs' && (
          <div>
            <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:13 }}>
                {documents.length} văn bản trong hệ thống
              </div>
              <button onClick={() => setShowAddDoc(true)}
                style={{ marginLeft:'auto', padding:'10px 18px', borderRadius:8, background:'#FFD700', color:'#0a2318', border:'none', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                + Thêm văn bản
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {documents.map(doc => {
                const CAT_ACC = { 'hinh-su':'#f87171','to-tung-hinh-su':'#60a5fa','nghiep-vu':'#6ee7b7','tham-nhung':'#fbbf24' };
                const acc = CAT_ACC[doc.category] || '#FFD700';
                return (
                  <div key={doc.id} style={{ background:'rgba(255,255,255,0.05)', borderRadius:10, padding:'14px 16px', border:'1px solid rgba(255,255,255,0.08)', borderLeft:'4px solid '+acc, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', gap:8, marginBottom:4, flexWrap:'wrap', alignItems:'center' }}>
                        <span style={{ fontSize:11, fontWeight:700, color:acc, background:acc+'22', padding:'2px 8px', borderRadius:20, border:'1px solid '+acc+'44' }}>{doc.categoryLabel}</span>
                        <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{doc.issue_number}</span>
                      </div>
                      <div style={{ color:'#FFD700', fontWeight:700, fontSize:14 }}>{doc.title}</div>
                      <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:3 }}>
                        {doc.content.chapters.length} chương · {doc.content.chapters.reduce((s,c)=>s+c.articles.length,0)} điều · Cập nhật: {doc.updatedAt}
                      </div>
                    </div>
                    <button onClick={() => deleteDocument(doc.id)}
                      style={{ padding:'7px 12px', borderRadius:7, border:'1px solid rgba(248,113,113,0.3)', background:'rgba(127,29,29,0.25)', color:'#f87171', fontSize:12, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
                      🗑 Xóa
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === TAB LOGS === */}
        {tab === 'logs' && (
          <div>
            <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
              <input type="text" value={logSearch} onChange={e => setLogSearch(e.target.value)}
                placeholder="Tìm theo tên cán bộ, từ khóa..."
                style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,215,0,0.25)', fontSize:14, outline:'none', background:'rgba(255,255,255,0.06)', color:'#fff' }}
                onFocus={e => e.target.style.borderColor='rgba(255,215,0,0.7)'}
                onBlur={e => e.target.style.borderColor='rgba(255,215,0,0.25)'} />
              <select value={logAction} onChange={e => setLogAction(e.target.value)}
                style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:14, outline:'none', background:'#113a26', color:'#FFD700' }}>
                <option value="all">Tất cả hành động</option>
                <option value="LOGIN">Đăng nhập</option>
                <option value="SEARCH">Tìm kiếm</option>
                <option value="VIEW_DOC">Xem văn bản</option>
              </select>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,215,0,0.7)', marginBottom:12 }}>Tổng {filteredLogs.length} nhật ký</div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filteredLogs.slice(0, 50).map(log => {
                const ac = ACTION_LABELS[log.action] || { label: log.action, color:'#475569', bg:'#f1f5f9', icon:'•' };
                const docTitle = log.action === 'VIEW_DOC' ? (window.DOC_TITLES[log.details] || log.details) : log.details;
                return (
                  <div key={log.id} style={{ display:'flex', gap:12, padding:'12px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.04)', alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{ac.icon}</span>
                    <span style={{ padding:'3px 10px', borderRadius:20, background:ac.bg, color:ac.color, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{ac.label}</span>
                    <div style={{ flex:1, minWidth:120 }}>
                      <span style={{ fontWeight:600, color:'#FFD700', fontSize:13 }}>{log.full_name}</span>
                      <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginLeft:6 }}>({log.username})</span>
                    </div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', flex:2, minWidth:100 }}>
                      {log.action === 'SEARCH' && <span>🔍 "<em>{docTitle}</em>"</span>}
                      {log.action === 'VIEW_DOC' && <span>📄 {docTitle}</span>}
                      {log.action === 'LOGIN' && <span style={{ color:'#059669' }}>✓ {docTitle}</span>}
                    </div>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap' }}>{formatTime(log.created_at)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* === MODAL: Thêm văn bản === */}
      {showAddDoc && <AddDocModal onClose={() => setShowAddDoc(false)} onAdd={addDocument} />}

      {/* === MODAL: Thêm tài khoản === */}
      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={addUser} />}

      {/* === MODAL: Reset mật khẩu === */}
      {resetTarget && (
        <Modal title={`Đặt lại mật khẩu — ${resetTarget.full_name}`} onClose={() => setResetTarget(null)}>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, margin:'0 0 12px' }}>Nhập mật khẩu mới cho tài khoản <strong>{resetTarget.username}</strong>:</p>
          <input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mật khẩu mới..."
            style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(255,215,0,0.25)', fontSize:14, boxSizing:'border-box', outline:'none', background:'rgba(255,255,255,0.06)', color:'#fff' }} />
          <div style={{ display:'flex', gap:8, marginTop:16, justifyContent:'flex-end' }}>
            <button onClick={() => setResetTarget(null)} style={btnSecondary}>Hủy</button>
            <button onClick={() => { if (newPass.trim().length >= 4) { resetPassword(resetTarget.id, newPass.trim()); setResetTarget(null); } else showToast('Mật khẩu phải ít nhất 4 ký tự.','error'); }} style={btnPrimary}>Xác nhận</button>
          </div>
        </Modal>
      )}

      {/* === MODAL: Xác nhận xóa === */}
      {deleteTarget && (
        <Modal title="Xác nhận xóa tài khoản" onClose={() => setDeleteTarget(null)}>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:14 }}>Bạn có chắc muốn xóa tài khoản <strong style={{ color:'#dc2626' }}>{deleteTarget.full_name}</strong>?</p>
          <p style={{ color:'#991b1b', fontSize:13, background:'#fee2e2', padding:'10px 14px', borderRadius:8 }}>⚠ Thao tác này không thể hoàn tác.</p>
          <div style={{ display:'flex', gap:8, marginTop:16, justifyContent:'flex-end' }}>
            <button onClick={() => setDeleteTarget(null)} style={btnSecondary}>Hủy</button>
            <button onClick={() => { deleteUser(deleteTarget.id); setDeleteTarget(null); }}
              style={{ ...btnPrimary, background:'#dc2626' }}>Xóa tài khoản</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#113a26', borderRadius:12, padding:'24px', width:'100%', maxWidth:420, border:'1px solid rgba(255,215,0,0.2)', boxShadow:'0 24px 48px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:'#FFD700' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'rgba(255,255,255,0.5)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useStA({ username:'', full_name:'', unit:'', password:'' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.username.trim() || !form.full_name.trim() || !form.password.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.'); return;
    }
    onAdd(form);
    onClose();
  };

  const fields = [
    { key:'full_name', label:'Họ tên & Cấp bậc *', ph:'VD: Thiếu tá Nguyễn Văn A' },
    { key:'username', label:'Tên đăng nhập *', ph:'VD: nguyen.van.a' },
    { key:'unit', label:'Đơn vị', ph:'VD: Phòng Cảnh sát Hình sự' },
    { key:'password', label:'Mật khẩu *', ph:'Tối thiểu 4 ký tự' },
  ];

  return (
    <Modal title="Thêm tài khoản mới" onClose={onClose}>
      {fields.map(f => (
        <div key={f.key} style={{ marginBottom:12 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,215,0,0.8)', marginBottom:4 }}>{f.label}</label>
          <input type={f.key === 'password' ? 'password' : 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph}
            style={{ width:'100%', padding:'9px 13px', borderRadius:8, border:'1px solid rgba(255,215,0,0.25)', fontSize:13, boxSizing:'border-box', outline:'none', background:'rgba(255,255,255,0.06)', color:'#fff' }} />
        </div>
      ))}
      <div style={{ display:'flex', gap:8, marginTop:16, justifyContent:'flex-end' }}>
        <button onClick={onClose} style={btnSecondary}>Hủy</button>
        <button onClick={handleAdd} style={btnPrimary}>Tạo tài khoản</button>
      </div>
    </Modal>
  );
}

const btnPrimary = { padding:'9px 18px', borderRadius:8, background:'#1e3a8a', color:'#fff', border:'1px solid rgba(96,165,250,0.3)', fontWeight:700, fontSize:13, cursor:'pointer' };
const btnSecondary = { padding:'9px 18px', borderRadius:8, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.15)', fontWeight:600, fontSize:13, cursor:'pointer' };

/* ──────────────────────────────────────────
   MODAL THÊM VĂN BẢN
────────────────────────────────────────── */
function AddDocModal({ onClose, onAdd }) {
  const [step, setStep] = useStA(1); // 1=Thông tin, 2=Nội dung
  const [form, setForm] = useStA({
    title: '', issue_number: '', category: 'hinh-su', categoryLabel: 'Hình sự',
    summary: '', updatedAt: new Date().toISOString().slice(0,10),
  });
  const [chapters, setChapters] = useStA([
    { id: 'ch1', title: 'Chương I: NHỮNG QUY ĐỊNH CHUNG', articles: [
      { id: 'art1', title: 'Điều 1. Phạm vi điều chỉnh', text: '' }
    ]}
  ]);

  const CAT_OPTIONS = [
    { id:'hinh-su', label:'Hình sự' },
    { id:'to-tung-hinh-su', label:'Tố tụng Hình sự' },
    { id:'nghiep-vu', label:'Nghiệp vụ Điều tra' },
    { id:'tham-nhung', label:'Phòng chống Tham nhũng' },
  ];

  const setF = (k, v) => setForm(p => ({...p, [k]: v}));

  const addChapter = () => {
    const n = chapters.length + 1;
    setChapters(prev => [...prev, { id:'ch'+n, title:'Chương ' + n + ': ', articles:[{ id:'art'+Date.now(), title:'Điều 1. ', text:'' }] }]);
  };
  const removeChapter = (ci) => setChapters(prev => prev.filter((_,i)=>i!==ci));
  const updateChapter = (ci, val) => setChapters(prev => prev.map((c,i)=> i===ci ? {...c, title:val} : c));
  const addArticle = (ci) => setChapters(prev => prev.map((c,i)=> i===ci ? {...c, articles:[...c.articles, {id:'art'+Date.now(), title:'Điều. ', text:''}]} : c));
  const removeArticle = (ci, ai) => setChapters(prev => prev.map((c,i)=> i===ci ? {...c, articles:c.articles.filter((_,j)=>j!==ai)} : c));
  const updateArticle = (ci, ai, k, v) => setChapters(prev => prev.map((c,i)=> i===ci ? {...c, articles:c.articles.map((a,j)=> j===ai ? {...a, [k]:v} : a)} : c));

  const handleSave = () => {
    if (!form.title.trim() || !form.issue_number.trim()) {
      alert('Vui lòng điền Tiêu đề và Số ký hiệu.'); return;
    }
    const doc = { ...form, content: { chapters } };
    onAdd(doc);
    onClose();
  };

  const inputStyle = { width:'100%', padding:'9px 12px', borderRadius:7, border:'1px solid rgba(255,215,0,0.25)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
  const labelStyle = { display:'block', fontSize:11, fontWeight:700, color:'rgba(255,215,0,0.8)', marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 };
  const textareaStyle = { ...inputStyle, resize:'vertical', lineHeight:1.6 };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'16px', overflowY:'auto' }}>
      <div style={{ background:'#0d2d1e', borderRadius:14, width:'100%', maxWidth:700, border:'1px solid rgba(255,215,0,0.2)', boxShadow:'0 32px 64px rgba(0,0,0,0.5)', margin:'auto' }}>

        {/* Header */}
        <div style={{ padding:'18px 20px', borderBottom:'1px solid rgba(255,215,0,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ margin:0, color:'#FFD700', fontSize:16, fontWeight:800 }}>📄 Thêm văn bản mới</h3>
            <p style={{ margin:'4px 0 0', color:'rgba(255,255,255,0.45)', fontSize:12 }}>
              Bước {step}/2 — {step===1 ? 'Thông tin cơ bản' : 'Nội dung chương/điều'}
            </p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.6)', width:32, height:32, borderRadius:8, cursor:'pointer', fontSize:16 }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ height:3, background:'rgba(255,255,255,0.08)' }}>
          <div style={{ height:'100%', width: step===1?'50%':'100%', background:'#FFD700', borderRadius:3, transition:'width 0.3s' }}></div>
        </div>

        <div style={{ padding:'20px' }}>
          {/* === STEP 1: Thông tin === */}
          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={labelStyle}>Tiêu đề văn bản *</label>
                <input value={form.title} onChange={e=>setF('title',e.target.value)} placeholder="VD: Bộ luật Hình sự năm 2015..." style={inputStyle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelStyle}>Số ký hiệu *</label>
                  <input value={form.issue_number} onChange={e=>setF('issue_number',e.target.value)} placeholder="VD: Luật số 100/2015/QH13" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ngày cập nhật</label>
                  <input type="date" value={form.updatedAt} onChange={e=>setF('updatedAt',e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Danh mục</label>
                <select value={form.category} onChange={e=>{
                  const opt = CAT_OPTIONS.find(c=>c.id===e.target.value);
                  setF('category',e.target.value); setF('categoryLabel',opt?.label||'');
                }} style={{...inputStyle, colorScheme:'dark'}}>
                  {CAT_OPTIONS.map(c=><option key={c.id} value={c.id} style={{ background:'#0d2d1e', color:'#FFD700' }}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tóm tắt nội dung</label>
                <textarea value={form.summary} onChange={e=>setF('summary',e.target.value)} placeholder="Mô tả ngắn về nội dung văn bản..." rows={3} style={textareaStyle} />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:4 }}>
                <button onClick={onClose} style={btnSecondary}>Hủy</button>
                <button onClick={() => { if(!form.title.trim()||!form.issue_number.trim()){alert('Điền Tiêu đề và Số ký hiệu.');return;} setStep(2); }}
                  style={{ ...btnPrimary, background:'#FFD700', color:'#0a2318', border:'none' }}>
                  Tiếp theo →
                </button>
              </div>
            </div>
          )}

          {/* === STEP 2: Nội dung === */}
          {step === 2 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>
                  {chapters.length} chương · {chapters.reduce((s,c)=>s+c.articles.length,0)} điều
                </span>
                <button onClick={addChapter}
                  style={{ padding:'6px 14px', borderRadius:7, background:'rgba(255,215,0,0.12)', border:'1px solid rgba(255,215,0,0.3)', color:'#FFD700', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  + Thêm chương
                </button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:16, maxHeight:'50vh', overflowY:'auto', paddingRight:4 }}>
                {chapters.map((ch, ci) => (
                  <div key={ch.id} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, border:'1px solid rgba(255,215,0,0.15)', overflow:'hidden' }}>
                    {/* Chapter header */}
                    <div style={{ padding:'10px 14px', background:'rgba(255,215,0,0.08)', display:'flex', gap:8, alignItems:'center' }}>
                      <input value={ch.title} onChange={e=>updateChapter(ci,e.target.value)}
                        style={{ flex:1, padding:'6px 10px', borderRadius:6, border:'1px solid rgba(255,215,0,0.25)', background:'rgba(0,0,0,0.2)', color:'#FFD700', fontSize:13, fontWeight:700, outline:'none' }} />
                      {chapters.length > 1 && (
                        <button onClick={()=>removeChapter(ci)} style={{ background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', borderRadius:6, padding:'4px 8px', cursor:'pointer', fontSize:12 }}>✕</button>
                      )}
                    </div>

                    {/* Articles */}
                    <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:10 }}>
                      {ch.articles.map((art, ai) => (
                        <div key={art.id} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                            <input value={art.title} onChange={e=>updateArticle(ci,ai,'title',e.target.value)}
                              placeholder="Tiêu đề điều..."
                              style={{ flex:1, padding:'6px 10px', borderRadius:6, border:'1px solid rgba(255,215,0,0.2)', background:'rgba(0,0,0,0.2)', color:'#fff', fontSize:12, fontWeight:600, outline:'none' }} />
                            {ch.articles.length > 1 && (
                              <button onClick={()=>removeArticle(ci,ai)} style={{ background:'transparent', border:'none', color:'rgba(248,113,113,0.6)', cursor:'pointer', fontSize:14, padding:'0 4px' }}>✕</button>
                            )}
                          </div>
                          <textarea value={art.text} onChange={e=>updateArticle(ci,ai,'text',e.target.value)}
                            placeholder="Nội dung điều khoản..."
                            rows={3} style={{ width:'100%', padding:'7px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(0,0,0,0.15)', color:'rgba(255,255,255,0.8)', fontSize:12, lineHeight:1.65, outline:'none', resize:'vertical', boxSizing:'border-box' }} />
                        </div>
                      ))}
                      <button onClick={()=>addArticle(ci)}
                        style={{ padding:'7px', borderRadius:7, background:'transparent', border:'1px dashed rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.45)', fontSize:12, cursor:'pointer' }}>
                        + Thêm điều
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginTop:16 }}>
                <button onClick={()=>setStep(1)} style={btnSecondary}>← Quay lại</button>
                <button onClick={handleSave} style={{ ...btnPrimary, background:'#FFD700', color:'#0a2318', border:'none', padding:'10px 24px' }}>
                  💾 Lưu văn bản
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminPage });
