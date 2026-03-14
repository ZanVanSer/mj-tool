import { PageIntro } from "@/components/page-intro";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <PageIntro
        title="Build faster email workflows from one workspace."
        description="A focused workspace for writing MJML, previewing output, and preparing production-ready emails."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/50 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
              MJML Editor
            </span>
            <span>utf-8</span>
          </div>
          <div className="grid min-h-[420px] grid-cols-[auto_1fr] overflow-hidden rounded-2xl border border-white/6 bg-slate-950/80">
            <div className="border-r border-white/6 bg-slate-950/80 px-4 py-5 font-mono text-sm leading-8 text-slate-600">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <pre className="overflow-hidden px-6 py-5 font-mono text-sm leading-8 text-slate-300">
              <code>{`<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Build responsive emails faster</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`}</code>
            </pre>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-500">
              <button className="rounded-full bg-white px-4 py-2 text-slate-950 shadow-sm">
                Desktop
              </button>
              <button className="rounded-full px-4 py-2">Mobile</button>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <button className="rounded-full border border-slate-200 p-2.5 transition hover:border-slate-300 hover:text-slate-700">
                <span className="sr-only">Light theme</span>
                ☼
              </button>
              <button className="rounded-full border border-slate-200 p-2.5 transition hover:border-slate-300 hover:text-slate-700">
                <span className="sr-only">Dark theme</span>
                ◐
              </button>
              <button className="rounded-full border border-slate-200 p-2.5 transition hover:border-slate-300 hover:text-slate-700">
                <span className="sr-only">Refresh preview</span>
                ↻
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#f3f6fb)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">
                To: preview@example.com · Subject: Weekly Product Update
              </div>
            </div>

            <div className="mx-auto flex min-h-[360px] max-w-[580px] items-center justify-center rounded-[28px] border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(148,163,184,0.18)]">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-500">
                  Preview Ready
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Preview polished email output side by side.
                </h2>
                <p className="mx-auto max-w-md text-sm leading-7 text-slate-500">
                  The workspace is set up to support conversion, analysis, and
                  export without cluttering the core editing flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
