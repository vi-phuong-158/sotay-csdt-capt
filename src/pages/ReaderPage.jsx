import React, { useState, useEffect, useRef } from 'react';
import { removeVietnameseDiacritics, getDirectImageUrl, getGoogleDriveEmbedUrl } from '../lib/utils';
import { useBookmarks, docKey } from '../hooks/useBookmarks';

export default function ReaderPage({ doc, searchTerm, onBack }) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [activeId, setActiveId] = useState('');
  const [fontSize, setFontSize] = useState(15);
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef(null);

  // Highlight logic
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    const term = removeVietnameseDiacritics(searchTerm.toLowerCase());
    if (!term) return text;

    const words = text.split(' ');
    const result = [];
    
    words.forEach((word, idx) => {
      const cleanWord = removeVietnameseDiacritics(word.toLowerCase());
      if (cleanWord.includes(term) || term.includes(cleanWord)) {
        result.push(<mark key={idx} className="bg-gold/60 text-forest-dark font-bold px-0.5 rounded">{word}</mark>, ' ');
      } else {
        result.push(word + ' ');
      }
    });
    return result;
  };

  // Intersection Observer for ToC
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let active = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          active = entry.target.id;
        }
      });
      if (active) setActiveId(active);
    }, { rootMargin: '-20% 0px -70% 0px' });

    const headings = document.querySelectorAll('.chapter-heading');
    if (headings.length > 0) {
      headings.forEach(h => observer.observe(h));
    }

    return () => observer.disconnect();
  }, [doc]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of fixed header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setShowToc(false);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 relative pb-20 animate-fade-up">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-forest-light text-white p-3 md:p-4 flex items-center gap-3 shadow-lg">
        <button onClick={onBack} className="bg-white/10 border-none text-gold w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center hover:bg-white/20 transition-all">
          ←
        </button>
        <div className="flex-1 min-w-0 px-2">
          <h2 className="m-0 text-sm md:text-base font-bold truncate leading-tight">{doc.title}</h2>
          <div className="text-[10px] md:text-[11px] text-white/70 truncate">{doc.issue_number}</div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => toggleBookmark(docKey(doc))}
            className={`bg-white/10 border-none rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center cursor-pointer text-lg hover:bg-white/20 transition-all
              ${isBookmarked(docKey(doc)) ? 'text-gold' : 'text-white/50'}`}
            title={isBookmarked(docKey(doc)) ? 'Bỏ ghim' : 'Ghim văn bản'}
          >★</button>
          <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="bg-white/10 border-none rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white cursor-pointer font-bold hover:bg-white/20 transition-all">A-</button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 1))} className="bg-white/10 border-none rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white cursor-pointer font-bold text-lg hover:bg-white/20 transition-all">A+</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1000px] mx-auto">
        {/* Content */}
        <div ref={contentRef} className="p-[24px_16px] md:p-12 bg-white min-h-screen shadow-sm">
          <div className="mb-10 pb-8 border-b-4 border-gold/30 max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight text-center">{doc.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số hiệu</span>
                <span className="text-sm font-bold text-forest">{doc.issue_number || '---'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày ban hành</span>
                <span className="text-sm font-bold text-forest">{doc.doc_date ? new Date(doc.doc_date).toLocaleDateString('vi-VN') : '---'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cơ quan phát hành</span>
                <span className="text-sm font-bold text-forest">{doc.issuing_authority || '---'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chuyên mục</span>
                <span className="text-sm font-bold text-forest">{doc.categoryLabel || '---'}</span>
              </div>
              {doc.summary && (
                <div className="flex flex-col gap-1 md:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tóm tắt văn bản</span>
                  <p className="m-0 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">{doc.summary}</p>
                </div>
              )}
            </div>
            
            {/* File đính kèm */}
            {doc.drive_link && doc.drive_link_type === 'image' ? (
              <div className="mt-6">
                <img
                  src={getDirectImageUrl(doc.drive_link)}
                  alt="Ảnh đính kèm"
                  className="max-w-full h-auto rounded-2xl shadow-2xl border border-slate-100"
                  loading="lazy"
                />
              </div>
            ) : doc.drive_link ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toàn văn</span>
                  <a href={doc.drive_link} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-bold text-forest hover:underline">
                    Mở tab mới ↗
                  </a>
                </div>
                <iframe
                  src={getGoogleDriveEmbedUrl(doc.drive_link)}
                  className="w-full rounded-2xl border border-slate-200 shadow-sm"
                  style={{ height: '80vh', minHeight: '500px' }}
                  allow="autoplay"
                  title="Toàn văn văn bản"
                />
              </div>
            ) : (
              <div className="mt-10 text-center p-8 text-slate-400 italic text-sm">
                Không có file đính kèm cho văn bản này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
