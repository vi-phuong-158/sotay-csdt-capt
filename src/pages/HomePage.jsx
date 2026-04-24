import React from 'react';
import { useApp } from '../context/AppContext';

export default function HomePage({ setActiveNav }) {
  const { user, documents } = useApp();
  
  const stats = [
    { label: 'Văn bản', value: documents.length, icon: '📚', color: 'text-gold' },
    { label: 'Điều khoản', value: documents.reduce((s, d) => s + d.content.chapters.reduce((cs, c) => cs + c.articles.length, 0), 0), icon: '📄', color: 'text-accent-green' },
    { label: 'Danh mục', value: 4, icon: '🗂', color: 'text-accent-blue' },
    { label: 'Cập nhật', value: '2026', icon: '🕐', color: 'text-accent-amber' },
  ];
  
  const quickLinks = [
    { id: 'doc-001', icon: '⚖️', title: 'BLTTHS 2015', cat: 'Tố tụng Hình sự' },
    { id: 'doc-002', icon: '📋', title: 'BLHS 2015', cat: 'Hình sự' },
    { id: 'doc-003', icon: '🔬', title: 'Quy trình Vật chứng', cat: 'Nghiệp vụ' },
    { id: 'doc-005', icon: '💬', title: 'Kỹ thuật Hỏi cung', cat: 'Nghiệp vụ' },
  ];

  return (
    <div className="p-[20px_16px] max-w-[860px] mx-auto animate-fade-up">
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest to-navy rounded-[14px] p-[24px_20px] mb-5 text-white relative overflow-hidden">
        <div className="absolute -right-[30px] -top-[30px] w-[150px] h-[150px] rounded-full bg-gold/5 pointer-events-none"></div>
        <div className="text-[11px] text-gold/80 tracking-wide uppercase mb-1.5 font-semibold">Hệ thống Tra cứu Nội bộ</div>
        <h1 className="text-xl font-extrabold m-0 mb-1.5 leading-snug">
          Chào, {user?.full_name?.split(' ').slice(-2).join(' ')}
        </h1>
        <p className="text-white/65 text-[13px] m-0 mb-[18px] leading-relaxed">
          {user?.unit}
        </p>
        <button onClick={() => setActiveNav('search')}
          className="p-[10px_20px] rounded-lg bg-gold text-forest-dark border-none font-extrabold text-sm cursor-pointer">
          🔍 Bắt đầu tra cứu
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 rounded-lg p-[14px_10px] border border-white/10 text-center">
            <div className="text-[22px] mb-0.5">{s.icon}</div>
            <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-white/45 mt-px font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="bg-white/5 rounded-xl border border-gold/10 overflow-hidden mb-4">
        <div className="p-[12px_16px] border-b border-white/5 font-bold text-sm text-gold">
          ⚡ Truy cập nhanh
        </div>
        <div className="grid grid-cols-2">
          {quickLinks.map((l, i) => (
            <button key={l.id} onClick={() => setActiveNav('search')}
              className={`p-[14px_16px] border-none bg-transparent cursor-pointer text-left flex items-center gap-2.5 transition-colors min-h-[60px] hover:bg-gold/5
                ${i % 2 === 0 ? 'border-r border-white/5' : ''}
                ${i < 2 ? 'border-b border-white/5' : ''}`}>
              <span className="text-[22px]">{l.icon}</span>
              <div>
                <div className="text-[13px] font-semibold text-white">{l.title}</div>
                <div className="text-[11px] text-white/40">{l.cat}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security notice */}
      <div className="p-[12px_14px] bg-gold/5 border border-gold/20 rounded-lg flex gap-2.5 items-start">
        <span className="text-base shrink-0">🔒</span>
        <p className="text-xs text-gold/80 m-0 leading-relaxed">
          <strong>Bảo mật thông tin:</strong> Mọi hoạt động tra cứu đều được ghi lại và giám sát. Nghiêm cấm chia sẻ thông tin ra ngoài phạm vi cho phép.
        </p>
      </div>
    </div>
  );
}
