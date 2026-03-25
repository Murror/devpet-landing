import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════
   CAT EMOJI + SMALL COMPONENTS
   ════════════════════════════════════════════ */
const CatEmoji = ({ size = 28, mood = "happy", glow = false }) => {
  const face = mood === "excited" ? "😸" : mood === "thinking" ? "😼" : mood === "worried" ? "🙀" : "😺";
  const anim = mood === "excited" ? "catBounce 0.5s" : mood === "thinking" ? "catTilt 2s" : "catFloat 2.5s";
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {glow && <div style={{ position: "absolute", width: size * 1.6, height: size * 1.6, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,203,119,0.12) 0%, transparent 70%)", animation: "catGlow 3s ease infinite" }} />}
      <span style={{ fontSize: size, display: "inline-block", animation: `${anim} ease infinite`, cursor: "pointer" }}>{face}</span>
    </div>
  );
};

const Ring = ({ value, max, size = 44, stroke = 4, color = "#6BCB77", children }) => {
  const r = (size - stroke) / 2, ci = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EBE8DF" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={ci} strokeDashoffset={ci - Math.min(value / max, 1) * ci}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

const Spark = ({ data, color = "#6BCB77", w = 120, h = 24 }) => {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / r) * (h - 4) - 2}`);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <path d={`M${pts.join(" L")} L${w},${h} L0,${h} Z`} fill={color} opacity="0.1" />
      <path d={`M${pts.join(" L")}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={parseFloat(pts[pts.length - 1].split(",")[0])} cy={parseFloat(pts[pts.length - 1].split(",")[1])} r="2" fill={color} />
    </svg>
  );
};

