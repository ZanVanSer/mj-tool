import CodeMirror from "@uiw/react-codemirror";
import { xml } from "@codemirror/lang-xml";
import { oneDark } from "@codemirror/theme-one-dark";

import type { MjmlIssue } from "@/types/conversion";

type EditorPanelProps = {
  code: string;
  onCodeChange: (value: string) => void;
  title: string;
  languageLabel: string;
  errors: MjmlIssue[];
  warnings: MjmlIssue[];
  requestError: string | null;
  isRefreshing: boolean;
};

export function EditorPanel({
  code,
  onCodeChange,
  title,
  languageLabel,
  errors,
  warnings,
  requestError,
  isRefreshing,
}: EditorPanelProps) {
  return (
    <div className="rounded-[30px] border border-white/50 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] xl:h-[calc(100vh-14.5rem)] xl:min-h-[680px]">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          {title}
        </span>
        <span>{isRefreshing ? "refreshing..." : languageLabel}</span>
      </div>

      <div className="min-h-[560px] overflow-hidden rounded-[24px] border border-white/6 bg-[#091122] xl:h-[calc(100%-7.5rem)] xl:min-h-0">
        <CodeMirror
          value={code}
          height="100%"
          extensions={[xml()]}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
          }}
          onChange={(value) => onCodeChange(value)}
          className="h-full text-sm"
        />
      </div>

      <div className="mt-5 space-y-3">
        {requestError ? (
          <IssueBox
            tone="error"
            title="Conversion failed"
            items={[{ id: "request-error", message: requestError, type: "error" }]}
          />
        ) : null}

        {errors.length > 0 ? (
          <IssueBox tone="error" title="MJML errors" items={errors} />
        ) : null}

        {warnings.length > 0 ? (
          <IssueBox tone="warning" title="MJML warnings" items={warnings} />
        ) : null}
      </div>
    </div>
  );
}

type IssueBoxProps = {
  title: string;
  items: MjmlIssue[];
  tone: "error" | "warning";
};

function IssueBox({ title, items, tone }: IssueBoxProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        tone === "error"
          ? "border-rose-400/25 bg-rose-500/10"
          : "border-amber-400/25 bg-amber-400/10"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            tone === "error" ? "bg-rose-400" : "bg-amber-300"
          }`}
        />
        <p
          className={`text-sm font-semibold ${
            tone === "error" ? "text-rose-200" : "text-amber-100"
          }`}
        >
          {title}
        </p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="space-y-1">
            <p
              className={`text-sm leading-6 ${
                tone === "error" ? "text-rose-100/90" : "text-amber-50/90"
              }`}
            >
              {item.line ? `Line ${item.line}: ` : ""}
              {item.message}
            </p>
            {item.snippet ? (
              <pre className="overflow-x-auto rounded-xl bg-slate-950/70 px-3 py-2 font-mono text-xs leading-6 text-slate-200">
                <code>{item.snippet}</code>
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
