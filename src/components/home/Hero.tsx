"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "@prisma/client";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[index];

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden grid-bg">
      {/* Background image — slow Ken Burns zoom */}
      <AnimatePresence mode="wait">
        {current?.imageUrl && (
          <motion.div
            key={`bg-${current.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.imageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover object-[60%_30%] md:object-[70%_30%] opacity-60 ken-burns"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradients — left dim for text contrast, right reveals subject, vertical fade-out at bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-pure-black via-pure-black/85 md:via-pure-black/70 to-pure-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-deep pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-primary/8 via-transparent to-blue-primary/8 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-3xl space-y-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold-accent/10 border border-gold-accent/30 text-gold-bright text-[10px] tracking-[5px] font-medium px-5 py-2.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
            LICENSED · WESTERN AUSTRALIA · SINCE 2024
          </div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${current?.id}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04 } },
              }}
              className="font-display text-7xl sm:text-8xl lg:text-[8.5rem] leading-[0.92] tracking-wider uppercase"
            >
              {(current?.headline ?? "Protecting What Matters").split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
                  {word.split("").map((char, ci) => (
                    <motion.span
                      key={`${wi}-${ci}`}
                      variants={{
                        hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
                        show: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current?.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif italic text-2xl md:text-3xl text-off-white/75 max-w-2xl leading-relaxed"
            >
              {current?.subheadline ?? "Perth's Premier Security Partner."}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {current?.ctaText && current?.ctaLink && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={current.ctaLink}
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-red-primary via-red-deep to-red-primary bg-[length:200%_100%] hover:bg-right text-white text-xs tracking-[3px] uppercase font-medium px-9 py-4 rounded-lg transition-[background-position] duration-700 shadow-[0_25px_60px_-20px_rgba(200,16,46,0.8)]"
                >
                  {current.ctaText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-gold-accent/40 hover:border-gold-bright text-off-white text-xs tracking-[3px] uppercase font-medium px-9 py-4 rounded-lg transition"
              >
                Explore Services
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10">
            {[
              { value: "Since 2024", label: "Established WA" },
              { value: "8", label: "Specialised Services" },
              { value: "24/7", label: "Communication" },
              { value: "100%", label: "Licensed Officers" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
              >
                <p className="font-display text-4xl sm:text-5xl tracking-wider brand-gradient-text">
                  {stat.value}
                </p>
                <p className="text-[10px] tracking-[3px] text-off-white/50 mt-1.5 uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-[2px] rounded-full transition-all ${
                i === index ? "w-12 bg-gold-bright" : "w-5 bg-off-white/25 hover:bg-off-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="hidden md:flex absolute bottom-8 right-8 flex-col items-center gap-2 z-20 text-off-white/40"
      >
        <span className="text-[10px] tracking-[4px] uppercase rotate-90 origin-center mb-3">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
