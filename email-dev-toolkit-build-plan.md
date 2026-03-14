# Email Dev Toolkit — Build Plan
## Vertical Slice Implementation for LLM-Assisted Coding

**Approach:** Each phase delivers one fully working, visually testable slice of the app.
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Vercel
**Reference:** Always read `email-dev-toolkit-prd.md` alongside this plan.

---

## Dependency Order

```
Phase 1 → Project scaffold + shared shell
Phase 2 → MJML Editor (/) + /api/convert
Phase 3 → HTML Output (/output) + minification
Phase 4 → Analyzer (/analyze) + /api/analyze (static checks)
Phase 5 → Link checker (adds to /api/analyze)
Phase 6 → Settings (/settings) + wire settings into analyzer
Phase 7 → Polish, error handling, Vercel deploy
```

After Phase 2 the core loop works. Everything after is additive.

---

## Phase 1 — Project Scaffold & Shared Shell

**Deliverable:** Running Next.js app with correct folder structure, Tailwind configured, shared header component rendering on all pages with correct navigation.

**Acceptance criteria:**
- `npm run dev` starts without errors
- All 4 routes exist and render (even if empty)
- Shared header renders on every page with logo, campaign name input, and three nav buttons
- Campaign name saves to `localStorage` key `edt_campaign_name`
- Tailwind is working (spot-check with a utility class)

---

### 📋 Prompt for Phase 1

```
You are building a personal email developer toolkit web app. This is Phase 1: project scaffold and shared shell.

TECH STACK:
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Deployed to Vercel

TASK:
1. Scaffold a new Next.js project with App Router and TypeScript. Install Tailwind CSS.
2. Create the following routes (empty pages for now, just a heading):
   - app/page.tsx (Main Editor)
   - app/output/page.tsx (HTML Output)
   - app/analyze/page.tsx (Email Quality Score)
   - app/settings/page.tsx (Settings)
3. Create a shared Header component at components/Header.tsx with:
   - Left: logo icon + "Email Dev Toolkit" text
   - Center: editable text input for campaign name (placeholder: "Campaign name...")
   - Right: three buttons — "Convert MJML", "Analyze", "Settings"
   - "Convert MJML" navigates to /output
   - "Analyze" navigates to /analyze
   - "Settings" navigates to /settings
   - Campaign name reads from and saves to localStorage key: edt_campaign_name
4. Import and render <Header /> at the top of every page.
5. Style the header to match a dark developer tool aesthetic — dark background (#0f1117 or similar), white text, subtle borders.

DESIGN REFERENCE:
The header has a dark background. The campaign name input is inline and looks like editable text, not a heavy form field. The three right buttons are clean — "Convert MJML" is the primary (blue/indigo), "Analyze" and "Settings" are secondary (outlined or muted).

Do not build any page content yet — just the shell. Verify the dev server starts cleanly.
```

---

## Phase 2 — MJML Editor + `/api/convert`

**Deliverable:** Main page (`/`) with a working code editor on the left, live preview on the right, and a real MJML-to-HTML conversion API.

**Acceptance criteria:**
- User can paste MJML into the editor
- Clicking refresh in the preview pane renders the email in an iframe
- Desktop/Mobile toggle changes preview width
- Light/Dark toggle flips the preview background
- MJML is saved to `sessionStorage` key `edt_mjml`
- Converted HTML is saved to `sessionStorage` key `edt_html`
- `/api/convert` returns correct HTML or error messages for bad MJML

---

### 📋 Prompt for Phase 2

