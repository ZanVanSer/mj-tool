"use client";

import { useEffect, useState } from "react";

import { AnalysisCategoryCard } from "@/components/analyzer/analysis-category-card";
import { AnalysisEmptyState } from "@/components/analyzer/analysis-empty-state";
import { AnalysisStatCard } from "@/components/analyzer/analysis-stat-card";
import { useToast } from "@/components/toast-provider";
import { STORAGE_KEYS } from "@/lib/storage";
import { DEFAULT_SETTINGS, normalizeSettings } from "@/lib/settings";
import type { AnalyzeResponse, AnalyzerSettings } from "@/types/analyzer";

export function AnalyzeWorkspace() {
  const { showToast } = useToast();
  const [html, setHtml] = useState("");
  const [mjmlHtml, setMjmlHtml] = useState("");
  const [htmlPreviewSource, setHtmlPreviewSource] = useState("");
  const [source, setSource] = useState<"mjml" | "html">("mjml");
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    const storedMjmlHtml = window.sessionStorage.getItem(STORAGE_KEYS.html) ?? "";
    const storedHtmlPreview =
      window.sessionStorage.getItem(STORAGE_KEYS.htmlPreview) ?? "";

    setMjmlHtml(storedMjmlHtml);
    setHtmlPreviewSource(storedHtmlPreview);
    setSource(storedMjmlHtml ? "mjml" : "html");
    setHtml(storedMjmlHtml || storedHtmlPreview);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const selectedHtml = source === "mjml" ? mjmlHtml : htmlPreviewSource;
    setHtml(selectedHtml);
  }, [source, mjmlHtml, htmlPreviewSource]);

  useEffect(() => {
    if (!isLoaded || !html) {
      return;
    }

    void runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, html]);

  async function runAnalysis() {
    if (!html) {
      return;
    }

    setIsLoading(true);
    setRequestError(null);

    try {
      const rawSettings = window.localStorage.getItem(STORAGE_KEYS.settings);
      const settings = normalizeSettings(
        rawSettings ? (JSON.parse(rawSettings) as Partial<AnalyzerSettings>) : DEFAULT_SETTINGS,
      );

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html, settings }),
      });

      const data = (await response.json()) as AnalyzeResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to analyze HTML");
      }

      setAnalysis(data);
      setExpandedIds(
        data.categories
          .filter((category) => category.status !== "pass")
          .map((category) => category.id),
      );
      setTimestamp(new Date().toLocaleString());
      window.sessionStorage.setItem(STORAGE_KEYS.analysis, JSON.stringify(data));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze HTML";
      setRequestError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleCategory(categoryId: string) {
    setExpandedIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  function toggleExpandAll() {
    if (!analysis) {
      return;
    }

    setExpandedIds((current) =>
      current.length === analysis.categories.length
        ? []
        : analysis.categories.map((category) => category.id),
    );
  }

  if (isLoaded && !html) {
    return <AnalysisEmptyState />;
  }

  return (
    <section>
      <div className="flex flex-col gap-4 rounded-[30px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSource("mjml")}
            disabled={!mjmlHtml}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              source === "mjml"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
            }`}
          >
            MJML Preview
          </button>
          <button
            type="button"
            onClick={() => setSource("html")}
            disabled={!htmlPreviewSource}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              source === "html"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
            }`}
          >
            HTML Preview
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {timestamp ? `Last analyzed: ${timestamp}` : "Ready to analyze current HTML"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void runAnalysis()}
            disabled={isLoading || !html}
            className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#4f46e5)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Running Analysis..." : "Re-run Analysis"}
          </button>
        </div>

        {requestError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {requestError}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AnalysisStatCard
            label="Overall Score"
            value={analysis ? `${analysis.score.toFixed(1)} / 10` : "--"}
            tone="neutral"
            isLoading={isLoading}
          />
          <AnalysisStatCard
            label="Passed Checks"
            value={analysis ? String(analysis.passedChecks) : "--"}
            tone="success"
            isLoading={isLoading}
          />
          <AnalysisStatCard
            label="Warnings"
            value={analysis ? String(analysis.warnings) : "--"}
            tone="warning"
            isLoading={isLoading}
          />
          <AnalysisStatCard
            label="Critical Errors"
            value={analysis ? String(analysis.criticalErrors) : "--"}
            tone="danger"
            isLoading={isLoading}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Analysis Categories
          </h2>
          <button
            type="button"
            onClick={toggleExpandAll}
            disabled={!analysis}
            className="text-sm font-medium text-sky-700 transition hover:text-sky-800 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            {analysis && expandedIds.length === analysis.categories.length
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>

        <div className="space-y-4">
          {isLoading && !analysis
            ? Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-[26px] border border-slate-200 bg-white"
                />
              ))
            : analysis?.categories.map((category) => (
                <AnalysisCategoryCard
                  key={category.id}
                  category={category}
                  expanded={expandedIds.includes(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
