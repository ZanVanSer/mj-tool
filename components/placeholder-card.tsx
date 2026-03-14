type PlaceholderCardProps = {
  title: string;
  description: string;
  compact?: boolean;
};

export function PlaceholderCard({
  title,
  description,
  compact = false,
}: PlaceholderCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_18px_60px_rgba(148,163,184,0.1)] backdrop-blur ${
        compact ? "min-h-[148px]" : "min-h-[220px]"
      }`}
    >
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
          Coming next
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
