import { useState, useCallback } from "react";

const STORAGE_KEY = "plnd_bookmarks";

export function docKey(doc) {
  if (!doc) return null;
  const id = String(doc.id ?? "").trim();
  if (id) return id;

  const fallback = [doc.issue_number, (doc.title || "").slice(0, 20)]
    .filter(Boolean)
    .join("|");
  return fallback || null;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const toggleBookmark = useCallback((key) => {
    if (!key) return;
    setBookmarks((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (key) => {
      if (!key) return false;
      return bookmarks.includes(key);
    },
    [bookmarks],
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
