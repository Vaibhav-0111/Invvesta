"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Check, Zap, Sparkles } from "lucide-react";

export default function PricingPage() {
  const { user, isAuthenticated, hydrated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      alert("Checkout error: " + err.message);
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f9fafb", paddingBottom: 100 }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 900, color: "#fff", textDecoration: "none", letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #ff6b35 0%, #ffd166 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, background: "#0a0a0f", borderRadius: 3 }} />
            </div>
            Investra
          </a>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Home</a>
            {isAuthenticated ? (
              <a href="/history" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>History</a>
            ) : (
              <a href="/login" style={{ color: "#f9fafb", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Sign In</a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", paddingTop: 80, paddingBottom: 60, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(0,209,178,0.1)", borderRadius: 20, color: "#00d1b2", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
          <Sparkles size={16} /> Unlock AI Research
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 16 }}>Invest smarter, not harder.</h1>
        <p style={{ fontSize: 18, color: "#9ca3af", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Get instant, institutional-grade AI analysis for any stock. Choose the plan that fits your investing journey.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "0 20px" }}>
        
        {/* Free Tier */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Starter</h2>
          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>Perfect for trying out the platform.</div>
          <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>$0 <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 500 }}>/mo</span></div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {["3 AI searches per month", "Basic financial charts", "News sentiment analysis", "Risk & Competitor insights"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#d1d5db" }}>
                <Check size={18} color="#00d1b2" /> {f}
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => window.location.href = "/"}
            style={{ width: "100%", padding: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f9fafb", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            Get Started Free
          </button>
        </div>

        {/* Pro Tier */}
        <div style={{ position: "relative", background: "linear-gradient(180deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.02) 100%)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 24, padding: 40, boxShadow: "0 24px 48px rgba(255,107,53,0.1)" }}>
          <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #ff6b35 0%, #ffd166 100%)", color: "#0a0a0f", fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>Most Popular</div>
          
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#ff6b35" }}>Pro Investor</h2>
          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>Everything you need for serious research.</div>
          <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>$19 <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 500 }}>/mo</span></div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {["Unlimited AI searches", "Interactive RAG Report Chat", "Professional PDF Exports", "Real-time Live Market Charts", "Priority AI processing"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 15, color: "#f9fafb" }}>
                <Zap size={18} color="#ff6b35" /> {f}
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => handleCheckout("price_pro")} // We will map this to a real stripe price ID
            disabled={loading}
            style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff6b35 0%, #ffd166 100%)", border: "none", borderRadius: 12, color: "#0a0a0f", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: "0 8px 24px rgba(255,107,53,0.3)" }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.transform = "translateY(0)" }}
          >
            {loading ? "Processing..." : "Upgrade to Pro"}
          </button>
        </div>

      </div>
    </div>
  );
}
