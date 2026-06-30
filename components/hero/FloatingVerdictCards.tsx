"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CARDS = [
  { company: "NVIDIA", ticker: "NVDA", decision: "INVEST", score: 91, color: "#06d6a0" },
  { company: "Tesla", ticker: "TSLA", decision: "PASS", score: 44, color: "#ef476f" },
  { company: "Apple", ticker: "AAPL", decision: "INVEST", score: 78, color: "#06d6a0" },
];

export default function FloatingVerdictCards() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Staggered entrance
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.15, ease: "power3.out" }
      );
    });

    // Organic float
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.to(card, {
        y: Math.sin(i * 1.2) * 8,
        duration: 2.5 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7 + i * 0.6,
      });
    });
  }, []);

  return (
    <div style={{ position: "relative", width: 220, height: 280 }}>
      {CARDS.map((card, i) => (
        <div
          key={card.ticker}
          ref={(el) => { if (el) cardsRef.current[i] = el; }}
          style={{
            position: "absolute",
            top: i * 70,
            left: i * 8,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            border: `1.5px solid ${card.color}30`,
            borderRadius: 14,
            padding: "12px 16px",
            width: 200,
            boxShadow: `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${card.color}20, inset 0 1px 0 rgba(255,255,255,0.6)`,
            zIndex: CARDS.length - i,
            opacity: 0,
            cursor: "default",
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            const d = e.currentTarget;
            d.style.transform = "perspective(600px) rotateX(-3deg) rotateY(3deg) scale(1.04)";
            d.style.boxShadow = `0 16px 48px rgba(0,0,0,0.2), 0 0 0 1px ${card.color}40, 0 0 24px ${card.color}15`;
          }}
          onMouseLeave={(e) => {
            const d = e.currentTarget;
            d.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
            d.style.boxShadow = `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${card.color}20, inset 0 1px 0 rgba(255,255,255,0.6)`;
          }}
        >
          {/* Glassmorphism shimmer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              animation: `ctaShimmer ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{card.company}</div>
              <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{card.ticker}</div>
            </div>
            <div
              style={{
                background: card.decision === "INVEST" ? "#d1fae5" : "#fee2e2",
                color: card.decision === "INVEST" ? "#065f46" : "#991b1b",
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 9px",
                borderRadius: 6,
                letterSpacing: "0.06em",
              }}
            >
              {card.decision}
            </div>
          </div>
          <div style={{ marginTop: 8, height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                width: `${card.score}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
                borderRadius: 2,
                boxShadow: `0 0 8px ${card.color}40`,
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, position: "relative" }}>Score: {card.score}/100</div>
        </div>
      ))}
    </div>
  );
}
