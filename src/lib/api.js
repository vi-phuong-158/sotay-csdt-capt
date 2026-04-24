// ============================================================
// api.js — Google Sheets API Layer (qua Apps Script Web App)
// ============================================================
// Cách dùng:
//   1. Tạo file google-apps-script/Code.gs lên Google Apps Script
//   2. Deploy dưới dạng Web App (Anyone can access)
//   3. Copy URL vào .env:  VITE_APPS_SCRIPT_URL=https://...
//   4. Đặt VITE_DEMO_MODE=false
//
// Khi VITE_DEMO_MODE=true (mặc định), app dùng mock data offline.
// ============================================================

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

// ── Internal fetch helper ─────────────────────────────────────
async function callAPI(params) {
  if (!APPS_SCRIPT_URL) throw new Error('Chưa cấu hình VITE_APPS_SCRIPT_URL')

  // Apps Script nhận GET qua query params
  const url = new URL(APPS_SCRIPT_URL)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`)
  return res.json()
}

async function postAPI(body) {
  if (!APPS_SCRIPT_URL) throw new Error('Chưa cấu hình VITE_APPS_SCRIPT_URL')

  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`API lỗi: ${res.status}`)
  return res.json()
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Lấy dữ liệu từ một sheet tab
 * @param {'users'|'documents'|'activity_logs'} sheetName
 * @returns {Promise<Array>}
 */
export async function fetchSheet(sheetName) {
  if (DEMO_MODE) {
    // Demo mode: import mock data
    const { MOCK_USERS, MOCK_DOCUMENTS, MOCK_LOGS } = await import('../data/mockData.js')
    if (sheetName === 'users') return MOCK_USERS
    if (sheetName === 'documents') return MOCK_DOCUMENTS
    if (sheetName === 'activity_logs') return MOCK_LOGS
    return []
  }

  const data = await callAPI({ action: 'get', sheet: sheetName })
  return data.rows || []
}

/**
 * Ghi một dòng mới vào sheet
 * @param {'users'|'documents'|'activity_logs'} sheetName
 * @param {Object} row  Dữ liệu cần ghi
 */
export async function appendRow(sheetName, row) {
  if (DEMO_MODE) {
    console.log('[DEMO] appendRow →', sheetName, row)
    return { success: true }
  }
  return postAPI({ action: 'append', sheet: sheetName, row })
}

/**
 * Cập nhật một dòng theo id
 * @param {'users'|'documents'} sheetName
 * @param {string} id
 * @param {Object} updates
 */
export async function updateRow(sheetName, id, updates) {
  if (DEMO_MODE) {
    console.log('[DEMO] updateRow →', sheetName, id, updates)
    return { success: true }
  }
  return postAPI({ action: 'update', sheet: sheetName, id, updates })
}

/**
 * Xóa một dòng theo id
 * @param {'users'|'documents'} sheetName
 * @param {string} id
 */
export async function deleteRow(sheetName, id) {
  if (DEMO_MODE) {
    console.log('[DEMO] deleteRow →', sheetName, id)
    return { success: true }
  }
  return postAPI({ action: 'delete', sheet: sheetName, id })
}

/**
 * Ghi log hoạt động (LOGIN, SEARCH, VIEW_DOC)
 * @param {string} username
 * @param {'LOGIN'|'SEARCH'|'VIEW_DOC'} action
 * @param {string} details
 */
export async function logActivity(username, action, details) {
  const row = {
    timestamp: new Date().toISOString(),
    username,
    action,
    details,
  }
  return appendRow('activity_logs', row)
}

/**
 * Upload file lên Google Drive thông qua Apps Script
 * @param {File} file 
 * @returns {Promise<{success: boolean, url?: string}>}
 */
export async function uploadFile(file) {
  if (DEMO_MODE) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, url: 'https://drive.google.com/demo-upload' }), 1000)
    })
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      // FileReader trả về chuỗi data:application/pdf;base64,... -> Cần lấy phần sau dấu phẩy
      const base64Data = reader.result.split(',')[1];
      try {
        const res = await postAPI({
          action: 'upload',
          fileName: file.name,
          mimeType: file.type,
          data: base64Data
        });
        resolve(res);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file); // Đọc file dưới dạng Base64
  });
}

export const isDemoMode = DEMO_MODE