```
You are continuing to build a personal email developer toolkit. Phase 1 (scaffold + header) is done. This is Phase 2: the MJML editor and conversion API.

TASK — API ROUTE:
Create app/api/convert/route.ts:
- Method: POST
- Body: { mjml: string }
- Use the `mjml` npm package (install it: npm install mjml @types/mjml)
- Run mjml2html() on the input
- Return: { html: string, errors: array, warnings: array }
- If mjml is empty or missing, return 400 with { error: "No MJML provided" }

TASK — MAIN PAGE (app/page.tsx):
Split layout: left panel (editor) 50%, right panel (preview) 50%.

LEFT PANEL — Code Editor:
- Use a <textarea> with monospace font and syntax-color-like styling (dark background, light text)
- Show line numbers alongside (can be a simple CSS trick or a lightweight solution)
- Label: "MJML EDITOR" in small caps at the top with a green dot indicator and "utf-8" on the right
- Save content to sessionStorage key: edt_mjml on every change
- Load from sessionStorage on mount

RIGHT PANEL — Preview:
- Desktop / Mobile toggle buttons at the top
- Sun/Moon icon buttons for light/dark preview theme
- Refresh icon button — triggers conversion and updates iframe
- Render converted HTML inside an <iframe> (use srcDoc)
- Desktop width: 600px centered, Mobile width: 375px centered
- Show a mock email client chrome above the iframe (To:, Subject: fields — static display only)
- Save converted HTML to sessionStorage key: edt_html

BEHAVIOR:
- On refresh click: call POST /api/convert with the MJML content, get HTML back, set it as iframe srcDoc
- Show inline error messages below the editor if MJML has errors (from API response)
- Do not auto-refresh — only on explicit refresh button click

DESIGN REFERENCE:
Dark theme overall. Editor panel is very dark (#0d1117). Preview panel is lighter (#f5f5f5 interior). The toggle buttons (Desktop/Mobile) look like a pill selector. Match the screenshot aesthetic from the PRD.
```

---

## Phase 3 — HTML Output Page (`/output`)

**Deliverable:** `/output` page showing the converted HTML with syntax highlighting, copy/download/minify actions, and a working Minified HTML tab.

**Acceptance criteria:**
- On page load, reads HTML from `sessionStorage` key `edt_html`
- If no HTML in storage, shows a prompt to go back and convert first
- `Copy HTML` copies to clipboard, shows success toast
- `Download HTML` downloads `.html` file named after the campaign name
- `Minify HTML` switches to the Minified tab with stripped whitespace/comments
- HTML size shown in KB, calculated client-side
- "Open in External Editor" opens raw HTML in a new tab (data URL or blob URL)
- Syntax-highlighted code viewer with line numbers (read-only)

---

### 📋 Prompt for Phase 3

```
You are continuing to build a personal email developer toolkit. Phases 1–2 are done (scaffold, header, editor, /api/convert). This is Phase 3: the HTML Output page.

TASK — Install dependencies:
npm install html-minifier-terser
npm install @types/html-minifier-terser

TASK — PAGE (app/output/page.tsx):
This page shows the converted HTML output.

LAYOUT:
- Page title: "HTML Output" (bold, large)
- Subtitle: "Review and export your generated email code."
- Two tabs: "Generated HTML" | "Minified HTML"
- Action bar: [Copy HTML] [Download HTML] [Minify HTML] ... HTML Size: X KB (right-aligned)
- Syntax-highlighted read-only code block with line numbers (use a <pre> with styled spans, or install react-syntax-highlighter)
- Bottom-right: "Open in External Editor ↗" link

DATA:
- On mount: read HTML from sessionStorage key edt_html
- If empty: show a message "No HTML found. Go back and convert your MJML first." with a back button
- HTML size: calculate as Math.round(new Blob([html]).size / 1024) + " KB"

ACTIONS:
- Copy HTML: navigator.clipboard.writeText(html), show a temporary "Copied!" toast for 2 seconds
- Download HTML: create a Blob, use URL.createObjectURL, trigger download. Filename = campaignName from localStorage key edt_campaign_name, fallback to "email-output.html"
- Minify HTML: use html-minifier-terser to strip whitespace and comments, switch to Minified tab
- Open in External Editor: open a new tab with the raw HTML (use URL.createObjectURL with Blob type text/html)

MINIFIED TAB:
- Same layout as Generated tab but shows minified version
- Minify options: collapseWhitespace: true, removeComments: true, minifyCSS: true

DESIGN REFERENCE:
Light theme page (#f0f2f5 background). The code viewer has a white card with subtle border. Active tab has a blue underline. "Copy HTML" is a filled blue button. "Download HTML" is outlined. "Minify HTML" has a lightning bolt icon and is outlined with blue text.
```

