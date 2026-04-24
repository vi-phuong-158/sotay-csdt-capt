// AppContext.jsx - Auth context, Toast, shared utilities
// Exports to window: { AppProvider, useApp, Toast }

const { createContext, useContext, useState, useEffect, useCallback } = React;

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([...window.MOCK_LOGS]);
  const [users, setUsers] = useState([...window.MOCK_USERS]);
  const [documents, setDocuments] = useState([...window.MOCK_DOCUMENTS]);

  // Kiểm tra session đã lưu
  useEffect(() => {
    const saved = localStorage.getItem('plnd_session');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const logActivity = useCallback((userId, action, details) => {
    const entry = {
      id: 'log-' + Date.now(),
      user_id: userId,
      username: users.find(u => u.id === userId)?.username || '',
      full_name: users.find(u => u.id === userId)?.full_name || '',
      action,
      details,
      created_at: new Date().toISOString(),
    };
    setLogs(prev => [entry, ...prev]);
    // Mô phỏng ghi vào Supabase
    console.log('[AUDIT LOG]', entry);
  }, [users]);

  const login = useCallback((username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
    const sessionUser = { ...found };
    delete sessionUser.password;
    setUser(sessionUser);
    localStorage.setItem('plnd_session', JSON.stringify(sessionUser));
    logActivity(found.id, 'LOGIN', 'Đăng nhập thành công');
    showToast(`Chào mừng, ${found.full_name}!`, 'success');
    return { success: true };
  }, [users, logActivity, showToast]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('plnd_session');
    showToast('Đã đăng xuất thành công.', 'info');
  }, [showToast]);

  const addUser = useCallback((data) => {
    const newUser = {
      id: 'u-' + Date.now(),
      ...data,
      role: 'user',
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Đã thêm tài khoản ${data.username}`, 'success');
    return newUser;
  }, [showToast]);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Đã xóa tài khoản.', 'success');
  }, [showToast]);

  const resetPassword = useCallback((id, newPass) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: newPass } : u));
    showToast('Đã đặt lại mật khẩu.', 'success');
  }, [showToast]);

  const addDocument = useCallback((doc) => {
    const newDoc = { ...doc, id: 'doc-' + Date.now(), created_at: new Date().toISOString() };
    setDocuments(prev => [newDoc, ...prev]);
    // Đồng bộ với MOCK_DOCUMENTS để Search có thể tìm thấy
    window.MOCK_DOCUMENTS.unshift(newDoc);
    showToast('Đã thêm văn bản: ' + doc.title, 'success');
    return newDoc;
  }, [showToast]);

  const deleteDocument = useCallback((id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    const idx = window.MOCK_DOCUMENTS.findIndex(d => d.id === id);
    if (idx !== -1) window.MOCK_DOCUMENTS.splice(idx, 1);
    showToast('Đã xóa văn bản.', 'success');
  }, [showToast]);

  return (
    <AppContext.Provider value={{ user, login, logout, logs, users, documents, addUser, deleteUser, resetPassword, logActivity, showToast, addDocument, deleteDocument }}>
      {children}
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const colors = {
    success: 'background:#166534;border-left:4px solid #4ade80',
    error: 'background:#991b1b;border-left:4px solid #f87171',
    info: 'background:#1e3a8a;border-left:4px solid #60a5fa',
    warning: 'background:#92400e;border-left:4px solid #fbbf24',
  };
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, maxWidth:340 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          color:'#fff', padding:'12px 16px', borderRadius:8, fontSize:14, fontWeight:500,
          display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
          animation:'slideIn 0.3s ease', ...(Object.fromEntries(colors[t.type].split(';').map(s => {
            const [k,v] = s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v?.trim()];
          }).filter(([k]) => k)))
        }}>
          <span style={{ fontSize:16 }}>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useApp() {
  return useContext(AppContext);
}

Object.assign(window, { AppProvider, useApp });
