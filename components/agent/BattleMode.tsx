"use client";
import { useState } from "react";

interface BattleResult {
  winner: string; confidence: number; verdict: string;
  company1: { name:string; ticker:string; score:number; strengths:string[]; weaknesses:string[]; recommendation:string };
  company2: { name:string; ticker:string; score:number; strengths:string[]; weaknesses:string[]; recommendation:string };
  categories: Record<string, { winner:string; margin:number }>;
}

export default function BattleMode({ fullPage = false }: { fullPage?: boolean }) {
  const [c1,setC1] = useState(""); const [c2,setC2] = useState("");
  const [result,setResult] = useState<BattleResult|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const run = async () => {
    if (!c1.trim()||!c2.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/compare",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({company1:c1,company2:c2}) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch(e:any){ setError(e.message); } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    background:"rgba(255,255,255,0.05)", color:"#f9fafb",
    border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
    padding:"12px 16px", fontSize:16, fontWeight:700,
    fontFamily:"monospace", outline:"none", width:"100%",
    textAlign:"center",
  };

  return (
    <div style={{
      background: fullPage ? "transparent" : "rgba(255,255,255,0.03)",
      border: fullPage ? "none" : "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: fullPage ? 0 : 24,
    }}>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:11, color:"#6b7280", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>⚔️ Investment Battle Mode</div>
        <div style={{ fontSize:20, fontWeight:800, color:"#f9fafb" }}>Which stock wins?</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"center", marginBottom:16 }}>
        <input value={c1} onChange={e=>setC1(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()} placeholder="NVIDIA" style={{...inputStyle,color:"#00d1b2"}} />
        <div style={{ fontSize:20, fontWeight:900, color:"#ff6b35", padding:"0 8px" }}>VS</div>
        <input value={c2} onChange={e=>setC2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()} placeholder="AMD" style={{...inputStyle,color:"#ffd166"}} />
      </div>

      <button onClick={run} disabled={loading||!c1.trim()||!c2.trim()} style={{
        width:"100%", padding:"13px",
        background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#ff6b35,#ffd166)",
        color: loading ? "#6b7280" : "#111",
        border:"none", borderRadius:10, fontSize:14, fontWeight:700,
        cursor: loading ? "not-allowed" : "pointer",
      }}>
        {loading ? "⟳ Analyzing..." : "⚔️ Start Battle"}
      </button>

      {error && <div style={{ marginTop:12, padding:12, background:"rgba(239,71,111,0.1)", borderRadius:8, color:"#ef476f", fontSize:13, border:"1px solid rgba(239,71,111,0.2)" }}>{error}</div>}

      {result && (
        <div style={{ marginTop:20 }}>
          <div style={{ textAlign:"center", padding:"18px 20px", background:"rgba(6,214,160,0.1)", borderRadius:12, marginBottom:16, border:"1px solid rgba(6,214,160,0.2)" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#06d6a0", textTransform:"uppercase", marginBottom:6 }}>🏆 Winner</div>
            <div style={{ fontSize:32, fontWeight:900, color:"#06d6a0" }}>{result.winner}</div>
            <div style={{ fontSize:13, color:"#9ca3af", marginTop:6 }}>{result.confidence}% confidence · {result.verdict}</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[result.company1, result.company2].map((c,i)=>(
              <div key={i} style={{
                padding:14, borderRadius:12, border:`1px solid ${c.name===result.winner?"rgba(6,214,160,0.3)":"rgba(255,255,255,0.06)"}`,
                background: c.name===result.winner?"rgba(6,214,160,0.06)":"rgba(255,255,255,0.03)",
              }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#f9fafb", marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>{c.ticker}</div>
                <div style={{ fontSize:30, fontWeight:900, color: c.name===result.winner?"#06d6a0":"#ffd166" }}>{c.score}</div>
                <div style={{ fontSize:10, color:"#6b7280", marginBottom:10 }}>SCORE</div>
                {c.strengths.slice(0,2).map((s,j)=>(
                  <div key={j} style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>✓ {s}</div>
                ))}
              </div>
            ))}
          </div>

          {Object.entries(result.categories).map(([cat,val])=>(
            <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:12, color:"#6b7280", textTransform:"capitalize" }}>{cat}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#00d1b2" }}>{val.winner} +{val.margin}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
