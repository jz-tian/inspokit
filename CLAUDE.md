# InspoKit — Claude Project Memory

## What This Is
Browser-only design kit. User uploads one image → app extracts palette, atmosphere/vibe, and subject elements → generates landing pages, social templates, wallpapers, and device mockups, all exportable as ZIP. Zero paid APIs. Everything runs in-browser.

**GitHub:** https://github.com/jz-tian/inspokit
**Stack:** Next.js 15, TypeScript, Tailwind CSS v3, chroma-js, jszip, file-saver, TensorFlow.js + MobileNet

---

## Architecture

### Rules
- All components are `'use client'` — no SSR, no server components
- Canvas API handles all image processing and rendering
- Single `AppContext` holds all state — never add local state that duplicates context
- Generators (`lib/generators/`) are pure functions — no React, no hooks
- Never call canvas APIs outside `'use client'` components or utility functions called from them

### State (`types/index.ts` + `context/AppContext.tsx`)
```
AppState {
  imageFile, imageUrl, imageEl    ← source image
  palette: string[]               ← 6 hex colors, sorted by luminance
  tokens: DesignTokens | null     ← CSS variables, radii, shadows, font pairings
  vibe: Vibe | null               ← atmosphere analysis (synchronous, runs first)
  subjects: Subject[]             ← detected elements (async, TF.js, streams in)
  subjectsLoading: boolean        ← true while TF model loads
  controls: Controls              ← roundedness/boldness/contrast sliders (0–1)
  activeTab: TabName
  fontPairingOverride: 1|2|3|null
}
```

### Load sequence (AppContext.loadImage)
1. Extract vibe (synchronous pixel stats → named atmosphere)
2. Extract palette (median-cut quantization, async canvas)
3. Generate tokens from palette + default controls
4. setState → UI renders immediately with palette/vibe
5. detectSubjects (async, TF.js MobileNet loads ~1.5MB model) → setState again

---

## Design System

### Theme — Light, editorial
- White background (`#ffffff`), warm neutral surfaces (`#f7f7f5`)
- CSS variables: `--bg`, `--surface`, `--surface-2`, `--border`, `--border-strong`, `--text`, `--text-2`, `--text-3`, `--shadow-sm/md/lg`
- Typography: **Cormorant Garant** (display/headings), **Instrument Sans** (body), **DM Mono** (labels/code)
- Rainbow animated gradient on the "InspoKit" wordmark — class `.rainbow-text`

### Tailwind utility classes (defined in `globals.css`)
- `.card` — white bg, border, rounded-2xl, shadow-sm
- `.card-elevated` — white bg, stronger border, shadow-md
- `.tab-pill` / `.tab-pill.active` — pill nav buttons
- `.label` — small uppercase mono label
- `.glass` — NOT used (was dark theme, removed)

### Component styling conventions
- Use `var(--text)`, `var(--border)`, `var(--surface)` etc. — never hardcode grays
- Use `style={{ fontFamily: "'Cormorant Garant', serif" }}` for display headings
- Use `className="label"` for section labels (DM Mono, small caps)
- Action buttons: `border border-[var(--border-strong)] text-[var(--text-2)] hover:bg-[var(--surface)]`
- Primary action (Export All): `bg-[var(--text)] text-white font-semibold`

---

## File Map

