import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  formatDate,
  formatDateTime,
  removeVietnameseDiacritics,
  validateFileHeader,
} from "../lib/utils";
import { uploadFile, postAPI } from "../lib/api";
import Modal from "../components/Modal";
import ReaderPage from "./ReaderPage";

export default function AdminPage() {
  const {
    documents,
    logs,
    addUser,
    deleteUser,
    resetPassword,
    addDocument,
    deleteDocument,
    user: currentUser,
    token,
  } = useApp();

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [logPage, setLogPage] = useState(1);
  const [tab, setTab] = useState("users");
  const [activeDoc, setActiveDoc] = useState(null);
  const logPageSize = 25;

  useEffect(() => {
    let cancelled = false;

    if (currentUser?.role !== "admin") {
      setUsers([]);
      return undefined;
    }

    if (!token) {
      setUsersError("Chưa có phiên đăng nhập hợp lệ để tải danh sách tài khoản.");
      return undefined;
    }

    const loadUsers = async () => {
      setIsLoadingUsers(true);
      setUsersError("");
      try {
        const res = await postAPI({ action: "admin_get_users", token });
        if (cancelled) return;
        if (res.success) {
          setUsers(res.rows || []);
        } else {
          setUsersError(res.error || "Không tải được danh sách tài khoản.");
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to load users", e);
          setUsersError(e.message || "Không tải được danh sách tài khoản.");
        }
      } finally {
        if (!cancelled) setIsLoadingUsers(false);
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.role, token]);

  const usersByUsername = useMemo(() => {
    return new Map(users.map((u) => [u.username, u]));
  }, [users]);

  const enrichedLogs = useMemo(() => {
    return logs.map((log) => {
      const matchedUser = usersByUsername.get(log.username);
      return {
        ...log,
        full_name: log.full_name || matchedUser?.full_name || "",
        unit: log.unit || matchedUser?.unit || "",
      };
    });
  }, [logs, usersByUsername]);

  const filteredUsers = useMemo(() => {
    const query = removeVietnameseDiacritics(userSearch.trim().toLowerCase());
    if (!query) return users;

    return users.filter((u) => {
      const searchable = removeVietnameseDiacritics(
        [u.username, u.full_name, u.unit, u.role].filter(Boolean).join(" ").toLowerCase(),
      );
      return searchable.includes(query);
    });
  }, [users, userSearch]);

  const sortedLogs = useMemo(() => {
    return [...enrichedLogs].sort((a, b) => {
      const timeA = new Date(a.created_at || a.timestamp || 0).getTime();
      const timeB = new Date(b.created_at || b.timestamp || 0).getTime();
      return timeB - timeA;
    });
  }, [enrichedLogs]);

  const totalLogPages = Math.max(1, Math.ceil(sortedLogs.length / logPageSize));
  const pagedLogs = useMemo(() => {
    const start = (logPage - 1) * logPageSize;
    return sortedLogs.slice(start, start + logPageSize);
  }, [sortedLogs, logPage, logPageSize]);

  useEffect(() => {
    setLogPage((page) => Math.min(page, totalLogPages));
  }, [totalLogPages]);

  const CATEGORIES = [
    { value: "hinh-su", label: "Hình sự" },
    { value: "to-tung-hinh-su", label: "Tố tụng Hình sự" },
    { value: "huong-dan-dieu-tra", label: "Hướng dẫn điều tra" },
    { value: "khac", label: "Khác" },
  ];

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    full_name: "",
    unit: "",
    password: "",
  });

  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    issue_number: "",
    doc_date: "",
    issuing_authority: "",
    category: "hinh-su",
    summary: "",
    drive_link: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.full_name) return;
    try {
      const added = await addUser(newUser);
      if (added) {
        setUsers((prev) => [...prev, added]);
        setShowUserModal(false);
        setNewUser({ username: "", full_name: "", unit: "", password: "" });
      }
    } catch (err) {
      // Error handled by showToast in AppContext
    }
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
        const uploadRes = await uploadFile(selectedFile, token);
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

    const docObj = {
      title: newDoc.title,
      issue_number: newDoc.issue_number,
      doc_date: newDoc.doc_date,
      issuing_authority: newDoc.issuing_authority,
      summary: newDoc.summary,
      category: newDoc.category,
      categoryLabel:
        CATEGORIES.find((c) => c.value === newDoc.category)?.label || "Khác",
      drive_link: driveUrl,
      drive_link_type: fileType,
    };

    await addDocument(docObj);
    setShowDocModal(false);
    setNewDoc({
      title: "",
      issue_number: "",
      doc_date: "",
      issuing_authority: "",
      category: "hinh-su",
      summary: "",
      drive_link: "",
    });
    setSelectedFile(null);
    setIsUploading(false);
  };

  if (activeDoc) {
    return (
      <ReaderPage
        doc={activeDoc}
        searchTerm=""
        onBack={() => setActiveDoc(null)}
      />
    );
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="p-8 text-center text-red-400">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  return (
    <div className="p-[20px_16px] max-w-[1000px] mx-auto animate-fade-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-forest m-0 mb-1">
          Quản trị hệ thống
        </h2>
        <p className="text-slate-500 text-sm m-0">
          Quản lý tài khoản, dữ liệu và giám sát hoạt động
        </p>
      </div>

      {}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {}
        <div className="flex bg-slate-50 p-1.5 border-b border-slate-200 overflow-x-auto">
          {[
            { id: "users", label: `Tài khoản (${users.length})`, icon: "👥" },
            { id: "docs", label: `Văn bản (${documents.length})`, icon: "📚" },
            { id: "logs", label: `Nhật ký (${sortedLogs.length})`, icon: "📋" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[120px] p-[10px] border-none rounded-lg cursor-pointer font-bold text-[13px] flex items-center justify-center gap-2 transition-all
                ${tab === t.id ? "bg-white text-forest shadow-sm border border-slate-200" : "bg-transparent text-slate-600 hover:bg-slate-200/50 font-bold"}`}
            >
              <span className="text-base">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {}
        {tab === "users" && (
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3 bg-white md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-slate-800 text-sm font-bold m-0">
                  Danh sách tài khoản
                </h3>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Hiển thị {filteredUsers.length}/{users.length} tài khoản
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Tìm username, họ tên, đơn vị..."
                  className="min-w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none transition-all focus:border-forest/50 focus:bg-white"
                />
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-gold text-forest border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                + Cấp tài khoản mới
              </button>
              </div>
            </div>
            {(isLoadingUsers || usersError || users.length === 0) && (
              <div
                className={`mx-4 mt-4 rounded-xl border p-3 text-xs font-bold ${
                  usersError
                    ? "border-red-100 bg-red-50 text-red-600"
                    : "border-slate-100 bg-slate-50 text-slate-500"
                }`}
              >
                {usersError ||
                  (isLoadingUsers
                    ? "Đang tải danh sách tài khoản từ Google Sheets..."
                    : "Chưa có tài khoản nào được trả về từ Google Sheets.")}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Username
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Họ tên / Đơn vị
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Phân quyền
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id || u.username}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-900">
                        {u.username}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-bold">
                          {u.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {u.unit}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === "admin" ? "bg-gold/20 text-forest" : "bg-slate-100 text-slate-600"}`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {u.id !== currentUser.id && (
                            <>
                              <button
                                onClick={() => resetPassword(u.id, "123456")}
                                className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                              >
                                Reset Pass
                              </button>
                              <button
                                  onClick={async () => {
                                    if (window.confirm("Xóa tài khoản này?")) {
                                      await deleteUser(u.id);
                                      setUsers((prev) =>
                                        prev.filter((user) => user.id !== u.id),
                                      );
                                    }
                                  }}
                                className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-sm font-bold text-slate-400"
                      >
                        Không tìm thấy tài khoản phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {}
        {tab === "docs" && (
          <div>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-slate-800 text-sm font-bold m-0">
                Quản lý văn bản
              </h3>
              <button
                onClick={() => setShowDocModal(true)}
                className="bg-gold text-forest border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                + Thêm văn bản
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Văn bản / Số hiệu
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Cơ quan / Ngày
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Chuyên mục
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {documents.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-[13px] line-clamp-1">
                          {d.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-bold">
                          {d.issue_number || "Chưa có số"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-bold text-[12px]">
                          {d.issuing_authority || "---"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {d.doc_date
                            ? new Date(d.doc_date).toLocaleDateString("vi-VN")
                            : "---"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-forest/10 text-forest px-2 py-1 rounded text-[10px] font-bold">
                          {d.categoryLabel}
                        </span>
                      </td>
                      <td className="p-4 text-[12px] text-slate-500">
                        {formatDate(d.updatedAt || d.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveDoc(d)}
                            className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Xóa văn bản này?"))
                                deleteDocument(d.id);
                            }}
                            className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {}
        {tab === "logs" && (
          <div>
            <div className="p-4 border-b border-slate-100 bg-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-slate-800 text-sm font-bold m-0">
                  Nhật ký hoạt động (Audit Trail)
                </h3>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Mới nhất trước · Trang {logPage}/{totalLogPages} · {sortedLogs.length} hoạt động
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLogPage((page) => Math.max(1, page - 1))}
                  disabled={logPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  onClick={() =>
                    setLogPage((page) => Math.min(totalLogPages, page + 1))
                  }
                  disabled={logPage === totalLogPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Thời gian
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Người dùng
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Hành động
                    </th>
                    <th className="p-4 border-b border-slate-100 font-bold">
                      Chi tiết
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {pagedLogs.map((l, index) => (
                    <tr
                      key={l.id || `${l.username}-${l.action}-${l.timestamp || l.created_at}-${index}`}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-[11px] text-slate-400">
                        {formatDateTime(l.created_at || l.timestamp)}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-900 font-bold text-[13px]">
                          {l.username}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {l.full_name}
                        </div>
                        {l.unit && (
                          <div className="text-[10px] text-slate-400">
                            {l.unit}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold 
                          ${
                            l.action === "LOGIN"
                              ? "bg-emerald-50 text-emerald-600"
                              : l.action === "SEARCH"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td
                        className="p-4 text-[12px] text-slate-600 max-w-[200px] truncate"
                        title={l.details}
                      >
                        {l.details}
                      </td>
                    </tr>
                  ))}
                  {pagedLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-sm font-bold text-slate-400"
                      >
                        Chưa có nhật ký hoạt động.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {sortedLogs.length > logPageSize && (
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Hiển thị {(logPage - 1) * logPageSize + 1}-
                  {Math.min(logPage * logPageSize, sortedLogs.length)} trong{" "}
                  {sortedLogs.length} hoạt động
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLogPage(1)}
                    disabled={logPage === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Đầu
                  </button>
                  <button
                    onClick={() => setLogPage(totalLogPages)}
                    disabled={logPage === totalLogPages}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cuối
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {}
      {showUserModal && (
        <Modal
          title="Cấp tài khoản mới"
          onClose={() => setShowUserModal(false)}
        >
          <form onSubmit={handleAddUser} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <input
                required
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Họ tên
              </label>
              <input
                required
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Đơn vị
              </label>
              <input
                required
                value={newUser.unit}
                onChange={(e) =>
                  setNewUser({ ...newUser, unit: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full p-4 rounded-xl bg-gold text-forest font-bold mt-2 border-none cursor-pointer shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all"
            >
              Lưu tài khoản
            </button>
          </form>
        </Modal>
      )}

      {}
      {showDocModal && (
        <Modal title="Thêm văn bản mới" onClose={() => setShowDocModal(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Số văn bản
                </label>
                <input
                  value={newDoc.issue_number}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, issue_number: e.target.value })
                  }
                  placeholder="Số: 123/2024/..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Ngày tháng năm
                </label>
                <input
                  type="date"
                  value={newDoc.doc_date}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, doc_date: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Cơ quan phát hành
              </label>
              <input
                value={newDoc.issuing_authority}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, issuing_authority: e.target.value })
                }
                placeholder="Ví dụ: Bộ Công an, Chính phủ..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Trích yếu văn bản
              </label>
              <textarea
                rows={2}
                required
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
                placeholder="Tên/trích yếu nội dung văn bản..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Chuyên mục
              </label>
              <select
                value={newDoc.category}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, category: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tải file đính kèm (PDF, Hình ảnh)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 outline-none focus:border-forest/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-forest file:text-gold hover:file:bg-forest-dark transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tóm tắt văn bản
              </label>
              <textarea
                rows={3}
                value={newDoc.summary}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, summary: e.target.value })
                }
                placeholder="Tóm tắt ngắn gọn nội dung chính..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-forest/50 focus:bg-white transition-all resize-y"
              />
            </div>
            <button
              onClick={handleAddDoc}
              disabled={isUploading}
              className="w-full p-4 rounded-xl bg-gold text-forest font-bold mt-2 border-none cursor-pointer disabled:opacity-50 shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all"
            >
              {isUploading ? "Đang xử lý..." : "Lưu văn bản"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
