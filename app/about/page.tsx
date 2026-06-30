"use client";

const NAV_LINKS = [
  { href: "/", label: "← Home" },
  { href: "/history", label: "📋 History" },
  { href: "/compare", label: "⚔️ Compare" },
];

const PIPELINE = [
  {
    step: "01", icon: "🏢", name: "Company Research", color: "#ff6b35",
    desc: "The first agent builds a full company profile — CEO, founding year, HQ, market cap, products, business model, and recent developments using LLM knowledge.",
    outputs: ["Company name & ticker", "Industry & sector", "Business model", "Recent developments"],
  },
  {
    step: "02", icon: "📊", name: "Financial Analysis", color: "#00d1b2",
    desc: "Analyses the last 4 years of revenue, EPS, P/E ratio, operating margin, cash flow, debt-to-equity, and ROE. Produces time-series charts.",
    outputs: ["Revenue history (4yr)", "EPS & P/E ratio", "Operating margins", "Financial rating"],
  },
  {
    step: "03", icon: "📰", name: "News Collection", color: "#ffd166",
    desc: "Generates 6 realistic recent headlines across earnings, products, legal, partnerships, and market events — categorised by sentiment.",
    outputs: ["6 recent headlines", "Sentiment labels", "Category tags", "Source attribution"],
  },
  {
    step: "04", icon: "🧠", name: "Sentiment Analysis", color: "#06d6a0",
    desc: "Synthesises a 0–100 bullish/bearish score from the news and financial context, counting positive, neutral, and negative signals.",
    outputs: ["0–100 sentiment score", "Bullish/Neutral/Bearish label", "Key themes (tags)", "Sentiment summary"],
  },
  {
    step: "05", icon: "⚔️", name: "Competitor Analysis", color: "#ef476f",
    desc: "Identifies the top 3 direct competitors with market cap, revenue growth, P/E ratio, and their primary competitive advantage.",
    outputs: ["Top 3 competitors", "Revenue growth comparison", "Competitive advantage", "Market positioning"],
  },
  {
    step: "06", icon: "⚠️", name: "Risk Analysis", color: "#a78bfa",
    desc: "Scores six risk axes — market, regulatory, execution, competition, financial, and macro — and surfaces 4–5 specific risk factors with severity ratings.",
    outputs: ["6-axis risk radar", "Risk factor list", "Severity ratings", "Overall risk level"],
  },
  {
    step: "07", icon: "✅", name: "Investment Decision", color: "#ff6b35",
    desc: "The final agent synthesises all prior data into a decisive INVEST or PASS verdict with confidence score, target price, time horizon, and balanced bull/bear reasoning.",
    outputs: ["INVEST or PASS", "Confidence score", "Bull & bear case", "Target price & horizon"],
  },
];

