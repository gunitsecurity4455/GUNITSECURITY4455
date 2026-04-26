"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

type ServiceKey =
  | "commercial"
  | "healthcare"
  | "retail"
  | "construction"
  | "event"
  | "patrol"
  | "cctv"
  | "vip";

const SERVICES: { value: ServiceKey; label: string; baseHourly: number }[] = [
  { value: "commercial", label: "Commercial Guarding", baseHourly: 42 },
  { value: "healthcare", label: "Healthcare Security", baseHourly: 46 },
  { value: "retail", label: "Retail / Warehousing", baseHourly: 40 },
  { value: "construction", label: "Construction Site", baseHourly: 44 },
  { value: "event", label: "Event / Crowd Control", baseHourly: 48 },
  { value: "patrol", label: "Mobile Patrols", baseHourly: 38 },
  { value: "cctv", label: "CCTV Monitoring", baseHourly: 36 },
  { value: "vip", label: "VIP / Asset Protection", baseHourly: 65 },
];

const SHIFT_OPTIONS = [
  { value: "day", label: "Day shift", multiplier: 1 },
  { value: "night", label: "Night shift", multiplier: 1.15 },
  { value: "247", label: "24/7 cover", multiplier: 1.25 },
];

const DURATION_OPTIONS = [
  { value: "oneoff", label: "One-off (per shift)", days: 1 },
  { value: "weekly", label: "Weekly contract", days: 7 },
  { value: "monthly", label: "Monthly contract", days: 30 },
];

export function QuoteCalculator() {
  const [service, setService] = useState<ServiceKey>("commercial");
  const [shift, setShift] = useState(SHIFT_OPTIONS[0].value);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1].value);
  const [hours, setHours] = useState(8);
  const [guards, setGuards] = useState(2);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdown = useMemo(() => {
    const baseHourly = SERVICES.find((s) => s.value === service)!.baseHourly;
    const shiftMult = SHIFT_OPTIONS.find((s) => s.value === shift)!.multiplier;
    const days = DURATION_OPTIONS.find((d) => d.value === duration)!.days;
    const perShift = baseHourly * hours * guards * shiftMult;
    const subtotal = perShift * days;
    // Volume discount on monthly
    const discount = duration === "monthly" ? 0.08 : duration === "weekly" ? 0.04 : 0;
    const discountedTotal = Math.round(subtotal * (1 - discount));
    return {
      baseHourly,
      shiftMult,
      days,
      perShift: Math.round(perShift),
      subtotal: Math.round(subtotal),
      discountPct: Math.round(discount * 100),
      total: discountedTotal,
    };
  }, [service, shift, duration, hours, guards]);

  const reset = () => {
    setService("commercial");
    setShift(SHIFT_OPTIONS[0].value);
    setDuration(DURATION_OPTIONS[1].value);
    setHours(8);
    setGuards(2);
  };

  return (
    <div className="card-luxury rounded-2xl p-7 md:p-9">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-gold-bright text-[10px] tracking-[4px] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Assisted Estimate
          </div>
          <h3 className="font-display text-3xl tracking-wider">
            Instant <span className="brand-gradient-text">Quote</span> Calculator
          </h3>
          <p className="font-serif italic text-sm text-off-white/60 mt-2">
            Indicative only. A tailored quote follows based on the site brief.
          </p>
        </div>
        <button
          onClick={reset}
          aria-label="Reset"
          className="text-off-white/40 hover:text-gold-bright transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Service">
          <select
            value={service}
            onChange={(e) => setService(e.target.value as ServiceKey)}
            className={selectClass}
          >
            {SERVICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Shift">
          <select value={shift} onChange={(e) => setShift(e.target.value)} className={selectClass}>
            {SHIFT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Duration">
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={selectClass}
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`Guards: ${guards}`}>
          <input
            type="range"
            min={1}
            max={10}
            value={guards}
            onChange={(e) => setGuards(Number(e.target.value))}
            className="w-full accent-red-bright"
          />
        </Field>

        <Field label={`Hours per shift: ${hours}`} className="md:col-span-2">
          <input
            type="range"
            min={2}
            max={24}
            step={2}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-red-bright"
          />
        </Field>
      </div>

      <div className="mt-7 p-6 rounded-xl bg-gradient-to-br from-pure-black via-navy-rich to-pure-black border border-gold-accent/20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] tracking-[3px] uppercase text-off-white/50">
              Estimated Total ({DURATION_OPTIONS.find((d) => d.value === duration)!.label})
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={breakdown.total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-display text-5xl md:text-6xl tracking-wider gold-gradient-text mt-2"
              >
                ${breakdown.total.toLocaleString()}
              </motion.p>
            </AnimatePresence>
            {breakdown.discountPct > 0 && (
              <p className="text-xs text-green-400 mt-2">
                Volume discount applied: {breakdown.discountPct}%
              </p>
            )}
          </div>
          <button
            onClick={() => setShowBreakdown((s) => !s)}
            className="text-xs tracking-widest uppercase text-off-white/60 hover:text-gold-bright transition"
          >
            {showBreakdown ? "Hide breakdown" : "Show breakdown"}
          </button>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 pt-5 border-t border-white/8 space-y-1.5 text-sm overflow-hidden"
            >
              <Row label="Base hourly rate" value={`$${breakdown.baseHourly}/hr per guard`} />
              <Row label="Shift multiplier" value={`× ${breakdown.shiftMult}`} />
              <Row label="Per-shift cost" value={`$${breakdown.perShift.toLocaleString()}`} />
              <Row label="Days in period" value={`× ${breakdown.days}`} />
              <Row label="Subtotal" value={`$${breakdown.subtotal.toLocaleString()}`} />
              {breakdown.discountPct > 0 && (
                <Row
                  label="Discount"
                  value={`− $${(breakdown.subtotal - breakdown.total).toLocaleString()}`}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <a
        href="/contact"
        className="mt-6 group inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-primary via-red-deep to-red-primary bg-[length:200%_100%] hover:bg-right text-white text-xs tracking-[3px] uppercase font-medium px-7 py-4 rounded-lg transition-[background-position] duration-700 shadow-[0_15px_50px_-15px_rgba(200,16,46,0.7)]"
      >
        <Calculator className="w-4 h-4" />
        Request Detailed Quote
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </a>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs tracking-widest text-off-white/60 mb-2 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-off-white/65">
      <span>{label}</span>
      <span className="text-off-white">{value}</span>
    </div>
  );
}

const selectClass =
  "w-full bg-pure-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-off-white focus:border-gold-accent/50 focus:outline-none transition";