---

## Phase 4 — Email Quality Analyzer (`/analyze`) + `/api/analyze` (static checks)

**Deliverable:** Working `/analyze` page with real scoring across all 8 check categories. Link checking is excluded in this phase (added in Phase 5).

**Acceptance criteria:**
- Score calculated correctly from weighted deductions
- All 7 static check categories run and return pass/warning/error
- Stat cards show correct overall score, passed checks, warnings, critical errors
- Each category row is expandable to show individual check results
- Spam trigger words shown as inline tags
- Status badges correct: PASSED (green), ACTION REQUIRED (amber)

---

### 📋 Prompt for Phase 4

```
You are continuing to build a personal email developer toolkit. Phases 1–3 are done. This is Phase 4: the email quality analyzer — the most complex part of the app.

TASK — API ROUTE (app/api/analyze/route.ts):
Method: POST
Body: { html: string, settings: { linkCheckEnabled: boolean, htmlSizeWarningKb: number, spamSensitivity: "low" | "medium" | "high" } }

Implement all checks below. Each check returns { id, name, status: "pass"|"warning"|"error", message, flagged?: string[] }.

--- SPAM RISK ---
- spam_trigger_words: scan text content for these words (case-insensitive): FREE, GUARANTEED, LIMITED OFFER, WINNER, CLICK HERE, ACT NOW, URGENT, EXCLUSIVE, CONGRATULATIONS, RISK-FREE, ONCE IN A LIFETIME, SPECIAL PROMOTION, BUY NOW, ORDER NOW, APPLY NOW. Deduct -0.3 per word found, max -1.5. Return flagged words in flagged[].
- all_caps: check if 3+ consecutive ALL CAPS words exist or >20% of text is caps. Deduct -0.5.
- exclamation_marks: count exclamation marks in body. If 5+, deduct -0.3.
- text_to_image_ratio: if img count > 2 and text length < 200 chars, flag. Deduct -0.5.

--- HTML STRUCTURE ---
- valid_doctype: check for "<!DOCTYPE" in html. Missing = error, deduct -1.0.
- no_script_tags: check for <script. Present = error, deduct -1.0.
- no_unsupported_tags: check for <article, <section, <nav, <header, <footer, <main, <aside. Found = warning, deduct -0.3.
- html_lang: check for <html lang=. Missing = warning, deduct -0.2.
- inline_styles: check for style=" in tags. If <5 instances, pass. If 5+, it's expected for email, so this passes.
- table_layout: check that <table exists and no display:flex or display:grid. If flexbox/grid found, deduct -0.5.

--- IMAGES & MEDIA ---
- img_alt_text: find all <img tags. For each missing alt="" or alt attribute, deduct -0.3, max -1.0.
- no_video_audio: check for <video or <audio. Found = warning, deduct -0.5.
- img_dimensions: find <img tags missing width= or height=. Deduct -0.2 per missing, max -0.5.
- not_image_only: check that there is text content outside of img tags. If none, error, deduct -1.5.

--- LINKS ---
- unsubscribe_link: check if "unsubscribe" appears in href or link text. Missing = error, deduct -1.5.
- no_javascript_hrefs: check for href="javascript:. Found = error, deduct -1.0.
- no_empty_hrefs: check for href="". Deduct -0.3 per instance, max -0.5.
(Skip broken link check — that's Phase 5)

--- ACCESSIBILITY ---
- table_role_presentation: check layout tables have role="presentation". Missing = warning, deduct -0.3.
- lang_attribute: same as html_lang above — deduplicate, just reference it.
- descriptive_alt_text: check that img alt attributes are not just "" for visible images (heuristic: if alt="" and no role="presentation" on the img, flag). Deduct -0.2.

--- EMAIL CLIENT COMPATIBILITY ---
- no_flexbox_grid: check for display:flex or display:grid or display: flex or display: grid. Found = warning, deduct -0.5.
- no_css_variables: check for var(--. Found = warning, deduct -0.3.
- no_position_fixed: check for position:fixed or position: fixed or position:sticky. Found = warning, deduct -0.3.
- no_external_stylesheets: check for <link rel="stylesheet". Found = warning, deduct -0.5.
- no_css_import: check for @import. Found = warning, deduct -0.3.
- no_svg_tags: check for <svg. Found = warning, deduct -0.3.

--- PERFORMANCE ---
- html_size: check byte size against htmlSizeWarningKb setting (default 102KB). Over limit = warning, deduct -0.5.
- no_base64_images: check for data:image/. Found = warning, deduct -0.3.

--- BEST PRACTICES ---
- preheader_text: check for a hidden/small div or span after the opening body tag with preview text (heuristic: look for style containing font-size:0 or display:none near the top). Missing = warning, deduct -0.3.
- no_deep_nesting: count table nesting depth. If >4 levels deep, deduct -0.2.

SCORE CALCULATION:
total_deductions = sum of all deductions from failed checks
score = max(0, min(10, 10 - total_deductions))
Round to 1 decimal place.

RESPONSE SHAPE:
{
  score: number,
  passedChecks: number,
  warnings: number,
  criticalErrors: number,
  categories: [
    {
      id: string,
      name: string,
      status: "pass" | "warning" | "error",
      summary: string,  // e.g. "1 warning detected"
      checks: [{ id, name, status, message, flagged? }]
    }
  ]
}

---

TASK — PAGE (app/analyze/page.tsx):

LAYOUT:
- Title: "Email Quality Score"
- Subtitle: campaign name from localStorage + " • Last analyzed: " + current timestamp
- Top-right: "Re-run Analysis" button
- Four stat cards in a row:
  - Overall Score: X.X / 10
  - Passed Checks: N
  - Warnings: N (amber if >0)
  - Critical Errors: N (red if >0)
- Section heading: "Analysis Categories" with "Expand All" toggle on the right
- Category rows: icon | name + summary | STATUS BADGE | chevron toggle
  - Clicking the row expands to show individual checks
  - Each check: colored dot (green/amber/red) | check name | message
  - Flagged items shown as small tag pills

BEHAVIOR:
- On mount: read HTML from sessionStorage edt_html and settings from localStorage edt_settings
- Call POST /api/analyze with the HTML and settings
- While loading show a skeleton/spinner
- "Re-run Analysis" re-calls the API and updates results
- Save result to sessionStorage key edt_analysis

STATUS BADGE COLORS:
- PASSED: green background
- ACTION REQUIRED: amber background
- CRITICAL: red background

DESIGN REFERENCE:
Match the screenshot — white cards on light gray background. Score card shows the big number prominently. Category rows have left-side colored icons. Expand/collapse with smooth animation.
```

