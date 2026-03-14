import Link from "next/link";

export function EmptyOutputState() {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-3 pt-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          HTML Output
        </h1>
        <p className="text-base leading-8 text-slate-600 sm:text-lg">
          No HTML found yet. Convert your MJML first, then return here to copy,
          download, or minify the generated output.
        </p>
      </div>

      <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
            Empty state
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            No HTML yet.
          </h2>
          <p className="text-sm leading-7 text-slate-500">
            Go back to the editor, refresh the preview to generate HTML, and
            then reopen this page.
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
