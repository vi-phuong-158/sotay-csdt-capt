import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../lib/utils";
import { useBookmarks, docKey } from "../hooks/useBookmarks";
import ReaderPage from "./ReaderPage";

export default function HomePage({ setActiveNav }) {
  const { user, documents, logs, logActivity, newDocsCount, clearNewDocs } = useApp();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const [activeDoc, setActiveDoc] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showNewBanner, setShowNewBanner] = useState(newDocsCount > 0);
  const [newCountSnapshot] = useState(newDocsCount);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    clearNewDocs();
  }, [clearNewDocs]);

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategory, sortOrder]);

  const CATEGORIES = [
    { value: "all", label: "Tất cả chuyên mục" },
    { value: "hinh-su", label: "Hình sự" },
    { value: "to-tung-hinh-su", label: "Tố tụng Hình sự" },
    { value: "huong-dan-dieu-tra", label: "Hướng dẫn điều tra" },
    { value: "khac", label: "Khác" },
  ];

  const loginCount = useMemo(
    () => logs.filter((l) => l.action === "LOGIN").length,
    [logs]
  );

  const viewDocCount = useMemo(
    () => logs.filter((l) => l.action === "VIEW_DOC").length,
    [logs]
  );

  const docViewCounts = useMemo(() => {
    const counts = {};
    logs.forEach((l) => {
      if (l.action === "VIEW_DOC" && l.details) {
        counts[l.details] = (counts[l.details] || 0) + 1;
      }
    });
    return counts;
  }, [logs]);

  const stats = [
    {
      label: "TỔNG SỐ VĂN BẢN",
      value: documents.length,
      icon: "📄",
      color: "border-forest",
      bgColor: "bg-forest/5",
    },
    {
      label: "CÓ FILE ĐÍNH KÈM",
      value: documents.filter((d) => d.drive_link).length,
      icon: "📎",
      color: "border-gold",
      bgColor: "bg-gold/5",
    },
    {
      label: "LƯỢT ĐĂNG NHẬP",
      value: loginCount,
      icon: "🔐",
      color: "border-emerald-400",
      bgColor: "bg-emerald-50",
    },
    {
      label: "LƯỢT ĐỌC TÀI LIỆU",
      value: viewDocCount,
      icon: "👁️",
      color: "border-purple-400",
      bgColor: "bg-purple-50",
    },
  ];

  const filteredDocs = useMemo(() => {
    let result = documents;
    if (selectedCategory !== "all") {
      const catItem = CATEGORIES.find((c) => c.value === selectedCategory);
      result = result.filter((d) => {
        const slug = (d.category || "").trim().toLowerCase();
        const label = (d.categoryLabel || "").trim().toLowerCase();
        return (
          slug === selectedCategory ||
          label === (catItem?.label || "").toLowerCase()
        );
      });
    }
    if (sortOrder === "popular") {
      result = [...result].sort(
        (a, b) => (docViewCounts[b.id] || 0) - (docViewCounts[a.id] || 0)
      );
    } else {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.created_at || 0).getTime();
        const dateB = new Date(b.updatedAt || b.created_at || 0).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
    }
    return result;
  }, [documents, selectedCategory, sortOrder, docViewCounts]);

  const bookmarkedDocs = useMemo(
    () =>
      bookmarks
        .map((key) => documents.find((d) => docKey(d) === key))
        .filter(Boolean),
    [bookmarks, documents],
  );

  const pinnedDocs = useMemo(
    () => documents.filter((d) => d.is_pinned === true),
    [documents]
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Chào buổi sáng";
    if (hour >= 11 && hour < 14) return "Chào buổi trưa";
    if (hour >= 14 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }, []);

  const handleOpenDoc = (doc) => {
    logActivity(user.id, "VIEW_DOC", doc.id);
    setActiveDoc(doc);
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

  return (
    <div className="p-[20px_16px] max-w-[860px] mx-auto animate-fade-up">
      {}
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3 z-0" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-forest m-0 mb-3 tracking-tight">
            {greeting}, {user?.full_name || user?.username}
          </h1>
          <p className="text-slate-600 text-base m-0 mb-8 max-w-md leading-relaxed font-bold">
            Cổng thông tin tra cứu văn bản quy phạm pháp luật nội bộ.
          </p>
          <div className="flex gap-2 max-w-md bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:border-forest/50 transition-colors">
            <div className="flex-1 flex items-center gap-3 px-3">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Nhập từ khóa, số hiệu..."
                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                onFocus={() => setActiveNav("search")}
              />
            </div>
            <button
              onClick={() => setActiveNav("search")}
              className="px-6 py-2.5 rounded-lg bg-gold text-forest font-bold text-sm shadow-md shadow-gold/20 hover:bg-gold/90 transition-all active:scale-95"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {}
      {showNewBanner && (
        <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <span className="text-xl shrink-0">🆕</span>
          <p className="m-0 flex-1 text-sm font-bold text-green-800">
            Có <span className="text-green-600">{newCountSnapshot}</span> văn
            bản mới được thêm kể từ lần đăng nhập trước.
          </p>
          <button
            onClick={() => setShowNewBanner(false)}
            className="bg-transparent border-none text-green-500 cursor-pointer text-lg leading-none hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      {}
      {pinnedDocs.length > 0 && (
        <div className="mb-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📌</span>
            <h2 className="text-sm font-extrabold text-amber-800 m-0 uppercase tracking-widest">
              Văn bản được ghim
            </h2>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0">
              Hệ thống
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedDocs.map((doc) => (
              <div
                key={doc.id || `pinned-${doc.title}`}
                onClick={() => handleOpenDoc(doc)}
                className="bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/70 hover:border-amber-400 hover:shadow-md rounded-2xl p-5 cursor-pointer transition-all relative flex flex-col justify-between group overflow-hidden"
              >
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-16 h-16 bg-amber-100/40 rounded-full group-hover:scale-125 transition-transform" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-forest text-gold px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {doc.categoryLabel || "Khác"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {doc.issue_number || "Chưa có số"}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-forest transition-colors mb-2 text-justify">
                    {doc.title}
                  </h3>
                </div>
                <div className="relative z-10 flex items-center justify-between border-t border-amber-100/50 pt-2.5 mt-2.5 text-[11px] text-slate-500">
                  <span>📅 {doc.doc_date ? new Date(doc.doc_date).toLocaleDateString("vi-VN") : "---"}</span>
                  <span className="text-forest font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Đọc ngay <span>❯</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h2 className="text-lg font-bold text-slate-800 m-0">
          Tổng quan hệ thống
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl p-6 border-t-4 ${s.color} shadow-sm border-x border-b border-slate-100 flex items-center justify-between`}
          >
            <div>
              <div className="text-3xl font-black text-slate-900 mb-1">
                {s.value.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-lg ${s.bgColor} flex items-center justify-center text-2xl`}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {}
      {bookmarkedDocs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">★</span>
            <h2 className="text-sm font-bold text-slate-800 m-0 uppercase tracking-widest">
              Đã ghim
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              ({bookmarkedDocs.length})
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {bookmarkedDocs.map((doc) => (
              <div
                key={doc.id || `bookmark-${doc.title}-${doc.issue_number}`}
                onClick={() => handleOpenDoc(doc)}
                className="shrink-0 w-52 bg-white border border-gold/30 rounded-xl p-4 cursor-pointer hover:border-gold/60 hover:shadow-md transition-all relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(docKey(doc));
                  }}
                  className="absolute top-2 right-2 text-gold text-base bg-transparent border-none cursor-pointer leading-none"
                  title="Bỏ ghim"
                >
                  ★
                </button>
                <div className="text-[11px] font-bold text-forest mb-1 uppercase tracking-wide">
                  {doc.categoryLabel || "Khác"}
                </div>
                <div className="text-[13px] font-bold text-slate-800 leading-snug line-clamp-3">
                  {doc.title}
                </div>
                <div className="text-[10px] text-slate-400 font-bold mt-2">
                  {doc.issue_number || "---"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/30">
          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <span className="text-lg">📄</span> Danh sách văn bản
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold outline-none focus:border-forest/50 cursor-pointer shadow-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold outline-none focus:border-forest/50 cursor-pointer shadow-sm"
            >
              <option value="desc">Mới cập nhật</option>
              <option value="asc">Cũ nhất</option>
              <option value="popular">Xem nhiều nhất</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col bg-white">
          {filteredDocs.length > 0 ? (
            <>
              {filteredDocs.slice(0, visibleCount).map((doc, i) => (
                <div
                  key={doc.id || `doc-${doc.title}-${doc.issue_number}-${i}`}
                  onClick={() => handleOpenDoc(doc)}
                  className={`p-[14px_20px] border-none bg-transparent cursor-pointer text-left flex items-center gap-3 transition-all hover:bg-slate-50
                  ${i < Math.min(visibleCount, filteredDocs.length) - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-slate-800 mb-0.5 text-justify flex flex-wrap items-center gap-1.5">
                      {doc.is_pinned && (
                        <span className="text-amber-600 text-[10px] font-extrabold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0" title="Văn bản được ghim">
                          📌 GHIM
                        </span>
                      )}
                      <span>{doc.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-forest font-bold">
                        {doc.categoryLabel || "Khác"}
                      </span>
                      <span className="text-slate-600 font-bold">
                        {doc.issue_number}
                      </span>
                      <span className="text-slate-500 font-bold">
                        • {formatDate(doc.updatedAt || doc.created_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(docKey(doc));
                    }}
                    className={`shrink-0 text-xl bg-transparent border-none cursor-pointer transition-colors leading-none px-1
                    ${isBookmarked(docKey(doc)) ? "text-gold" : "text-slate-200 hover:text-gold/60"}`}
                    title={isBookmarked(docKey(doc)) ? "Bỏ ghim" : "Ghim văn bản"}
                  >
                    ★
                  </button>
                  <div className="text-slate-300 shrink-0">❯</div>
                </div>
              ))}
              {visibleCount < filteredDocs.length && (
                <button
                  onClick={() => setVisibleCount((c) => c + 10)}
                  className="w-full py-4 border-t border-slate-100 bg-slate-50 text-forest font-bold text-sm hover:bg-slate-100 active:bg-slate-200 transition-colors"
                >
                  Xem thêm ({filteredDocs.length - visibleCount} văn bản) ↓
                </button>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              Không có văn bản nào trong chuyên mục này.
            </div>
          )}
        </div>
      </div>

      {}
      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 items-start mt-4 mb-8">
        <span className="text-lg shrink-0">🛡️</span>
        <p className="text-[12px] text-emerald-800 m-0 leading-relaxed font-medium">
          <strong>Bảo mật thông tin:</strong> Mọi hoạt động tra cứu đều được ghi
          lại và giám sát. Nghiêm cấm chia sẻ thông tin ra ngoài phạm vi cho
          phép.
        </p>
      </div>
    </div>
  );
}
