# Converge Pilot Onboarding Tracker

> Local-first, single-user web app that recreates an OctaiPipe-branded
> 2-page A4 status report as an editable, auto-saving document with
> per-customer tabs and pixel-perfect PDF export.

## Project context
- **User**: Tomer (Solution Architect, OctaiPipe).
- **Goal**: turn a static HTML status-report template into a working tool he uses with multiple pilot customers (Converge first).
- **Constraints**: runs on his laptop, no backend, no auth, no network calls at runtime.
- **Visual contract**: `/design/template.html` (the original static file). The rendered app must match it pixel-for-pixel; the PDF must match the rendered app pixel-for-pixel **minus all editing chrome**.

## Stack (do not deviate without asking)
- Vite + React 18 + TypeScript (strict).
- Zustand with the `persist` middleware → localStorage (key: `converge-tracker-v1`).
- Tailwind CSS + a hand-written `@page` / `@media print` block in `src/index.css`.
- Fonts: `@fontsource/jetbrains-mono` and `@fontsource/inter`, self-hosted.
- No other UI libs, no html2pdf, no html2canvas, no jsPDF, no @react-pdf/renderer, no Puppeteer, no rich-text editor, no router.

## Run
```bash
npm install
npm run dev          # http://localhost:5173
npm run build && npm run preview
```

## File map
- `src/store/useTrackerStore.ts` — Zustand store, persisted.
- `src/types/tracker.ts` — `CustomerProfile`, `Task`, `WorkStream`, `Milestone`, `Blocker`, `Phase`.
- `src/components/Document.tsx` — wraps `Page1` + `Page2`; this element is what prints.
- `src/components/chrome/*` — every editing affordance (tabs, add buttons, print button); all carry `className="no-print"`.
- `src/components/primitives/Editable.tsx` — `contentEditable` wrapper. Uncontrolled. Commits on blur. Strips rich paste. Enter = blur unless `multiline` prop.
- `src/lib/exportPdf.ts` — `() => window.print()`. Nothing else.
- `src/index.css` — Tailwind layers + `@page { size: A4; margin: 0 }` + `@media print { ... }` hiding `.no-print`.

## Data model
See `src/types/tracker.ts`. One Zustand store keyed by `customers: Record<id, CustomerProfile>` plus `activeCustomerId`. Every mutation goes through a typed action; persist middleware handles the rest.

## Visual tokens
- Accent: `#FF5C39` (OctaiPipe orange).
- Severity: HIGH `#FF5C39`, MED `#F0A93B`, LOW `#9CA3AF`.
- Stream status: AHEAD `#22C55E`, ON_TRACK `#FF5C39`, BEHIND `#EF4444`.
- Hero: `bg-black text-white`, 24 px white-6% grid overlay.
- Body bg `#FAFAFA`, text `#111`, dividers `#E5E7EB`.
- Mono `JetBrains Mono` 500/600 for labels, pills, section numbers, hero number; sans `Inter` 400/500/600 for body/titles.

## Interactions (canonical list)
- All text is `contentEditable`; commit on blur; rich paste stripped; Enter blurs except bullets.
- Pills cycle on click. Phase: ACTIVE → PENDING → COMPLETE. Stream: AHEAD → ON_TRACK → BEHIND. Severity: HIGH → MED → LOW.
- Checkboxes toggle `done` and apply `line-through` to the associated label.
- Progress percentages: click reveals inline number input, 0–100; bar width = `${percent}%`.
- `+ ADD …` buttons append a row with a fresh uuid and auto-focus.
- Customer tabs at the top of the viewport switch `activeCustomerId`. `+ NEW CUSTOMER` seeds a blank profile. Double-click a tab to rename.
- Auto-save is implicit (Zustand persist).

## PDF export — the rule
- Trigger: `window.print()`.
- `@page { size: A4; margin: 0 }` sets paper size.
- `@media print` block:
  - Hides every `.no-print` element (tabs, add buttons, print button, hover affordances).
  - Sets `print-color-adjust: exact` so black hero block and pill colours survive.
  - Removes `contentEditable` outlines.
  - Sets `.page` to `210mm × 297mm` with `page-break-after: always`.
- Tell the user: Scale = 100%, Margins = Default, Headers/footers = Off, then "Save as PDF".
- **Do not** install html2pdf, html2canvas, jsPDF, or any rasterising library. Text must remain vector and selectable.

## Acceptance criteria (must all pass)
1. `npm run dev` boots cleanly; `npm run build` produces a static `dist/` with no warnings.
2. Edit any text → reload tab → text persists.
3. Switch customer tabs → each profile holds independent state.
4. Click each pill type → it cycles through its states.
5. Toggle a milestone checkbox → the label gets a strikethrough.
6. Edit a percentage → progress bar width updates.
7. Add and remove tasks, milestones, blockers, outlook bullets.
8. Click "Export PDF" → Chrome print dialog opens → "Save as PDF" yields a 2-page A4 PDF where text is selectable, all `.no-print` chrome is absent, hero/pill colours are preserved, and the layout matches the on-screen document within ±2 mm.
9. No console errors in production build.

## Workflow rules for Claude Code
- Before adding any dependency not listed under **Stack**, ask first.
- Type-check with `tsc --noEmit` after substantive changes.
- Keep components < 200 lines; extract primitives.
- Prefer Tailwind utilities; reach for `index.css` only for `@page`, `@media print`, and `@font-face`.
- Treat `/design/template.html` as the visual contract — match it pixel-for-pixel.
- Never introduce a backend, env vars, auth, telemetry, or network calls at runtime.
- IMPORTANT: PDF parity (the print stylesheet) is the highest-risk part of the spec. After any layout change, re-test print preview before declaring the task done.

## Gotchas
- contentEditable in React: render initial value once, **never re-render via `dangerouslySetInnerHTML` while focused** — the caret jumps. Use uncontrolled refs and read on blur.
- localStorage is ~5 MiB per origin (MDN); current data shape is far below that, but never store binary or large pasted images.
- Do not call `localStorage.clear()` anywhere in `main.tsx`.
- `print-color-adjust: exact` is required for the black hero block; without it Chrome strips backgrounds.
- Self-hosted fonts must be loaded before print fires; `<link rel="preload">` the woff2 in `index.html`.