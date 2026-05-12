# 📋 OctaiPipe Customer Onboarding Tracker

A local-first web app for tracking and exporting pilot onboarding reports — one per customer, all in the browser, no backend needed.

---

## ✨ What it does

- **Dashboard** — see all your pilot customers at a glance, with onboarding progress at a glance
- **Per-customer reports** — a 2-page A4 status document covering phases, tasks, workstreams, blockers, and weekly outlook
- **Fully editable** — click any text to edit it in place; pills cycle through states on click
- **Auto-saves** — everything persists to `localStorage` automatically
- **PDF export** — prints a pixel-perfect 2-page A4 PDF via the browser; text stays selectable and vector

---

## 🚀 Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 Exporting a PDF

1. Open a customer report and click **Save as PDF** in the top-right toolbar
2. In the Chrome print dialog, set:
   - **Scale:** 100%
   - **Margins:** None
   - **Headers & footers:** Off
3. Click **Save as PDF**

---

## 🏗️ Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## 🗂️ Tech stack

| Layer | Choice |
|---|---|
| Bundler | Vite |
| UI | React 18 + TypeScript |
| State | Zustand (persisted to localStorage) |
| Styles | Tailwind CSS + custom print stylesheet |
| Fonts | Inter + JetBrains Mono (self-hosted) |
| PDF | `window.print()` + `@media print` CSS |
