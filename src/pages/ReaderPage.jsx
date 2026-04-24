import React, { useState, useEffect, useRef } from 'react';
import { removeVietnameseDiacritics, getDirectImageUrl } from '../lib/utils';

export default function ReaderPage({ doc, searchTerm, onBack }) {
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
        result.push(<mark key={idx} className="bg-gold/40 text-white font-bold">{word}</mark>, ' ');
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
    headings.forEach(h => observer.observe(h));

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
    <div className="min-h-full bg-[#e2f0e8] text-[#113a26] relative pb-20 animate-fade-up">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#113a26] text-white p-[12px_16px] flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="bg-transparent border-none text-gold text-lg cursor-pointer p-1">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="m-0 text-sm font-bold truncate">{doc.title}</h2>
          <div className="text-[10px] text-white/60 truncate">{doc.issue_number}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="bg-white/10 border-none rounded w-8 h-8 flex items-center justify-center text-white cursor-pointer font-bold">A-</button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 1))} className="bg-white/10 border-none rounded w-8 h-8 flex items-center justify-center text-white cursor-pointer font-bold text-lg">A+</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1000px] mx-auto flex">
        {/* Table of Contents (Desktop) / Drawer (Mobile) */}
        {showToc && <div className="toc-tap-overlay hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowToc(false)} />}
        <aside className={`fixed md:sticky top-[60px] left-0 h-[calc(100vh-60px)] w-[260px] bg-white border-r border-[#113a26]/10 overflow-y-auto p-4 z-40 transition-transform ${showToc ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <h3 className="text-sm font-bold text-[#113a26] border-b border-[#113a26]/10 pb-2 mb-3">Mục lục</h3>
          <div className="flex flex-col gap-1">
            {doc.content.chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => scrollTo(ch.id)}
                className={`text-left p-2 rounded text-[13px] border-none cursor-pointer transition-colors
                  ${activeId === ch.id ? 'bg-[#113a26] text-white font-bold' : 'bg-transparent text-[#113a26]/80 hover:bg-[#113a26]/5'}`}
              >
                {ch.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div ref={contentRef} className="flex-1 p-[20px_16px] md:p-8" style={{ fontSize: `${fontSize}px` }}>
          <div className="mb-8 pb-6 border-b-2 border-gold text-center">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#113a26] mb-2">{doc.title}</h1>
            <div className="text-sm font-bold text-[#113a26]/70">{doc.issue_number}</div>
            
            {/* Nút Xem PDF hoặc hiển thị Ảnh */}
            {doc.drive_link && doc.drive_link_type === 'image' ? (
              <div className="mt-6 flex justify-center">
                <img 
                  src={getDirectImageUrl(doc.drive_link)} 
                  alt="Ảnh đính kèm" 
                  className="max-w-full md:max-w-2xl h-auto rounded-lg shadow-md border border-[#113a26]/10" 
                  loading="lazy" 
                />
              </div>
            ) : doc.drive_link ? (
              <div className="mt-4">
                <a href={doc.drive_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#113a26] text-white px-4 py-2 rounded-lg text-sm font-bold no-underline transition-colors hover:bg-navy">
                  📄 Xem bản gốc (PDF)
                </a>
              </div>
            ) : null}
          </div>

          <div className="leading-relaxed">
            {doc.content.chapters.map(ch => (
              <div key={ch.id} id={ch.id} className="chapter-heading mb-8 scroll-mt-20">
                <h2 className="text-lg md:text-xl font-bold text-navy mb-4 border-l-4 border-gold pl-3">{ch.title}</h2>
                <div className="flex flex-col gap-5">
                  {ch.articles.map(art => (
                    <div key={art.id} id={art.id} className="scroll-mt-20">
                      <h3 className="text-base font-bold text-[#113a26] mb-1.5">{highlightText(art.title)}</h3>
                      <p className="m-0 text-justify whitespace-pre-wrap text-[#113a26]/90">
                        {highlightText(art.text)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating ToC Button (Mobile only) */}
      <button
        onClick={() => setShowToc(!showToc)}
        className="md:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gold text-[#113a26] border-none shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-xl flex items-center justify-center cursor-pointer z-50"
      >
        📑
      </button>
    </div>
  );
}
