import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate delay
    await new Promise(r => setTimeout(r, 600));
    
    const result = login(username.trim(), password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-dark via-forest to-forest-deeper flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }}></div>

      <div className="w-full max-w-[420px] relative">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            {/* Shield SVG */}
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <path d="M40 4 L72 16 L72 40 C72 58 58 72 40 78 C22 72 8 58 8 40 L8 16 Z" fill="#1e3a8a" stroke="#FFD700" strokeWidth="2"/>
              <path d="M40 10 L66 20 L66 40 C66 55 54 67 40 73 C26 67 14 55 14 40 L14 20 Z" fill="#113a26" stroke="#FFD700" strokeWidth="1"/>
              <text x="40" y="48" textAnchor="middle" fill="#FFD700" fontSize="22" fontWeight="bold" fontFamily="serif">★</text>
              <text x="40" y="62" textAnchor="middle" fill="#FFD700" fontSize="9" fontFamily="sans-serif" letterSpacing="1">CÔNG AN</text>
            </svg>
          </div>
          <h1 className="text-gold text-xl font-bold m-0 tracking-wide uppercase">Cẩm Nang Pháp Luật</h1>
          <p className="text-white/60 text-[13px] mt-1.5 mb-0 tracking-wide">Nghiệp vụ Điều tra Hình sự — Hệ thống Bảo mật</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-gold/20 rounded-2xl p-[32px_28px] shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
          <h2 className="text-white text-lg font-semibold m-0 mb-6 text-center">Đăng nhập hệ thống</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white/70 text-[13px] mb-1.5 font-medium">Tên đăng nhập</label>
              <div className="relative group">
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Nhập username..."
                  autoComplete="username"
                  className="w-full p-[12px_16px_12px_40px] rounded-lg border border-white/15 bg-white/5 text-white text-[15px] outline-none transition-colors focus:border-gold/50"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base">👤</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-white/70 text-[13px] mb-1.5 font-medium">Mật khẩu</label>
              <div className="relative group">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  autoComplete="current-password"
                  className="w-full p-[12px_44px_12px_40px] rounded-lg border border-white/15 bg-white/5 text-white text-[15px] outline-none transition-colors focus:border-gold/50"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base">🔑</span>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-white/50 text-sm p-0">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-crimson/30 border border-red-400/40 rounded-lg p-[10px_14px] mb-4 text-red-300 text-[13px] flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className={`w-full p-[14px] rounded-lg border-none cursor-pointer text-white text-[15px] font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2
                ${loading ? 'bg-navy/50' : 'bg-gradient-to-br from-navy to-navy-light shadow-[0_4px_16px_rgba(30,58,138,0.5)]'}`}>
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-fast"></span> Đang xác thực...</>
              ) : '🔐 Đăng nhập'}
            </button>
          </form>

          <div className="mt-5 p-[12px_16px] bg-gold/5 rounded-lg border border-gold/15">
            <p className="text-gold/80 text-xs m-0 text-center leading-relaxed">
              Hệ thống dành riêng cho cán bộ được cấp phép.<br/>
              Demo: <strong>admin / admin123</strong> &nbsp;|&nbsp; <strong>tran.huu.duc / duc123</strong>
            </p>
          </div>
        </div>

        <p className="text-center text-white/25 text-[11px] mt-5 tracking-wide">
          © 2026 Bộ Công an — Phiên bản 2.1.0 — Bảo mật CẤP MẬT
        </p>
      </div>
    </div>
  );
}
