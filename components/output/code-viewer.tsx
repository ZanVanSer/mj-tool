type CodeViewerProps = {
  code: string;
};

export function CodeViewer({ code }: CodeViewerProps) {
  const lines = code.split("\n");

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fcfdff,#f8fbff)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      <div className="grid max-h-[70vh] min-h-[520px] grid-cols-[auto_1fr] overflow-auto">
        <div className="sticky left-0 bg-slate-50/90 px-4 py-5 font-mono text-sm leading-8 text-slate-400 backdrop-blur">
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <pre className="overflow-auto px-5 py-5 font-mono text-sm leading-8 text-slate-700">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
