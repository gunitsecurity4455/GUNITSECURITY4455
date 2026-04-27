import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { QuoteCalculator } from "@/components/forms/QuoteCalculator";

export function QuoteSection() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <Reveal className="text-center mb-12 space-y-5">
          <div className="inline-flex items-center gap-2 bg-gold-accent/10 border border-gold-accent/30 text-gold-bright text-[10px] tracking-[5px] font-medium px-5 py-2 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            AI-ASSISTED ESTIMATE
          </div>
          <h2 className="font-display text-5xl sm:text-6xl tracking-wider">
            Build Your <span className="brand-gradient-text">Quote</span>
          </h2>
          <p className="font-serif italic text-lg text-off-white/65">
            Slide, pick, see the number. Indicative only — a tailored quote follows the brief.
          </p>
        </Reveal>

        <Reveal>
          <QuoteCalculator />
        </Reveal>
      </div>
    </section>
  );
}
