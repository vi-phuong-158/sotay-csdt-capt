const { useState: useSt } = React;

function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useSt("");
  const [password, setPassword] = useSt("");
  const [loading, setLoading] = useSt(false);
  const [error, setError] = useSt("");
  const [showPass, setShowPass] = useSt(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const result = login(username.trim(), password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0a2318 0%, #113a26 50%, #0d2d1e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      ></div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 16px",
              position: "relative",
            }}
          >
            {}
            <svg viewBox="0 0 80 80" style={{ width: "100%", height: "100%" }}>
              <path
                d="M40 4 L72 16 L72 40 C72 58 58 72 40 78 C22 72 8 58 8 40 L8 16 Z"
                fill="#1e3a8a"
                stroke="#FFD700"
                strokeWidth="2"
              />
              <path
                d="M40 10 L66 20 L66 40 C66 55 54 67 40 73 C26 67 14 55 14 40 L14 20 Z"
                fill="#113a26"
                stroke="#FFD700"
                strokeWidth="1"
              />
              <text
                x="40"
                y="48"
                textAnchor="middle"
                fill="#FFD700"
                fontSize="22"
                fontWeight="bold"
                fontFamily="serif"
              >
                ★
              </text>
              <text
                x="40"
                y="62"
                textAnchor="middle"
                fill="#FFD700"
                fontSize="9"
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                CÔNG AN
              </text>
            </svg>
          </div>
          <h1
            style={{
              color: "#FFD700",
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Cẩm Nang Pháp Luật
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              margin: "6px 0 0",
              letterSpacing: 0.5,
            }}
          >
            Nghiệp vụ Điều tra Hình sự — Hệ thống Bảo mật
          </p>
        </div>

        {}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              margin: "0 0 24px",
              textAlign: "center",
            }}
          >
            Đăng nhập hệ thống
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Tên đăng nhập
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập username..."
                  autoComplete="username"
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,215,0,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                  }
                />
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 16,
                  }}
                >
                  👤
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 13,
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Mật khẩu
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 40px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,215,0,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                  }
                />
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 16,
                  }}
                >
                  🔑
                </span>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    padding: 0,
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(153,27,27,0.3)",
                  border: "1px solid rgba(248,113,113,0.4)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  color: "#fca5a5",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 8,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading
                  ? "rgba(30,58,138,0.5)"
                  : "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                boxShadow: loading ? "none" : "0 4px 16px rgba(30,58,138,0.5)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  ></span>{" "}
                  Đang xác thực...
                </>
              ) : (
                "🔐 Đăng nhập"
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "rgba(255,215,0,0.07)",
              borderRadius: 8,
              border: "1px solid rgba(255,215,0,0.15)",
            }}
          >
            <p
              style={{
                color: "rgba(255,215,0,0.8)",
                fontSize: 12,
                margin: 0,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Hệ thống dành riêng cho cán bộ được cấp phép.
              <br />
              Demo: <strong>admin / admin123</strong> &nbsp;|&nbsp;{" "}
              <strong>tran.huu.duc / duc123</strong>
            </p>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: 11,
            marginTop: 20,
            letterSpacing: 0.5,
          }}
        >
          © 2026 Bộ Công an — Phiên bản 2.1.0 — Bảo mật CẤP MẬT
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

Object.assign(window, { LoginPage });
