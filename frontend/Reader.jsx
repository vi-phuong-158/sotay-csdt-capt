const { useState: useStR, useEffect: useEffR, useRef: useRefR } = React;

const CAT_ACCENT = {
  "hinh-su": "#f87171",
  "to-tung-hinh-su": "#60a5fa",
  "nghiep-vu": "#6ee7b7",
  "tham-nhung": "#fbbf24",
};

function ReaderPage({ doc, onBack }) {
  const [activeArticle, setActiveArticle] = useStR(null);
  const [tocOpen, setTocOpen] = useStR(false);
  const [fontSize, setFontSize] = useStR(16);
  const [expanded, setExpanded] = useStR(() =>
    Object.fromEntries(doc.content.chapters.map((c) => [c.id, true])),
  );
  const articleRefs = useRefR({});
  const scrollRef = useRefR(null);
  const accent = CAT_ACCENT[doc.category] || "#FFD700";

  useEffR(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveArticle(e.target.dataset.aid);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    Object.values(articleRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [doc]);

  const scrollTo = (id) => {
    const el = articleRefs.current[id];
    const container = scrollRef.current;
    if (!el || !container) return;
    container.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
    setTocOpen(false);
  };

  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 52px)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        overflow: "hidden",
        background: "#0a2318",
      }}
    >
      {}
      <div
        style={{
          flexShrink: 0,
          background: "#113a26",
          borderBottom: "2px solid " + accent,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "7px 13px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
            minHeight: 36,
          }}
        >
          ← Lại
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            {doc.issue_number}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#FFD700",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {doc.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setFontSize((s) => Math.max(13, s - 1))}
            style={rdrBtn}
          >
            A−
          </button>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              minWidth: 18,
              textAlign: "center",
            }}
          >
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize((s) => Math.min(22, s + 1))}
            style={rdrBtn}
          >
            A+
          </button>
        </div>

        <button
          onClick={() => setTocOpen((o) => !o)}
          style={{
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid " + accent,
            background: tocOpen ? accent : "transparent",
            color: tocOpen ? "#0a2318" : accent,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            minHeight: 36,
          }}
        >
          ≡ Mục lục
        </button>
      </div>

      {}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {}
        <div
          style={{
            width: tocOpen ? 256 : 0,
            flexShrink: 0,
            overflow: "hidden",
            background: "#0d2d1e",
            borderRight: "1px solid rgba(255,215,0,0.12)",
            transition: "width 0.22s ease",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 20,
          }}
        >
          <div
            style={{
              minWidth: 256,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid rgba(255,215,0,0.12)",
                fontWeight: 700,
                fontSize: 11,
                color: "#FFD700",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              📋 Mục lục
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              {doc.content.chapters.map((ch, ci) => (
                <div key={ch.id}>
                  <button
                    onClick={() => {
                      setExpanded((p) => ({ ...p, [ch.id]: !p[ch.id] }));
                      if (ch.articles[0]) scrollTo(ch.articles[0].id);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      borderLeft: "3px solid " + accent,
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      Ch.{ROMAN[ci]} {ch.title.split(": ")[1] || ch.title}
                    </span>
                    <span style={{ fontSize: 10, opacity: 0.5 }}>
                      {expanded[ch.id] ? "▲" : "▼"}
                    </span>
                  </button>
                  {expanded[ch.id] &&
                    ch.articles.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => scrollTo(art.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 14px 6px 26px",
                          border: "none",
                          cursor: "pointer",
                          background:
                            activeArticle === art.id
                              ? "rgba(255,215,0,0.1)"
                              : "transparent",
                          color:
                            activeArticle === art.id
                              ? "#FFD700"
                              : "rgba(255,255,255,0.55)",
                          fontSize: 11,
                          fontWeight: activeArticle === art.id ? 700 : 400,
                          borderLeft:
                            activeArticle === art.id
                              ? "3px solid " + accent
                              : "3px solid transparent",
                          lineHeight: 1.5,
                          transition: "all 0.12s",
                        }}
                      >
                        {art.title.length > 48
                          ? art.title.slice(0, 48) + "…"
                          : art.title}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        {tocOpen && (
          <div
            onClick={() => setTocOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 15,
            }}
            className="toc-tap-overlay"
          />
        )}

        {}
        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              padding: "20px 14px 80px",
            }}
          >
            {}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                padding: "18px 20px",
                marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "3px solid " + accent,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {doc.issue_number}
              </div>
              <h1
                style={{
                  margin: "0 0 10px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#FFD700",
                  lineHeight: 1.35,
                }}
              >
                {doc.title}
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.75,
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {doc.summary}
              </p>
            </div>

            {}
            {doc.content.chapters.map((ch, ci) => (
              <div key={ch.id} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    background:
                      "linear-gradient(90deg," + accent + "22, transparent)",
                    borderLeft: "4px solid " + accent,
                    borderRadius: "0 8px 8px 0",
                    padding: "11px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: accent,
                    marginBottom: 1,
                    letterSpacing: 0.3,
                  }}
                >
                  {ch.title}
                </div>

                {ch.articles.map((art, ai) => (
                  <div
                    key={art.id}
                    ref={(el) => (articleRefs.current[art.id] = el)}
                    data-aid={art.id}
                    style={{
                      background:
                        activeArticle === art.id
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderTop:
                        ai > 0 ? "none" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius:
                        ai === ch.articles.length - 1 ? "0 0 10px 10px" : 0,
                      padding: "16px 18px",
                      borderLeft:
                        activeArticle === art.id
                          ? "4px solid " + accent
                          : "4px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: Math.max(14, fontSize - 1),
                        fontWeight: 700,
                        color: "#FFD700",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          background: accent + "33",
                          color: accent,
                          border: "1px solid " + accent + "55",
                          borderRadius: 5,
                          padding: "2px 7px",
                          fontSize: 10,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {ci + 1}.{ai + 1}
                      </span>
                      <span>{art.title}</span>
                    </h3>
                    <div
                      style={{
                        fontSize: fontSize,
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.9,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {art.text}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.25)",
                fontSize: 12,
                padding: "16px 0",
              }}
            >
              ─── Hết văn bản ───
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .toc-tap-overlay { display: none; }
        @media (max-width: 767px) { .toc-tap-overlay { display: block !important; } }
      `}</style>
    </div>
  );
}

const rdrBtn = {
  padding: "5px 8px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  minHeight: 30,
};

Object.assign(window, { ReaderPage });
