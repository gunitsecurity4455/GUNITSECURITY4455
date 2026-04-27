export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-red-bright animate-spin" />
        <p className="text-xs tracking-[4px] text-off-white/40 uppercase">Loading…</p>
      </div>
    </div>
  );
}
