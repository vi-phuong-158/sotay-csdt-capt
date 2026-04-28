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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative">
      <div className="w-full max-w-[420px] relative">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/logo.png" alt="Logo Công an" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-forest text-xl font-bold m-0 tracking-wide uppercase">Công an tỉnh Phú Thọ</h1>
          <h2 className="text-slate-500 text-[13px] font-semibold m-0 mt-1 uppercase tracking-wide">Văn phòng Cảnh sát điều tra</h2>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          <h2 className="text-slate-800 text-lg font-bold m-0 mb-6 text-center">Đăng nhập hệ thống</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-slate-500 text-[12px] mb-1.5 font-bold uppercase tracking-wider">Tên đăng nhập</label>
              <div className="relative">
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Nhập username..."
                  autoComplete="username"
                  className="w-full p-[12px_16px_12px_40px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[15px] outline-none transition-all focus:border-forest/50 focus:bg-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-slate-500 text-[12px] mb-1.5 font-bold uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  autoComplete="current-password"
                  className="w-full p-[12px_44px_12px_40px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-[15px] outline-none transition-all focus:border-forest/50 focus:bg-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔑</span>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-0">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-red-600 text-[13px] flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className={`w-full p-4 rounded-xl border-none cursor-pointer text-forest text-[15px] font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2
                ${loading ? 'bg-slate-100 text-slate-400' : 'bg-gold shadow-lg shadow-gold/20 hover:bg-gold/90 hover:-translate-y-0.5'}`}>
              {loading ? 'Đang xác thực...' : '🔐 Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-500 text-[11px] m-0 text-center leading-relaxed">
              Hệ thống dành riêng cho cán bộ được cấp phép.<br/>
              Demo: <strong>admin / admin123</strong>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[11px] mt-6 tracking-wide">
          Mô hình của Đoàn thanh niên Văn phòng CSĐT
        </p>
      </div>
    </div>
  );
}
