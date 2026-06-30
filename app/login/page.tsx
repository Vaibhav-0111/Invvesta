"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { isFirebaseReady } from "@/lib/firebase";

export default function LoginPage() {
  const { signIn, signOut, user, isAuthenticated, isLoading, hydrated } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // Only redirect after hydration so server and client start identical
  useEffect(() => {
    if (hydrated && isAuthenticated && !isLoading) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    }
  }, [hydrated, isAuthenticated, isLoading]);

  const handleGoogleSignIn = async () => {
    if (!isFirebaseReady) {
      setErrorMsg(
        "Firebase is not configured yet. Open your .env file and fill in the NEXT_PUBLIC_FIREBASE_* variables from your Firebase console."
      );
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await signIn();
      // AuthContext will update; useEffect above will redirect
    } catch (err: any) {
      const msg = err?.code === "auth/popup-closed-by-user"
        ? "Sign-in popup was closed. Try again."
        : err?.message ?? "Sign-in failed. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setStatus("idle");
    setErrorMsg("");
  };

  /* ── already logged in ─────────────────────────────────────── */
  if (isAuthenticated && user) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,214,160,0.3)",
          borderRadius: 20, padding: "40px 48px", textAlign: "center", maxWidth: 400,
          boxShadow: "0 0 40px rgba(6,214,160,0.08)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f9fafb", marginBottom: 6 }}>
            Signed in!
          </div>
          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
            Welcome back, <strong style={{ color: "#06d6a0" }}>{user.displayName ?? user.email}</strong>
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
            {redirecting ? "Redirecting to home…" : ""}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <a href="/" style={{
              padding: "10px 22px", background: "linear-gradient(135deg,#ff6b35,#ffd166)",
              color: "#0a0a0f", borderRadius: 10, fontWeight: 700, fontSize: 14,
              textDecoration: "none",
            }}>Go to Home →</a>
            <button onClick={handleSignOut} style={{
              padding: "10px 18px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              color: "#9ca3af", fontSize: 14, cursor: "pointer", fontWeight: 600,
            }}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── sign in form ──────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#f9fafb",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>

      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "-10%", left: "10%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-5%", right: "5%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(0,209,178,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Back link */}
      <a href="/" style={{
        position: "absolute", top: 24, left: 28,
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 13, color: "#6b7280", textDecoration: "none",
        transition: "color 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "#f9fafb")}
        onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
      >
        ← Back to Investra
      </a>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 24, padding: "40px 36px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        position: "relative", zIndex: 1,
        animation: "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#ff6b35,#ffd166)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            boxShadow: "0 0 16px rgba(255,107,53,0.35)",
            animation: "breathe 3s ease-in-out infinite",
          }}>📈</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>Investra</div>
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: "0.08em" }}>AI INVESTMENT RESEARCH</div>
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 6 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 32, lineHeight: 1.5 }}>
          Sign in to save reports, track history, and access your research archive.
        </p>

        {/* Error alert */}
        {status === "error" && errorMsg && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: "rgba(239,71,111,0.1)", border: "1px solid rgba(239,71,111,0.25)",
            borderRadius: 10, fontSize: 13, color: "#ef476f", lineHeight: 1.5,
            animation: "slideUp 0.3s ease both",
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Firebase not configured warning */}
        {!isFirebaseReady && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: "rgba(255,209,102,0.08)", border: "1px solid rgba(255,209,102,0.2)",
            borderRadius: 10, fontSize: 12, color: "#ffd166", lineHeight: 1.6,
          }}>
            ⚙️ <strong>Firebase not configured.</strong> To enable Google Sign-In, open{" "}
            <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>.env</code>{" "}
            and fill in the <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>NEXT_PUBLIC_FIREBASE_*</code> values from your{" "}
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#ffd166", textDecoration: "underline" }}>Firebase Console</a>.
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
          style={{
            width: "100%", padding: "14px 20px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            background: status === "loading" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer",
            color: status === "loading" ? "#6b7280" : "#f9fafb",
            transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => {
            if (status !== "loading") {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {status === "loading" ? (
            <>
              <span style={{ fontSize: 16, animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
              Signing in…
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "#4b5563" }}>or explore without signing in</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Guest continue */}
        <a href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "13px",
          background: "linear-gradient(135deg,#ff6b35,#ffd166)",
          color: "#0a0a0f", borderRadius: 12, fontSize: 14, fontWeight: 800,
          textDecoration: "none", transition: "all 0.25s ease",
          boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,53,0.45)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,107,53,0.3)";
          }}
        >
          📈 Start analysing companies →
        </a>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#374151", lineHeight: 1.6 }}>
          By continuing you agree to our Terms of Service &amp; Privacy Policy.
          <br />Reports are saved to Supabase when signed in.
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-2 1.4-4.4 2.2-6.9 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.6 5C9.5 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5c4.2-3.9 6.8-9.6 6.8-16 0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
