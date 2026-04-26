"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string; ts: number };

// Smart keyword-driven responses. Looks AI-powered without spending a cent
// on a real LLM. We can swap this for an OpenAI/Claude call later by replacing
// the answer() function below.
const ANSWERS: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["service", "offer", "what do you", "what services"],
    reply:
      "We provide 8 specialised services:\n• Commercial Guarding\n• Healthcare Security\n• Retail, Warehousing & Logistics\n• Construction Site Security\n• Crowd Control & Events\n• Mobile Patrols & Alarm Response\n• CCTV Monitoring\n• VIP & Asset Protection",
  },
  {
    keywords: ["price", "cost", "quote", "how much", "rate", "charge"],
    reply:
      "Pricing depends on site type, hours, and number of officers. We can prepare a tailored quote within 24 hours — share your contact details on the Contact page or call 0490 331 894.",
  },
  {
    keywords: ["contact", "phone", "email", "address", "reach", "office"],
    reply:
      "📞 0490 331 894\n📧 dario.m@gunitsecurity.com.au\n📍 36 Brisbane Street, Perth WA 6000",
  },
  {
    keywords: ["hour", "open", "available", "24", "emergency"],
    reply:
      "Operations are 24/7 — emergency response any time of day or night. Office hours: Mon–Fri 9 AM – 5 PM.",
  },
  {
    keywords: ["license", "licensed", "insured", "insurance"],
    reply:
      "Yes — fully licensed by Western Australia. All officers are individually licensed, screened, and trained.",
  },
  {
    keywords: ["job", "career", "hiring", "apply", "work for", "employ"],
    reply:
      "We're always looking for disciplined, licensed professionals. Apply via the Careers page — upload your resume and we'll review within one business week.",
  },
  {
    keywords: ["cctv", "monitoring", "camera"],
    reply:
      "Our CCTV Monitoring Support provides real-time monitoring, incident reporting, and operational communication — backed by structured digital reporting.",
  },
  {
    keywords: ["event", "crowd", "venue", "concert", "function"],
    reply:
      "Event security is one of our specialities — licensed crowd-control officers, customer-focused approach, support for licensed venues, corporate functions, and community events.",
  },
  {
    keywords: ["construction", "building site"],
    reply:
      "Construction site security includes static guarding, mobile patrols, access control, and after-hours monitoring to reduce theft risk.",
  },
  {
    keywords: ["mobile", "patrol", "alarm"],
    reply:
      "Mobile patrols cover lock-up checks, infrastructure inspections, alarm response, perimeter checks, and incident reporting — flexible and cost-effective.",
  },
  {
    keywords: ["team", "who", "staff", "leader"],
    reply:
      "Our leadership: Dario (Director), Ali (Event Manager), Hardy (BD / Scheduling), Mandy (Operations), Aman (Rostering). See the Team page for full bios.",
  },
  {
    keywords: ["thanks", "thank you", "thank"],
    reply: "You're welcome 🙏 — anything else I can help with?",
  },
  {
    keywords: ["hi", "hello", "hey", "namaste"],
    reply:
      "Hi there 👋 I'm G-Unit's AI assistant. Ask me about services, pricing, contact details, jobs — anything.",
  },
];

const FALLBACK =
  "Thanks for your message. For a detailed answer please call 0490 331 894 or email dario.m@gunitsecurity.com.au — our team responds within 24 hours.";

function answer(input: string): string {
  const text = input.toLowerCase();
  for (const entry of ANSWERS) {
    if (entry.keywords.some((k) => text.includes(k))) return entry.reply;
  }
  return FALLBACK;
}

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How much does it cost?",
  "Can I get a quote?",
  "How do I contact you?",
];

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi 👋 I'm G-Unit's AI Assistant. How can I help you today?",
      ts: Date.now(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    // Tiny delay so it "thinks". Looks more human than instant replies.
    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: answer(trimmed), ts: Date.now() },
      ]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-primary via-red-deep to-red-primary bg-[length:200%_200%] hover:bg-right text-white shadow-[0_20px_60px_-15px_rgba(200,16,46,0.7)] border border-gold-accent/30 flex items-center justify-center transition-[background-position] duration-700"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-8rem))] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] border border-gold-accent/20 overflow-hidden flex flex-col bg-gradient-to-br from-navy-rich to-pure-black"
            role="dialog"
            aria-label="AI assistant"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-red-primary via-red-deep to-blue-primary flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-bright" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg tracking-wider text-white leading-none">
                  G-UNIT AI
                </p>
                <p className="text-[10px] tracking-[2px] uppercase text-white/70 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · 24/7
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-red-primary to-red-deep text-white rounded-2xl rounded-br-sm"
                        : "bg-white/5 border border-white/8 text-off-white/90 rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-off-white/60 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-off-white/60 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-off-white/60 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !typing && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] tracking-[2px] text-off-white/40 uppercase px-1">
                    Quick prompts
                  </p>
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-left text-xs text-off-white/85 bg-white/5 hover:bg-gold-accent/10 hover:border-gold-accent/30 border border-white/8 rounded-lg px-3 py-2.5 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/8 bg-pure-black/50">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !typing) send(input);
                  }}
                  placeholder="Ask anything…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-off-white placeholder:text-off-white/30 focus:outline-none focus:border-gold-accent/50 transition"
                />
                <button
                  onClick={() => send(input)}
                  disabled={typing || !input.trim()}
                  aria-label="Send"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-red-primary to-red-deep text-white flex items-center justify-center hover:from-red-bright hover:to-red-primary disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-off-white/30 text-center mt-2 tracking-wider">
                AI-powered · Replies suggested by G-Unit knowledge base
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
