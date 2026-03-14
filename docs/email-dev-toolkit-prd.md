# Product Requirements Document
## Email Dev Toolkit — Personal Workflow Tool

**Version:** 1.0  
**Status:** Draft  
**Intended builder:** AI coding agent (Claude Code or similar CLI)

---

## 1. Overview

A personal web-based tool that accelerates email development workflow. The user writes MJML in VS Code, pastes it into this app, converts it to HTML, analyzes it for quality, and exports a minified HTML ready to send.

This is a single-user personal tool with no auth, no database, and no backend persistence. It runs on Vercel.

---

## 2. Goals

- Eliminate manual steps between writing MJML and getting send-ready HTML
- Catch email quality issues (spam triggers, broken links, accessibility) before sending
- Be fast, offline-capable for most features, and deployable in one click to Vercel

---

## 3. Non-Goals (v1)

- User authentication / accounts
- Database or persistent storage
- AI-powered analysis (all checks are rule-based)
- DKIM, SPF, DMARC server-side checks
- Inbox rendering previews (e.g. Litmus-style screenshots)
- Collaboration features

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Modern, Vercel-native, good for API routes |
| Styling | Tailwind CSS | Utility-first, fast to build with |
| MJML Conversion | `mjml` npm package | Official library, runs in Node.js serverless function |
| Link Checking | Native `fetch` with HEAD requests | Simple, no extra dependencies |
| Hosting | Vercel | Free tier, zero-config Next.js deployment |
| Language | TypeScript | Better DX, easier for AI agents to work with |

---

## 5. Application Structure

### Pages / Routes

```
/              → Main editor (MJML input + preview)
/output        → HTML Output page
/output/minify → Minified HTML tab (within /output)
/analyze       → Email Quality Score page
/settings      → Settings page
```

### Persistent State

Since there's no database, state is passed between pages via:
- `sessionStorage` or `localStorage` for the current working MJML/HTML
- Or URL query params for simple state (e.g. active tab)

---

## 6. Pages & Features

---

### 6.1 Main Editor (`/`)

**Purpose:** User pastes MJML code and sees a live preview.

**Layout:**
- Top header bar with: logo/app name, campaign name input (editable text field), and three buttons: `Convert MJML`, `Analyze`, `Settings`
- Left panel: code editor (syntax-highlighted textarea or simple code editor like CodeMirror)
- Right panel: live email preview (Desktop / Mobile toggle, light/dark mode toggle, refresh button)

**Behavior:**
- Preview updates when user clicks refresh (not live — avoids unnecessary API calls)
- Preview renders via API call to `/api/convert` which returns HTML, then renders in an iframe
- Campaign name is stored in localStorage
- `Convert MJML` button → navigates to `/output`
- `Analyze` button → navigates to `/analyze` (uses last converted HTML, or auto-converts first)
- `Settings` button → navigates to `/settings`

**Header is shared across all pages** (same component).

---

### 6.2 HTML Output (`/output`)

**Purpose:** Shows the converted HTML from MJML. User can copy, download, or minify.

**Layout:**
- No separate header — uses shared app header from main page
- Page title: "HTML Output" with subtitle "Review and export your generated email code."
- Two tabs: `Generated HTML` | `Minified HTML`
- Action buttons: `Copy HTML`, `Download HTML`, `Minify HTML`
- HTML size indicator (e.g. "HTML Size: 84 KB")
- Syntax-highlighted read-only code viewer with line numbers
- Bottom-right: "Open in External Editor" link (opens raw HTML in new tab)

**Behavior:**
- On load, reads MJML from state and calls `/api/convert`
- `Copy HTML` copies full HTML to clipboard
- `Download HTML` downloads as `.html` file with campaign name as filename
- `Minify HTML` switches to Minified tab and shows minified version (strips whitespace/comments)
- HTML size is calculated client-side from string length

---

### 6.3 Email Quality Score (`/analyze`)

