import Link from "next/link";

export function AnalysisEmptyState() {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-3 pt-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Email Quality Score
        </h1>
        <p className="text-base leading-8 text-slate-600 sm:text-lg">
          No HTML found yet. Generate HTML from the editor first, then come
          back here to run the analyzer.
        </p>
      </div>

      <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="max-w-xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            Nothing to analyze yet.
          </h2>
          <p className="text-sm leading-7 text-slate-500">
            Refresh the MJML preview first so we have generated HTML to inspect.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#2563eb,#4f46e5)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition hover:brightness-105"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    </section>
  );
}
