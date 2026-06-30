"use client";
import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import { ChevronDown, Star, Zap, Shield, TrendingUp } from "lucide-react";

/* ── Testimonials Section ───────────────────────────────────────── */
export function Testimonials() {
  const testimonials = [
    { name: "Sarah J.", role: "Retail Investor", content: "Investra's AI completely changed how I research stocks. It caught risks in my portfolio I never would have seen.", rating: 5 },
    { name: "Michael T.", role: "Day Trader", content: "The real-time sentiment analysis and competitor comparison saves me hours every week. Absolutely worth the Pro upgrade.", rating: 5 },
    { name: "Elena R.", role: "Financial Analyst", content: "I use the PDF exports for my client briefs. The institutional-grade analysis is spot on and beautifully presented.", rating: 5 }
  ];

  return (
    <div style={{ padding: "80px 20px", background: "linear-gradient(to bottom, #0a0a0f, #0d0d14)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f9fafb", letterSpacing: "-0.02em", marginBottom: 12 }}>Loved by investors worldwide</h2>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Don't just take our word for it.</p>
          </div>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32, height: "100%", display: "flex", flexDirection: "column",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} color="#ffd166" fill="#ffd166" />)}
                </div>
                <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.6, flex: 1, marginBottom: 24 }}>"{t.content}"</p>
                <div>
                  <div style={{ fontWeight: 700, color: "#f9fafb", fontSize: 15 }}>{t.name}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{t.role}</div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── More Features Section ──────────────────────────────────────── */
export function MoreFeatures() {
  const features = [
    { icon: <Zap color="#ff6b35" />, title: "Lightning Fast Analysis", desc: "Our 7-agent pipeline processes thousands of data points in under 60 seconds." },
    { icon: <Shield color="#00d1b2" />, title: "Institutional Grade Data", desc: "We pull from premium financial APIs to ensure accuracy and real-time relevance." },
    { icon: <TrendingUp color="#ffd166" />, title: "Live Market Charts", desc: "Visualize historical performance alongside AI recommendations." }
  ];

  return (
    <div style={{ padding: "80px 20px", background: "#0a0a0f" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f9fafb", letterSpacing: "-0.02em", marginBottom: 12 }}>Everything you need to trade smarter</h2>
            <p style={{ color: "#9ca3af", fontSize: 16 }}>We've packed Investra with features designed for the modern investor.</p>
          </div>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {features.map((f, i) => (
            <RevealOnScroll key={i}>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Section ────────────────────────────────────────────────── */
export function FAQ() {
  const faqs = [
    { q: "How accurate is the AI recommendation?", a: "Investra uses a multi-agent architecture (LangGraph) powered by top-tier models like Gemini 2.5 Flash. It cross-references financial statements, live news, and competitor data. However, it is not financial advice and should be used as a research tool." },
    { q: "What data sources do you use?", a: "We pull real-time data from premium financial APIs including Alpha Vantage for market data, and aggregate news from top financial outlets." },
    { q: "Is there a free trial?", a: "Yes! Your account comes with 3 free AI searches every month. You can upgrade to the Pro Tier for unlimited searches." },
    { q: "Can I export the reports?", a: "Yes, Pro users can download beautiful, paginated PDF exports of any analysis for offline viewing or sharing with clients." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div style={{ padding: "80px 20px", background: "linear-gradient(to top, #0a0a0f, #0d0d14)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f9fafb", letterSpacing: "-0.02em", marginBottom: 12 }}>Frequently Asked Questions</h2>
          </div>
        </RevealOnScroll>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <RevealOnScroll key={i}>
                <div 
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    background: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16, overflow: "hidden", cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: isOpen ? "#fff" : "#d1d5db", margin: 0 }}>{faq.q}</h3>
                    <ChevronDown size={20} color="#6b7280" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }} />
                  </div>
                  <div style={{
                    maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0,
                    transition: "all 0.3s ease", padding: isOpen ? "0 24px 20px" : "0 24px"
                  }}>
                    <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </div>
  );
}
