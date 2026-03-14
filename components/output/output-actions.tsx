type OutputActionsProps = {
  htmlSizeKb: string;
  copied: boolean;
  isMinifying: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onMinify: () => void;
};

export function OutputActions({
  htmlSizeKb,
  copied,
  isMinifying,
  onCopy,
  onDownload,
  onMinify,
}: OutputActionsProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#4f46e5)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition hover:brightness-105"
        >
          {copied ? "Copied!" : "Copy HTML"}
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          Download HTML
        </button>

        <button
          type="button"
          onClick={onMinify}
          disabled={isMinifying}
          className="inline-flex items-center rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isMinifying ? "Minifying..." : "Minify HTML"}
        </button>
      </div>

      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
        HTML Size: {htmlSizeKb}
      </div>
    </div>
  );
}
