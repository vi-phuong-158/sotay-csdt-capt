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
  changePassword as apiChangePassword,
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
    (userId, action, details, customToken, actorUser) => {
      const logUser = actorUser || user || {};
      const username = logUser.username || "Guest";
      const createdAt = new Date().toISOString();
      const entry = {
        id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        user_id: userId,
        username,
        full_name: logUser.full_name || "",
        action,
        details,
        timestamp: createdAt,
        created_at: createdAt,
      };
      setLogs((prev) => [entry, ...prev]);
      apiLogActivity(username, action, details, customToken || token).catch(
        (e) => console.error("Log error", e),
      );
    },
    [user, token],
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

          logActivity(
            userData.id,
            "LOGIN",
            "Đăng nhập thành công",
            userToken,
            userData,
          );
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
      try {
        const newUser = {
          id: "u-" + Date.now(),
          ...data,
          role: "user",
        };
        const result = await appendRow("users", newUser, token);
        if (result.success) {
          showToast(`Đã thêm tài khoản ${data.username}`, "success");
          // Re-fetch users list might be needed, but for now we just return
          return newUser;
        } else {
          throw new Error(result.error || "Lỗi khi tạo tài khoản");
        }
      } catch (error) {
        showToast(error.message, "error");
        throw error;
      }
    },
    [showToast, token],
  );

  const deleteUserAction = useCallback(
    async (id) => {
      try {
        const result = await deleteRow("users", id, token);
        if (result.success) {
          showToast("Đã xóa tài khoản.", "success");
        } else {
          throw new Error(result.error || "Lỗi khi xóa tài khoản");
        }
      } catch (error) {
        showToast(error.message, "error");
      }
    },
    [showToast, token],
  );

  const resetPassword = useCallback(
    async (id, newPass) => {
      try {
        const result = await updateRow("users", id, { password: newPass }, token);
        if (result.success) {
          showToast("Đã đặt lại mật khẩu.", "success");
        } else {
          throw new Error(result.error || "Lỗi khi đặt lại mật khẩu");
        }
      } catch (error) {
        showToast(error.message, "error");
      }
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
      try {
        const result = await deleteRow("documents", id, token);
        if (result.success) {
          setDocuments((prev) => prev.filter((d) => d.id !== id));
          showToast("Đã xóa văn bản.", "success");
        } else {
          throw new Error(result.error || "Lỗi khi xóa văn bản");
        }
      } catch (error) {
        showToast(error.message, "error");
      }
    },
    [showToast, token],
  );

  const changePassword = useCallback(
    async (oldPass, newPass) => {
      try {
        const result = await apiChangePassword(oldPass, newPass, token);
        if (result.success) {
          showToast("Đã đổi mật khẩu thành công.", "success");
          return { success: true };
        } else {
          return { error: result.error || "Lỗi khi đổi mật khẩu" };
        }
      } catch (error) {
        return { error: "Lỗi kết nối máy chủ." };
      }
    },
    [token, showToast],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        token,
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
        changePassword,
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
