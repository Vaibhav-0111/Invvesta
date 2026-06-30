"use client";
import type { AgentStep } from "@/lib/types";

const STEPS: { id: AgentStep; label: string; icon: string; desc: string }[] = [
  { id:"company_research",    label:"Company Research",   icon:"🏢", desc:"Profile, CEO, Products" },
  { id:"financial_analysis",  label:"Financial Analysis", icon:"📊", desc:"Revenue, EPS, Cash Flow" },
  { id:"news_collection",     label:"News Collection",    icon:"📰", desc:"Latest Headlines" },
  { id:"sentiment_analysis",  label:"Sentiment Analysis", icon:"🧠", desc:"Market Mood Score" },
  { id:"competitor_analysis", label:"Competitor Analysis",icon:"⚔️", desc:"Market Position" },
  { id:"risk_analysis",       label:"Risk Analysis",      icon:"⚠️", desc:"Risk Radar" },
  { id:"investment_decision", label:"Final Decision",     icon:"✅", desc:"INVEST / PASS" },
];

export default function AgentGraph({ currentStep, completedSteps }: { currentStep: AgentStep; completedSteps: AgentStep[] }) {
  const getStatus = (id: AgentStep) =>
    completedSteps.includes(id) ? "done" : currentStep === id ? "active" : "pending";

  const isRunning = currentStep !== "idle" && currentStep !== "complete";

  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:20 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
        <div style={{ width:8, height:8, borderRadius:"50%",
          background: isRunning ? "#ff6b35" : completedSteps.length > 0 ? "#06d6a0" : "#374151",
          boxShadow: isRunning ? "0 0 8px #ff6b35" : "none",
          animation: isRunning ? "blink 1.5s ease-in-out infinite" : "none",
        }} />
        <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Agent Pipeline
        </span>
        {completedSteps.length > 0 && (
          <span style={{ marginLeft:"auto", fontSize:11, color:"#6b7280" }}>
            {completedSteps.length}/{STEPS.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:"rgba(255,255,255,0.06)", borderRadius:2, marginBottom:20, overflow:"hidden" }}>
        <div style={{
          width:`${(completedSteps.length/STEPS.length)*100}%`,
          height:"100%",
          background:"linear-gradient(90deg,#ff6b35,#00d1b2)",
          borderRadius:2,
          transition:"width 0.5s ease",
        }} />
      </div>

      {/* Steps */}
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {STEPS.map((step) => {
          const status = getStatus(step.id);
          return (
            <div key={step.id} style={{
              display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10,
              background: status==="active" ? "rgba(255,107,53,0.08)" : status==="done" ? "rgba(0,209,178,0.04)" : "transparent",
              border: status==="active" ? "1px solid rgba(255,107,53,0.2)" : "1px solid transparent",
              opacity: status==="pending" ? 0.35 : 1,
              transition:"all 0.3s ease",
            }}>
              {/* Icon circle */}
              <div style={{
                width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:14, flexShrink:0,
                background: status==="done" ? "linear-gradient(135deg,#06d6a0,#00d1b2)"
                          : status==="active" ? "linear-gradient(135deg,#ff6b35,#ffd166)"
                          : "rgba(255,255,255,0.05)",
                boxShadow: status==="active" ? "0 0 16px rgba(255,107,53,0.5)"
                          : status==="done" ? "0 0 10px rgba(0,209,178,0.3)" : "none",
              }}>
                {status==="done" ? "✓" : step.icon}
              </div>
              {/* Text */}
              <div>
                <div style={{ fontSize:13, fontWeight:600, color: status==="pending" ? "#4b5563" : "#f9fafb" }}>
                  {step.label}
                </div>
                <div style={{ fontSize:11, color:"#6b7280", marginTop:1 }}>{step.desc}</div>
                {status==="active" && (
                  <div style={{ fontSize:10, color:"#ff6b35", fontWeight:700, marginTop:3, letterSpacing:"0.04em", animation:"blink 1.2s ease-in-out infinite" }}>
                    ANALYZING...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
