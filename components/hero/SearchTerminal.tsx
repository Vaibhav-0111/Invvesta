"use client";
import { useState, useEffect, useRef } from "react";
import { useResearchStore } from "@/stores/useResearchStore";
import { useAuth } from "@/lib/AuthContext";

const SUGGESTIONS = ["NVIDIA","Apple","Tesla","Microsoft","Google","Amazon","Meta","Netflix"];

export default function SearchTerminal() {
  const [input, setInput]       = useState("");
  const [suggIdx, setSuggIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const { startResearch, mergeData, completeResearch, setError, isLoading } = useResearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  /* typewriter placeholder */
  useEffect(() => {
    const text = SUGGESTIONS[suggIdx];
    let i = 0; setDisplayed("");
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) { clearInterval(t); setTimeout(() => setSuggIdx(p => (p+1)%SUGGESTIONS.length), 2000); }
    }, 90);
    return () => clearInterval(t);
  }, [suggIdx]);

  const run = async (company: string) => {
    if (!company.trim() || isLoading) return;
    startResearch(company);
    try {
      const res = await fetch("/api/research", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ company, userId: user?.uid || null }),
      });
      
      if (res.status === 403) {
        const errorData = await res.json();
        setError(errorData.error || "Credit limit reached.");
        // Redirect to pricing after 2 seconds
        setTimeout(() => { window.location.href = "/pricing"; }, 2000);
        return;
      }
      if (!res.ok || !res.body) throw new Error("Research API failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const event = JSON.parse(line.slice(6));
          if (event.type === "step_complete") mergeData(event.data);
          if (event.type === "complete")      {
            completeResearch();
            const s = useResearchStore.getState().state;
            if (s) fetch("/api/history", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId:    user?.uid   ?? null,   // Firebase UID
                userName:  user?.displayName ?? null,
                userEmail: user?.email ?? null,
                userPhoto: user?.photoURL ?? null,
                company:        s.company,
                ticker:         s.ticker,
                recommendation: s.recommendation?.decision,
                score:          s.score,
                analysis:       s,
              }),
            }).catch(() => {});
          }
          if (event.type === "error") setError(event.message);
        }
      }
    } catch(e:any){ setError(e.message); }
  };

  return (
    <div style={{ maxWidth:640, margin:"0 auto", position:"relative" }}>
      {/* Glowing border pulse when idle */}
      <div style={{
        position:"absolute", inset:-2, borderRadius:16,
        backgroundImage: isLoading
          ? "none"
          : "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(0,209,178,0.15), rgba(255,209,102,0.2))",
        backgroundSize: "200% 200%",
        animation: isLoading ? "none" : "gradientShift 3s ease infinite",
        filter: "blur(8px)",
        opacity: 0.6,
        pointerEvents:"none",
        zIndex: 0,
        transition: "opacity 0.4s ease",
      }} />

      {/* Chrome bar */}
      <div style={{
        background:"#1a1a26", borderRadius:"14px 14px 0 0", padding:"10px 18px",
        display:"flex", alignItems:"center", gap:8,
        border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none",
        position:"relative", zIndex:1,
      }}>
        <div style={{ width:12,height:12,borderRadius:"50%",background:"#ef4444",
          boxShadow:"0 0 6px rgba(239,68,68,0.4)", transition:"box-shadow 0.3s ease" }} />
        <div style={{ width:12,height:12,borderRadius:"50%",background:"#f59e0b",
          boxShadow:"0 0 6px rgba(245,158,11,0.4)", transition:"box-shadow 0.3s ease" }} />
        <div style={{ width:12,height:12,borderRadius:"50%",background:"#22c55e",
          boxShadow:"0 0 6px rgba(34,197,94,0.4)", transition:"box-shadow 0.3s ease" }} />
        <span style={{ marginLeft:8, color:"#4b5563", fontSize:12, fontFamily:"monospace" }}>analyst@investra ~ $</span>
        <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:isLoading?"#ff6b35":"#22c55e",
            boxShadow: isLoading?"0 0 8px #ff6b35, 0 0 16px rgba(255,107,53,0.3)":"0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.3)",
            animation: isLoading?"blink 1s ease-in-out infinite":"none",
            display:"inline-block",
          }} />
          <span style={{ fontSize:11, color:"#4b5563" }}>{isLoading ? "running" : "ready"}</span>
        </span>
      </div>

      {/* Terminal body */}
      <div style={{
        background:"#0d0d18", padding:"20px 20px 24px", borderRadius:"0 0 14px 14px",
        border:"1px solid rgba(255,255,255,0.08)", borderTop:"none",
        position:"relative", zIndex:1, overflow:"hidden",
      }}>
        {/* Scanline overlay */}
        <div style={{
          position:"absolute", inset:0,
          background:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px)",
          pointerEvents:"none", zIndex:0,
        }} />
        {/* Moving scanline */}
        <div style={{
          position:"absolute", left:0, right:0, height:1,
          background:"linear-gradient(90deg, transparent, rgba(0,209,178,0.25), transparent)",
          animation:"scanline 4s ease-in-out infinite",
          pointerEvents:"none", zIndex:0,
        }} />

        {/* Input row */}
        <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:1 }}>
          <span style={{ color:"#ff6b35", fontFamily:"monospace", fontSize:20, userSelect:"none", flexShrink:0,
            textShadow:"0 0 8px rgba(255,107,53,0.4)",
          }}>❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && run(input)}
            placeholder={`Research ${displayed}...`}
            disabled={isLoading}
            autoFocus
            style={{
              flex:1, background:"transparent", border:"none", outline:"none",
              color:"#00d1b2", fontFamily:"monospace", fontSize:20,
              caretColor:"#ff6b35", letterSpacing:"0.02em",
              textShadow:"0 0 12px rgba(0,209,178,0.15)",
            }}
          />
          {isLoading && (
            <span style={{ fontSize:12, color:"#ff6b35", fontFamily:"monospace", animation:"blink 1s ease-in-out infinite",
              textShadow:"0 0 8px rgba(255,107,53,0.5)",
            }}>█</span>
          )}
        </div>

        {/* Quick picks */}
        <div style={{ marginTop:18, display:"flex", gap:8, flexWrap:"wrap", position:"relative", zIndex:1 }}>
          <span style={{ fontSize:11, color:"#4b5563", fontFamily:"monospace", alignSelf:"center", marginRight:4 }}>try:</span>
          {SUGGESTIONS.slice(0,6).map(s => (
            <button key={s} onClick={() => { setInput(s); run(s); }} disabled={isLoading}
              style={{
                background:"rgba(255,255,255,0.04)", color:"#9ca3af",
                border:"1px solid rgba(255,255,255,0.08)", borderRadius:8,
                padding:"5px 14px", fontSize:13, cursor:isLoading?"not-allowed":"pointer",
                fontFamily:"monospace",
                transition:"all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.borderColor="rgba(255,107,53,0.4)";
                b.style.color="#ff6b35";
                b.style.background="rgba(255,107,53,0.06)";
                b.style.transform="translateY(-2px)";
                b.style.boxShadow="0 4px 12px rgba(255,107,53,0.12)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.borderColor="rgba(255,255,255,0.08)";
                b.style.color="#9ca3af";
                b.style.background="rgba(255,255,255,0.04)";
                b.style.transform="translateY(0)";
                b.style.boxShadow="none";
              }}
            >{s}</button>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => run(input)}
          disabled={isLoading || !input.trim()}
          style={{
            marginTop:20, width:"100%", padding:"16px",
            background: isLoading
              ? "rgba(255,255,255,0.04)"
              : "linear-gradient(135deg,#ff6b35 0%,#ffd166 100%)",
            color: isLoading ? "#4b5563" : "#0a0a0f",
            border: isLoading ? "1px solid rgba(255,255,255,0.06)" : "none",
            borderRadius:12, fontSize:16, fontWeight:800,
            cursor: isLoading?"not-allowed":"pointer",
            letterSpacing:"0.04em",
            transition:"all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: isLoading ? "none" : "0 4px 24px rgba(255,107,53,0.35), 0 0 0 1px rgba(255,107,53,0.15)",
            position:"relative", overflow:"hidden",
            zIndex:1,
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,53,0.5), 0 0 0 1px rgba(255,107,53,0.3)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            if (!isLoading) {
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,107,53,0.35), 0 0 0 1px rgba(255,107,53,0.15)";
            }
          }}
        >
          {/* Shimmer overlay on CTA */}
          {!isLoading && (
            <span style={{
              position:"absolute", top:0, left:"-100%", width:"60%", height:"100%",
              background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation:"ctaShimmer 2.5s ease-in-out infinite",
              pointerEvents:"none",
            }} />
          )}
          <span style={{ position:"relative", zIndex:1 }}>
            {isLoading ? "⟳  Analyzing..." : "Run Analysis  →"}
          </span>
        </button>
      </div>
    </div>
  );
}