const BarChart = ({ data, color = "#6BCB77", height = 50, labels }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: height + 16 }}>
      {data.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <div style={{ width: "100%", maxWidth: 24, height: Math.max((v / max) * height, 2), background: i === data.length - 1 ? color : color + "66", borderRadius: 4 }} />
          {labels && <span style={{ fontSize: 8, fontFamily: "var(--m)", color: "#B0A898" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

const TypingDots = () => {
  const [f, setF] = useState(0);
  useEffect(() => { const iv = setInterval(() => setF(n => n + 1), 400); return () => clearInterval(iv); }, []);
  return <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8C0B4", opacity: (f % 3) === i ? 1 : 0.3, transition: "opacity 0.2s" }} />)}</div>;
};

/* ════════════════════════════════════════════
   ALL DATA
   ════════════════════════════════════════════ */
const TOOLS = [
  { name: "Cursor", icon: "⌨️", detail: "page.tsx", status: "active" },
  { name: "Ollama", icon: "🦙", detail: "llama3.3:8b", status: "bg" },
];
const FOCUS = [
  { icon: "📏", title: "Create .cursorrules", priority: "high", reason: "Corrected Cursor 6× this week" },
  { icon: "📄", title: "Write a README", priority: "high", reason: "No project description found" },
  { icon: "🎨", title: "Extract design tokens", priority: "med", reason: "4 border-radius values detected" },
];
const YESTERDAY_LESSONS = [
  { skill: "Context setting", icon: "🎯", summary: "Tell AI your tools before asking for code" },
  { skill: "Tool switching", icon: "🔄", summary: "Switch tools when stuck in a retry loop" },
];
const SESSIONS_DATA = [
  { id: 1, date: "Today", time: "2:00 PM", project: "Portfolio site", dur: "42m", prompts: 8, wins: 4, errors: 2, mood: "great", skills: ["Context setting", "Tool switching"], summary: "Built hero, grid, dark theme, contact form. Overcame 2 errors by adding context and switching tools.", lessons: ["Tell AI your CSS framework before styling", "Switch to Claude Code for complex form logic"] },
  { id: 2, date: "Yesterday", time: "10:30 AM", project: "Blog with MDX", dur: "1h 15m", prompts: 14, wins: 7, errors: 5, mood: "good", skills: ["Prompt clarity", "Error recovery"], summary: "Set up MDX blog with syntax highlighting. Multiple struggles with mdx-bundler config.", lessons: ["Always check package compatibility before prompting", "When config errors repeat, read docs instead of reprompting"] },
  { id: 3, date: "2 days ago", time: "3:15 PM", project: "API integration", dur: "28m", prompts: 5, wins: 3, errors: 1, mood: "great", skills: ["Scope management"], summary: "Connected Stripe API with checkout flow. Clean session with minimal errors.", lessons: ["Break API integration into: auth → endpoint → UI separately"] },
  { id: 4, date: "4 days ago", time: "11:00 AM", project: "Dashboard UI", dur: "55m", prompts: 11, wins: 5, errors: 4, mood: "okay", skills: ["Design consistency"], summary: "Built analytics dashboard but styling was inconsistent. Identified need for design tokens.", lessons: ["Create a tokens file before starting any UI work", "AI generates inconsistent styles without a single source of truth"] },
  { id: 5, date: "5 days ago", time: "9:00 AM", project: "Auth flow", dur: "1h 30m", prompts: 18, wins: 8, errors: 7, mood: "tough", skills: ["Error recovery", "Prompt clarity"], summary: "Auth was painful — lots of retry loops. Eventually got OAuth working.", lessons: ["Auth is complex — break into: login UI → OAuth config → callback → session", "Don't try to generate the entire auth flow in one prompt"] },
  { id: 6, date: "1 week ago", time: "2:00 PM", project: "Landing page", dur: "35m", prompts: 6, wins: 5, errors: 1, mood: "great", skills: ["Prompt clarity"], summary: "Clean session — hero, features, CTA, footer. Minimal errors.", lessons: ["Simple pages with clear structure produce the best AI output"] },
];
const SKILL_TIERS = [
  { tier: 1, name: "Foundations", color: "#6BCB77", unlocked: true, skills: [
    { id: "prompt-clarity", name: "Prompt Clarity", icon: "✏️", level: 3, max: 5, xp: 320, xpN: 500, status: "active", desc: "Write clear, specific prompts." },
    { id: "error-reading", name: "Error Reading", icon: "🔍", level: 2, max: 5, xp: 180, xpN: 300, status: "active", desc: "Understand error messages." },
    { id: "tool-basics", name: "Tool Basics", icon: "🛠️", level: 4, max: 5, xp: 450, xpN: 500, status: "active", desc: "Know your AI tools' features." },
    { id: "code-judgment", name: "Code Judgment", icon: "⚖️", level: 1, max: 5, xp: 80, xpN: 200, status: "active", desc: "Decide when to accept or reject." },
  ]},
  { tier: 2, name: "Context & Structure", color: "#D89840", unlocked: true, skills: [
    { id: "context-setting", name: "Context Setting", icon: "🎯", level: 2, max: 5, xp: 210, xpN: 300, status: "active", desc: "Set stack context before prompting." },
    { id: "rules-files", name: "AI Rules Files", icon: "📏", level: 0, max: 5, xp: 0, xpN: 100, status: "new", desc: "Create persistent AI instructions." },
    { id: "documentation", name: "Documentation", icon: "📄", level: 0, max: 5, xp: 0, xpN: 100, status: "new", desc: "Write READMEs and project docs." },
    { id: "file-structure", name: "Project Structure", icon: "📁", level: 1, max: 5, xp: 60, xpN: 200, status: "active", desc: "Organize files for AI navigation." },
  ]},
  { tier: 3, name: "Advanced", color: "#7B8CE0", unlocked: true, skills: [
    { id: "tool-switching", name: "Tool Switching", icon: "🔄", level: 2, max: 5, xp: 150, xpN: 300, status: "active", desc: "Switch tools strategically." },
    { id: "scope-mgmt", name: "Scope Mgmt", icon: "📦", level: 1, max: 5, xp: 90, xpN: 200, status: "active", desc: "Break features into small chunks." },
    { id: "design-system", name: "Design System", icon: "🎨", level: 1, max: 5, xp: 70, xpN: 200, status: "active", desc: "Maintain visual consistency." },
    { id: "iteration", name: "Prompt Iteration", icon: "🔁", level: 0, max: 5, xp: 0, xpN: 100, status: "locked", desc: "Refine prompts iteratively." },
  ]},
  { tier: 4, name: "Expert", color: "#C07AB8", unlocked: false, skills: [
    { id: "personas", name: "User Personas", icon: "🧩", level: 0, max: 5, xp: 0, xpN: 100, status: "locked", desc: "Define who you're building for." },
    { id: "context-windows", name: "Context Windows", icon: "🧠", level: 0, max: 5, xp: 0, xpN: 100, status: "locked", desc: "Manage AI context limits." },
    { id: "architecture", name: "AI Architecture", icon: "🏗️", level: 0, max: 5, xp: 0, xpN: 100, status: "locked", desc: "Design AI-friendly systems." },
    { id: "second-brain", name: "Second Brain", icon: "💡", level: 0, max: 5, xp: 0, xpN: 100, status: "locked", desc: "Build a living knowledge base." },
  ]},
];
const ERROR_PATTERNS = [
  { pattern: "Wrong CSS framework assumed", count: 6, trend: "improving", tip: "Now adding context 80% of the time" },
  { pattern: "Import path errors", count: 4, trend: "stable", tip: "Add path aliases to your rules file" },
  { pattern: "Retry loops (3+ attempts)", count: 3, trend: "improving", tip: "Switched tools 2× instead of looping" },
];
const WEEKLY_LESSONS = [
  { icon: "🎯", title: "Context eliminates your #1 error", body: "You added CSS framework context to 80% of styling prompts this week. Your 'wrong framework' errors dropped from 11 last week to 6. Keep going — the goal is 100%.", skill: "Context Setting", tag: "breakthrough" },
  { icon: "🔄", title: "Switching tools broke 2 stuck loops", body: "Twice this week you were stuck (3+ retries) and switched from Cursor to Claude Code. Both times you solved it in 1 prompt. The lesson: if 3 retries fail, the problem isn't your wording — it's the tool's approach.", skill: "Tool Switching", tag: "pattern" },
  { icon: "📦", title: "Complex prompts still trip you up", body: "Your 4 failed styling prompts all asked for 2+ visual changes at once. Your successful ones asked for 1 change each. This is Scope Management — the skill of making AI-sized asks.", skill: "Scope Management", tag: "growth-area" },
  { icon: "💰", title: "Claude Code costs more but saves time", body: "Claude Code cost $3.80 on Friday (vs $0.40 avg for Cursor). But it solved in 1 prompt what Cursor failed in 6. Cost-per-success was actually 50% lower. Sometimes the 'expensive' tool is cheaper.", skill: "Tool Selection", tag: "insight" },
];
const STREAK_DAYS = [1,1,1,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1];
const DAILY_LABELS = ["M","T","W","T","F","S","S"];
const ACHIEVEMENTS = [
  { icon: "🏗️", name: "First Build", desc: "Build succeeded on first try", date: "5 days ago", unlocked: true },
  { icon: "🧠", name: "Error Scholar", desc: "Learned from 5 different error types", date: "3 days ago", unlocked: true },
  { icon: "🔄", name: "Tool Switcher", desc: "Successfully switched tools to solve a problem", date: "Today", unlocked: true },
  { icon: "🔥", name: "Week Warrior", desc: "7-day coding streak", date: "Today", unlocked: true },
  { icon: "📏", name: "Rule Maker", desc: "Create your first .cursorrules file", date: null, unlocked: false },
  { icon: "📄", name: "Documentarian", desc: "Write a project README", date: null, unlocked: false },
  { icon: "🎨", name: "Design Thinker", desc: "Extract design tokens from a project", date: null, unlocked: false },
  { icon: "🚀", name: "Speed Builder", desc: "Complete a feature in under 15 minutes", date: null, unlocked: false },
];

/* ════════════════════════════════════════════
   CHAT
   ════════════════════════════════════════════ */
const CHAT_INIT = {
  home: [{ from: "cat", text: "Hey! You're working on portfolio-site. Cursor is active on page.tsx. How can I help?" }],
  sessions: [{ from: "cat", text: "Here are all your past sessions. You can tap any to see the full story and lessons. What are you looking for?" }],
  skills: [{ from: "cat", text: "Your strongest skills are Tool Basics (Lv 4) and Prompt Clarity (Lv 3). I'd suggest Rules Files next — it'll reduce your most common errors." }],
  insights: [{ from: "cat", text: "Great week! Your success rate hit 70% — up from 62%. The biggest driver was Context Setting. Want me to break down anything?" }],
  profile: [{ from: "cat", text: "You've unlocked 4 achievements so far! The next one — Rule Maker — is within reach. Just create a .cursorrules file." }],
};

/* ════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════ */
export default function VibeMon() {
  const [tab, setTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(true);
  const [msgs, setMsgs] = useState(CHAT_INIT.home);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [insightLessonOpen, setInsightLessonOpen] = useState(null);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  // Reset chat on tab change
  useEffect(() => {
    setMsgs(CHAT_INIT[tab] || CHAT_INIT.home);
    setSelectedSession(null);
    setSelectedSkill(null);
  }, [tab]);

  const send = () => {
    if (!input.trim()) return;
    const t = input.trim(); setInput("");
    setMsgs(p => [...p, { from: "user", text: t }]);
    setTimeout(() => setTyping(true), 400);
    setTimeout(() => { setTyping(false); setMsgs(p => [...p, { from: "cat", text: "Good question! Based on your project and session history, I'd give you specific advice here. Tell me more about what you're working on." }]); }, 1400);
  };

  const pc = { high: "#E06050", med: "#D89840", low: "#A09B8E" };
  const moodColor = m => m === "great" ? "#6BCB77" : m === "good" ? "#D89840" : m === "okay" ? "#A09B8E" : "#E06050";
  const NAV = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "sessions", icon: "📖", label: "Sessions" },
    { id: "skills", icon: "🌳", label: "Skills" },
    { id: "insights", icon: "📊", label: "Insights" },
  ];
  const lessonTag = { breakthrough: { bg: "#E8F5E9", c: "#2E7D32" }, pattern: { bg: "#E3F2FD", c: "#1565C0" }, "growth-area": { bg: "#FFF3E0", c: "#E65100" }, insight: { bg: "#F3E5F5", c: "#7B1FA2" } };

  return (
    <div style={{ fontFamily: "var(--b)", background: "#FBF9F1", height: "100vh", color: "#2D2B26", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Anybody:wght@400;500;600&family=Overpass+Mono:wght@400;500;600&display=swap');
        :root{--b:'Anybody',sans-serif;--d:'Fraunces',serif;--m:'Overpass Mono',monospace}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes msgIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes catFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes catBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.05)}}
        @keyframes catTilt{0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}
        @keyframes catGlow{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes blink{0%,90%,100%{opacity:1}95%{opacity:0}}
        @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(107,203,119,0.18)}50%{box-shadow:0 0 10px 2px rgba(107,203,119,0.1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes popIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}
      `}</style>

      {/* ═══ LEFT NAV ═══ */}
      <nav style={{ width: 72, background: "#fff", borderRight: "1px solid #EBE8DF", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", flexShrink: 0, gap: 2 }}>
        <div style={{ fontSize: 24, marginBottom: 16, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#F0FAF4", borderRadius: 12 }}>
          <CatEmoji size={22} />
        </div>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            background: tab === n.id ? "#F0FAF4" : "transparent", border: "none", borderRadius: 12, width: 56, padding: "10px 0",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative", transition: "all 0.15s",
          }}
            onMouseEnter={e => { if (tab !== n.id) e.currentTarget.style.background = "#FAFAF6"; }}
            onMouseLeave={e => { if (tab !== n.id) e.currentTarget.style.background = "transparent"; }}>
            {tab === n.id && <div style={{ position: "absolute", left: 0, top: "50%", marginTop: -10, width: 3, height: 20, borderRadius: "0 3px 3px 0", background: "#6BCB77" }} />}
            <span style={{ fontSize: 18, filter: tab === n.id ? "none" : "grayscale(0.6) opacity(0.5)" }}>{n.icon}</span>
            <span style={{ fontSize: 8, fontFamily: "var(--m)", color: tab === n.id ? "#2D2B26" : "#B0A898", fontWeight: tab === n.id ? 600 : 400 }}>{n.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setTab("profile")} style={{ background: tab === "profile" ? "#F0FAF4" : "transparent", border: "none", borderRadius: 12, width: 56, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative" }}>
          {tab === "profile" && <div style={{ position: "absolute", left: 0, top: "50%", marginTop: -10, width: 3, height: 20, borderRadius: "0 3px 3px 0", background: "#6BCB77" }} />}
          <span style={{ fontSize: 18, filter: tab === "profile" ? "none" : "grayscale(0.6) opacity(0.5)" }}>😺</span>
          <span style={{ fontSize: 8, fontFamily: "var(--m)", color: tab === "profile" ? "#2D2B26" : "#B0A898" }}>Profile</span>
        </button>
        <button onClick={() => setChatOpen(!chatOpen)} style={{ background: chatOpen ? "#F0FAF4" : "transparent", border: "none", borderRadius: 12, width: 56, padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", marginTop: 4 }}>
          <span style={{ fontSize: 18 }}>💬</span>
          <span style={{ fontSize: 8, fontFamily: "var(--m)", color: chatOpen ? "#2D2B26" : "#B0A898" }}>Chat</span>
        </button>
      </nav>

      {/* ═══ CENTER CONTENT ═══ */}
      <main key={tab} style={{ flex: 1, minWidth: 0, overflowY: "auto", height: "100vh" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "28px 28px 48px" }}>

          {/* ──── HOME ──── */}
          {tab === "home" && <>
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>◆ VibeMon</span>
              <h1 style={{ fontSize: 24, fontFamily: "var(--d)", fontWeight: 600, marginTop: 2 }}>Good afternoon!</h1>
            </div>
            <div style={{ marginTop: 18, background: "#F0FAF4", border: "1px solid #6BCB7733", borderRadius: 16, padding: "12px 16px", animation: "livePulse 3s ease infinite" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6BCB77", animation: "blink 2s infinite" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2E7D32" }}>Session in progress</span>
                </div>
                <span style={{ fontSize: 10, fontFamily: "var(--m)", color: "#6BCB77" }}>14m</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {TOOLS.map((t, i) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "#fff", borderRadius: 7, border: "1px solid #EBE8DF", fontSize: 10 }}>{t.icon} <strong>{t.name}</strong> <span style={{ color: "#A09B8E" }}>{t.detail}</span><span style={{ width: 4, height: 4, borderRadius: "50%", background: t.status === "active" ? "#6BCB77" : "#D89840" }} /></span>)}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🔥</span>
                <div><div style={{ fontSize: 22, fontFamily: "var(--m)", fontWeight: 700, lineHeight: 1 }}>7</div><div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#A09B8E", textTransform: "uppercase", marginTop: 2 }}>Day streak</div></div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <Ring value={2} max={3}><span style={{ fontSize: 11, fontFamily: "var(--m)", fontWeight: 700 }}>2/3</span></Ring>
                <div><div style={{ fontSize: 11, fontWeight: 600 }}>Daily goal</div><div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 2 }}>1 left</div></div>
              </div>
            </div>
            <div style={{ marginTop: 22 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Today's focus</h2>
              {FOCUS.map((f, i) => <div key={i} style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 12, padding: "10px 14px", marginBottom: 6, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{f.title}</span><span style={{ fontSize: 7, fontFamily: "var(--m)", fontWeight: 600, color: pc[f.priority], background: f.priority === "high" ? "#FEF0EE" : "#FFF8EE", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase" }}>{f.priority}</span></div><div style={{ fontSize: 10, color: "#A09B8E", marginTop: 2 }}>{f.reason}</div></div>
              </div>)}
            </div>
            <div style={{ marginTop: 22 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Yesterday you learned</h2>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 14, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: "linear-gradient(90deg,transparent,#6BCB77,transparent)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontSize: 18 }}>{YESTERDAY_LESSONS[lessonIdx].icon}</span><div><div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#6BCB77", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>{YESTERDAY_LESSONS[lessonIdx].skill}</div><div style={{ fontSize: 13, fontFamily: "var(--d)", fontWeight: 600 }}>{YESTERDAY_LESSONS[lessonIdx].summary}</div></div></div>
                <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }}>{YESTERDAY_LESSONS.map((_, i) => <button key={i} onClick={() => setLessonIdx(i)} style={{ width: i === lessonIdx ? 16 : 5, height: 5, borderRadius: 3, border: "none", background: i === lessonIdx ? "#6BCB77" : "#E0DDD6", cursor: "pointer" }} />)}</div>
              </div>
            </div>
          </>}

          {/* ──── SESSIONS ──── */}
          {tab === "sessions" && <>
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>◆ VibeMon</span>
              <h1 style={{ fontSize: 24, fontFamily: "var(--d)", fontWeight: 600, marginTop: 2 }}>Sessions</h1>
              <p style={{ fontSize: 12, color: "#A09B8E", marginTop: 4 }}>{SESSIONS_DATA.length} sessions · {SESSIONS_DATA.reduce((a, s) => a + s.prompts, 0)} prompts · {SESSIONS_DATA.reduce((a, s) => a + s.lessons.length, 0)} lessons learned</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
              {SESSIONS_DATA.map((s, i) => {
                const isOpen = selectedSession === s.id;
                return (
                  <div key={s.id} onClick={() => setSelectedSession(isOpen ? null : s.id)} style={{ background: "#fff", border: `1px solid ${isOpen ? moodColor(s.mood) + "44" : "#EBE8DF"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", animation: `fadeUp 0.4s ease ${i * 0.04}s both`, boxShadow: isOpen ? "0 3px 14px rgba(0,0,0,0.04)" : "none" }}>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div><div style={{ fontSize: 9, fontFamily: "var(--m)", color: "#A09B8E" }}>{s.date} · {s.time}</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{s.project}</div></div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: moodColor(s.mood) }} /><span style={{ fontSize: 9, fontFamily: "var(--m)", color: moodColor(s.mood) }}>{s.mood}</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 10, fontSize: 10, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 8 }}><span>⏱ {s.dur}</span><span>💬 {s.prompts}</span><span>✅ {s.wins}</span><span>🔴 {s.errors}</span></div>
                      <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>{s.skills.map((sk, j) => <span key={j} style={{ fontSize: 8, fontFamily: "var(--m)", color: "#6BCB77", background: "#E8F5E9", padding: "2px 7px", borderRadius: 5 }}>{sk}</span>)}</div>
                    </div>
                    {isOpen && (
                      <div style={{ borderTop: "1px solid #EBE8DF", animation: "popIn 0.2s ease" }}>
                        <div style={{ padding: "14px 16px", background: "#FAFAF6" }}>
                          <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#6BCB77", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Session summary</div>
                          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#555", margin: 0 }}>{s.summary}</p>
                        </div>
                        <div style={{ padding: "14px 16px", background: "#F8F4EA" }}>
                          <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#B8860B", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>📝 Lessons learned</div>
                          {s.lessons.map((l, j) => <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D89840", marginTop: 5, flexShrink: 0 }} /><span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{l}</span></div>)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>}

          {/* ──── SKILLS ──── */}
          {tab === "skills" && <>
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>◆ VibeMon</span>
              <h1 style={{ fontSize: 24, fontFamily: "var(--d)", fontWeight: 600, marginTop: 2 }}>Skill Tree</h1>
            </div>
            <div style={{ marginTop: 18, background: "#fff", border: "1px solid #EBE8DF", borderRadius: 18, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Ring value={1610} max={2500} size={52} stroke={5}><span style={{ fontSize: 16, fontFamily: "var(--m)", fontWeight: 700 }}>4</span></Ring>
                <div><div style={{ fontSize: 14, fontWeight: 600 }}>Level 4</div><div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 2 }}>1,610 / 2,500 XP</div></div>
              </div>
              <div style={{ height: 6, background: "#EBE8DF", borderRadius: 3, overflow: "hidden", marginTop: 12 }}><div style={{ height: "100%", width: "64%", background: "linear-gradient(90deg,#6BCB77,#4AA96C)", borderRadius: 3 }} /></div>
            </div>
            {SKILL_TIERS.map((tier, ti) => (
              <div key={tier.tier} style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: tier.color + "18", fontSize: 10, fontFamily: "var(--m)", fontWeight: 700, color: tier.color }}>{tier.tier}</div>
                  <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, color: tier.unlocked ? "#2D2B26" : "#B0A898" }}>{tier.name}</h2>
                  {!tier.unlocked && <span style={{ fontSize: 8, fontFamily: "var(--m)", color: "#B0A898", marginLeft: "auto" }}>🔒</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {tier.skills.map(sk => {
                    const isOpen = selectedSkill === sk.id;
                    return (
                      <div key={sk.id} onClick={() => setSelectedSkill(isOpen ? null : sk.id)} style={{
                        background: sk.status === "locked" ? "#F5F4F0" : sk.status === "new" ? "#FFF8EE" : "#F0FAF4",
                        border: `1px solid ${isOpen ? tier.color + "55" : sk.status === "locked" ? "#E0DDD6" : "#EBE8DF"}`,
                        borderRadius: 14, padding: "12px 14px", cursor: "pointer", opacity: sk.status === "locked" ? 0.5 : 1,
                        gridColumn: isOpen ? "1 / -1" : "auto",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 16 }}>{sk.icon}</span>
                            <div><div style={{ fontSize: 11, fontWeight: 600 }}>{sk.name}</div><div style={{ fontSize: 9, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 1 }}>Lv {sk.level}/{sk.max}</div></div>
                          </div>
                          {sk.status !== "locked" && <Ring value={sk.level} max={sk.max} size={28} stroke={2.5} color={tier.color}><span style={{ fontSize: 8, fontFamily: "var(--m)", fontWeight: 700, color: tier.color }}>{sk.level}</span></Ring>}
                        </div>
                        {sk.status !== "locked" && <div style={{ height: 3, background: "#E8E7E2", borderRadius: 2, marginTop: 8, overflow: "hidden" }}><div style={{ height: "100%", width: `${(sk.xp / sk.xpN) * 100}%`, background: tier.color, borderRadius: 2 }} /></div>}
                        {isOpen && <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #EBE8DF" }}><p style={{ fontSize: 11.5, lineHeight: 1.6, color: "#666", margin: 0 }}>{sk.desc}</p>{sk.status === "new" && <button style={{ marginTop: 10, background: tier.color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Start learning →</button>}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>}

          {/* ──── INSIGHTS ──── */}
          {tab === "insights" && <>
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>◆ VibeMon</span>
              <h1 style={{ fontSize: 24, fontFamily: "var(--d)", fontWeight: 600, marginTop: 2 }}>Insights</h1>
            </div>
            {/* AI Summary */}
            <div style={{ marginTop: 18, background: "#fff", border: "1px solid #EBE8DF", borderRadius: 18, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,transparent,#6BCB77,#D89840,transparent)", backgroundSize: "200% 100%", animation: "shimmer 4s linear infinite" }} />
              <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", fontWeight: 600, textTransform: "uppercase" }}>✦ Weekly summary</span>
              <h2 style={{ fontSize: 18, fontFamily: "var(--d)", fontWeight: 600, marginTop: 6, fontStyle: "italic" }}>Your best week yet</h2>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: "#666", margin: "8px 0 12px" }}>12 sessions, success rate up from 62% to 70%. The biggest driver was Context Setting — you went from never doing it to 80% of the time.</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FAF4", borderRadius: 8, padding: "5px 10px" }}><span>📈</span><span style={{ fontSize: 11, fontFamily: "var(--m)", fontWeight: 600, color: "#2E7D32" }}>62% → 70% success rate</span></div>
            </div>
            {/* Lessons this week */}
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Lessons this week</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {WEEKLY_LESSONS.map((l, i) => {
                  const isOpen = insightLessonOpen === i;
                  const t = lessonTag[l.tag] || lessonTag.insight;
                  return (
                    <div key={i} onClick={() => setInsightLessonOpen(isOpen ? null : i)} style={{ background: "#fff", border: `1px solid ${isOpen ? "#6BCB7744" : "#EBE8DF"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
                      <div style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 18, marginTop: 1 }}>{l.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 8, fontFamily: "var(--m)", fontWeight: 600, color: t.c, background: t.bg, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase" }}>{l.tag.replace("-", " ")}</span>
                            <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#A09B8E" }}>{l.skill}</span>
                          </div>
                          <h3 style={{ fontSize: 13, fontFamily: "var(--d)", fontWeight: 600, lineHeight: 1.35 }}>{l.title}</h3>
                        </div>
                        <span style={{ fontSize: 10, color: "#bbb", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                      </div>
                      {isOpen && <div style={{ padding: "0 14px 14px 42px" }}><p style={{ fontSize: 12, lineHeight: 1.65, color: "#666", margin: 0 }}>{l.body}</p></div>}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 20 }}>
              {[{ l: "Sessions", v: "12", i: "📖" }, { l: "Time", v: "8h 24m", i: "⏱" }, { l: "Success", v: "70%", i: "✅" }, { l: "Cost", v: "$14.20", i: "💰" }].map((s, i) => <div key={i} style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 14, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 14 }}>{s.i}</div><div style={{ fontSize: 16, fontFamily: "var(--m)", fontWeight: 700, marginTop: 3 }}>{s.v}</div><div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 2, textTransform: "uppercase" }}>{s.l}</div></div>)}
            </div>
            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#A09B8E", textTransform: "uppercase", marginBottom: 10 }}>Sessions / day</div>
                <BarChart data={[3,1,2,0,4,1,2]} labels={DAILY_LABELS} color="#6BCB77" />
              </div>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#A09B8E", textTransform: "uppercase", marginBottom: 10 }}>API cost / day</div>
                <BarChart data={[1.2,0.8,2.4,0,3.8,2.6,3.4]} labels={DAILY_LABELS} color="#D89840" />
              </div>
            </div>
            {/* Error patterns */}
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Error patterns</h2>
              {ERROR_PATTERNS.map((ep, i) => <div key={i} style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 12, padding: "10px 14px", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12 }}><strong>{ep.count}×</strong> {ep.pattern}</span><span style={{ fontSize: 8, fontFamily: "var(--m)", fontWeight: 600, color: ep.trend === "improving" ? "#6BCB77" : "#A09B8E", background: ep.trend === "improving" ? "#E8F5E9" : "#F5F5F2", padding: "2px 6px", borderRadius: 4 }}>{ep.trend === "improving" ? "↗" : "→"} {ep.trend}</span></div>
                <p style={{ fontSize: 10, color: "#888", marginTop: 4, fontStyle: "italic", fontFamily: "var(--d)" }}>💡 {ep.tip}</p>
              </div>)}
            </div>
            {/* Streak */}
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>28-day activity</h2>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                  {DAILY_LABELS.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 8, fontFamily: "var(--m)", color: "#B0A898", marginBottom: 3 }}>{d}</div>)}
                  {STREAK_DAYS.map((d, i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 4, background: d ? "#6BCB77" : "#F0EFEA", opacity: d ? 0.4 + (i / STREAK_DAYS.length) * 0.6 : 1 }} />)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, fontFamily: "var(--m)", color: "#A09B8E" }}><span>4 weeks ago</span><span>🔥 7-day streak</span><span>Today</span></div>
              </div>
            </div>
          </>}

          {/* ──── PROFILE ──── */}
          {tab === "profile" && <>
            <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center", paddingTop: 10 }}>
              <CatEmoji size={48} glow />
              <h1 style={{ fontSize: 24, fontFamily: "var(--d)", fontWeight: 600, marginTop: 12 }}>Your Profile</h1>
              <p style={{ fontSize: 12, color: "#A09B8E", marginTop: 4 }}>Vibe coder since 4 weeks ago</p>
            </div>
            {/* Level card */}
            <div style={{ marginTop: 20, background: "#fff", border: "1px solid #EBE8DF", borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <Ring value={1610} max={2500} size={56} stroke={5}><span style={{ fontSize: 18, fontFamily: "var(--m)", fontWeight: 700 }}>4</span></Ring>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Level 4 — Building Habits</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 2 }}>1,610 / 2,500 XP to Level 5</div>
                </div>
              </div>
              <div style={{ height: 6, background: "#EBE8DF", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: "64%", background: "linear-gradient(90deg,#6BCB77,#4AA96C)", borderRadius: 3 }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
                {[{ l: "Sessions", v: "24" }, { l: "Prompts", v: "186" }, { l: "Skills", v: "10/16" }, { l: "Streak", v: "7🔥" }].map((s, i) => <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontFamily: "var(--m)", fontWeight: 700 }}>{s.v}</div><div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#A09B8E", marginTop: 2, textTransform: "uppercase" }}>{s.l}</div></div>)}
              </div>
            </div>
            {/* Achievements */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Achievements</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} style={{ background: a.unlocked ? "#fff" : "#F5F4F0", border: "1px solid #EBE8DF", borderRadius: 14, padding: "12px 14px", opacity: a.unlocked ? 1 : 0.5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{a.icon}</span>
                      <div><div style={{ fontSize: 11, fontWeight: 600, color: a.unlocked ? "#2D2B26" : "#B0A898" }}>{a.name}</div><div style={{ fontSize: 9, color: "#A09B8E", marginTop: 1 }}>{a.desc}</div></div>
                    </div>
                    {a.date && <div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#6BCB77", marginTop: 6 }}>✓ Unlocked {a.date}</div>}
                    {!a.unlocked && <div style={{ fontSize: 8, fontFamily: "var(--m)", color: "#B0A898", marginTop: 6 }}>🔒 Not yet</div>}
                  </div>
                ))}
              </div>
            </div>
            {/* Settings */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 14, fontFamily: "var(--d)", fontWeight: 600, marginBottom: 10 }}>Settings</h2>
              <div style={{ background: "#fff", border: "1px solid #EBE8DF", borderRadius: 16, overflow: "hidden" }}>
                {["Daily session goal", "Notification preferences", "Connected tools", "Export my data", "About VibeMon"].map((s, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderBottom: i < 4 ? "1px solid #F0EFEA" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAF6"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <span style={{ fontSize: 12 }}>{s}</span>
                    <span style={{ fontSize: 10, color: "#C8C0B4" }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </>}
        </div>
      </main>

      {/* ═══ RIGHT CHAT ═══ */}
      {chatOpen && (
        <aside style={{ width: 340, borderLeft: "1px solid #EBE8DF", background: "#fff", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0, animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #EBE8DF", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <CatEmoji size={26} glow />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontFamily: "var(--d)", fontWeight: 600 }}>VibeMon</div>
              <div style={{ fontSize: 9, fontFamily: "var(--m)", color: "#6BCB77", display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#6BCB77" }} />
                {tab === "home" ? "Watching session" : tab === "sessions" ? "Session library" : tab === "skills" ? "Skills advisor" : tab === "insights" ? "Weekly analysis" : "Your profile"}
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "#F5F4F0", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, color: "#999" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", animation: "msgIn 0.25s ease" }}>
                {msg.from === "cat" && <span style={{ fontSize: 14, marginRight: 6, marginTop: 4, flexShrink: 0 }}>😺</span>}
                <div style={{ maxWidth: "82%", background: msg.from === "user" ? "#2D2B26" : "#F8F7F2", color: msg.from === "user" ? "#fff" : "#444", border: msg.from === "user" ? "none" : "1px solid #EBE8DF", borderRadius: msg.from === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", padding: "8px 12px" }}>
                  <p style={{ fontSize: 11.5, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line", fontFamily: msg.from === "cat" ? "var(--d)" : "var(--b)", fontStyle: msg.from === "cat" ? "italic" : "normal" }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {typing && <div style={{ display: "flex", animation: "msgIn 0.2s ease" }}><span style={{ fontSize: 14, marginRight: 6, marginTop: 4 }}>😺</span><div style={{ background: "#F8F7F2", border: "1px solid #EBE8DF", borderRadius: "14px 14px 14px 3px", padding: "8px 12px" }}><TypingDots /></div></div>}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: "8px 16px 12px", borderTop: "1px solid #EBE8DF", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 5, background: "#F8F7F2", borderRadius: 12, padding: "3px 3px 3px 12px", border: "1px solid #EBE8DF" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask your cat..."
                style={{ flex: 1, border: "none", background: "transparent", fontSize: 11.5, fontFamily: "var(--b)", color: "#2D2B26", padding: "7px 0", outline: "none" }} />
              <button onClick={send} style={{ background: input.trim() ? "#2D2B26" : "#E0DDD6", border: "none", borderRadius: 9, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 12 }}>↑</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