**Purpose:** Runs all quality checks on the HTML and shows a scored report.

**Layout:**
- Page title: "Email Quality Score"
- Subtitle: Campaign name + last analyzed timestamp
- `Re-run Analysis` button
- Four stat cards: Overall Score, Passed Checks, Warnings, Critical Errors
- "Analysis Categories" section with expandable rows per category
- Each row: icon, category name, short summary, status badge (`PASSED` / `ACTION REQUIRED`), expand toggle
- Expanded rows show individual check results with pass/fail icons and detail text
- Flagged items (e.g. spam trigger words) shown as inline tags

**Score Calculation:**
- Each check has a weight (see Section 7)
- Score = 10 − (sum of deductions from failed checks)
- Score is capped between 0 and 10, shown as X.X / 10
- Critical errors deduct more than warnings

**Status Badges:**
- `PASSED` — green — all checks in category passed
- `ACTION REQUIRED` — amber — one or more checks failed
- `CRITICAL` — red — a critical check failed (e.g. no unsubscribe link)

---

### 6.4 Settings (`/settings`)

**Purpose:** Configure thresholds and toggles for the analyzer.

**Sections:**

**Preview Settings**
- Default preview width (px) — default: `600`
- Default preview device — dropdown: `Desktop` / `Mobile`
- Default preview theme — dropdown: `Light` / `Dark`

**Analyzer Thresholds**
- HTML size warning (KB) — default: `102` (Gmail clips over 102KB)
- Image weight warning (MB) — default: `1.5`

**Spam Detection**
- Sensitivity Level — dropdown: `Low`, `Medium — Balanced detection`, `High`

**Link Checking**
- Toggle: Enable broken link checking (default: on)

**Save Settings** button — persists to `localStorage`.

---

## 7. Analyzer Rules & Scoring

All checks run against the converted HTML string. Each check returns: `pass | warning | error`.

### 7.1 Spam Risk (weight: high)

| Check | Type | Deduction |
|---|---|---|
| Spam trigger words in subject/body (FREE, GUARANTEED, LIMITED OFFER, WINNER, CLICK HERE, ACT NOW, etc.) | warning | −0.3 per word, max −1.5 |
| ALL CAPS words (3+ in a row or >20% of text) | warning | −0.5 |
| Excessive exclamation marks (3+ in subject, 5+ in body) | warning | −0.3 |
| Text-to-image ratio too low (<20% text) | warning | −0.5 |
| Missing plain text alternative hint (no text version) | warning | −0.2 |

### 7.2 HTML Structure (weight: medium)

| Check | Type | Deduction |
|---|---|---|
| Valid DOCTYPE present | error | −1.0 |
| Table-based layout (not div/flexbox/grid) | warning | −0.5 |
| Inline styles used (not stylesheet-only) | warning | −0.3 |
| No `<script>` tags | error | −1.0 |
| No unsupported HTML5 tags (article, section, nav, etc.) | warning | −0.3 |
| `<html lang="">` attribute present | warning | −0.2 |

### 7.3 Images & Media (weight: medium)

| Check | Type | Deduction |
|---|---|---|
| All `<img>` tags have non-empty `alt` attribute | warning | −0.3 per missing, max −1.0 |
| No `<video>` or `<audio>` tags | warning | −0.5 |
| Images have explicit `width` and `height` attributes | warning | −0.2 per missing, max −0.5 |
| Email is not image-only (text content exists outside images) | error | −1.5 |

### 7.4 Links (weight: medium)

| Check | Type | Deduction |
|---|---|---|
| Unsubscribe link present (`unsubscribe` in href or text) | error | −1.5 |
| No `javascript:` hrefs | error | −1.0 |
| No empty `href=""` anchors | warning | −0.3 per instance, max −0.5 |
| Broken link check (HEAD request, if enabled in settings) | warning | −0.5 per broken link, max −1.5 |

### 7.5 Accessibility (weight: medium)

