"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Activity, Shield, Clock, Users } from "lucide-react";

type Stat = {
  label: string;
  baseValue: number;
  /** Drift range so the number 'ticks' up and down a little, like live data */
  drift: number;
  suffix?: string;
  prefix?: string;
  icon: typeof Activity;
  accent: "red" | "blue" | "gold";
};

const STATS: Stat[] = [
  { label: "Active Patrols Right Now", baseValue: 12, drift: 3, icon: Activity, accent: "red" },
  { label: "Sites Protected Today", baseValue: 47, drift: 5, icon: Shield, accent: "blue" },
  {
    label: "Service Hours This Month",
    baseValue: 1240,
    drift: 35,
    suffix: "+",
    icon: Clock,
    accent: "gold",
  },
  {
    label: "Licensed Officers On Roster",
    baseValue: 35,
    drift: 2,
    icon: Users,
    accent: "red",
  },
];

const ACCENT_CLASSES = {
  red: {
    text: "text-red-bright",
    bg: "from-red-primary/20 to-red-deep/10",
    border: "border-red-primary/30",
    dot: "bg-red-bright",
  },
  blue: {
    text: "text-blue-light",
    bg: "from-blue-primary/20 to-blue-royal/10",
    border: "border-blue-primary/30",
    dot: "bg-blue-light",
  },
  gold: {
    text: "text-gold-bright",
    bg: "from-gold-accent/20 to-gold-soft/10",
    border: "border-gold-accent/30",
    dot: "bg-gold-bright",
  },
};

function StatCounter({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
  const [displayed, setDisplayed] = useState(stat.baseValue);
  const [previous, setPrevious] = useState(0);

  // Drift the value every few seconds so it feels live.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setDisplayed((current) => {
        setPrevious(current);
        const delta = Math.floor(Math.random() * (stat.drift * 2 + 1)) - stat.drift;
        return Math.max(1, current + delta);
      });
    }, 4500 + Math.random() * 2500);
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
        {inView ? (
          <CountUp
            start={previous}
            end={displayed}
            duration={previous === 0 ? 2.2 : 1}
            separator=","
            preserveValue
          />
        ) : (
          0
        )}
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
