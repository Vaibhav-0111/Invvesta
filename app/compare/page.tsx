"use client";
import BattleMode from "@/components/agent/BattleMode";

const NAV_LINKS = [
  { href: "/", label: "← Home" },
  { href: "/history", label: "📋 History" },
  { href: "/about", label: "About" },
];

export default function ComparePage() {
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
        }}>+ New Analysis</a>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: "#ef476f", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Head-to-Head Analysis
          </div>
          <h1 style={{
            fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.035em",
            background: "linear-gradient(135deg,#ff6b35 0%,#ffd166 50%,#ef476f 100%)",
            backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "gradientShift 4s ease infinite",
          }}>
            ⚔️ Battle Mode
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
            Enter two companies and our AI will pick the stronger investment in seconds.
          </p>
        </div>

        {/* Battle Mode component */}
        <BattleMode fullPage />

        {/* How it works */}
        <div style={{
          marginTop: 64, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: 32,
        }}>
          <div style={{ fontSize: 11, color: "#00d1b2", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            How it works
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 20 }}>
            {[
              { icon: "✍️", title: "Enter two companies", desc: "Type any two public companies you want to compare" },
              { icon: "🧠", title: "AI runs dual analysis", desc: "GPT-4o-mini analyses both simultaneously across 5 categories" },
              { icon: "📊", title: "Category breakdown", desc: "Growth, profitability, valuation, risk, and momentum scored" },
              { icon: "🏆", title: "Winner declared", desc: "One clear winner with reasoning and confidence score" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f9fafb", marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
