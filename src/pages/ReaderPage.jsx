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
          <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="bg-white/10 border-none rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white cursor-pointer font-bold hover:bg-white/20 transition-all">A-</button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 1))} className="bg-white/10 border-none rounded-lg w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white cursor-pointer font-bold text-lg hover:bg-white/20 transition-all">A+</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1000px] mx-auto flex">
        {/* Table of Contents (Only for structured docs) */}
        {doc.content.chapters && (
          <>
            {showToc && <div className="toc-tap-overlay hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowToc(false)} />}
            <aside className={`fixed md:sticky top-[68px] left-0 h-[calc(100vh-68px)] w-[260px] bg-white border-r border-slate-200 overflow-y-auto p-4 z-40 transition-transform ${showToc ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shadow-xl md:shadow-none`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Mục lục văn bản</h3>
              <div className="flex flex-col gap-1">
                {doc.content.chapters.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => scrollTo(ch.id)}
                    className={`text-left p-3 rounded-xl text-[13px] border-none cursor-pointer transition-all
                      ${activeId === ch.id ? 'bg-forest text-white font-black' : 'bg-transparent text-slate-900 hover:bg-slate-100 font-bold'}`}
                  >
                    {ch.title}
                  </button>
                ))}
              </div>
            </aside>
          </>
        )}

        {/* Content */}
        <div ref={contentRef} className="flex-1 p-[24px_16px] md:p-12 bg-white min-h-screen shadow-sm" style={{ fontSize: `${fontSize}px` }}>
          <div className="mb-10 pb-8 border-b-4 border-gold/30 text-center max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">{doc.title}</h1>
            <div className="inline-block bg-forest/5 text-forest px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{doc.issue_number}</div>
            
            {/* Image display */}
            {doc.drive_link && doc.drive_link_type === 'image' ? (
              <div className="mt-10">
                <img 
                  src={getDirectImageUrl(doc.drive_link)} 
                  alt="Ảnh đính kèm" 
                  className="max-w-full h-auto rounded-2xl shadow-2xl border border-slate-100" 
                  loading="lazy" 
                />
              </div>
            ) : doc.drive_link ? (
              <div className="mt-8">
                <a href={doc.drive_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-forest text-gold px-6 py-3 rounded-xl text-sm font-bold no-underline transition-all hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/20 active:scale-95">
                  📄 Xem bản gốc (PDF)
                </a>
              </div>
            ) : null}
          </div>

          <div className="leading-relaxed max-w-3xl mx-auto">
            {/* Render legacy chapters if they exist */}
            {doc.content.chapters && doc.content.chapters.map(ch => (
              <div key={ch.id} id={ch.id} className="chapter-heading mb-12 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-black text-forest mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gold rounded-full" />
                  {ch.title}
                </h2>
                <div className="flex flex-col gap-8">
                  {ch.articles.map(art => (
                    <div key={art.id} id={art.id} className="scroll-mt-24">
                      <h3 className="text-base md:text-lg font-bold text-slate-800 mb-3 flex items-start gap-2">
                        {highlightText(art.title)}
                      </h3>
                      <p className="m-0 text-justify whitespace-pre-wrap text-slate-800 leading-relaxed font-bold">
                        {highlightText(art.text)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Render unstructured text if it exists */}
            {doc.content.fullText && (
              <div className="text-slate-800 whitespace-pre-wrap leading-relaxed font-bold text-justify">
                {highlightText(doc.content.fullText)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating ToC Button (Only if chapters exist) */}
      {doc.content.chapters && (
        <button
          onClick={() => setShowToc(!showToc)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-forest text-gold border-none shadow-xl shadow-forest/20 text-2xl flex items-center justify-center cursor-pointer z-50 hover:scale-105 active:scale-95 transition-all"
        >
          📑
        </button>
      )}
    </div>
  );
}
