type AnalysisStatCardProps = {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger";
  isLoading: boolean;
};

const TONE_STYLES = {
  neutral: "text-slate-950",
  success: "text-emerald-600",
  warning: "text-amber-500",
  danger: "text-rose-500",
} as const;

export function AnalysisStatCard({
  label,
  value,
  tone,
  isLoading,
}: AnalysisStatCardProps) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(148,163,184,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <p className={`text-4xl font-semibold tracking-tight ${TONE_STYLES[tone]}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
