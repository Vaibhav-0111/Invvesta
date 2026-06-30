"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

interface HistoryItem {
  id: string;
  company_name: string;
  ticker: string;
  recommendation: "INVEST" | "PASS";
  score: number;
  created_at: string;
}

const NAV_LINKS = [
  { href: "/", label: "← Home" },
  { href: "/compare", label: "⚔️ Compare" },
  { href: "/about", label: "About" },
];

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "INVEST" | "PASS">("all");
  const [search, setSearch] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const url = user?.uid
      ? `/api/history?userId=${encodeURIComponent(user.uid)}`
      : "/api/history";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const filtered = history.filter(h => {
    const matchFilter = filter === "all" || h.recommendation === filter;
    const matchSearch = h.company_name.toLowerCase().includes(search.toLowerCase()) ||
      h.ticker.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const investCount = history.filter(h => h.recommendation === "INVEST").length;
  const passCount = history.filter(h => h.recommendation === "PASS").length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : 0;

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
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Research Archive
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: "white", letterSpacing: "-0.03em" }}>
            Report History
          </h1>
          <p style={{ fontSize: 15, color: "#6b7280", marginTop: 8 }}>
            All your AI-generated investment reports, saved to Supabase.
          </p>
        </div>

        {/* Stats */}
        {!loading && history.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Total Reports", value: history.length, color: "#f9fafb" },
              { label: "INVEST", value: investCount, color: "#06d6a0" },
              { label: "PASS", value: passCount, color: "#ef476f" },
              { label: "Avg Score", value: avgScore, color: "#ffd166" },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "20px 16px", textAlign: "center",
              }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or ticker…"
            style={{
              flex: 1, minWidth: 200, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "10px 16px", color: "#f9fafb", fontSize: 13,
              outline: "none",
            }}
          />
          {(["all", "INVEST", "PASS"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "9px 18px", borderRadius: 10, border: "1px solid",
              fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease",
              background: filter === f
                ? f === "INVEST" ? "rgba(6,214,160,0.15)" : f === "PASS" ? "rgba(239,71,111,0.15)" : "rgba(255,107,53,0.15)"
                : "rgba(255,255,255,0.04)",
              borderColor: filter === f
                ? f === "INVEST" ? "rgba(6,214,160,0.4)" : f === "PASS" ? "rgba(239,71,111,0.4)" : "rgba(255,107,53,0.4)"
                : "rgba(255,255,255,0.08)",
              color: filter === f
                ? f === "INVEST" ? "#06d6a0" : f === "PASS" ? "#ef476f" : "#ff6b35"
                : "#9ca3af",
            }}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }}>📋</div>
            Loading reports…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: 48, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{history.length === 0 ? "🔍" : "😶"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb", marginBottom: 8 }}>
              {history.length === 0 ? "No reports yet" : "No matching reports"}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {history.length === 0
                ? "Run your first analysis from the home page."
                : "Try a different search or filter."}
            </div>
            {history.length === 0 && (
              <a href="/" style={{
                display: "inline-block", marginTop: 20, padding: "10px 24px",
                background: "linear-gradient(135deg,#ff6b35,#ffd166)", color: "#0a0a0f",
                borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 14,
              }}>Start Analysing →</a>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((h, i) => (
              <a key={h.id} href={`/report?id=${h.id}`} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "18px 22px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, textDecoration: "none",
                transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                animation: `slideInUp 0.4s ease ${i * 0.04}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,107,53,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: h.recommendation === "INVEST" ? "rgba(6,214,160,0.12)" : "rgba(239,71,111,0.12)",
                    border: `1px solid ${h.recommendation === "INVEST" ? "rgba(6,214,160,0.3)" : "rgba(239,71,111,0.3)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 900, color: h.recommendation === "INVEST" ? "#06d6a0" : "#ef476f",
                  }}>
                    {h.recommendation === "INVEST" ? "↑" : "↓"}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#f9fafb" }}>{h.company_name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      <span style={{ fontFamily: "monospace", color: "#ff6b35" }}>{h.ticker}</span>
                      {" · "}{new Date(h.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  {/* Score bar */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: 20, fontWeight: 900,
                      color: h.score >= 60 ? "#06d6a0" : h.score >= 40 ? "#ffd166" : "#ef476f",
                    }}>{h.score}</div>
                    <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600 }}>SCORE</div>
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
                    background: h.recommendation === "INVEST" ? "rgba(6,214,160,0.15)" : "rgba(239,71,111,0.15)",
                    color: h.recommendation === "INVEST" ? "#06d6a0" : "#ef476f",
                    border: `1px solid ${h.recommendation === "INVEST" ? "rgba(6,214,160,0.3)" : "rgba(239,71,111,0.3)"}`,
                    minWidth: 60, textAlign: "center",
                  }}>{h.recommendation}</div>
                  <span style={{ fontSize: 16, color: "#374151" }}>→</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
