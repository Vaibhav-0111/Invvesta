"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useResearchStore } from "@/stores/useResearchStore";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "ai"; content: string };

export default function ReportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm the Investra AI. Ask me anything about this report." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useResearchStore();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!state?.companyData) return null; // Only show if we have a report

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          context: state
        })
      });

      if (!response.ok) throw new Error("Failed to connect");
      if (!response.body) throw new Error("No readable stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      setMessages(prev => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiContent;
          return newMessages;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 50,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #00d1b2 0%, #209cee 100%)",
          color: "white", border: "none", cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0, 209, 178, 0.4)",
          display: isOpen ? "none" : "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50,
          width: 380, height: 520, borderRadius: 16,
          background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(0,209,178,0.1), rgba(32,156,238,0.1))",
            padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d1b2", boxShadow: "0 0 8px #00d1b2" }} />
              <span style={{ fontWeight: 600, fontSize: 15, color: "#f9fafb" }}>Ask Investra AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer"
            }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.role === "user" ? "#ff6b35" : "rgba(255,255,255,0.05)",
                color: msg.role === "user" ? "#fff" : "#d1d5db",
                padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 14, lineHeight: 1.5,
              }}>
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{margin: 0}} {...props} />,
                    strong: ({node, ...props}) => <strong style={{color: msg.role === "user" ? "#fff" : "#00d1b2"}} {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: "flex-start", padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: "16px 16px 16px 4px" }}>
                <Loader2 size={16} className="animate-spin" color="#00d1b2" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: 16, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0d0d18"
          }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", gap: 8 }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about the analysis..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 24, padding: "10px 16px", color: "#f9fafb", fontSize: 14, outline: "none"
                }}
              />
              <button type="submit" disabled={!input.trim() || isTyping} style={{
                background: input.trim() ? "#00d1b2" : "rgba(255,255,255,0.1)",
                color: input.trim() ? "#fff" : "#9ca3af",
                border: "none", borderRadius: "50%", width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: input.trim() ? "pointer" : "not-allowed", transition: "all 0.2s ease"
              }}>
                <Send size={16} style={{ marginLeft: 2 }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
