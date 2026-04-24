// ============================================================
// utils.js — Tiện ích xử lý tiếng Việt & helper functions
// ============================================================

/**
 * Loại bỏ dấu tiếng Việt
 * @param {string} str
 * @returns {string}
 */
export function removeVietnameseDiacritics(str) {
  if (!str) return ''
  str = str.toLowerCase()
  const patterns = [
    [/[àáảãạăắặằẳẵâấầẩẫậ]/g, 'a'],
    [/[èéẻẽẹêếềểễệ]/g, 'e'],
    [/[ìíỉĩị]/g, 'i'],
    [/[òóỏõọôốồổỗộơớờởỡợ]/g, 'o'],
    [/[ùúủũụưứừửữự]/g, 'u'],
    [/[ỳýỷỹỵ]/g, 'y'],
    [/[đ]/g, 'd'],
  ]
  patterns.forEach(([re, c]) => { str = str.replace(re, c) })
  return str
}

/**
 * Tìm kiếm mờ (fuzzy match) hỗ trợ tiếng Việt không dấu
 * @param {string} text
 * @param {string} query
 * @returns {boolean}
 */
export function fuzzyMatch(text, query) {
  if (!query || !query.trim()) return true
  if (!text) return false
  const normalText = removeVietnameseDiacritics(text)
  const normalQuery = removeVietnameseDiacritics(query.trim())
  return normalText.includes(normalQuery) || text.toLowerCase().includes(query.toLowerCase())
}

/**
 * Format ngày giờ theo định dạng Việt Nam
 * @param {string} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

/**
 * Format ngày (không có giờ)
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

/**
 * Lấy URL hiển thị ảnh trực tiếp từ Google Drive (Google Proxy lh3)
 * Theo chuẩn google-apps-script-cms
 */
export const getDirectImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const driveIdMatch = url.match(/[-\w]{25,}/);
  if (url.includes('drive.google.com') && driveIdMatch) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[0]}`;
  }
  return url;
};

/**
 * Kiểm tra file qua Magic Bytes để đảm bảo an toàn bảo mật (Chỉ cho phép JPG, PNG, PDF)
 * Tránh trường hợp đổi đuôi file .exe thành .jpg
 */
export const validateFileHeader = (file) => {
  return new Promise((resolve) => {
    // Kiểm tra dung lượng: tối đa 5MB
    if (file.size > 5 * 1024 * 1024) {
      resolve({ isValid: false, error: 'Kích thước file vượt quá 5MB.' });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0');
      }
      
      // 89504e47 = PNG, ffd8 = JPG, 25504446 = PDF (%PDF)
      if (header.startsWith('89504e47') || header.startsWith('ffd8')) {
        resolve({ isValid: true, type: 'image' });
      } else if (header.startsWith('25504446')) {
        resolve({ isValid: true, type: 'pdf' });
      } else {
        resolve({ isValid: false, error: 'File không hợp lệ. Chỉ cho phép Ảnh (JPG, PNG) hoặc PDF.' });
      }
    };
    reader.onerror = () => resolve({ isValid: false, error: 'Lỗi đọc file.' });
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};