---

## Phase 5 — Link Checker (adds to `/api/analyze`)

**Deliverable:** Real HTTP link checking integrated into the analyzer. Runs in parallel with timeout. Controlled by the settings toggle.

**Acceptance criteria:**
- When `linkCheckEnabled: true`, all unique `href` values in the HTML are checked
- HEAD request first, fallback to GET on 405
- 5-second timeout per URL
- Results show pass / broken (4xx/5xx) / could not verify (timeout/network error)
- Broken links deduct −0.5 each, max −1.5
- Runs in parallel with `Promise.all`

---

### 📋 Prompt for Phase 5

```
You are continuing to build a personal email developer toolkit. Phases 1–4 are done. This is Phase 5: adding real broken link checking to the /api/analyze route.

TASK — Update app/api/analyze/route.ts:

Add a new check function: checkBrokenLinks(html: string, enabled: boolean)

LOGIC:
1. If enabled is false, return a single check result: { id: "link_check_disabled", status: "pass", message: "Link checking is disabled in settings." }
2. Extract all unique href values from the HTML using a regex: /href="(https?:\/\/[^"]+)"/g
3. Deduplicate URLs.
4. For each URL, make a fetch request with:
   - Method: HEAD
   - AbortSignal with 5-second timeout: AbortSignal.timeout(5000)
   - If response status is 405, retry with GET
   - If status is 2xx or 3xx: pass
   - If status is 4xx or 5xx: broken link
   - If fetch throws (timeout, network error): "could not verify"
5. Run all checks in parallel: await Promise.all(urls.map(checkUrl))
6. Return results as individual check items:
   - Passing URLs: grouped into one pass result
   - Each broken URL: separate warning result with the URL in the message
   - Each unverifiable URL: separate result with icon hint "Could not verify"
7. Deduct -0.5 per broken link, max total -1.5 for this category

IMPORTANT:
- This runs server-side in a Next.js API route (serverless function), so outbound fetch works fine
- Do not check mailto:, tel:, #anchor, or javascript: links — only http/https
- Add User-Agent header: "Mozilla/5.0 EmailDevToolkit/1.0" to avoid some bot blocks
- Handle the case where the HTML has no external links gracefully (return pass)

Integrate these results into the Links category of the existing /api/analyze response. The Links category should now have both the static checks from Phase 4 AND the dynamic link check results.
```

