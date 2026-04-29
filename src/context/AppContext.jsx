import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import ToastContainer from "../components/Toast";
import {
  login as apiLogin,
  fetchSheet,
  appendRow,
  updateRow,
  deleteRow,
  logActivity as apiLogActivity,
} from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("plnd_token") || null,
  );
  const [toasts, setToasts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDocsCount, setNewDocsCount] = useState(0);

  useEffect(() => {
    const initData = async () => {
      try {
        const saved = localStorage.getItem("plnd_session");
        if (saved && token) {
          setUser(JSON.parse(saved));
        }

        const [fetchedDocs, fetchedLogs] = await Promise.all([
          fetchSheet("documents"),
          fetchSheet("activity_logs"),
        ]);

        setDocuments(fetchedDocs);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [token]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  const logActivity = useCallback(
    (userId, action, details) => {
      const username = user?.username || "Guest";
      const entry = {
        id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        user_id: userId,
        username,
        full_name: user?.full_name || "",
        action,
        details,
        created_at: new Date().toISOString(),
      };
      setLogs((prev) => [entry, ...prev]);
      apiLogActivity(username, action, details).catch((e) =>
        console.error("Log error", e),
      );
    },
    [user],
  );

  const clearNewDocs = useCallback(() => setNewDocsCount(0), []);

  const login = useCallback(
    async (username, password) => {
      try {
        const res = await apiLogin(username, password);

        if (res.success) {
          const userData = res.user;
          const userToken = res.token;

          const lastLogin = localStorage.getItem("plnd_last_login");
          if (lastLogin) {
            const count = documents.filter(
              (d) =>
                d.created_at && new Date(d.created_at) > new Date(lastLogin),
            ).length;
            if (count > 0) setNewDocsCount(count);
          }
          localStorage.setItem("plnd_last_login", new Date().toISOString());

          setUser(userData);
          setToken(userToken);
          localStorage.setItem("plnd_session", JSON.stringify(userData));
          localStorage.setItem("plnd_token", userToken);

          logActivity(userData.id, "LOGIN", "Đăng nhập thành công");
          showToast(`Chào mừng, ${userData.full_name}!`, "success");
          return { success: true };
        } else {
          return { error: res.error || "Sai tên đăng nhập hoặc mật khẩu." };
        }
      } catch (e) {
        return { error: "Lỗi kết nối máy chủ." };
      }
    },
    [documents, logActivity, showToast],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("plnd_session");
    localStorage.removeItem("plnd_token");
    showToast("Đã đăng xuất thành công.", "info");
  }, [showToast]);

  const addUser = useCallback(
    async (data) => {
      const newUser = {
        id: "u-" + Date.now(),
        ...data,
        role: "user",
      };
      showToast(`Đã thêm tài khoản ${data.username}`, "success");
      await appendRow("users", newUser, token);
      return newUser;
    },
    [showToast, token],
  );

  const deleteUserAction = useCallback(
    async (id) => {
      showToast("Đã xóa tài khoản.", "success");
      await deleteRow("users", id, token);
    },
    [showToast, token],
  );

  const resetPassword = useCallback(
    async (id, newPass) => {
      showToast("Đã đặt lại mật khẩu.", "success");
      await updateRow("users", id, { password: newPass }, token);
    },
    [showToast, token],
  );

  const addDocument = useCallback(
    async (doc) => {
      try {
        const newDoc = {
          ...doc,
          id: "doc-" + Date.now(),
          created_at: new Date().toISOString(),
        };

        const result = await appendRow("documents", newDoc, token);
        if (result.success) {
          setDocuments((prev) => [newDoc, ...prev]);
          showToast("Đã thêm văn bản: " + doc.title, "success");
          return newDoc;
        } else {
          throw new Error(result.error || "Lỗi xác thực hoặc API");
        }
      } catch (error) {
        console.error("Add doc error:", error);
        showToast(error.message, "error");
        if (error.message.includes("Phiên đăng nhập")) logout();
        throw error;
      }
    },
    [showToast, token, logout],
  );

  const deleteDocumentAction = useCallback(
    async (id) => {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast("Đã xóa văn bản.", "success");
      await deleteRow("documents", id, token);
    },
    [showToast, token],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        logs,
        documents,
        newDocsCount,
        clearNewDocs,
        addUser,
        deleteUser: deleteUserAction,
        resetPassword,
        logActivity,
        showToast,
        addDocument,
        deleteDocument: deleteDocumentAction,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
