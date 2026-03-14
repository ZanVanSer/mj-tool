type OutputTab = "generated" | "minified";

type OutputTabsProps = {
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  minifiedReady: boolean;
};

export function OutputTabs({
  activeTab,
  onTabChange,
  minifiedReady,
}: OutputTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 pb-3">
      <button
        type="button"
        onClick={() => onTabChange("generated")}
        className={`relative pb-2 text-sm font-semibold transition ${
          activeTab === "generated"
            ? "text-sky-700"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        Generated HTML
        {activeTab === "generated" ? (
          <span className="absolute inset-x-0 -bottom-[13px] h-0.5 rounded-full bg-sky-600" />
        ) : null}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("minified")}
        className={`relative pb-2 text-sm font-semibold transition ${
          activeTab === "minified"
            ? "text-sky-700"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        Minified HTML
        {!minifiedReady ? (
          <span className="ml-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400">
            create first
          </span>
        ) : null}
        {activeTab === "minified" ? (
          <span className="absolute inset-x-0 -bottom-[13px] h-0.5 rounded-full bg-sky-600" />
        ) : null}
      </button>
    </div>
  );
}
