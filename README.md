# Investra — AI Investment Research Agent

> Institutional-grade investment analysis powered by a multi-agent LangGraph pipeline.

## Overview
Investra takes a company name and runs it through a 7-node LangGraph research pipeline. It produces a comprehensive INVEST / PASS recommendation backed by real reasoning. It serves as an AI Investment Research Agent that researches a company and decides whether to invest or pass, providing its decision-making logic.

## How to run it
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy the example file and fill in your keys.
   ```bash
   cp .env.local.example .env.local
   ```
   **Required Keys (`.env.local`):**
   ```env
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
3. Set up the Database (Supabase):
   Run the SQL provided in `lib/supabase/schema.sql` in your Supabase SQL editor to create the necessary tables.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## How it works
**Approach & Architecture**
- **Frontend**: Built with Next.js 15, React, Zustand, and Recharts for a dynamic, interactive UI.
- **Backend/API**: Next.js App Router API routes (`/api/research`) handle Server-Sent Events (SSE) to stream live updates to the frontend.
- **AI Pipeline (LangGraph.js)**: The core intelligence is a 7-node pipeline.
  - *Nodes*: Company Research → Financial Analysis → News → Sentiment → Competitors → Risk → Decision
  - Instead of a single massive prompt, the system routes the company through specialized agents, gathering structured data at each step, culminating in a synthesized "Decision" node.
- **Database**: Supabase (PostgreSQL) is used to store past research reports and user data.
- **LLM**: Powered by LangChain.js and OpenAI models.

## Key decisions & trade-offs
- **LangGraph multi-node vs. Single Prompt**: We chose a specialized multi-agent graph approach because it provides deeper, more structured output. The trade-off is higher latency and complexity, but this is mitigated by streaming progress via SSE.
- **SSE Streaming vs. Polling/WebSockets**: Selected Server-Sent Events (SSE) for the research API to provide live, node-by-node updates. It's simpler than WebSockets and perfect for one-way streaming, preventing users from staring at a blank spinner.
- **GPT-4o-mini vs. GPT-4o**: We opted for `gpt-4o-mini` as the primary engine because it offers equivalent JSON extraction quality for this specific task while being significantly cheaper and faster, allowing for parallel node execution without hitting rate limits easily.
- **What was left out**: Deep real-time financial scraping (e.g., Edgar/SEC filings directly) was left out in favor of simulated/LLM-knowledge data due to time constraints and the complexity of robust financial data APIs (like Bloomberg/Yahoo Finance).

## Example runs
- **NVIDIA**: INVEST · 91% confidence · Score 87/100
  *(Reasoning highlights strong AI chip dominance and revenue growth, outweighing high valuation concerns.)*
- **Tesla**: PASS · 72% confidence · Score 44/100
  *(Reasoning highlights increasing competition in EV space, margin compression, and reliance on unproven FSD revenues.)*
- **Apple**: INVEST · 78% confidence · Score 68/100
  *(Reasoning points to massive cash reserves, services growth, and sticky ecosystem, despite slower hardware upgrade cycles.)*

## What you would improve with more time
1. **Real-time Financial Data API**: Integrate tools like Yahoo Finance, Alpha Vantage, or Polygon.io to pull live ticker data, P/E ratios, and SEC filings to ground the LLM's reasoning in real-time quantitative data.
2. **Portfolio Context**: Allow users to upload their current portfolio so the agent can recommend INVEST/PASS based on portfolio fit (e.g., risk tolerance, diversification) rather than in isolation.
3. **RAG Chat**: Add a "Chat with Report" feature so users can ask specific follow-up questions about the generated research.
4. **Enhanced UI**: Add a 3D animated hero section using React Three Fiber for a more premium institutional feel.
