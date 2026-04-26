"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@prisma/client";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index];

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden grid-bg">
      {/* Background image — admin-set per slide */}
      {current?.imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`bg-${current.id}`}
            src={current.imageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-50 animate-[fade-up_0.8s_ease]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/55 to-navy-deep pointer-events-none" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-red-primary/10 via-transparent to-blue-primary/10 pointer-events-none" />

      {/* Rotating shield background */}
      <svg
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 pointer-events-none animate-[spin_120s_linear_infinite]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8102e" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <path
          d="M100 20 L170 50 L170 110 Q170 160 100 180 Q30 160 30 110 L30 50 Z"
          fill="none"
          stroke="url(#heroShieldGrad)"
          strokeWidth="1"
        />
        <path
          d="M100 30 L160 55 L160 110 Q160 155 100 170 Q40 155 40 110 L40 55 Z"
          fill="none"
          stroke="url(#heroShieldGrad)"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M100 40 L150 60 L150 110 Q150 150 100 160 Q50 150 50 110 L50 60 Z"
          fill="none"
          stroke="url(#heroShieldGrad)"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-red-primary/10 border border-red-primary/30 text-red-bright text-[11px] tracking-[3px] font-medium px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-bright animate-pulse" />
            LICENSED · WESTERN AUSTRALIA · SINCE 2024
          </div>

          <h1 key={current?.id} className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-wider animate-[fade-up_0.8s_ease]">
            {current?.headline ?? "Protecting What Matters Most"}
          </h1>

          <p className="font-serif italic text-2xl text-off-white/75 max-w-2xl leading-relaxed">
            {current?.subheadline ?? "Perth's Premier Security Partner."}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {current?.ctaText && current?.ctaLink && (
              <Link
                href={current.ctaLink}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-primary to-red-deep hover:from-red-bright hover:to-red-primary text-white text-xs tracking-[3px] uppercase font-medium px-7 py-4 rounded-lg transition shadow-[0_20px_50px_-15px_rgba(200,16,46,0.6)]"
              >
                {current.ctaText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            )}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-off-white/20 hover:border-off-white/50 text-off-white text-xs tracking-[3px] uppercase font-medium px-7 py-4 rounded-lg transition"
            >
              Explore Services
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-navy-light">
            {[
              { value: "Since 2024", label: "Established WA" },
              { value: "8", label: "Specialised Services" },
              { value: "24/7", label: "Communication" },
              { value: "100%", label: "Licensed Officers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl sm:text-5xl tracking-wider brand-gradient-text">
                  {stat.value}
                </p>
                <p className="text-xs tracking-[2px] text-gray-mid mt-1 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-10 bg-red-bright" : "w-4 bg-off-white/20 hover:bg-off-white/40"
              }`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
