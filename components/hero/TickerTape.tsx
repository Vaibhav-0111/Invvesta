"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TICKERS = [
  { sym: "NVDA", price: "134.26", chg: "+2.84", pct: "+2.16%", up: true },
  { sym: "AAPL", price: "211.45", chg: "-0.92", pct: "-0.43%", up: false },
  { sym: "TSLA", price: "248.71", chg: "+6.33", pct: "+2.61%", up: true },
  { sym: "MSFT", price: "422.08", chg: "+1.44", pct: "+0.34%", up: true },
  { sym: "AMZN", price: "198.54", chg: "-1.27", pct: "-0.64%", up: false },
  { sym: "GOOG", price: "181.93", chg: "+3.12", pct: "+1.75%", up: true },
  { sym: "META", price: "563.82", chg: "+8.91", pct: "+1.60%", up: true },
  { sym: "NFLX", price: "712.44", chg: "-4.18", pct: "-0.58%", up: false },
  { sym: "AMD",  price: "158.37", chg: "+4.22", pct: "+2.74%", up: true },
  { sym: "BRK",  price: "444.20", chg: "+0.88", pct: "+0.20%", up: true },
];

export default function TickerTape() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const totalW = el.scrollWidth / 2;

    tweenRef.current = gsap.fromTo(
      el,
      { x: 0 },
      {
        x: -totalW,
        duration: 42,
        ease: "none",
        repeat: -1,
      }
    );
    return () => { tweenRef.current?.kill(); };
  }, []);

  const items = [...TICKERS, ...TICKERS]; // duplicate for seamless loop

  return (
    <div
      style={{
        overflow: "hidden",
        background: "#111827",
        borderTop: "1px solid #1f2937",
        borderBottom: "1px solid #1f2937",
        padding: "10px 0",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Left edge fade */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 80, zIndex: 2,
        background: "linear-gradient(to right, #111827, transparent)",
        pointerEvents: "none",
      }} />
      {/* Right edge fade */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: 80, zIndex: 2,
        background: "linear-gradient(to left, #111827, transparent)",
        pointerEvents: "none",
      }} />

      <div ref={trackRef} style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}>
        {items.map((t, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 28px",
              borderRight: "1px solid #1f2937",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: "white", fontFamily: "monospace" }}>
              {t.sym}
            </span>
            <span style={{ fontSize: 13, color: "#9ca3af", fontFamily: "monospace" }}>
              ${t.price}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.up ? "#06d6a0" : "#ef476f",
                fontFamily: "monospace",
                textShadow: t.up
                  ? "0 0 8px rgba(6,214,160,0.4)"
                  : "0 0 8px rgba(239,71,111,0.4)",
              }}
            >
              {t.up ? "▲" : "▼"} {t.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
