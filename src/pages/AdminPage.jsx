import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatDateTime, validateFileHeader } from '../lib/utils';
import { uploadFile } from '../lib/api';
import Modal from '../components/Modal';
import ReaderPage from './ReaderPage';

export default function AdminPage() {
  const { users, documents, logs, addUser, deleteUser, resetPassword, addDocument, deleteDocument, user: currentUser } = useApp();
  const [tab, setTab] = useState('users');
  const [activeDoc, setActiveDoc] = useState(null);

  // Danh sách chuyên mục
  const CATEGORIES = [
    { value: 'hinh-su', label: 'Hình sự' },
    { value: 'to-tung-hinh-su', label: 'Tố tụng Hình sự' },
    { value: 'huong-dan-dieu-tra', label: 'Hướng dẫn điều tra' },
    { value: 'khac', label: 'Khác' },
  ];

  // Add User State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', full_name: '', unit: '', password: '' });

  if (activeDoc) {
    return <ReaderPage doc={activeDoc} searchTerm="" onBack={() => setActiveDoc(null)} />;
  }

  // Add Doc State
  const [showDocModal, setShowDocModal] = useState(false);
  const [docStep, setDocStep] = useState(1);
  const [newDoc, setNewDoc] = useState({ title: '', issue_number: '', category: 'hinh-su', summary: '', drive_link: '', rawText: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.full_name) return;
    await addUser(newUser);
    setShowUserModal(false);
    setNewUser({ username: '', full_name: '', unit: '', password: '' });
  };

  const handleAddDoc = async () => {
    if (!newDoc.title || !newDoc.rawText) return;
    
    setIsUploading(true);
    let driveUrl = newDoc.drive_link;
    let fileType = null;

    if (selectedFile) {
      const validation = await validateFileHeader(selectedFile);
      if (!validation.isValid) {
        alert(validation.error);
        setIsUploading(false);
        return;
      }
      fileType = validation.type;

      try {
        const uploadRes = await uploadFile(selectedFile);
        if (uploadRes.success && uploadRes.url) {
          driveUrl = uploadRes.url;
        }
      } catch (err) {
        console.error("Upload file failed", err);
        alert("Lỗi khi tải file lên Google Drive. Vui lòng thử lại.");
        setIsUploading(false);
        return;
      }
    }

    // No more chapter/article splitting. Just store the raw text.
    const docObj = {
      title: newDoc.title,
      issue_number: newDoc.issue_number,
      category: newDoc.category,
      categoryLabel: CATEGORIES.find(c => c.value === newDoc.category)?.label || 'Khác',
      summary: newDoc.summary,
      drive_link: driveUrl,
      drive_link_type: fileType,
      content: {
        fullText: newDoc.rawText
      }
    };

    await addDocument(docObj);
    setShowDocModal(false);
    setDocStep(1);
    setNewDoc({ title: '', issue_number: '', category: 'hinh-su', summary: '', drive_link: '', rawText: '' });
    setSelectedFile(null);
    setIsUploading(false);
  };

  if (currentUser?.role !== 'admin') {
    return <div className="p-8 text-center text-red-400">Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div className="p-[20px_16px] max-w-[1000px] mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-forest m-0 mb-1">Quản trị hệ thống</h2>
        <p className="text-slate-500 text-sm m-0">Quản lý tài khoản, dữ liệu và giám sát hoạt động</p>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Tabs Bar */}
        <div className="flex bg-slate-50 p-1.5 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'users', label: `Tài khoản (${users.length})`, icon: '👥' },
            { id: 'docs', label: `Văn bản (${documents.length})`, icon: '📚' },
            { id: 'logs', label: `Nhật ký (${logs.length})`, icon: '📋' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[120px] p-[10px] border-none rounded-lg cursor-pointer font-bold text-[13px] flex items-center justify-center gap-2 transition-all
                ${tab === t.id ? 'bg-white text-forest shadow-sm border border-slate-200' : 'bg-transparent text-slate-600 hover:bg-slate-200/50 font-bold'}`}>
              <span className="text-base">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        
        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-slate-800 text-sm font-bold m-0">Danh sách tài khoản</h3>
              <button onClick={() => setShowUserModal(true)} className="bg-gold text-forest border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm hover:shadow-md transition-all">
                + Cấp tài khoản mới
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">Username</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Họ tên / Đơn vị</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Phân quyền</th>
                    <th className="p-4 border-b border-slate-100 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{u.username}</td>
                      <td className="p-4">
                        <div className="text-slate-800 font-bold">{u.full_name}</div>
                        <div className="text-[11px] text-slate-500">{u.unit}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-gold/20 text-forest' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {u.id !== currentUser.id && (
                            <>
                              <button onClick={() => resetPassword(u.id, '123456')} className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">Reset Pass</button>
                              <button onClick={() => {if(window.confirm('Xóa tài khoản này?')) deleteUser(u.id)}} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">Xóa</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCS TAB */}
        {tab === 'docs' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-slate-800 text-sm font-bold m-0">Quản lý văn bản</h3>
              <button onClick={() => setShowDocModal(true)} className="bg-gold text-forest border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm hover:shadow-md transition-all">
                + Thêm văn bản
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">Văn bản</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Chuyên mục</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Cập nhật</th>
                    <th className="p-4 border-b border-slate-100 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {documents.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-[13px]">{d.title}</div>
                        <div className="text-[11px] text-slate-500">{d.issue_number}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-forest/10 text-forest px-2 py-1 rounded text-[10px] font-bold">
                          {d.categoryLabel}
                        </span>
                      </td>
                      <td className="p-4 text-[12px] text-slate-500">{formatDate(d.updatedAt || d.created_at)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setActiveDoc(d)} className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">Xem</button>
                          <button onClick={() => {if(window.confirm('Xóa văn bản này?')) deleteDocument(d.id)}} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <div>
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="text-slate-800 text-sm font-bold m-0">Nhật ký hoạt động (Audit Trail)</h3>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">Thời gian</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Người dùng</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Hành động</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {logs.map(l => (
                    <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-[11px] text-slate-400">{formatDateTime(l.created_at)}</td>
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-[13px]">{l.username}</div>
                        <div className="text-[10px] text-slate-500">{l.full_name}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold 
                          ${l.action === 'LOGIN' ? 'bg-emerald-50 text-emerald-600' : 
                            l.action === 'SEARCH' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {l.action}
                        </span>
                      </td>
                      <td className="p-4 text-[12px] text-slate-600 max-w-[200px] truncate" title={l.details}>{l.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <Modal title="Cấp tài khoản mới" onClose={() => setShowUserModal(false)}>
          <form onSubmit={handleAddUser} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên đăng nhập</label>
              <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <input required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Họ tên</label>
              <input required value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đơn vị</label>
              <input required value={newUser.unit} onChange={e => setNewUser({...newUser, unit: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
            </div>
            <button type="submit" className="w-full p-4 rounded-xl bg-gold text-forest font-bold mt-2 border-none cursor-pointer shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all">Lưu tài khoản</button>
          </form>
        </Modal>
      )}

      {/* Doc Modal */}
      {showDocModal && (
        <Modal title="Thêm văn bản mới" onClose={() => setShowDocModal(false)}>
          <div className="flex flex-col gap-4">
            {docStep === 1 && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên văn bản</label>
                  <input required value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số hiệu</label>
                  <input value={newDoc.issue_number} onChange={e => setNewDoc({...newDoc, issue_number: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Chuyên mục</label>
                  <select value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all cursor-pointer">
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tải file đính kèm (PDF, Hình ảnh)</label>
                  <input type="file" accept=".pdf,image/*" onChange={e => setSelectedFile(e.target.files[0])} className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 outline-none focus:border-forest/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-forest file:text-gold hover:file:bg-forest-dark transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tóm tắt</label>
                  <textarea rows={3} value={newDoc.summary} onChange={e => setNewDoc({...newDoc, summary: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-y" />
                </div>
                <button onClick={() => setDocStep(2)} className="w-full p-4 rounded-xl bg-forest text-white font-bold mt-2 border-none cursor-pointer shadow-lg shadow-forest/20 hover:bg-forest-dark transition-all">Tiếp tục: Nhập nội dung</button>
              </>
            )}
            {docStep === 2 && (
              <>
                <div className="text-[11px] font-bold text-forest bg-forest/5 p-3 rounded-xl border border-forest/10 mb-2">
                  Dán nội dung văn bản vào đây. Hệ thống sẽ hiển thị đúng như định dạng bạn đã dán.
                </div>
                <div>
                  <textarea rows={10} value={newDoc.rawText} onChange={e => setNewDoc({...newDoc, rawText: e.target.value})} placeholder="Điều 1: Phạm vi..." className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-y font-mono text-xs leading-relaxed" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setDocStep(1)} className="flex-1 p-4 rounded-xl bg-slate-100 text-slate-600 font-bold border-none cursor-pointer hover:bg-slate-200 transition-all">Quay lại</button>
                  <button onClick={handleAddDoc} disabled={isUploading} className="flex-[2] p-4 rounded-xl bg-gold text-forest font-bold border-none cursor-pointer disabled:opacity-50 shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all">
                    {isUploading ? 'Đang xử lý...' : 'Lưu văn bản'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
