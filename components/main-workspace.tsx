"use client";

import { useEffect, useState } from "react";

import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { DEFAULT_SETTINGS, normalizeSettings } from "@/lib/settings";
import { DEFAULT_MJML, STORAGE_KEYS } from "@/lib/storage";
import type { AnalyzerSettings } from "@/types/analyzer";
import type {
  ConvertResponse,
  DeviceMode,
  PreviewTheme,
} from "@/types/conversion";

export function MainWorkspace() {
  const [mjml, setMjml] = useState(DEFAULT_MJML);
  const [html, setHtml] = useState("");
  const [errors, setErrors] = useState<ConvertResponse["errors"]>([]);
  const [warnings, setWarnings] = useState<ConvertResponse["warnings"]>([]);
  const [previewWidth, setPreviewWidth] = useState(DEFAULT_SETTINGS.previewWidth);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(
    DEFAULT_SETTINGS.previewDevice,
  );
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>(
    DEFAULT_SETTINGS.previewTheme,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    const storedMjml = window.sessionStorage.getItem(STORAGE_KEYS.mjml);
    const storedHtml = window.sessionStorage.getItem(STORAGE_KEYS.html);
    const rawSettings = window.localStorage.getItem(STORAGE_KEYS.settings);

    if (storedMjml) {
      setMjml(storedMjml);
    }

    if (storedHtml) {
      setHtml(storedHtml);
    }

    if (rawSettings) {
      const settings = normalizeSettings(
        JSON.parse(rawSettings) as Partial<AnalyzerSettings>,
      );
      setPreviewWidth(settings.previewWidth);
      setDeviceMode(settings.previewDevice);
      setPreviewTheme(settings.previewTheme);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEYS.mjml, mjml);
  }, [isLoaded, mjml]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEYS.html, html);
  }, [html, isLoaded]);

  async function refreshPreview() {
    setIsRefreshing(true);
    setRequestError(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mjml }),
      });

      const data = (await response.json()) as ConvertResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to convert MJML");
      }

      setHtml(data.html);
      setErrors(data.errors);
      setWarnings(data.warnings);
    } catch (error) {
      setHtml("");
      setErrors([]);
      setWarnings([]);
      setRequestError(
        error instanceof Error ? error.message : "Failed to convert MJML",
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <section>
      <div className="grid gap-4 xl:grid-cols-2">
        <EditorPanel
          mjml={mjml}
          onMjmlChange={setMjml}
          errors={errors}
          warnings={warnings}
          requestError={requestError}
          isRefreshing={isRefreshing}
        />
        <PreviewPanel
          html={html}
          previewWidth={previewWidth}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
          previewTheme={previewTheme}
          onPreviewThemeChange={setPreviewTheme}
          onRefresh={refreshPreview}
          isRefreshing={isRefreshing}
          requestError={requestError}
        />
      </div>
    </section>
  );
}
