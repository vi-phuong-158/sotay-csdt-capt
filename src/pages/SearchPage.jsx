import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { fuzzyMatch, removeVietnameseDiacritics } from "../lib/utils";
import { useBookmarks, docKey } from "../hooks/useBookmarks";
import ReaderPage from "./ReaderPage";

const CATEGORIES = [
  { value: "all", label: "Tất cả chuyên mục" },
  { value: "hinh-su", label: "Hình sự" },
  { value: "to-tung-hinh-su", label: "Tố tụng Hình sự" },
  { value: "huong-dan-dieu-tra", label: "Hướng dẫn điều tra" },
  { value: "khac", label: "Khác" },
];

export default function SearchPage() {
  const { user, documents, logActivity } = useApp();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAuthority, setFilterAuthority] = useState("all");
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const authorities = useMemo(() => {
    const list = [
      ...new Set(
        documents
          .map((d) => (d.issuing_authority || "").trim())
          .filter(Boolean),
      ),
    ].sort();
    return list;
  }, [documents]);

  const hasFilters = filterCategory !== "all" || filterAuthority !== "all";
  const hasQuery = query.trim().length > 0;

  const results = useMemo(() => {
    if (!hasQuery && !hasFilters) return [];

    let docs = documents;

    if (filterCategory !== "all") {
      const catItem = CATEGORIES.find((c) => c.value === filterCategory);
      docs = docs.filter((d) => {
        const slug = (d.category || "").trim().toLowerCase();
        const label = (d.categoryLabel || "").trim().toLowerCase();
        return (
          slug === filterCategory ||
          label === (catItem?.label || "").toLowerCase()
        );
      });
    }

    if (filterAuthority !== "all") {
      docs = docs.filter(
        (d) => (d.issuing_authority || "").trim() === filterAuthority,
      );
    }

    if (hasQuery) {
      const lowerQ = query.trim().toLowerCase();
      const normalQ = removeVietnameseDiacritics(lowerQ);

      docs = docs
        .map((doc) => {
          let score = 0;
          if (fuzzyMatch(doc.title, normalQ, lowerQ)) score += 10;
          if (fuzzyMatch(doc.issue_number, normalQ, lowerQ)) score += 8;
          if (fuzzyMatch(doc.issuing_authority, normalQ, lowerQ)) score += 5;
          if (fuzzyMatch(doc.summary, normalQ, lowerQ)) score += 2;
          return { ...doc, score };
        })
        .filter((d) => d.score > 0)
        .sort((a, b) => b.score - a.score);
    } else {
      docs = [...docs].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
      );
    }

    return docs;
  }, [query, filterCategory, filterAuthority, documents, hasQuery, hasFilters]);

  useEffect(() => {
    if (hasQuery && query.trim().length >= 3) {
      const timer = setTimeout(() => {
        logActivity(user?.id, "SEARCH", query.trim());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [query, user, logActivity, hasQuery]);

  const handleOpenDoc = (doc) => {
    logActivity(user?.id, "VIEW_DOC", doc.id);
    setActiveSearchTerm(query.trim());
    setActiveDoc(doc);
  };

  if (activeDoc) {
    return (
      <ReaderPage
        doc={activeDoc}
        searchTerm={activeSearchTerm}
        onBack={() => setActiveDoc(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-up">
      {}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-[800px] p-4">
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khóa, số hiệu văn bản..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-[14px_45px] text-[15px] text-slate-800 shadow-sm outline-none transition-all focus:border-forest/50 focus:bg-white"
              autoFocus
            />
            <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              🔍
            </span>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-[18px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-none bg-slate-200/50 text-[10px] text-slate-600 cursor-pointer transition-all hover:bg-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`cursor-pointer rounded-lg border p-2 text-xs font-bold outline-none transition-all
                ${filterCategory !== "all" ? "border-forest bg-forest text-white" : "border-slate-200 bg-white text-slate-600"}`}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={filterAuthority}
              onChange={(e) => setFilterAuthority(e.target.value)}
              className={`min-w-0 flex-1 cursor-pointer rounded-lg border p-2 text-xs font-bold outline-none transition-all
                ${filterAuthority !== "all" ? "border-forest bg-forest text-white" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <option value="all">Tất cả cơ quan</option>
              {authorities.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setFilterAuthority("all");
                }}
                className="shrink-0 cursor-pointer rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-100"
              >
                Xoá lọc ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-[20px_16px]">
        <div className="mx-auto max-w-[800px]">
          {!hasQuery && !hasFilters && (
            <div className="p-12 text-center">
              <div className="mb-4 text-5xl opacity-10">📚</div>
              <h3 className="m-0 font-bold tracking-wide text-slate-400">
                Tra cứu nhanh chóng, chính xác
              </h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-slate-400 opacity-60">
                Nhập từ khóa hoặc chọn bộ lọc bên trên
              </p>
            </div>
          )}

          {(hasQuery || hasFilters) && results.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-400 shadow-sm">
              <div className="mb-3 text-4xl">📄</div>
              Không tìm thấy kết quả phù hợp
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              Tìm thấy {results.length} văn bản phù hợp
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDoc(doc)}
                className="relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-forest/40 hover:shadow-lg hover:shadow-slate-200/50"
              >
                {}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(docKey(doc));
                  }}
                  className={`absolute right-4 top-4 bg-transparent border-none cursor-pointer text-xl leading-none transition-colors
                    ${isBookmarked(docKey(doc)) ? "text-gold" : "text-slate-200 hover:text-gold/60"}`}
                  title={isBookmarked(docKey(doc)) ? "Bỏ ghim" : "Ghim văn bản"}
                >
                  ★
                </button>

                <div className="pr-8">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest">
                      {doc.categoryLabel}
                    </span>
                    {doc.drive_link && (
                      <span className="rounded bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        📎 File
                      </span>
                    )}
                  </div>
                  <h3 className="m-0 mb-2 text-base font-bold leading-snug text-forest-dark">
                    {doc.title}
                  </h3>
                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="text-[12px] font-bold text-slate-700">
                      {doc.issue_number || "Chưa có số"}
                    </div>
                    {doc.issuing_authority && (
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {doc.issuing_authority}
                      </div>
                    )}
                    {doc.doc_date && (
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {new Date(doc.doc_date).toLocaleDateString("vi-VN")}
                      </div>
                    )}
                  </div>
                  {doc.summary && (
                    <p className="m-0 line-clamp-2 text-[13px] font-medium leading-relaxed text-slate-600">
                      {doc.summary}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