| Check | Type | Deduction |
|---|---|---|
| `role="presentation"` on layout tables | warning | −0.3 |
| `lang` attribute on `<html>` tag | warning | −0.2 |
| Images have descriptive alt text (not empty string for content images) | warning | −0.2 |

### 7.6 Email Client Compatibility (weight: medium)

| Check | Type | Deduction |
|---|---|---|
| No CSS `flexbox` or `grid` | warning | −0.5 |
| No CSS variables (`var(--`)  | warning | −0.3 |
| No `position: fixed` or `position: sticky` | warning | −0.3 |
| No `<link>` external stylesheets | warning | −0.5 |
| No `@import` in styles | warning | −0.3 |
| No `<svg>` tags | warning | −0.3 |

### 7.7 Performance (weight: low)

| Check | Type | Deduction |
|---|---|---|
| HTML size under threshold (default 102KB) | warning | −0.5 |
| No base64-encoded images inline (large payload risk) | warning | −0.3 |

### 7.8 Best Practices (weight: low)

| Check | Type | Deduction |
|---|---|---|
| Preheader text present (hidden preview text after subject) | warning | −0.3 |
| From name / sender info identifiable in content | warning | −0.2 |
| No excessive nesting depth (tables > 4 levels deep) | warning | −0.2 |

---

## 8. API Routes

### `POST /api/convert`
Converts MJML to HTML.

**Request body:**
```json
{ "mjml": "<mjml>...</mjml>" }
```

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "errors": [],
  "warnings": []
}
```

Uses the `mjml` npm package server-side. Returns MJML compilation errors if invalid.

---

### `POST /api/analyze`
Runs all quality checks on HTML.

**Request body:**
```json
{
  "html": "<!DOCTYPE html>...",
  "settings": {
    "linkCheckEnabled": true,
    "htmlSizeWarningKb": 102,
    "spamSensitivity": "medium"
  }
}
```

**Response:**
```json
{
  "score": 9.2,
  "passedChecks": 45,
  "warnings": 2,
  "criticalErrors": 0,
  "categories": [
    {
      "id": "spam",
      "name": "Spam Risk",
      "status": "warning",
      "checks": [
        {
          "id": "spam_trigger_words",
          "name": "Spam trigger words detected",
          "status": "warning",
          "message": "Consider replacing: FREE, LIMITED OFFER, GUARANTEED",
          "flagged": ["FREE", "LIMITED OFFER", "GUARANTEED"]
        }
      ]
    }
  ]
}
```

Link checking runs in parallel with `Promise.all()` and a 5-second timeout per URL. HEAD requests used first, fallback to GET if 405 returned.

---

## 9. Data Persistence

No backend database. Everything stored in browser:

| Data | Storage | Key |
|---|---|---|
| Current MJML | `sessionStorage` | `edt_mjml` |
| Current HTML | `sessionStorage` | `edt_html` |
| Campaign name | `localStorage` | `edt_campaign_name` |
| Settings | `localStorage` | `edt_settings` |
| Last analysis result | `sessionStorage` | `edt_analysis` |

---

## 10. Error Handling

- MJML syntax errors → shown inline in editor panel, analysis blocked until fixed
- Link check timeout → marked as "Could not verify" (not failed), shown with warning icon
- API route failure → toast notification with error message
- Empty MJML on convert/analyze → prompt user to paste content first

---

## 11. Deployment

- Host: Vercel (free hobby tier is sufficient)
- Build: `next build`
- No environment variables required for v1
- No database, no auth, no external services (link checker uses outbound fetch from serverless functions)

---

## 12. Future Considerations (not in scope for v1)

- User accounts + cloud storage of campaigns
- Team collaboration / sharing analysis reports
- History of past analyses
- Real inbox preview screenshots (e.g. via Mailosaur or Email on Acid API)
- Export analysis report as PDF
- Subject line tester
- A/B variant comparison
