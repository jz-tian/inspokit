'use client'
import { useApp } from '@/context/AppContext'
import { wcagRatio } from '@/lib/contrast'
import { FONT_PAIRINGS } from '@/lib/tokens'

const TOKEN_LABELS: Record<string, string> = {
  bg: 'Background',
  surface: 'Surface',
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  text: 'Text',
  textMuted: 'Text Muted',
}

export default function PaletteDisplay() {
  const { palette, tokens, setFontOverride, fontPairingOverride } = useApp()
  if (!tokens) return null

  const contrastRatio = wcagRatio(tokens.colors.text, tokens.colors.bg)
  const passes = contrastRatio >= 4.5
  const activeFontId = fontPairingOverride ?? tokens.fontPairing.id

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Extracted palette */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Extracted Palette</h2>
        <div className="flex gap-4">
          {palette.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                style={{ background: color }}
                className="w-16 h-16 rounded-2xl shadow-lg ring-1 ring-white/10"
              />
              <span className="text-xs text-white/40 font-mono">{color}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Token grid */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Design Tokens</h2>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(tokens.colors) as [string, string][]).map(([key, val]) => (
            <div key={key} className="glass rounded-xl p-3 flex items-center gap-3">
              <div style={{ background: val }} className="w-9 h-9 rounded-lg flex-shrink-0 ring-1 ring-white/10" />
              <div className="min-w-0">
                <p className="text-xs font-mono text-white/60 truncate">
                  --color-{key.replace(/([A-Z])/g, m => '-' + m.toLowerCase())}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{TOKEN_LABELS[key] ?? key} · {val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WCAG contrast check */}
      <section>
        <div
          className={`rounded-xl p-4 text-sm flex items-center gap-3 ${
            passes
              ? 'bg-emerald-950/50 border border-emerald-500/25 text-emerald-300'
              : 'bg-red-950/50 border border-red-500/25 text-red-300'
          }`}
        >
          <span className="text-lg">{passes ? '✓' : '⚠'}</span>
          <span>
            Text / Background contrast:{' '}
            <strong className="font-mono">{contrastRatio.toFixed(2)}:1</strong>{' '}
            {passes ? '— Passes WCAG AA (4.5:1)' : '— Below 4.5:1 threshold, text auto-adjusted'}
          </span>
        </div>
      </section>

      {/* Gradient previews */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Gradients</h2>
        <div className="flex gap-4">
          {[
            { label: 'Linear', bg: tokens.gradients.linear },
            { label: 'Radial', bg: tokens.gradients.radial },
            { label: 'Mesh', bg: tokens.gradients.mesh },
          ].map(({ label, bg }) => (
            <div key={label} className="flex flex-col gap-2">
              <div
                style={{ background: bg }}
                className="w-32 h-20 rounded-xl ring-1 ring-white/10"
              />
              <span className="text-xs text-white/35 text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Font pairings */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Font Pairing</h2>
        <div className="flex gap-3">
          {FONT_PAIRINGS.map(fp => {
            const active = activeFontId === fp.id
            return (
              <button
                key={fp.id}
                onClick={() => setFontOverride(fp.id)}
                className={`glass rounded-xl px-5 py-4 text-left transition-all duration-150 ${
                  active ? 'border-white/30 bg-white/8' : 'hover:border-white/15'
                }`}
              >
                <p className="text-sm font-semibold text-white/90">{fp.heading}</p>
                <p className="text-xs text-white/45 mt-0.5">{fp.body}</p>
                {active && (
                  <p className="text-xs text-white/25 mt-2">
                    {fontPairingOverride ? 'Selected' : 'Auto-selected'}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Token values summary */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Typography & Spacing</h2>
        <div className="glass rounded-xl p-5 font-mono text-xs text-white/50 space-y-1">
          <p>--radius-sm: {tokens.radii.sm} &nbsp; --radius-md: {tokens.radii.md} &nbsp; --radius-lg: {tokens.radii.lg}</p>
          <p>--fw-body: {tokens.fontWeights.body} &nbsp; --fw-heading: {tokens.fontWeights.heading}</p>
          <p>--shadow-sm: {tokens.shadows.sm}</p>
        </div>
      </section>
    </div>
  )
}
