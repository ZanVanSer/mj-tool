import type { DeviceMode, PreviewTheme } from "@/types/conversion";

type PreviewPanelProps = {
  html: string;
  previewWidth: number;
  deviceMode: DeviceMode;
  onDeviceModeChange: (value: DeviceMode) => void;
  previewTheme: PreviewTheme;
  onPreviewThemeChange: (value: PreviewTheme) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  requestError: string | null;
};

export function PreviewPanel({
  html,
  previewWidth,
  deviceMode,
  onDeviceModeChange,
  previewTheme,
  onPreviewThemeChange,
  onRefresh,
  isRefreshing,
  requestError,
}: PreviewPanelProps) {
  const frameWidth = deviceMode === "desktop" ? `${previewWidth}px` : "375px";
  const hasHtml = html.trim().length > 0;
  const previewHtml = hasHtml ? applyPreviewTheme(html, previewTheme) : "";

  return (
    <div className="rounded-[30px] border border-slate-200/80 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] xl:h-[calc(100vh-11.5rem)] xl:min-h-[760px]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-500">
          <button
            type="button"
            onClick={() => onDeviceModeChange("desktop")}
            className={`rounded-full px-4 py-2 transition ${
              deviceMode === "desktop"
                ? "bg-white text-slate-950 shadow-sm"
                : "hover:text-slate-700"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => onDeviceModeChange("mobile")}
            className={`rounded-full px-4 py-2 transition ${
              deviceMode === "mobile"
                ? "bg-white text-slate-950 shadow-sm"
                : "hover:text-slate-700"
            }`}
          >
            Mobile
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <button
            type="button"
            onClick={() => onPreviewThemeChange("light")}
            className={`rounded-full border p-2.5 transition ${
              previewTheme === "light"
                ? "border-sky-200 bg-sky-50 text-sky-700"
                : "border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <span className="sr-only">Light theme</span>
            ☼
          </button>
          <button
            type="button"
            onClick={() => onPreviewThemeChange("dark")}
            className={`rounded-full border p-2.5 transition ${
              previewTheme === "dark"
                ? "border-slate-800 bg-slate-950 text-white"
                : "border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <span className="sr-only">Dark theme</span>
            ◐
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full border border-slate-200 p-2.5 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="sr-only">Refresh preview</span>
            ↻
          </button>
        </div>
      </div>

      {requestError ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {requestError}
        </div>
      ) : null}

      <div
        className={`rounded-[24px] border border-slate-200 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] xl:flex xl:h-[calc(100%-4.8rem)] xl:min-h-0 xl:flex-col ${
          previewTheme === "light"
            ? "bg-[linear-gradient(180deg,#f8fbff,#f3f6fb)]"
            : "bg-[linear-gradient(180deg,#0f172a,#111827)]"
        }`}
      >
        <div
          className="mx-auto w-full overflow-hidden rounded-[24px] bg-white transition-[width] duration-200 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col"
          style={{ width: frameWidth, maxWidth: "100%" }}
        >
          {hasHtml ? (
            <iframe
              title="MJML preview"
              srcDoc={previewHtml}
              className={`min-h-[620px] w-full xl:min-h-0 xl:flex-1 ${
                previewTheme === "dark" ? "bg-slate-950" : "bg-white"
              }`}
            />
          ) : (
            <div className="flex min-h-[620px] items-center justify-center px-8 text-center xl:min-h-0 xl:flex-1">
              <div className="max-w-md space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-500">
                  Preview Ready
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Refresh to compile your MJML.
                </h2>
                <p className="text-sm leading-7 text-slate-500">
                  The preview updates only when you ask for it, so you can edit
                  freely without constant API requests.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function applyPreviewTheme(html: string, theme: PreviewTheme) {
  if (theme === "light") {
    return html;
  }

  const darkModeStyles = `
    <style id="mj-tool-dark-preview">
      html {
        background: #020817 !important;
      }
      body {
        background: #020817 !important;
        filter: invert(1) hue-rotate(180deg);
        transform-origin: top left;
      }
      img, picture, video, svg {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    </style>
  `;

  if (html.includes("</head>")) {
    return html.replace("</head>", `${darkModeStyles}</head>`);
  }

  return `${darkModeStyles}${html}`;
}