const TECH = [
  { icon: "🦜", name: "LangGraph", desc: "Multi-agent state machine orchestration" },
  { icon: "🤖", name: "GPT-4o-mini", desc: "Reasoning and structured JSON output" },
  { icon: "⚡", name: "Next.js 16", desc: "App Router with SSE streaming" },
  { icon: "🗄️", name: "Supabase", desc: "PostgreSQL persistence for reports" },
  { icon: "🎨", name: "Three.js + GSAP", desc: "3D hero scene and scroll animations" },
  { icon: "📊", name: "Recharts", desc: "Revenue, profit and risk visualisations" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f9fafb" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 28px",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#ff6b35,#ffd166)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            boxShadow: "0 0 12px rgba(255,107,53,0.3)",
          }}>📈</div>
          <span style={{ fontSize: 18, fontWeight: 900, color: "white" }}>Investra</span>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#ff6b35", color: "white", borderRadius: 5, padding: "2px 7px" }}>AI</span>
        </a>
        <div style={{ display: "flex", gap: 20 }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f9fafb")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >{l.label}</a>
          ))}
        </div>
        <a href="/" style={{
          padding: "8px 20px", background: "linear-gradient(135deg,#ff6b35,#ffd166)",
          color: "#0a0a0f", borderRadius: 10, fontWeight: 700, fontSize: 13,
          textDecoration: "none",
        }}>Try it now →</a>
      </nav>

      {/* Hero */}
      <div style={{
        padding: "80px 24px 72px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 40%, rgba(255,107,53,0.07) 0%, transparent 65%), #0a0a0f",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          About the project
        </div>
        <h1 style={{
          fontSize: "clamp(36px,5.5vw,64px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.06,
          maxWidth: 720, margin: "0 auto",
        }}>
          Institutional-grade AI research,{" "}
          <span style={{
            background: "linear-gradient(135deg,#ff6b35 0%,#ffd166 50%,#06d6a0 100%)",
            backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "gradientShift 4s ease infinite",
          }}>
            democratised
          </span>
        </h1>
        <p style={{ fontSize: 17, color: "#9ca3af", maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7 }}>
          Investra uses a 7-node LangGraph multi-agent pipeline to deliver the kind of
          research a Wall Street analyst would take hours to produce — in under 60 seconds.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "7 Agents", color: "#ff6b35" },
            { label: "SSE Streaming", color: "#00d1b2" },
            { label: "GPT-4o-mini", color: "#ffd166" },
            { label: "LangGraph", color: "#06d6a0" },
            { label: "Not financial advice", color: "#6b7280" },
          ].map(b => (
            <span key={b.label} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: b.color,
            }}>{b.label}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 20px" }}>

        {/* Pipeline walkthrough */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, color: "#00d1b2", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Architecture
          </div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 40 }}>
            The 7-agent pipeline
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PIPELINE.map((node, i) => (
              <div key={node.step} style={{
                display: "grid", gridTemplateColumns: "auto 1fr",
                gap: 24, padding: 24,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                animation: `slideInUp 0.5s ease ${i * 0.07}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${node.color}30`;
                  e.currentTarget.style.background = `rgba(${node.color === "#ff6b35" ? "255,107,53" : node.color === "#00d1b2" ? "0,209,178" : "255,255,255"},0.04)`;
                  e.currentTarget.style.transform = "translateX(6px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Icon column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `${node.color}18`, border: `1px solid ${node.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    boxShadow: `0 0 16px ${node.color}15`,
                  }}>{node.icon}</div>
                  {i < PIPELINE.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 20, background: `linear-gradient(to bottom, ${node.color}40, transparent)` }} />
                  )}
                </div>
                {/* Content column */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: node.color, fontWeight: 700 }}>NODE {node.step}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#f9fafb" }}>{node.name}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, marginBottom: 12 }}>{node.desc}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {node.outputs.map(o => (
                      <span key={o} style={{
                        fontSize: 11, fontWeight: 600, color: "#d1d5db",
                        background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 10px",
                      }}>{o}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontSize: 11, color: "#ffd166", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Built with
          </div>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 32 }}>
            Technology stack
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
            {TECH.map((t, i) => (
              <div key={t.name} style={{
                padding: "18px 20px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14,
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.25s ease",
                animation: `slideInUp 0.4s ease ${i * 0.06}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,107,53,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: 26 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          padding: 28, background: "rgba(239,71,111,0.06)", border: "1px solid rgba(239,71,111,0.2)",
          borderRadius: 16, textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ef476f", marginBottom: 6 }}>Not Financial Advice</div>
          <div style={{ fontSize: 13, color: "#9ca3af", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Investra is a demonstration of multi-agent AI capabilities. All analysis is AI-generated
            and should not be used as the sole basis for investment decisions. Always consult a
            qualified financial advisor before investing.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#ff6b35,#ffd166)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📈</div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "white" }}>Investra</span>
        </div>
        <div style={{ fontSize: 12, color: "#374151" }}>
          LangGraph · Next.js · Supabase · Three.js · GSAP · Not financial advice
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
          {[{ href: "/", label: "Home" }, { href: "/history", label: "History" }, { href: "/compare", label: "Compare" }].map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 12, color: "#4b5563", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
              onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
            >{l.label}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
