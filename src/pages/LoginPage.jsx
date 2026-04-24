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
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/background.svg)' }}>
      {/* Background dark overlay for readability */}
      <div className="fixed inset-0 bg-[#0a2318]/85 pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative">
        {/* Header Logo */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/logo.png" alt="Logo Công an" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
          </div>
          <h1 className="text-gold text-xl font-bold m-0 tracking-wide uppercase">Công an tỉnh Phú Thọ</h1>
          <h2 className="text-white text-[15px] font-semibold m-0 mt-1.5 uppercase tracking-wide">Văn phòng Cảnh sát điều tra</h2>
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
