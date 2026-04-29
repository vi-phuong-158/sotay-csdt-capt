const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

async function callAPI(params) {
  if (!APPS_SCRIPT_URL) throw new Error("Chưa cấu hình VITE_APPS_SCRIPT_URL");

  const url = new URL(APPS_SCRIPT_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method: "GET",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
  return res.json();
}

export async function postAPI(body) {
  if (!APPS_SCRIPT_URL) throw new Error("Chưa cấu hình VITE_APPS_SCRIPT_URL");

  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`);
  return res.json();
}

export async function login(username, password) {
  if (DEMO_MODE) {
    const { MOCK_USERS } = await import("../data/mockData.js");
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (user) {
      return {
        success: true,
        token: "demo-token",
        user: { ...user, password: "" },
      };
    }
    return { success: false, error: "Sai thông tin đăng nhập" };
  }
  return postAPI({ action: "login", username, password });
}

export async function fetchSheet(sheetName) {
  if (DEMO_MODE) {
    const { MOCK_USERS, MOCK_DOCUMENTS, MOCK_LOGS } =
      await import("../data/mockData.js");
    if (sheetName === "users") return MOCK_USERS;
    if (sheetName === "documents") return MOCK_DOCUMENTS;
    if (sheetName === "activity_logs") return MOCK_LOGS;
    return [];
  }

  if (sheetName === "users") {
    console.warn("Truy cập bảng users bị chặn vì lý do bảo mật.");
    return [];
  }

  const data = await callAPI({ action: "get", sheet: sheetName });
  return data.rows || [];
}

export async function appendRow(sheetName, row, token) {
  if (DEMO_MODE) {
    console.log("[DEMO] appendRow →", sheetName, row);
    return { success: true };
  }
  return postAPI({ action: "append", sheet: sheetName, row, token });
}

export async function updateRow(sheetName, id, updates, token) {
  if (DEMO_MODE) {
    console.log("[DEMO] updateRow →", sheetName, id, updates);
    return { success: true };
  }
  return postAPI({ action: "update", sheet: sheetName, id, updates, token });
}

export async function deleteRow(sheetName, id, token) {
  if (DEMO_MODE) {
    console.log("[DEMO] deleteRow →", sheetName, id);
    return { success: true };
  }
  return postAPI({ action: "delete", sheet: sheetName, id, token });
}

export async function logActivity(username, action, details) {
  const row = {
    timestamp: new Date().toISOString(),
    username,
    action,
    details,
  };
  return appendRow("activity_logs", row);
}

export async function uploadFile(file, token) {
  if (DEMO_MODE) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            success: true,
            url: "https://drive.google.com/demo-upload",
          }),
        1000,
      );
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      try {
        const res = await postAPI({
          action: "upload",
          fileName: file.name,
          mimeType: file.type,
          data: base64Data,
          token,
        });
        resolve(res);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const isDemoMode = DEMO_MODE;
