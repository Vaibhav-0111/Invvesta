"use client";
import type { Recommendation, CompanyData } from "@/lib/types";

export default function RecommendationCard({ recommendation, company, score }: {
  recommendation: Recommendation; company: CompanyData; score: number;
}) {
  const isInvest = recommendation.decision === "INVEST";
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const col    = isInvest ? "#06d6a0" : "#ef476f";

  return (
    <div style={{
      background: isInvest ? "rgba(6,214,160,0.06)" : "rgba(239,71,111,0.06)",
      border: `2px solid ${col}40`,
      borderRadius: 20, padding: 32,
    }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20 }}>
        <div>
          <div style={{ fontSize:11, color:"#6b7280", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Final Verdict</div>
          <div style={{ fontSize:60, fontWeight:900, color:col, letterSpacing:"-0.02em", lineHeight:1,
            textShadow:`0 0 40px ${col}60`,
          }}>{recommendation.decision}</div>
          <div style={{ marginTop:12, fontSize:15, color:"#d1d5db", maxWidth:380, lineHeight:1.6 }}>{recommendation.verdict}</div>
          <div style={{ marginTop:14, display:"flex", gap:10, flexWrap:"wrap" }}>
            <span style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af", borderRadius:8, padding:"5px 14px", fontSize:13, fontWeight:600 }}>
              {recommendation.confidence}% confidence
            </span>
            <span style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af", borderRadius:8, padding:"5px 14px", fontSize:13, fontWeight:600, textTransform:"capitalize" }}>
              {recommendation.timeHorizon}-term
            </span>
            {recommendation.targetPrice && (
              <span style={{ background:`${col}15`, color:col, border:`1px solid ${col}40`, borderRadius:8, padding:"5px 14px", fontSize:13, fontWeight:700 }}>
                Target: ${recommendation.targetPrice}
              </span>
            )}
          </div>
        </div>

        {/* Score ring */}
        <div style={{ position:"relative", width:130, height:130, flexShrink:0 }}>
          <svg width="130" height="130" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle cx="65" cy="65" r={radius} fill="none" stroke={col} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition:"stroke-dashoffset 1.2s ease", filter:`drop-shadow(0 0 10px ${col})` }}
            />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:30, fontWeight:900, color:"#f9fafb" }}>{score}</div>
            <div style={{ fontSize:10, color:"#6b7280", fontWeight:700, letterSpacing:"0.06em" }}>SCORE</div>
          </div>
        </div>
      </div>

      {/* Reasons grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:28 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#06d6a0", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
            ✓ Reasons To Invest
          </div>
          {recommendation.investReasons.map((r,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
              <span style={{ color:"#06d6a0", marginTop:2, flexShrink:0 }}>•</span>
              <span style={{ fontSize:13, color:"#d1d5db", lineHeight:1.5 }}>{r}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#ef476f", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
            ✗ Reasons Not To Invest
          </div>
          {recommendation.passReasons.map((r,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
              <span style={{ color:"#ef476f", marginTop:2, flexShrink:0 }}>•</span>
              <span style={{ fontSize:13, color:"#d1d5db", lineHeight:1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst note */}
      <div style={{ marginTop:24, padding:"14px 18px", background:"rgba(255,255,255,0.04)", borderRadius:12, borderLeft:`3px solid ${col}`, fontSize:13, color:"#9ca3af", lineHeight:1.6, fontStyle:"italic" }}>
        💬 {recommendation.analystNote}
      </div>
    </div>
  );
}
