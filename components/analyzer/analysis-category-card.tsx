"use client";

import { useState } from "react";

import type { AnalyzerCategory } from "@/types/analyzer";

type AnalysisCategoryCardProps = {
  category: AnalyzerCategory;
  expanded: boolean;
  onToggle: () => void;
};

const STATUS_STYLES = {
  pass: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-rose-100 text-rose-700",
} as const;

export function AnalysisCategoryCard({
  category,
  expanded,
  onToggle,
}: AnalysisCategoryCardProps) {
  const [expandedChecks, setExpandedChecks] = useState<string[]>([]);

  function toggleCheck(checkId: string) {
    setExpandedChecks((current) =>
      current.includes(checkId)
        ? current.filter((id) => id !== checkId)
        : [...current, checkId],
    );
  }

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(148,163,184,0.08)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-950">{category.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{category.summary}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              STATUS_STYLES[category.status]
            }`}
          >
            {category.status === "pass"
              ? "Passed"
              : category.status === "warning"
                ? "Action Required"
                : "Critical"}
          </span>
          <span className="text-slate-400">{expanded ? "⌃" : "⌄"}</span>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="space-y-4">
            {category.checks.map((check) => (
              <div
                key={check.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-2 h-2.5 w-2.5 rounded-full ${
                      check.status === "pass"
                        ? "bg-emerald-500"
                        : check.status === "warning"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  />
                  <div className="min-w-0 space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {check.name}
                      </p>
                      <p className="text-sm leading-6 text-slate-600">
                        {check.message}
                      </p>
                    </div>
                    {check.flagged?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {check.flagged.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {check.findings?.length ? (
                      <div className="space-y-3 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleCheck(check.id)}
                          className="text-sm font-medium text-sky-700 transition hover:text-sky-800"
                        >
                          {expandedChecks.includes(check.id)
                            ? `Hide ${check.findings.length} issue details`
                            : `Show ${check.findings.length} issue details`}
                        </button>

                        {expandedChecks.includes(check.id) ? (
                          <div className="space-y-3">
                            {check.findings.map((finding) => (
                              <div
                                key={finding.id}
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  <span>{finding.label ?? "Finding"}</span>
                                  {finding.line ? <span>Line {finding.line}</span> : null}
                                </div>
                                <pre className="overflow-x-auto rounded-xl bg-slate-950 px-3 py-3 font-mono text-xs leading-6 text-slate-200">
                                  <code>{finding.snippet}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
