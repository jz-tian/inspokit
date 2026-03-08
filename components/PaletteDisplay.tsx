'use client'
import { useApp } from '@/context/AppContext'
import { wcagRatio } from '@/lib/contrast'
import { FONT_PAIRINGS } from '@/lib/tokens'

const ENERGY_BAR: Record<string, number> = { low: 1, medium: 2, high: 3 }
const WARMTH_LABEL: Record<string, string> = { warm: '🔆 Warm', cool: '❄ Cool', neutral: '◐ Neutral' }
const BRIGHTNESS_LABEL: Record<string, string> = { dark: '● Dark', mid: '◐ Mid', bright: '○ Bright' }

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="label" style={{ marginBottom: '1rem' }}>{children}</p>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="card" style={{ padding: '1.25rem', ...style }}>{children}</div>
  )
}

export default function PaletteDisplay() {
  const { palette, tokens, vibe, subjects, subjectsLoading, setFontOverride, fontPairingOverride } = useApp()
  if (!tokens) return null

  const contrastRatio = wcagRatio(tokens.colors.text, tokens.colors.bg)
  const passes = contrastRatio >= 4.5
  const activeFontId = fontPairingOverride ?? tokens.fontPairing.id

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: '960px' }}>

      {/* ── Vibe ─────────────────────────────────────── */}
      {vibe && (
        <div
          className="card-elevated"
          style={{
            gridColumn: '1 / -1',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background wash from palette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: tokens.gradients.mesh,
            opacity: 0.08,
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <SectionLabel>Atmosphere & Vibe</SectionLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{vibe.emoji}</span>
                  <h2 style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: '1.875rem', fontWeight: 700,
                    color: 'var(--text)', lineHeight: 1.1,
                  }}>
                    {vibe.label}
                  </h2>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem', maxWidth: '44ch', lineHeight: 1.6 }}>
                  {vibe.description}
                </p>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.6875rem', color: 'var(--text-3)',
                  marginTop: '0.75rem', letterSpacing: '0.05em',
                }}>
                  {vibe.mood}
                </p>
              </div>

              {/* Attribute pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                {[
                  { label: 'Warmth', value: WARMTH_LABEL[vibe.warmth] },
                  { label: 'Brightness', value: BRIGHTNESS_LABEL[vibe.brightness] },
                  { label: 'Saturation', value: vibe.saturation },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.625rem', color: 'var(--text-3)', width: '68px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                    <span style={{
                      fontSize: '0.75rem', color: 'var(--text-2)',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: '9999px', padding: '0.2rem 0.7rem',
                      fontFamily: "'DM Mono', monospace",
                      textTransform: 'capitalize',
                    }}>{value}</span>
                  </div>
                ))}
                {/* Energy bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.625rem', color: 'var(--text-3)', width: '68px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Energy</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1,2,3].map(n => (
                      <div key={n} style={{
                        width: '20px', height: '6px', borderRadius: '3px',
                        background: n <= ENERGY_BAR[vibe.energy]
                          ? tokens.colors.accent
                          : 'var(--border)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Copy tone hint */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.875rem 1rem',
              background: 'var(--surface)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.625rem', color: 'var(--text-3)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Suggested copy tone
              </p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.5 }}>{vibe.copyTone}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Detected subjects ────────────────────────── */}
      {(subjects.length > 0 || subjectsLoading) && (
        <div className="card" style={{ gridColumn: '1 / -1', padding: '1.25rem' }}>
          <SectionLabel>Detected Elements</SectionLabel>
          {subjectsLoading && subjects.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
              <div style={{ width: '14px', height: '14px', border: '2px solid var(--border-strong)', borderTop: '2px solid var(--text-3)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Analysing image contents…
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {subjects.map(s => (
                <div
                  key={s.category}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '0.6rem 1rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{s.emoji}</span>
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{s.label}</p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.625rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>
                      {Math.round(s.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              ))}
              {subjects.length > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  padding: '0.6rem 1rem',
                  background: tokens.colors.accent + '14',
                  border: `1px solid ${tokens.colors.accent}33`,
                  borderRadius: '12px',
                }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                    &ldquo;{subjects[0].copyHeadline}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Palette swatches ─────────────────────────── */}
      <Card>
        <SectionLabel>Extracted Palette</SectionLabel>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {palette.map((color, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: color,
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.5625rem', color: 'var(--text-3)' }}>{color}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Gradients ────────────────────────────────── */}
      <Card>
        <SectionLabel>Generated Gradients</SectionLabel>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { label: 'Linear', bg: tokens.gradients.linear },
            { label: 'Radial', bg: tokens.gradients.radial },
            { label: 'Mesh',   bg: tokens.gradients.mesh },
          ].map(({ label, bg }) => (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                height: '56px', borderRadius: '10px',
                background: bg,
                border: '1px solid rgba(0,0,0,0.06)',
              }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.625rem', color: 'var(--text-3)', textAlign: 'center' }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Token grid ───────────────────────────────── */}
      <Card style={{ gridColumn: '1 / -1' }}>
        <SectionLabel>Design Tokens</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }}>
          {(Object.entries(tokens.colors) as [string, string][]).map(([key, val]) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              background: 'var(--surface)', borderRadius: '10px',
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: val, flexShrink: 0,
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.5625rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {key.replace(/([A-Z])/g, m => '-' + m.toLowerCase())}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.5625rem', color: 'var(--text-2)', marginTop: '1px' }}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── WCAG check ───────────────────────────────── */}
      <div style={{
        gridColumn: '1 / -1',
        padding: '0.875rem 1.125rem',
        borderRadius: '12px',
        border: `1px solid ${passes ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
        background: passes ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '0.875rem',
      }}>
        <span style={{ fontSize: '1.1rem' }}>{passes ? '✓' : '⚠'}</span>
        <span style={{ color: 'var(--text-2)' }}>
          Text / Background contrast:{' '}
          <strong style={{ fontFamily: "'DM Mono', monospace", color: 'var(--text)', fontSize: '0.8125rem' }}>
            {contrastRatio.toFixed(2)}:1
          </strong>{' '}
          {passes ? '— Passes WCAG AA (4.5:1 minimum)' : '— Below 4.5:1, text color has been auto-adjusted'}
        </span>
      </div>

      {/* ── Font pairings ─────────────────────────────── */}
      <Card style={{ gridColumn: '1 / -1' }}>
        <SectionLabel>Font Pairing</SectionLabel>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {FONT_PAIRINGS.map(fp => {
            const active = activeFontId === fp.id
            return (
              <button
                key={fp.id}
                onClick={() => setFontOverride(fp.id)}
                style={{
                  flex: 1,
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: active ? '1.5px solid var(--text)' : '1px solid var(--border)',
                  background: active ? 'var(--text)' : 'var(--surface)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <p style={{
                  fontFamily: "'Cormorant Garant', serif",
                  fontSize: '1rem', fontWeight: 600,
                  color: active ? '#fff' : 'var(--text)',
                  marginBottom: '0.25rem',
                }}>
                  {fp.heading}
                </p>
                <p style={{ fontSize: '0.75rem', color: active ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' }}>
                  {fp.body}
                </p>
                {active && (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.5625rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {fontPairingOverride ? 'Selected' : 'Auto-selected'}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* ── Spacing & type scale ─────────────────────── */}
      <Card style={{ gridColumn: '1 / -1' }}>
        <SectionLabel>Typography & Spacing</SectionLabel>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.6875rem', color: 'var(--text-2)',
          lineHeight: 2, columnCount: 2, columnGap: '2rem',
        }}>
          <div>--radius-sm: {tokens.radii.sm}</div>
          <div>--radius-md: {tokens.radii.md}</div>
          <div>--radius-lg: {tokens.radii.lg}</div>
          <div>--fw-body: {tokens.fontWeights.body}</div>
          <div>--fw-heading: {tokens.fontWeights.heading}</div>
          <div>--shadow-sm: {tokens.shadows.sm}</div>
        </div>
      </Card>
    </div>
  )
}
