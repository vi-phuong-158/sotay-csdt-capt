import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ToastContainer from '../components/Toast';
import { fetchSheet, appendRow, updateRow, deleteRow, logActivity as apiLogActivity } from '../lib/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Khôi phục session và fetch data
  useEffect(() => {
    const initData = async () => {
      try {
        const saved = localStorage.getItem('plnd_session');
        if (saved) {
          const sessionUser = JSON.parse(saved);
          setUser(sessionUser);
        }

        // Fetch toàn bộ data 1 lần
        const [fetchedUsers, fetchedDocs, fetchedLogs] = await Promise.all([
          fetchSheet('users'),
          fetchSheet('documents'),
          fetchSheet('activity_logs')
        ]);
        
        setUsers(fetchedUsers);
        setDocuments(fetchedDocs);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();

    // Background fetch mỗi 5 phút
    const interval = setInterval(async () => {
      try {
        const [fetchedUsers, fetchedDocs, fetchedLogs] = await Promise.all([
          fetchSheet('users'),
          fetchSheet('documents'),
          fetchSheet('activity_logs')
        ]);
        setUsers(fetchedUsers);
        setDocuments(fetchedDocs);
        setLogs(fetchedLogs);
      } catch (e) {
        console.warn("Background fetch failed", e);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const logActivity = useCallback((userId, action, details) => {
    const username = users.find(u => u.id === userId)?.username || '';
    const full_name = users.find(u => u.id === userId)?.full_name || '';
    const entry = {
      id: 'log-' + Date.now(),
      user_id: userId,
      username,
      full_name,
      action,
      details,
      created_at: new Date().toISOString(),
    };
    setLogs(prev => [entry, ...prev]);
    
    // Ghi log qua API
    apiLogActivity(username, action, details).catch(e => console.error("Log error", e));
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

  const addUser = useCallback(async (data) => {
    const newUser = {
      id: 'u-' + Date.now(),
      ...data,
      role: 'user',
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Đã thêm tài khoản ${data.username}`, 'success');
    await appendRow('users', newUser);
    return newUser;
  }, [showToast]);

  const deleteUserAction = useCallback(async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Đã xóa tài khoản.', 'success');
    await deleteRow('users', id);
  }, [showToast]);

  const resetPassword = useCallback(async (id, newPass) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: newPass } : u));
    showToast('Đã đặt lại mật khẩu.', 'success');
    await updateRow('users', id, { password: newPass });
  }, [showToast]);

  const addDocument = useCallback(async (doc) => {
    const newDoc = { ...doc, id: 'doc-' + Date.now(), created_at: new Date().toISOString() };
    setDocuments(prev => [newDoc, ...prev]);
    showToast('Đã thêm văn bản: ' + doc.title, 'success');
    await appendRow('documents', newDoc);
    return newDoc;
  }, [showToast]);

  const deleteDocumentAction = useCallback(async (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Đã xóa văn bản.', 'success');
    await deleteRow('documents', id);
  }, [showToast]);

  return (
    <AppContext.Provider value={{ 
      user, loading, login, logout, logs, users, documents, 
      addUser, deleteUser: deleteUserAction, resetPassword, 
      logActivity, showToast, addDocument, deleteDocument: deleteDocumentAction 
    }}>
      {children}
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
