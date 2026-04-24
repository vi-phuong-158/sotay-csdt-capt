import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatDateTime, validateFileHeader } from '../lib/utils';
import { uploadFile } from '../lib/api';
import Modal from '../components/Modal';

export default function AdminPage() {
  const { users, documents, logs, addUser, deleteUser, resetPassword, addDocument, deleteDocument, user: currentUser } = useApp();
  const [tab, setTab] = useState('users');

  // Add User State
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', full_name: '', unit: '', password: '' });

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

    // Parse raw text into chapters/articles
    // Simplified parser for demo: treats each line as an article in one chapter
    const lines = newDoc.rawText.split('\n').filter(l => l.trim() !== '');
    const articles = lines.map((line, idx) => {
      const parts = line.split(':');
      return {
        id: `art-${Date.now()}-${idx}`,
        title: parts.length > 1 ? parts[0].trim() : `Điều ${idx + 1}`,
        text: parts.length > 1 ? parts.slice(1).join(':').trim() : line.trim()
      };
    });

    const docObj = {
      title: newDoc.title,
      issue_number: newDoc.issue_number,
      category: newDoc.category,
      categoryLabel: newDoc.category === 'hinh-su' ? 'Hình sự' : 'Khác',
      summary: newDoc.summary,
      drive_link: driveUrl,
      drive_link_type: fileType,
      content: {
        chapters: [{ id: `ch-${Date.now()}`, title: 'Chương I', articles }]
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
        <h2 className="text-xl font-bold text-gold m-0 mb-1">Quản trị hệ thống</h2>
        <p className="text-white/50 text-sm m-0">Quản lý tài khoản, dữ liệu và giám sát hoạt động</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0a2318] rounded-lg p-1 border border-white/10 mb-5 overflow-x-auto">
        {[
          { id: 'users', label: `Tài khoản (${users.length})`, icon: '👥' },
          { id: 'docs', label: `Văn bản (${documents.length})`, icon: '📚' },
          { id: 'logs', label: `Nhật ký (${logs.length})`, icon: '📋' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[120px] p-[10px] border-none rounded-md cursor-pointer font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors
              ${tab === t.id ? 'bg-navy text-white shadow-sm' : 'bg-transparent text-white/50 hover:bg-white/5'}`}>
            <span className="text-base">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#05110c] border border-white/10 rounded-xl overflow-hidden">
        
        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-white text-sm font-bold m-0">Danh sách tài khoản</h3>
              <button onClick={() => setShowUserModal(true)} className="bg-gold text-forest-dark border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer">
                + Cấp tài khoản mới
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80 border-collapse">
                <thead className="bg-[#113a26] text-gold/80 text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10 font-bold">Username</th>
                    <th className="p-3 border-b border-white/10 font-bold">Họ tên / Đơn vị</th>
                    <th className="p-3 border-b border-white/10 font-bold">Phân quyền</th>
                    <th className="p-3 border-b border-white/10 font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3 font-semibold text-white">{u.username}</td>
                      <td className="p-3">
                        <div className="text-white font-medium">{u.full_name}</div>
                        <div className="text-[11px] text-white/40">{u.unit}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-gold text-forest-dark' : 'bg-white/10 text-white/70'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        {u.id !== currentUser.id && (
                          <>
                            <button onClick={() => resetPassword(u.id, '123456')} className="bg-blue-500/20 text-blue-300 border-none px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-500/40">Reset Pass</button>
                            <button onClick={() => {if(window.confirm('Xóa tài khoản này?')) deleteUser(u.id)}} className="bg-red-500/20 text-red-300 border-none px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-500/40">Xóa</button>
                          </>
                        )}
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
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-white text-sm font-bold m-0">Quản lý văn bản</h3>
              <button onClick={() => setShowDocModal(true)} className="bg-gold text-forest-dark border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer">
                + Thêm văn bản
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80 border-collapse">
                <thead className="bg-[#113a26] text-gold/80 text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-b border-white/10 font-bold">Văn bản</th>
                    <th className="p-3 border-b border-white/10 font-bold">Chuyên mục</th>
                    <th className="p-3 border-b border-white/10 font-bold">Ngày cập nhật</th>
                    <th className="p-3 border-b border-white/10 font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(d => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3">
                        <div className="text-white font-bold text-[13px]">{d.title}</div>
                        <div className="text-[11px] text-white/40">{d.issue_number}</div>
                      </td>
                      <td className="p-3"><span className="bg-navy px-2 py-1 rounded text-[10px] text-white">{d.categoryLabel}</span></td>
                      <td className="p-3 text-[12px]">{formatDate(d.updatedAt || d.created_at)}</td>
                      <td className="p-3">
                        <button onClick={() => {if(window.confirm('Xóa văn bản này?')) deleteDocument(d.id)}} className="bg-red-500/20 text-red-300 border-none px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-500/40">Xóa</button>
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
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-white text-sm font-bold m-0">Nhật ký hoạt động (Audit Trail)</h3>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-sm text-white/80 border-collapse">
                <thead className="bg-[#113a26] text-gold/80 text-[11px] uppercase sticky top-0">
                  <tr>
                    <th className="p-3 border-b border-white/10 font-bold">Thời gian</th>
                    <th className="p-3 border-b border-white/10 font-bold">Người dùng</th>
                    <th className="p-3 border-b border-white/10 font-bold">Hành động</th>
                    <th className="p-3 border-b border-white/10 font-bold">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3 text-[11px] text-white/50">{formatDateTime(l.created_at)}</td>
                      <td className="p-3">
                        <div className="text-white font-medium text-[13px]">{l.username}</div>
                        <div className="text-[10px] text-white/30">{l.full_name}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold 
                          ${l.action === 'LOGIN' ? 'bg-green-500/20 text-green-300' : 
                            l.action === 'SEARCH' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                          {l.action}
                        </span>
                      </td>
                      <td className="p-3 text-[12px] max-w-[200px] truncate" title={l.details}>{l.details}</td>
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
              <label className="block text-xs text-white/60 mb-1">Tên đăng nhập</label>
              <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Mật khẩu</label>
              <input required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Họ tên</label>
              <input required value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Đơn vị</label>
              <input required value={newUser.unit} onChange={e => setNewUser({...newUser, unit: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
            </div>
            <button type="submit" className="w-full p-3 rounded bg-gold text-forest-dark font-bold mt-2 border-none cursor-pointer">Lưu tài khoản</button>
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
                  <label className="block text-xs text-white/60 mb-1">Tên văn bản</label>
                  <input required value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Số hiệu</label>
                  <input value={newDoc.issue_number} onChange={e => setNewDoc({...newDoc, issue_number: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Tải file đính kèm (PDF, Hình ảnh)</label>
                  <input type="file" accept=".pdf,image/*" onChange={e => setSelectedFile(e.target.files[0])} className="w-full p-2 rounded bg-white/5 border border-white/20 text-white/70 outline-none focus:border-gold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-forest-dark hover:file:bg-gold/80" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Tóm tắt</label>
                  <textarea rows={3} value={newDoc.summary} onChange={e => setNewDoc({...newDoc, summary: e.target.value})} className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold resize-y" />
                </div>
                <button onClick={() => setDocStep(2)} className="w-full p-3 rounded bg-navy text-white font-bold mt-2 border-none cursor-pointer">Tiếp tục: Nhập nội dung</button>
              </>
            )}
            {docStep === 2 && (
              <>
                <div className="text-xs text-gold/80 bg-gold/10 p-2 rounded">
                  Dán nội dung văn bản vào đây. Mỗi dòng sẽ được chuyển thành một Điều. Format: "Điều X: Nội dung..."
                </div>
                <div>
                  <textarea rows={10} value={newDoc.rawText} onChange={e => setNewDoc({...newDoc, rawText: e.target.value})} placeholder="Điều 1: Phạm vi..." className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-white outline-none focus:border-gold resize-y font-mono text-xs" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setDocStep(1)} className="flex-1 p-3 rounded bg-white/10 text-white font-bold border-none cursor-pointer">Quay lại</button>
                  <button onClick={handleAddDoc} disabled={isUploading} className="flex-[2] p-3 rounded bg-gold text-forest-dark font-bold border-none cursor-pointer disabled:opacity-50">
                    {isUploading ? 'Đang tải file & lưu...' : 'Lưu văn bản'}
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
