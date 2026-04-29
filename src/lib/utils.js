export function removeVietnameseDiacritics(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export function fuzzyMatch(text, normalQuery, lowerQuery) {
  if (!normalQuery) return true;
  if (!text) return false;
  const lowerText = text.toLowerCase();
  if (lowerText.includes(lowerQuery)) return true;
  const normalText = removeVietnameseDiacritics(lowerText);
  return normalText.includes(normalQuery);
}

export function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const getGoogleDriveEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const idMatch = url.match(/[-\w]{25,}/);
  if (url.includes("drive.google.com") && idMatch) {
    return `https://drive.google.com/file/d/${idMatch[0]}/preview`;
  }
  return url;
};

export const getDirectImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const driveIdMatch = url.match(/[-\w]{25,}/);
  if (url.includes("drive.google.com") && driveIdMatch) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[0]}`;
  }
  return url;
};

export const validateFileHeader = (file) => {
  return new Promise((resolve) => {
    if (file.size > 5 * 1024 * 1024) {
      resolve({ isValid: false, error: "Kích thước file vượt quá 5MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 4);
      let header = "";
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, "0");
      }

      if (header.startsWith("89504e47") || header.startsWith("ffd8")) {
        resolve({ isValid: true, type: "image" });
      } else if (header.startsWith("25504446")) {
        resolve({ isValid: true, type: "pdf" });
      } else {
        resolve({
          isValid: false,
          error: "File không hợp lệ. Chỉ cho phép Ảnh (JPG, PNG) hoặc PDF.",
        });
      }
    };
    reader.onerror = () => resolve({ isValid: false, error: "Lỗi đọc file." });
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};
