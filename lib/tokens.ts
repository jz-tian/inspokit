import chroma from 'chroma-js'
import { forcePassAA } from './contrast'
import type { DesignTokens, Controls, FontPairing } from '../types'

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 1,
    heading: 'Playfair Display',
    body: 'Inter',
    importUrl:
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap',
  },
  {
    id: 2,
    heading: 'Space Grotesk',
    body: 'DM Sans',
    importUrl:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap',
  },
  {
    id: 3,
    heading: 'Fraunces',
    body: 'Plus Jakarta Sans',
    importUrl:
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap',
  },
]

function autoPickFontPairing(palette: string[]): FontPairing {
  const sample = palette.slice(2, 4)
  const avgHue = sample.reduce((sum, c) => sum + (chroma(c).hsl()[0] ?? 0), 0) / sample.length
  if (avgHue < 60 || avgHue > 300) return FONT_PAIRINGS[0] // warm
  if (avgHue > 160 && avgHue < 260) return FONT_PAIRINGS[1] // cool
  return FONT_PAIRINGS[2] // earthy/mixed
}

export function generateTokens(
  palette: string[],
  controls: Controls,
  fontOverride: 1 | 2 | 3 | null
): DesignTokens {
  const [c0, , c2, c3, c4, c5] = palette

  const bg = c0
  const surface = chroma(c0).brighten(0.5).hex()
  const primary = c2
  const secondary = c3
  const accent = c4
  const rawText = c5 ?? '#ffffff'
  const text = forcePassAA(rawText, bg)
  const textMuted = chroma(text).alpha(0.55).css()

  const r = controls.roundedness
  const b = controls.boldness

  const radiiBase = Math.round(r * 24)
  const radii = {
    sm: `${Math.round(radiiBase * 0.4)}px`,
    md: `${radiiBase}px`,
    lg: `${Math.round(radiiBase * 2)}px`,
    full: '9999px',
  }

  const shadowAlpha = 0.1 + b * 0.3
  const shadowY = Math.round(2 + b * 12)
  const shadows = {
    sm: `0 1px ${shadowY}px rgba(0,0,0,${shadowAlpha.toFixed(2)})`,
    md: `0 4px ${shadowY * 2}px rgba(0,0,0,${(shadowAlpha + 0.05).toFixed(2)})`,
    lg: `0 8px ${shadowY * 3}px rgba(0,0,0,${(shadowAlpha + 0.1).toFixed(2)})`,
  }

  const fontWeights = {
    body: Math.round(400 + b * 200),
    heading: Math.round(600 + b * 200),
  }

  const fp = fontOverride ? FONT_PAIRINGS[fontOverride - 1] : autoPickFontPairing(palette)

  const gradients = {
    linear: `linear-gradient(135deg, ${primary}, ${accent})`,
    radial: `radial-gradient(ellipse at 50% 50%, ${accent}, ${primary}, ${bg})`,
    mesh: [
      `radial-gradient(ellipse at 20% 30%, ${primary}b3 0%, transparent 60%)`,
      `radial-gradient(ellipse at 80% 70%, ${accent}b3 0%, transparent 60%)`,
      `radial-gradient(ellipse at 50% 10%, ${secondary}80 0%, transparent 50%)`,
    ].join(', '),
  }

  return {
    colors: { bg, surface, primary, secondary, accent, text, textMuted },
    radii,
    shadows,
    fontWeights,
    fontPairing: fp,
    gradients,
  }
}

export function tokensToCSS(tokens: DesignTokens): string {
  const { colors, radii, shadows, fontWeights } = tokens
  return `:root {
  --color-bg: ${colors.bg};
  --color-surface: ${colors.surface};
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-text: ${colors.text};
  --color-text-muted: ${colors.textMuted};
  --radius-sm: ${radii.sm};
  --radius-md: ${radii.md};
  --radius-lg: ${radii.lg};
  --radius-full: ${radii.full};
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --fw-body: ${fontWeights.body};
  --fw-heading: ${fontWeights.heading};
  --gradient-linear: ${tokens.gradients.linear};
  --gradient-radial: ${tokens.gradients.radial};
}`
}

export function tokensToJSON(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2)
}
