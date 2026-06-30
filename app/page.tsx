"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchTerminal    from "@/components/hero/SearchTerminal";
import TickerTape        from "@/components/hero/TickerTape";
import AnalystWorkspace  from "@/components/hero/AnalystWorkspace";
import FloatingVerdictCards from "@/components/hero/FloatingVerdictCards";
import RevealOnScroll    from "@/components/hero/RevealOnScroll";
import ResearchDashboard from "@/components/agent/ResearchDashboard";
import BattleMode        from "@/components/agent/BattleMode";
import ReportHistory     from "@/components/agent/ReportHistory";
import { Testimonials, MoreFeatures, FAQ } from "@/components/hero/LandingSections";
import { useResearchStore } from "@/stores/useResearchStore";
import { useAuth } from "@/lib/AuthContext";

const StockMarketScene = dynamic(
  () => import("@/components/hero/StockMarketScene"),
  { ssr: false, loading: () => <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 40%, rgba(255,107,53,0.08) 0%, transparent 70%)" }} /> }
);

/* ── Glowing section divider ───────────────────────────────────── */
function GlowDivider() {
  return <div className="glow-divider" />;
}

export default function Home() {
  const { state, isLoading, error: storeError, currentStep } = useResearchStore();
  const { user, isAuthenticated, hydrated } = useAuth();
  
  // Stay on analysis view if: actively loading, has data, has an error, or any step started
  const hasResults = !!(state?.companyData || isLoading || storeError || (currentStep && currentStep !== "idle"));

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#f9fafb" }}>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        background:"rgba(10,10,15,0.72)", backdropFilter:"blur(20px) saturate(1.5)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        height:60, display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"0 28px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:8,
            background:"linear-gradient(135deg,#ff6b35,#ffd166)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
            boxShadow:"0 0 12px rgba(255,107,53,0.3)",
            animation:"breathe 3s ease-in-out infinite",
          }}>📈</div>
          <span style={{ fontSize:18, fontWeight:900, color:"white" }}>Investra</span>
          <span style={{
            fontSize:10, fontWeight:700, background:"#ff6b35", color:"white",
            borderRadius:5, padding:"2px 7px", letterSpacing:"0.06em",
            boxShadow:"0 0 8px rgba(255,107,53,0.3)",
          }}>AI</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", gap:18 }}>
            {[
              { href:"/history", label:"📋 History" },
              { href:"/compare", label:"⚔️ Compare" },
              { href:"/pricing", label:"💎 Pricing" },
              { href:"/about",   label:"About" },
            ].map(l => (
              <a key={l.href} href={l.href}
                style={{ fontSize:13, color:"#6b7280", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#f9fafb")}
                onMouseLeave={e=>(e.currentTarget.style.color="#6b7280")}
              >{l.label}</a>
            ))}
          </div>

          <div style={{ width:1, height:16, background:"rgba(255,255,255,0.1)", margin:"0 4px" }} />

          {!hydrated ? (
            <div style={{ width: 80, height: 32 }} /> // skeleton
          ) : !isAuthenticated ? (
            <a href="/login" style={{
              padding:"6px 18px", background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
              fontSize:13, fontWeight:600, color:"#f9fafb", textDecoration:"none",
              transition:"all 0.2s"
            }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}
              onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}
            >
              Sign In
            </a>
          ) : (
            <button onClick={() => window.location.href = "/"} style={{
              padding:"6px 18px", background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:8,
              fontSize:13, fontWeight:600, cursor:"pointer", color:"#9ca3af",
              transition:"all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
              onMouseEnter={e=>{
                const b = e.currentTarget;
                b.style.background="rgba(255,107,53,0.1)";
                b.style.borderColor="rgba(255,107,53,0.3)";
                b.style.color="#ff6b35";
                b.style.transform="translateY(-1px)";
              }}
              onMouseLeave={e=>{
                const b = e.currentTarget;
                b.style.background="rgba(255,255,255,0.05)";
                b.style.borderColor="rgba(255,255,255,0.1)";
                b.style.color="#9ca3af";
                b.style.transform="translateY(0)";
              }}
            >← New Research</button>
          )}
        </div>
      </nav>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {hasResults ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: 60 }}
          >
            <ResearchDashboard dark />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ── HERO (3D canvas + Main Copy) ──────────────────────────────────── */}
            <div style={{
              position:"relative", height:"100vh", overflow:"hidden",
              background:"radial-gradient(ellipse at 30% 40%, rgba(255,107,53,0.06) 0%, transparent 55%), radial-gradient(ellipse at 70% 65%, rgba(0,209,178,0.06) 0%, transparent 55%), #0a0a0f",
            }}>
              <StockMarketScene />

              {/* bottom fade */}
              <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"45%", background:"linear-gradient(to bottom,transparent,#0a0a0f)", pointerEvents:"none", zIndex: 1 }} />

              {/* centre copy */}
              <div style={{
                position:"absolute", inset:0, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"0 24px", paddingTop:60, pointerEvents:"none", zIndex: 10
              }}>
                {/* live badge */}
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  style={{
                  display:"inline-flex", alignItems:"center", gap:7,
                  background:"rgba(255,107,53,0.1)", border:"1px solid rgba(255,107,53,0.22)",
                  borderRadius:20, padding:"5px 16px", marginBottom:28, pointerEvents:"auto",
                  backdropFilter:"blur(8px)",
                  boxShadow:"0 4px 16px rgba(255,107,53,0.1)",
                }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#ff6b35",
                    boxShadow:"0 0 8px #ff6b35, 0 0 16px rgba(255,107,53,0.3)", animation:"blink 1.5s ease-in-out infinite", display:"inline-block" }} />
                  <span style={{ fontSize:12,fontWeight:700,color:"#ff9966",letterSpacing:"0.1em",textTransform:"uppercase" }}>
                    Multi-Agent AI · 7 Nodes · Live
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  style={{
                  fontSize:"clamp(40px,6.5vw,80px)", fontWeight:900, color:"white",
                  lineHeight:1.06, letterSpacing:"-0.035em", textAlign:"center",
                  maxWidth:860
                }}>
                  Your AI Investment
                  <br />
                  <span style={{
                    background:"linear-gradient(135deg,#ff6b35 0%,#ffd166 45%,#06d6a0 100%)",
                    backgroundSize:"200% 200%",
                    animation:"gradientShift 4s ease infinite",
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>Research Analyst</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                  style={{
                  marginTop:22, fontSize:18, color:"#9ca3af",
                  maxWidth:520, textAlign:"center", lineHeight:1.65
                }}>
                  Enter any public company. 7 specialist AI agents research it and deliver an{" "}
                  <strong style={{color:"white"}}>INVEST / PASS</strong> verdict in under 60 seconds.
                </motion.p>
              </div>

              {/* floating cards – left */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.6 }}
                style={{ position:"absolute", left:"4%", top:"28%", animation:"floatY 5s ease-in-out infinite", zIndex: 5 }}
              >
                <FloatingVerdictCards />
              </motion.div>

              {/* analyst workspace – right (desktop only) */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.7 }}
                style={{ position:"absolute", right:"5%", top:"30%", animation:"floatY 4s ease-in-out infinite reverse", zIndex: 5 }}
                className="show-desktop"
              >
                <AnalystWorkspace />
              </motion.div>

              {/* scroll cue */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                animation:"floatY 2.5s ease-in-out infinite", zIndex: 10 }}
              >
                <span style={{ fontSize:10, color:"#374151", letterSpacing:"0.1em", textTransform:"uppercase" }}>scroll</span>
                <div style={{ width:1,height:32, background:"linear-gradient(to bottom,#374151,transparent)" }} />
              </motion.div>
            </div>

            {/* ── TICKER TAPE ───────────────────────────────────────── */}
            <TickerTape />

            {/* ── Glow divider ────────────────────────────────────────── */}
            <GlowDivider />

            {/* ── SEARCH SECTION ────────────────────────────────────── */}
            <div style={{
              padding:"88px 24px 72px",
              background:"#0d0d18",
              position:"relative", overflow:"hidden",
            }}>
              {/* Subtle ambient glow */}
              <div style={{
                position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)",
                width:600, height:600, borderRadius:"50%",
                background:"radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)",
                pointerEvents:"none",
              }} />

              <RevealOnScroll direction="up">
                <div style={{ textAlign:"center", marginBottom:40 }}>
                  <div style={{ fontSize:11, color:"#ff6b35", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>
                    AI Research Terminal
                  </div>
                  <h2 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:900, color:"white", letterSpacing:"-0.025em" }}>
                    What should we analyze today?
                  </h2>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="scale" delay={0.1}>
                <div style={{ maxWidth:700, margin:"0 auto" }}>
                  <SearchTerminal />
                </div>
              </RevealOnScroll>
            </div>

            <GlowDivider />

            {/* ── BATTLE MODE + HISTORY ──────────────────────────────── */}
            <div style={{ padding:"72px 24px 80px", background:"#0d0d18", position:"relative", overflow:"hidden" }}>
              <div style={{
                position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                width:700, height:700, borderRadius:"50%",
                background:"radial-gradient(circle, rgba(255,107,53,0.03) 0%, transparent 70%)",
                pointerEvents:"none",
              }} />

              <div style={{ maxWidth:1100, margin:"0 auto" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
                  <RevealOnScroll direction="left">
                    <div>
                      <div style={{ fontSize:11, color:"#ff6b35", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Bonus Feature</div>
                      <h3 style={{ fontSize:26, fontWeight:900, color:"white", marginBottom:20 }}>⚔️ Battle Mode</h3>
                      <BattleMode />
                    </div>
                  </RevealOnScroll>
                  <RevealOnScroll direction="right">
                    <div>
                      <div style={{ fontSize:11, color:"#00d1b2", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Saved Reports</div>
                      <h3 style={{ fontSize:26, fontWeight:900, color:"white", marginBottom:20 }}>📋 History</h3>
                      <ReportHistory />
                    </div>
                  </RevealOnScroll>
                </div>
              </div>
            </div>

            <GlowDivider />

            {/* ── FEATURE GRID ────────────────────────────────────────── */}
            <div style={{ padding:"80px 24px 96px", background:"#0a0a0f", position:"relative", overflow:"hidden" }}>
              <div style={{
                position:"absolute", top:"-10%", left:"30%", width:500, height:500,
                borderRadius:"50%", background:"radial-gradient(circle, rgba(0,209,178,0.03) 0%, transparent 70%)",
                pointerEvents:"none",
              }} />

              <div style={{ maxWidth:1000, margin:"0 auto" }}>
                <RevealOnScroll direction="up">
                  <h2 style={{ fontSize:"clamp(26px,3.5vw,42px)", fontWeight:900, color:"white", textAlign:"center", marginBottom:52, letterSpacing:"-0.025em" }}>
                    Built like a{" "}
                    <span style={{
                      background:"linear-gradient(135deg,#00d1b2,#06d6a0)",
                      backgroundSize:"200% 200%",
                      animation:"gradientShift 3s ease infinite",
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    }}>
                      real product
                    </span>
                  </h2>
                </RevealOnScroll>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18 }}>
                  {[
                    { icon:"📈", label:"Live Agent Visualization",  desc:"Pipeline nodes light up in real time as each agent completes", color:"#ff6b35" },
                    { icon:"⚡", label:"SSE Streaming",             desc:"Results stream back node-by-node — no waiting, full transparency", color:"#00d1b2" },
                    { icon:"🗄️", label:"Supabase Persistence",      desc:"Every report saved to PostgreSQL — track sentiment over time", color:"#ffd166" },
                    { icon:"⚖️", label:"Why Not Invest?",           desc:"Bull AND bear case every time — both sides, equally weighted", color:"#06d6a0" },
                    { icon:"⚔️",  label:"Battle Mode",              desc:"Head-to-head comparison of any two companies in seconds", color:"#ef476f" },
                    { icon:"💯", label:"Confidence Scoring",        desc:"0–100 score with time horizon, target price, and analyst note", color:"#a78bfa" },
                  ].map((f,i) => (
                    <RevealOnScroll key={f.label} direction="up" delay={i*0.06}>
                      <div
                        style={{
                          background:"rgba(255,255,255,0.03)",
                          border:"1px solid rgba(255,255,255,0.06)",
                          borderRadius:18, padding:"24px 22px",
                          transition:"all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                          cursor:"default", position:"relative", overflow:"hidden",
                        }}
                        onMouseEnter={e=>{
                          const d=e.currentTarget as HTMLDivElement;
                          d.style.transform="translateY(-5px) scale(1.01)";
                          d.style.borderColor=`${f.color}40`;
                          d.style.boxShadow=`0 16px 40px rgba(0,0,0,0.35), 0 0 20px ${f.color}10`;
                        }}
                        onMouseLeave={e=>{
                          const d=e.currentTarget as HTMLDivElement;
                          d.style.transform="translateY(0) scale(1)";
                          d.style.borderColor="rgba(255,255,255,0.06)";
                          d.style.boxShadow="none";
                        }}
                      >
                        <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                        <div style={{ fontSize:15, fontWeight:700, color:"white", marginBottom:6 }}>{f.label}</div>
                        <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>{f.desc}</div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </div>

            {/* ── NEW SECTIONS ────────────────────────────────────────── */}
            <MoreFeatures />
            <Testimonials />
            <FAQ />

            {/* ── FOOTER ────────────────────────────────────────────── */}
            <GlowDivider />
            <footer style={{ padding:"32px 24px", background:"#0a0a0f", textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
                <div style={{
                  width:24,height:24,borderRadius:6,
                  background:"linear-gradient(135deg,#ff6b35,#ffd166)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,
                  boxShadow:"0 0 8px rgba(255,107,53,0.25)",
                }}>📈</div>
                <span style={{ fontSize:16, fontWeight:800, color:"white" }}>Investra</span>
              </div>
              <div style={{ fontSize:12, color:"#374151" }}>
                Built with LangGraph · Next.js · Supabase · Three.js · Framer Motion · Not financial advice
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink   { 0%,100%{opacity:1}  50%{opacity:0.3} }
        @keyframes floatY  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @media (min-width:1100px) { .show-desktop { display:block !important; } }
      `}</style>
    </div>
  );
}
