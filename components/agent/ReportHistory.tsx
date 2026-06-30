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

export default function ReportHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Build URL: if signed in, filter by Firebase UID
    const url = user?.uid
      ? `/api/history?userId=${encodeURIComponent(user.uid)}`
      : "/api/history";

    fetch(url)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => setLoading(false));
  }, [user?.uid]);   // re-fetch if user changes (sign in / sign out)

  if (loading) return (
    <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#6b7280", fontSize: 13 }}>
      Loading reports…
    </div>
  );

  // Not signed in — prompt to sign in
  if (!isAuthenticated) return (
    <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>🔐</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb", marginBottom: 6 }}>Sign in to save reports</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Reports are linked to your Firebase account and stored in Supabase.</div>
      <a href="/login" style={{
        display: "inline-block", padding: "9px 22px",
        background: "linear-gradient(135deg,#ff6b35,#ffd166)",
        color: "#0a0a0f", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none",
      }}>Sign In with Google →</a>
    </div>
  );

  if (history.length === 0) return (
    <div style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4b5563", fontSize: 13, textAlign: "center" }}>
      No reports yet. Run your first analysis above ↑
    </div>
  );

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
      {history.slice(0, 8).map(h => (
        <a key={h.id} href={`/report?id=${h.id}`}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", background: "rgba(255,255,255,0.03)",
            borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)",
            textDecoration: "none", transition: "all 0.2s ease", cursor: "pointer",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,107,53,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{h.company_name}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>
              {h.ticker} · {new Date(h.created_at).toLocaleDateString()} · <span style={{ color: "#ff6b35" }}>View full report →</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6,
              background: h.recommendation === "INVEST" ? "rgba(6,214,160,0.15)" : "rgba(239,71,111,0.15)",
              color: h.recommendation === "INVEST" ? "#06d6a0" : "#ef476f",
              border: `1px solid ${h.recommendation === "INVEST" ? "rgba(6,214,160,0.3)" : "rgba(239,71,111,0.3)"}`,
            }}>
              {h.recommendation}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>Score: {h.score}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
