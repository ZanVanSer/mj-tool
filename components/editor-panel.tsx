import type { MjmlIssue } from "@/types/conversion";

type EditorPanelProps = {
  mjml: string;
  onMjmlChange: (value: string) => void;
  errors: MjmlIssue[];
  warnings: MjmlIssue[];
  requestError: string | null;
  isRefreshing: boolean;
};

export function EditorPanel({
  mjml,
  onMjmlChange,
  errors,
  warnings,
  requestError,
  isRefreshing,
}: EditorPanelProps) {
  const lineCount = Math.max(mjml.split("\n").length, 12);

  return (
    <div className="rounded-[30px] border border-white/50 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] xl:h-[calc(100vh-14.5rem)] xl:min-h-[680px]">
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          MJML Editor
        </span>
        <span>{isRefreshing ? "compiling..." : "utf-8"}</span>
      </div>

      <div className="grid min-h-[560px] grid-cols-[auto_1fr] overflow-hidden rounded-[24px] border border-white/6 bg-slate-950/80 xl:h-[calc(100%-7.5rem)] xl:min-h-0">
        <div className="overflow-hidden border-r border-white/6 bg-slate-950/80 px-3 py-4 font-mono text-sm leading-8 text-slate-600">
          <div className="h-full overflow-y-auto pr-1 text-right">
          {Array.from({ length: lineCount }, (_, index) => (
              <div key={index}>{index + 1}</div>
          ))}
          </div>
        </div>

        <textarea
          value={mjml}
          onChange={(event) => onMjmlChange(event.target.value)}
          spellCheck={false}
          className="h-full min-h-[560px] w-full resize-none overflow-auto border-none bg-transparent px-5 py-4 font-mono text-sm leading-8 text-slate-200 outline-none placeholder:text-slate-500 xl:min-h-0"
          placeholder="Paste MJML here..."
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
          <p
            key={item.id}
            className={`text-sm leading-6 ${
              tone === "error" ? "text-rose-100/90" : "text-amber-50/90"
            }`}
          >
            {item.line ? `Line ${item.line}: ` : ""}
            {item.message}
          </p>
        ))}
      </div>
    </div>
  );
}
