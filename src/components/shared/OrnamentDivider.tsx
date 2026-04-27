/**
 * Thin gold-accent ornament used between major sections — a luxury-mag
 * style break that signals scene change without taking up real estate.
 */
export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <span className="h-px w-24 md:w-40 bg-gradient-to-r from-transparent to-gold-accent/60" />
      <span className="mx-5 text-gold-bright/80 text-xs tracking-[6px]" aria-hidden>
        ◆
      </span>
      <span className="h-px w-24 md:w-40 bg-gradient-to-l from-transparent to-gold-accent/60" />
    </div>
  );
}
