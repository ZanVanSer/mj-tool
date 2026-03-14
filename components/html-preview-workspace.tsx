"use client";

import { useEffect, useState } from "react";

import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { useToast } from "@/components/toast-provider";
import { DEFAULT_SETTINGS, normalizeSettings } from "@/lib/settings";
import { DEFAULT_HTML, STORAGE_KEYS } from "@/lib/storage";
import type { AnalyzerSettings } from "@/types/analyzer";
import type { DeviceMode, PreviewTheme } from "@/types/conversion";

export function HtmlPreviewWorkspace() {
  const { showToast } = useToast();
  const [htmlInput, setHtmlInput] = useState(DEFAULT_HTML);
  const [previewHtml, setPreviewHtml] = useState("");
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
  const [mobilePane, setMobilePane] = useState<"editor" | "preview">("editor");

  useEffect(() => {
    const storedHtml = window.sessionStorage.getItem(STORAGE_KEYS.htmlPreview);
    const rawSettings = window.localStorage.getItem(STORAGE_KEYS.settings);

    if (storedHtml) {
      setHtmlInput(storedHtml);
      setPreviewHtml(storedHtml);
    } else {
      setPreviewHtml(DEFAULT_HTML);
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

    window.sessionStorage.setItem(STORAGE_KEYS.htmlPreview, htmlInput);
  }, [htmlInput, isLoaded]);

  function refreshPreview() {
    setIsRefreshing(true);
    setRequestError(null);

    try {
      if (!htmlInput.trim()) {
        throw new Error("No HTML provided");
      }

      setPreviewHtml(htmlInput);
      showToast("HTML preview updated.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to preview HTML";
      setRequestError(message);
      showToast(message, "error");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <section>
      <div className="mb-4 flex lg:hidden">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-medium text-slate-500 shadow-sm">
          <button
            type="button"
            onClick={() => setMobilePane("editor")}
            className={`rounded-full px-4 py-2 transition ${
              mobilePane === "editor" ? "bg-slate-950 text-white" : "hover:text-slate-800"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobilePane("preview")}
            className={`rounded-full px-4 py-2 transition ${
              mobilePane === "preview" ? "bg-slate-950 text-white" : "hover:text-slate-800"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className={mobilePane === "preview" ? "hidden lg:block" : ""}>
          <EditorPanel
            code={htmlInput}
            onCodeChange={setHtmlInput}
            title="HTML Editor"
            languageLabel="html"
            errors={[]}
            warnings={[]}
            requestError={requestError}
            isRefreshing={isRefreshing}
          />
        </div>
        <div className={mobilePane === "editor" ? "hidden lg:block" : ""}>
          <PreviewPanel
            html={previewHtml}
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
      </div>
    </section>
  );
}
