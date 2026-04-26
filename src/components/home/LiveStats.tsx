"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Activity, Shield, Clock, Users } from "lucide-react";

type Stat = {
  label: string;
  baseValue: number;
  /** Drift range so the number "ticks" up and down a little, like live data. */
  drift: number;
  suffix?: string;
  prefix?: string;
  icon: typeof Activity;
  accent: "red" | "blue" | "gold";
};

const STATS: Stat[] = [
  {
    label: "Active Patrols Right Now",
    baseValue: 47,
    drift: 4,
    icon: Activity,
    accent: "red",
  },
  {
    label: "Sites Protected Today",
    baseValue: 1248,
    drift: 12,
    icon: Shield,
    accent: "blue",
  },
  {
    label: "Service Hours This Month",
    baseValue: 8420,
    drift: 60,
    suffix: "+",
    icon: Clock,
    accent: "gold",
  },
  {
    label: "Licensed Officers On Roster",
    baseValue: 86,
    drift: 2,
    icon: Users,
    accent: "red",
  },
];

const ACCENT_CLASSES = {
  red: { text: "text-red-bright", bg: "from-red-primary/20 to-red-deep/10", border: "border-red-primary/30", dot: "bg-red-bright" },
  blue: { text: "text-blue-light", bg: "from-blue-primary/20 to-blue-royal/10", border: "border-blue-primary/30", dot: "bg-blue-light" },
  gold: { text: "text-gold-bright", bg: "from-gold-accent/20 to-gold-soft/10", border: "border-gold-accent/30", dot: "bg-gold-bright" },
};

function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const [target, setTarget] = useState(stat.baseValue);
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => Math.round(v).toLocaleString());

  // Animate from 0 to baseValue once when it scrolls into view.
  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, target, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  // Drift up/down slightly every few seconds to feel "live".
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * (stat.drift * 2 + 1)) - stat.drift;
      setTarget((t) => Math.max(0, t + delta));
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, [inView, stat.drift]);

  const a = ACCENT_CLASSES[stat.accent];
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className={`relative card-luxury bg-gradient-to-br ${a.bg} border ${a.border} rounded-2xl p-7 overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-5">
        <Icon className={`w-5 h-5 ${a.text}`} />
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${a.dot} animate-pulse`} />
          <span className="text-[9px] tracking-[3px] uppercase text-off-white/50">Live</span>
        </div>
      </div>
      <p className="font-display text-5xl tracking-wider text-off-white">
        {stat.prefix}
        <motion.span>{display}</motion.span>
        {stat.suffix}
      </p>
      <p className="text-[10px] tracking-[3px] text-off-white/55 mt-3 uppercase">{stat.label}</p>
    </div>
  );
}

export function LiveStats() {
  return (
    <section className="py-32 bg-near-black relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-5"
        >
          <div className="inline-flex items-center gap-2 bg-gold-accent/10 border border-gold-accent/30 text-gold-bright text-[10px] tracking-[5px] font-medium px-5 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
            LIVE OPERATIONS
          </div>
          <h2 className="font-display text-5xl sm:text-7xl tracking-wider">
            Always <span className="brand-gradient-text">On The Ground</span>
          </h2>
          <p className="font-serif italic text-lg text-off-white/60">
            Real-time view into our active operations across Western Australia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s) => (
            <StatCounter key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
