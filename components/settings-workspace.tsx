"use client";

import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS, normalizeSettings } from "@/lib/settings";
import { STORAGE_KEYS } from "@/lib/storage";
import type { AnalyzerSettings } from "@/types/analyzer";

export function SettingsWorkspace() {
  const [settings, setSettings] = useState<AnalyzerSettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    const rawSettings = window.localStorage.getItem(STORAGE_KEYS.settings);
    return rawSettings
      ? normalizeSettings(JSON.parse(rawSettings) as Partial<AnalyzerSettings>)
      : DEFAULT_SETTINGS;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [saved]);

  function updateSetting<Key extends keyof AnalyzerSettings>(
    key: Key,
    value: AnalyzerSettings[Key],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSave() {
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    setSaved(true);
  }

  return (
    <section>
      <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="grid gap-8">
          <SettingsSection
            title="Preview Settings"
            description="Control the default preview size, device, and theme for the editor workspace."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Default preview width (px)" hint="Initial width for the desktop preview frame.">
                <input
                  type="number"
                  min={320}
                  value={settings.previewWidth}
                  onChange={(event) =>
                    updateSetting("previewWidth", Number(event.target.value) || DEFAULT_SETTINGS.previewWidth)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
                />
              </Field>

              <Field label="Default preview device">
                <select
                  value={settings.previewDevice}
                  onChange={(event) =>
                    updateSetting(
                      "previewDevice",
                      event.target.value as AnalyzerSettings["previewDevice"],
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </select>
              </Field>

              <Field label="Default preview theme">
                <select
                  value={settings.previewTheme}
                  onChange={(event) =>
                    updateSetting(
                      "previewTheme",
                      event.target.value as AnalyzerSettings["previewTheme"],
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Analyzer Thresholds"
            description="Set the limits and sensitivity used by the rule-based analyzer."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="HTML size warning (KB)" hint="Gmail commonly clips emails over 102 KB.">
                <input
                  type="number"
                  min={1}
                  value={settings.htmlSizeWarningKb}
                  onChange={(event) =>
                    updateSetting(
                      "htmlSizeWarningKb",
                      Number(event.target.value) || DEFAULT_SETTINGS.htmlSizeWarningKb,
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
                />
              </Field>

              <Field label="Image weight warning (MB)" hint="Reserved for future weight-based media checks.">
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={settings.imageWeightWarningMb}
                  onChange={(event) =>
                    updateSetting(
                      "imageWeightWarningMb",
                      Number(event.target.value) || DEFAULT_SETTINGS.imageWeightWarningMb,
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
                />
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Spam Detection"
            description="Choose how aggressively the analyzer should flag risky promotional language."
          >
            <Field label="Sensitivity level" hint="Higher sensitivity catches more risky phrases, but can increase false positives.">
              <select
                value={settings.spamSensitivity}
                onChange={(event) =>
                  updateSetting(
                    "spamSensitivity",
                    event.target.value as AnalyzerSettings["spamSensitivity"],
                  )
                }
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium - Balanced detection</option>
                <option value="high">High</option>
              </select>
            </Field>
          </SettingsSection>

          <SettingsSection
            title="Link Checking"
            description="Control whether the analyzer verifies external URLs during analysis."
          >
            <button
              type="button"
              onClick={() => updateSetting("linkCheckEnabled", !settings.linkCheckEnabled)}
              className="flex w-full items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Enable broken link checking
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Automatically verify external URLs with timeout protection.
                </p>
              </div>
              <span
                className={`relative inline-flex h-7 w-12 rounded-full transition ${
                  settings.linkCheckEnabled ? "bg-sky-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    settings.linkCheckEnabled ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </button>
          </SettingsSection>

          <div className="flex items-center justify-end gap-3">
            {saved ? (
              <span className="text-sm font-medium text-emerald-600">
                Settings saved!
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#4f46e5)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] transition hover:brightness-105"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="space-y-4 border-b border-slate-100 pb-8 last:border-b-0 last:pb-0">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <p className="text-xs leading-5 text-slate-400">{hint}</p> : null}
    </label>
  );
}