```
lib/
  contrast.ts          — wcagRatio, passesAA, forcePassAA (chroma-js)
  palette.ts           — medianCut(), extractPalette(imageEl) → 6 hex colors
  tokens.ts            — generateTokens(), tokensToCSS(), tokensToJSON(), FONT_PAIRINGS
  vibe.ts              — analysePixels(), classifyVibe(), extractVibe() → Vibe
  subjects.ts          — detectSubjects() [TF.js async], getSubjectCopy(), getSubjectMotif()
                         SUBJECT_SVG_MOTIFS keyed by category id
  generators/
    landing.ts         — generateLandingHTML(template, tokens, subjects?) → HTML string
    social.ts          — renderSocialTemplate(canvas, format, tokens, subjects?) → void
    wallpaper.ts       — renderWallpaper(canvas, style, tokens, imageEl?) → void
    mockup.ts          — getLaptopSVG(url), getIPhoneSVG(url), svgToPng()
  exporters/
    zip.ts             — exportAllZip(tokens, imageEl, subjects?) → ZIP download

components/
  Upload.tsx           — drag-and-drop / file input
  Controls.tsx         — roundedness/boldness/contrast sliders
  PaletteDisplay.tsx   — palette swatches, vibe card, subjects section, tokens, WCAG badge, font picker
  LandingPages.tsx     — iframe previews (links disabled via CSS injection), template selector, ZIP export
  SocialTemplates.tsx  — canvas previews for 8 formats, ZIP export
  Wallpapers.tsx       — canvas previews at iPhone aspect ratio, ZIP export
  Mockups.tsx          — SVG laptop + iPhone frames with screenshot embedded
  ExportAll.tsx        — master ZIP button in header

context/
  AppContext.tsx        — AppProvider, useApp() hook

app/
  page.tsx             — upload gate + main shell with tabs, centered at max-width 1160px
  globals.css          — CSS variables, fonts, utility classes, keyframes
  layout.tsx           — minimal root layout

types/
  index.ts             — DesignTokens, FontPairing, Controls, Vibe, Subject, TabName, AppState
```

---

## Key Behaviours

### Subject detection (TF.js)
- Uses MobileNet v2 alpha=0.5 (~1.5MB model, cached by browser after first load)
- Maps ImageNet labels → 8 categories: `bird | flower | person | coastal | landscape | urban | food | animal`
- Each category has: `copyHeadline`, `copySub`, SVG motif string
- Subjects stream into UI asynchronously — `subjectsLoading` controls spinner in PaletteDisplay
- Model is cached in module-level `_model` variable — only loads once per session

### Landing page previews (iframes)
- `makePreviewSrc(html)` injects `pointer-events:none` CSS into `<head>` before setting `srcDoc`
- Downloaded HTML files are unmodified and fully interactive
- Thumbnails use CSS `transform: scale(0.5)` trick for miniature preview

### Social templates (canvas)
- Subject motif drawn first (semi-transparent geometric shape matching category)
- Subject typographic label drawn as large ghosted text bottom-right
- Then decorative circles, text, branding on top

### Vibe extraction (synchronous)
- Analyses 120×120 downsampled canvas pixels
- Calculates avgLum, lumVariance, avgSat, avgHue (circular mean)
- Maps to named vibes: Cinematic Depth, Golden Hour, Nordic Light, Neon Nights, Tropical Vivid, Ethereal Bloom, Editorial Cool, Nordic Dusk, Earthy & Organic

---

## What the User Wants

- **Design philosophy:** Apple-inspired, editorial, refined — not generic SaaS
- **No dark mode** — white light theme only
- **Rainbow iridescent wordmark** on InspoKit — keep the `.rainbow-text` animation
- **Subject-driven design:** If user uploads a bird photo, all outputs should feel "bird-like" — motifs, copy, aesthetic
- **Content centered** — `max-width: 1160px; margin: 0 auto` on all tab content
- **No clickable links in landing page iframes** — disable via CSS injection, not HTML modification

---

## Testing

```bash
npm test              # jest unit tests
npm run build         # must pass with 0 TS errors before any commit
npx tsc --noEmit      # type check only
```

Tests live in `lib/__tests__/` — cover contrast, palette, tokens, landing generators.
The `lib/__tests__` directory is excluded from `tsconfig.json` to avoid Jest/Next.js type conflicts.

---

## Git / Deploy

- Single branch: `main`, pushed to `https://github.com/jz-tian/inspokit`
- Always run `npm run build` before committing — the ESLint step in the build catches JSX escape issues
- No CI configured yet