---

## Phase 6 — Settings Page + Wire Settings

**Deliverable:** Working settings page that saves to `localStorage`. Settings are read by the analyzer and the preview.

**Acceptance criteria:**
- All settings fields render and save correctly to `localStorage` key `edt_settings`
- Save button shows a success confirmation
- The main editor preview respects default device and theme settings on load
- The analyzer reads `htmlSizeWarningKb` and `linkCheckEnabled` and `spamSensitivity` from stored settings

---

### 📋 Prompt for Phase 6

```
You are continuing to build a personal email developer toolkit. Phases 1–5 are done. This is Phase 6: the Settings page and wiring settings throughout the app.

TASK — PAGE (app/settings/page.tsx):

LAYOUT:
- Title: "Settings"
- Subtitle: "Configure your email development environment and analyzer thresholds."
- Section 1: "Preview Settings" (eye icon)
  - Default preview width (px) — number input, default 600
  - Default preview device — select: Desktop / Mobile
  - Default preview theme — select: Light / Dark
- Section 2: "Analyzer Thresholds" (bar chart icon)
  - HTML size warning (KB) — number input, default 102, hint: "Gmail clips emails over 102KB."
  - Image weight warning (MB) — number input, default 1.5, hint: "Threshold for total asset weight."
- Section 3: "Spam Detection" (shield icon)
  - Sensitivity Level — select: Low / Medium - Balanced detection / High
  - Hint: "Higher sensitivity might flag more false positives."
- Section 4: "Link Checking" (link icon)
  - Toggle: "Enable broken link checking" — default on
  - Subtitle: "Automatically verify all URLs in the email during analysis."
- Bottom-right: "Save Settings" button (blue, filled)

BEHAVIOR:
- On mount: load settings from localStorage key edt_settings, populate fields
- Default settings if nothing in localStorage:
  {
    previewWidth: 600,
    previewDevice: "desktop",
    previewTheme: "light",
    htmlSizeWarningKb: 102,
    imageWeightWarningMb: 1.5,
    spamSensitivity: "medium",
    linkCheckEnabled: true
  }
- On save: write all values to localStorage key edt_settings, show "Settings saved!" toast for 2s

WIRING:
1. In app/page.tsx (Main Editor): on mount, read edt_settings and apply previewDevice and previewTheme as defaults for the toggle states.
2. In app/analyze/page.tsx: when calling /api/analyze, read edt_settings from localStorage and pass { linkCheckEnabled, htmlSizeWarningKb, spamSensitivity } in the request body.

DESIGN REFERENCE:
Light page. Sections separated by dividers. Each section has a colored icon next to the heading. Input fields are clean with helper text below. The toggle is a smooth CSS/Tailwind toggle switch. Match the settings screenshot from the PRD.
```

