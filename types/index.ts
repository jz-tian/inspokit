export interface DesignTokens {
  colors: {
    bg: string
    surface: string
    primary: string
    secondary: string
    accent: string
    text: string
    textMuted: string
  }
  radii: { sm: string; md: string; lg: string; full: string }
  shadows: { sm: string; md: string; lg: string }
  fontWeights: { body: number; heading: number }
  fontPairing: FontPairing
  gradients: { linear: string; radial: string; mesh: string }
}

export interface FontPairing {
  id: 1 | 2 | 3
  heading: string
  body: string
  importUrl: string
}

export interface Controls {
  roundedness: number  // 0–1
  boldness: number     // 0–1
  contrast: number     // 0–1
}

export type TabName = 'palette' | 'landing' | 'social' | 'wallpapers' | 'mockups'

export interface AppState {
  imageFile: File | null
  imageUrl: string | null
  imageEl: HTMLImageElement | null
  palette: string[]   // 6 hex colors
  tokens: DesignTokens | null
  controls: Controls
  activeTab: TabName
  fontPairingOverride: 1 | 2 | 3 | null
}
