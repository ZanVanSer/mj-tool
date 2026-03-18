# MJ Tool

MJ Tool is a local web app for building and reviewing MJML email templates. It gives you a place to edit MJML, convert it to HTML, preview the result, inspect the generated markup, run rule-based analysis.

![Next.js](https://img.shields.io/badge/Next.js-111827?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MJML](https://img.shields.io/badge/MJML-0F172A?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## What It Does

- Edit MJML with a code editor and refresh the preview on demand
- Convert MJML to HTML
- Inspect, copy, download, minify, and open generated HTML in a new tab
- Preview raw HTML separately from the MJML workflow
- Run analysis against generated or pasted HTML through
- Save preview defaults and analyzer preferences in local storage

## Screenshots

Add 1 to 3 screenshots here once you have them ready:

```md
![MJ Tool screenshot](./public/screenshots/mjtool.png)
```

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- MJML
- html-minifier-terser
- Cheerio
- CodeMirror

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app:

```text
http://localhost:3000
```

The project intentionally uses webpack for `dev` and `build` because MJML is more stable there than in Turbopack for this app.