---

## Phase 7 — Polish, Error Handling & Vercel Deploy

**Deliverable:** Production-ready app. All edge cases handled, UI polished, deployed to Vercel.

**Acceptance criteria:**
- Empty state handled on every page (no MJML, no HTML)
- Toast notifications work across all error paths
- Loading states / spinners on all async operations
- Mobile layout doesn't break (basic responsiveness)
- `vercel deploy` succeeds with no build errors
- `next build` completes without TypeScript errors

---

### 📋 Prompt for Phase 7

```
You are finishing a personal email developer toolkit. All core features are built (Phases 1–6). This is Phase 7: polish, error handling, and deployment prep.

TASK — Error handling sweep:
1. app/output/page.tsx: if sessionStorage edt_html is empty or missing, show a full-page empty state: "No HTML yet. Go back to the editor and convert your MJML." with a button linking back to /.
2. app/analyze/page.tsx: same — if edt_html is missing, show empty state. If /api/analyze returns an error, show an error card with the message and a retry button.
3. app/page.tsx: if /api/convert returns errors, show them inline below the editor with red styling. Don't navigate to /output if there are errors.
4. All pages: if a button action fails (copy, download, API call), show a toast with the error message.

TASK — Loading states:
- app/analyze/page.tsx: while the API call is in progress, show skeleton cards for the stat row and skeleton rows for the categories. Do not show stale data from the previous run.
- app/output/page.tsx: while converting on load, show a spinner over the code viewer.

TASK — Toast system:
- If not already implemented, add a simple toast component (bottom-right, auto-dismiss after 3s) that accepts { message: string, type: "success" | "error" | "warning" }.
- Wire it to all copy/save/error actions across the app.

TASK — Vercel deployment prep:
1. Ensure next.config.ts has no misconfigurations.
2. Run next build locally and fix any TypeScript or build errors.
3. Ensure the mjml package works in Next.js serverless functions — add to next.config.ts if needed:
   experimental: { serverComponentsExternalPackages: ['mjml'] }
4. Create a vercel.json if needed for any route or function configuration.
5. Add a README.md with: what the app does, how to run locally (npm install, npm run dev), and how to deploy (vercel deploy).

TASK — Basic responsiveness:
- The header should stack on mobile (below 768px): campaign input goes to second row, buttons shrink.
- The editor/preview split on / should collapse on mobile: tabs or a toggle to switch between editor and preview panes.

Run npm run build at the end and confirm it passes before considering this phase done.
```

---

## Quick Reference

| Phase | Route / File | Key Dependency |
|---|---|---|
| 1 | All routes, `components/Header.tsx` | — |
| 2 | `app/page.tsx`, `app/api/convert/route.ts` | `mjml` package |
| 3 | `app/output/page.tsx` | `html-minifier-terser` |
| 4 | `app/analyze/page.tsx`, `app/api/analyze/route.ts` | Phase 2 HTML output |
| 5 | `app/api/analyze/route.ts` (update) | Phase 4 analyzer |
| 6 | `app/settings/page.tsx`, wire to pages | Phase 4 + 2 |
| 7 | All files | All phases |

## sessionStorage / localStorage Keys

| Key | Storage | Used by |
|---|---|---|
| `edt_mjml` | sessionStorage | Editor (write), Output (read) |
| `edt_html` | sessionStorage | Editor (write), Output (read), Analyze (read) |
| `edt_campaign_name` | localStorage | Header (write), Output (read for filename) |
| `edt_settings` | localStorage | Settings (write), Analyze (read), Editor (read) |
| `edt_analysis` | sessionStorage | Analyze (write) |
