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
  const [newDoc, setNewDoc] = useState({ 
    title: '', 
    issue_number: '', 
    doc_date: '', 
    issuing_authority: '', 
    category: 'hinh-su', 
    summary: '', 
    drive_link: ''
  });
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
    if (!newDoc.title) return;
    
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

    // Remove chapter/article splitting. Just store metadata.
    const docObj = {
      title: newDoc.title,
      issue_number: newDoc.issue_number,
      doc_date: newDoc.doc_date,
      issuing_authority: newDoc.issuing_authority,
      summary: newDoc.summary,
      category: newDoc.category,
      categoryLabel: CATEGORIES.find(c => c.value === newDoc.category)?.label || 'Khác',
      drive_link: driveUrl,
      drive_link_type: fileType
    };

    await addDocument(docObj);
    setShowDocModal(false);
    setNewDoc({ title: '', issue_number: '', doc_date: '', issuing_authority: '', category: 'hinh-su', summary: '', drive_link: '' });
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
                    <th className="p-4 border-b border-slate-100 font-bold">Văn bản / Số hiệu</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Cơ quan / Ngày</th>
                    <th className="p-4 border-b border-slate-100 font-bold">Chuyên mục</th>
                    <th className="p-4 border-b border-slate-100 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {documents.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-[13px] line-clamp-1">{d.title}</div>
                        <div className="text-[11px] text-slate-500 font-bold">{d.issue_number || 'Chưa có số'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-bold text-[12px]">{d.issuing_authority || '---'}</div>
                        <div className="text-[11px] text-slate-500">{d.doc_date ? new Date(d.doc_date).toLocaleDateString('vi-VN') : '---'}</div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số văn bản</label>
                <input value={newDoc.issue_number} onChange={e => setNewDoc({...newDoc, issue_number: e.target.value})} placeholder="Số: 123/2024/..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày tháng năm</label>
                <input type="date" value={newDoc.doc_date} onChange={e => setNewDoc({...newDoc, doc_date: e.target.value})} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cơ quan phát hành</label>
              <input value={newDoc.issuing_authority} onChange={e => setNewDoc({...newDoc, issuing_authority: e.target.value})} placeholder="Ví dụ: Bộ Công an, Chính phủ..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Trích yếu văn bản</label>
              <textarea rows={2} required value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} placeholder="Tên/trích yếu nội dung văn bản..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-none" />
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tóm tắt văn bản</label>
              <textarea rows={3} value={newDoc.summary} onChange={e => setNewDoc({...newDoc, summary: e.target.value})} placeholder="Tóm tắt ngắn gọn nội dung chính..." className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-y" />
            </div>
            <button onClick={handleAddDoc} disabled={isUploading} className="w-full p-4 rounded-xl bg-gold text-forest font-bold mt-2 border-none cursor-pointer disabled:opacity-50 shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all">
              {isUploading ? 'Đang xử lý...' : 'Lưu văn bản'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
