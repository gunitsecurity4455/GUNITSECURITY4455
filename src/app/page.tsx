export default function HomePage() {
  return (
    <main className="flex-1 grid-bg flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-red-bright tracking-[4px] text-sm font-medium">
          G UNIT SECURITY — PHASE 1
        </p>
        <h1 className="font-display text-6xl md:text-8xl tracking-wider">
          <span className="brand-gradient-text">Scaffolding</span> Ready
        </h1>
        <p className="text-gray-mid font-serif italic text-xl">
          Next.js 16 · Tailwind v4 · Prisma + SQLite · NextAuth — all wired up.
        </p>
        <p className="text-off-white/70 text-sm">
          Pages, admin UI, and public site come in later phases.
        </p>
      </div>
    </main>
  );
}
