# MJ Tool

MJ Tool is a personal web app for MJML email development. It lets you paste MJML, convert it to HTML, preview the result, inspect the generated markup, run rule-based quality checks, and tune analyzer behavior through saved settings.

## Screenshots

| Editor / Preview | Analyze |
| --- | --- |
| ![MJ Tool editor preview](docs/screenshots/editor-preview.png) | ![MJ Tool analyze screen](docs/screenshots/analyze-screen.png) |

## Features

- MJML editor with manual preview refresh
- Server-side MJML to HTML conversion
- HTML output view with copy, download, minify, and open-in-new-tab actions
- Rule-based analyzer for deliverability, structure, accessibility, compatibility, and link checks
- Saved local settings for preview defaults and analyzer thresholds

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MJML
- html-minifier-terser
- Cheerio

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

Note:
- The project intentionally uses webpack for `dev` and `build` because MJML is more stable there than in Turbopack for this app.

## Build

To create a production build:

```bash
npm run build
```

To start the production server locally after building:

```bash
npm run start
```

## Deployment

This app is designed to deploy cleanly on Vercel.

Typical flow:

1. Push your branch to GitHub
2. Import the repository into Vercel
3. Use the default Next.js project settings
4. Deploy

No environment variables are required for the current version.

## Storage Keys

- `edt_mjml` in `sessionStorage`
- `edt_html` in `sessionStorage`
- `edt_analysis` in `sessionStorage`
- `edt_settings` in `localStorage`

## Project Notes

- `docs/` and `design/` are ignored from git for local planning/design reference
- Analyzer checks are implemented in `lib/analyzer.ts`
- Settings defaults are defined in `lib/settings.ts`
