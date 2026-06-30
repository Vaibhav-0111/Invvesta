"use client";
import { useResearchStore } from "@/stores/useResearchStore";
import { RevenueChart, ProfitChart, RiskRadar } from "@/components/charts/FinancialCharts";
import StockChart from "@/components/charts/StockChart";
import RecommendationCard from "./RecommendationCard";
import AgentGraph from "./AgentGraph";
import ReportChat from "./ReportChat";
import { Download } from "lucide-react";

const C = {
  card: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24 } as React.CSSProperties,
  label: { fontSize:11, color:"#6b7280", fontWeight:600, textTransform:"uppercase" as const, letterSpacing:"0.06em" },
  title: { fontSize:26, fontWeight:800, color:"#f9fafb" },
  sub:   { fontSize:13, color:"#9ca3af" },
  body:  { fontSize:13, color:"#d1d5db", lineHeight:1.6 },
};

export default function ResearchDashboard({ dark = false }: { dark?: boolean }) {
  const { state, isLoading, currentStep, completedSteps, error, reset } = useResearchStore();
  if (!state && !isLoading && !error) return null;
  const s = state;

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"48px 20px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:24, alignItems:"start" }}>

        {/* ── Left: sticky pipeline ── */}
        <div style={{ position:"sticky", top:80 }}>
          <AgentGraph currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        {/* ── Right: output ── */}
        <div id="report-content" style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Error state */}
          {error && (
            <div style={{ ...C.card, borderColor:"rgba(239,71,111,0.3)", background:"rgba(239,71,111,0.06)", textAlign:"center", padding:48 }}>
              <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#ef476f", marginBottom:8 }}>Analysis Failed</div>
              <div style={{ fontSize:13, color:"#9ca3af", marginBottom:20, maxWidth:460, margin:"0 auto 20px", lineHeight:1.6 }}>
                {error.includes("quota") || error.includes("insufficient")
                  ? (<>Your API key has run out of credits or hit a rate limit.<br/>
                     Get a free Gemini key at{" "}
                     <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                       style={{color:"#ffd166", textDecoration:"underline"}}>aistudio.google.com</a>
                     {" "}and add it to your <code style={{background:"rgba(255,255,255,0.08)",padding:"1px 6px",borderRadius:4}}>.env</code> as<br/>
                     <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 8px",borderRadius:4
                       }}>GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...</code></>
                  ) : error
                }
              </div>
              <button onClick={() => reset()} style={{
                padding:"10px 24px", background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.15)", borderRadius:10,
                color:"#f9fafb", fontSize:14, fontWeight:700, cursor:"pointer",
              }}>← Try Again</button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && !s?.companyData && (
            <div style={{ ...C.card, textAlign:"center", padding:48 }}>
              <div style={{ fontSize:40, marginBottom:16 }}>🔍</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#f9fafb" }}>Analyst Workspace</div>
              <div style={{ fontSize:14, color:"#6b7280", marginTop:8 }}>
                Running research pipeline for <strong style={{color:"#ff6b35"}}>{state?.company}</strong>…
              </div>
              <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:10, textAlign:"left", maxWidth:260, margin:"24px auto 0" }}>
                {["Reading Financial Statements","Checking News Sources","Evaluating Risks","Comparing Competitors","Building Recommendation"].map((item,i)=>(
                  <div key={i} style={{ fontSize:13, color:"#9ca3af", display:"flex", gap:8 }}>
                    <span style={{color:"#00d1b2"}}>○</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company header & PDF Export */}
          {s?.companyData && (
            <div style={{ ...C.card, display:"flex", alignItems:"center", gap:20 }}>
              <img src={s.companyData.logoUrl} alt={s.companyData.name}
                style={{ width:64, height:64, borderRadius:14, objectFit:"contain", background:"rgba(255,255,255,0.06)", padding:8, flexShrink:0 }}
                onError={e=>{ (e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${s.companyData?.ticker}&size=64&background=FF6B35&color=fff&bold=true`; }}
              />
              <div style={{flex:1}}>
                <div style={C.title}>{s.companyData.name}</div>
                <div style={{ display:"flex", gap:12, marginTop:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#ff6b35", fontFamily:"monospace" }}>{s.ticker}</span>
                  <span style={C.sub}>{s.companyData.industry}</span>
                  <span style={C.sub}>·</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#00d1b2" }}>{s.companyData.marketCap}</span>
                </div>
                <div style={{ ...C.body, marginTop:8 }}>{s.companyData.description}</div>
              </div>
              <button
                onClick={async () => {
                  const html2pdf = (await import("html2pdf.js")).default;
                  const element = document.getElementById("report-content");
                  if (!element) return;
                  const opt = {
                    margin:       0.5,
                    filename:     `${s.ticker}_Investment_Report.pdf`,
                    image:        { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0a0a0f' },
                    jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
                  };
                  html2pdf().set(opt).from(element).save();
                }}
                className="hide-on-pdf"
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#f9fafb", cursor: "pointer", transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                <Download size={16} /> <span style={{ fontSize: 13, fontWeight: 600 }}>PDF</span>
              </button>
            </div>
          )}

          {/* Key metrics */}
          {s?.financialData && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[
                  { label:"P/E Ratio",     value:`${s.financialData.peRatio.toFixed(1)}x` },
                  { label:"EPS",           value:`$${s.financialData.eps.toFixed(2)}` },
                  { label:"Op. Margin",    value:`${s.financialData.operatingMargin.toFixed(1)}%` },
                  { label:"D/E Ratio",     value:`${s.financialData.debtToEquity.toFixed(2)}x` },
                ].map(m=>(
                  <div key={m.label} style={{ ...C.card, textAlign:"center", padding:"16px 12px" }}>
                    <div style={C.label}>{m.label}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#f9fafb", marginTop:6 }}>{m.value}</div>
                  </div>
                ))}
              </div>
              
              {/* Real-time Market Data Chart */}
              <div style={C.card}>
                <div style={{ ...C.label, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                  <span>Market Performance (1 Year)</span>
                  <span style={{ color: "#00d1b2" }}>Live Data</span>
                </div>
                <StockChart ticker={s.ticker} />
              </div>

              {/* Fundamental Mock Charts */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <RevenueChart data={s.financialData} />
                <ProfitChart  data={s.financialData} />
              </div>
            </>
          )}

          {/* Sentiment */}
          {s?.sentiment && (
            <div style={C.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={C.label}>Market Sentiment</div>
                  <div style={{ fontSize:24, fontWeight:800, marginTop:4,
                    color: s.sentiment.label==="Bullish" ? "#06d6a0" : s.sentiment.label==="Bearish" ? "#ef476f" : "#ffd166"
                  }}>
                    {s.sentiment.label} · {s.sentiment.score}/100
                  </div>
                  <div style={{ ...C.body, marginTop:6 }}>{s.sentiment.summary}</div>
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  {[{label:"Pos",count:s.sentiment.positiveCount,color:"#06d6a0"},{label:"Neu",count:s.sentiment.neutralCount,color:"#ffd166"},{label:"Neg",count:s.sentiment.negativeCount,color:"#ef476f"}].map(b=>(
                    <div key={b.label} style={{textAlign:"center"}}>
                      <div style={{fontSize:22,fontWeight:800,color:b.color}}>{b.count}</div>
                      <div style={{fontSize:11,color:"#6b7280"}}>{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden", marginBottom:14 }}>
                <div style={{ width:`${s.sentiment.score}%`, height:"100%", background:"linear-gradient(90deg,#ff6b35,#00d1b2)", borderRadius:4, transition:"width 1s ease" }} />
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {s.sentiment.keyThemes.map(t=>(
                  <span key={t} style={{ background:"rgba(255,255,255,0.06)", color:"#d1d5db", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {s?.newsData && s.newsData.length > 0 && (
            <div style={C.card}>
              <div style={{ ...C.label, marginBottom:16 }}>News Timeline</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {s.newsData.map((n,i)=>(
                  <div key={i} style={{
                    padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:10,
                    borderLeft:`3px solid ${n.sentiment==="positive"?"#06d6a0":n.sentiment==="negative"?"#ef476f":"#374151"}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:"#f9fafb", lineHeight:1.4 }}>{n.title}</div>
                      <span style={{
                        fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, flexShrink:0,
                        background: n.sentiment==="positive"?"rgba(6,214,160,0.15)":n.sentiment==="negative"?"rgba(239,71,111,0.15)":"rgba(255,255,255,0.06)",
                        color: n.sentiment==="positive"?"#06d6a0":n.sentiment==="negative"?"#ef476f":"#9ca3af",
                        border: `1px solid ${n.sentiment==="positive"?"rgba(6,214,160,0.3)":n.sentiment==="negative"?"rgba(239,71,111,0.3)":"rgba(255,255,255,0.1)"}`,
                      }}>{n.sentiment}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#6b7280", marginTop:4 }}>{n.source} · {n.date}</div>
                    <div style={{ fontSize:12, color:"#9ca3af", marginTop:4, lineHeight:1.5 }}>{n.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitors */}
          {s?.competitors && s.competitors.length > 0 && (
            <div style={C.card}>
              <div style={{ ...C.label, marginBottom:16 }}>Competitor Analysis</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {s.competitors.map((c,i)=>(
                  <div key={i} style={{ padding:16, background:"rgba(255,255,255,0.03)", borderRadius:12, textAlign:"center", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <img src={c.logoUrl} alt={c.name}
                      style={{ width:40, height:40, borderRadius:8, objectFit:"contain", background:"rgba(255,255,255,0.06)", padding:4, margin:"0 auto 8px" }}
                      onError={e=>{ (e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${c.ticker}&size=40&background=374151&color=fff&bold=true`; }}
                    />
                    <div style={{ fontWeight:700, fontSize:14, color:"#f9fafb" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:"#6b7280", margin:"4px 0 8px" }}>{c.ticker} · {c.marketCap}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: c.revenueGrowth>=0?"#06d6a0":"#ef476f" }}>
                      {c.revenueGrowth>=0?"▲":"▼"} {Math.abs(c.revenueGrowth)}% growth
                    </div>
                    <div style={{ fontSize:11, color:"#6b7280", marginTop:6, lineHeight:1.4 }}>{c.advantage}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk radar + factors */}
          {s?.risks && (
            <>
              <RiskRadar data={s.risks} />
              <div style={C.card}>
                <div style={{ ...C.label, marginBottom:16 }}>Risk Factors</div>
                {s.risks.factors.map((f,i)=>(
                  <div key={i} style={{
                    padding:"12px 16px", background:"rgba(255,255,255,0.03)", borderRadius:10, marginBottom:8,
                    borderLeft:`3px solid ${f.severity==="high"?"#ef476f":f.severity==="medium"?"#ffd166":"#06d6a0"}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:14, fontWeight:600, color:"#f9fafb" }}>{f.category}</div>
                      <span style={{
                        fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700, textTransform:"capitalize",
                        background: f.severity==="high"?"rgba(239,71,111,0.15)":f.severity==="medium"?"rgba(255,209,102,0.15)":"rgba(6,214,160,0.15)",
                        color: f.severity==="high"?"#ef476f":f.severity==="medium"?"#ffd166":"#06d6a0",
                      }}>{f.severity}</span>
                    </div>
                    <div style={{ fontSize:13, color:"#9ca3af", marginTop:4, lineHeight:1.5 }}>{f.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Final verdict */}
          {s?.recommendation && s.companyData && (
            <RecommendationCard recommendation={s.recommendation} company={s.companyData} score={s.score ?? 0} />
          )}
        </div>
      </div>
      <ReportChat />
    </div>
  );
}
