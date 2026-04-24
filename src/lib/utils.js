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
