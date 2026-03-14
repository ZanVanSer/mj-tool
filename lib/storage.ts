export const STORAGE_KEYS = {
  mjml: "edt_mjml",
  html: "edt_html",
  settings: "edt_settings",
  analysis: "edt_analysis",
} as const;

export const DEFAULT_MJML = `<mjml>
  <mj-body background-color="#f6f8fb">
    <mj-section padding="32px 24px">
      <mj-column>
        <mj-text
          font-size="28px"
          font-family="Helvetica, Arial, sans-serif"
          font-weight="700"
          color="#0f172a"
        >
          Build responsive emails faster
        </mj-text>
        <mj-text
          padding-top="12px"
          font-size="16px"
          line-height="24px"
          font-family="Helvetica, Arial, sans-serif"
          color="#475569"
        >
          MJ Tool helps you preview, inspect, and prepare production HTML
          without leaving your workflow.
        </mj-text>
        <mj-button
          padding-top="20px"
          background-color="#2563eb"
          color="#ffffff"
          border-radius="12px"
          font-family="Helvetica, Arial, sans-serif"
        >
          Start Building
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
