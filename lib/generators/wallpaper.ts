import type { DesignTokens } from '@/types'

export type WallpaperStyle = 'blur' | 'duotone' | 'mesh'

const W = 1290
const H = 2796

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity = 0.06): void {
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255
    data[i] = Math.max(0, Math.min(255, data[i] + noise))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
  }
  ctx.putImageData(imageData, 0, 0)
}

function addVignette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.8)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.65)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
): void {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const sw = img.naturalWidth * scale
  const sh = img.naturalHeight * scale
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
}

function renderBlur(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens,
  img?: HTMLImageElement
): void {
  if (img) {
    ctx.filter = 'blur(48px) brightness(0.65) saturate(1.2)'
    drawImageCover(ctx, img, w, h)
    ctx.filter = 'none'
  } else {
    // Fallback: mesh gradient when no image
    renderMesh(ctx, w, h, tokens)
  }

  // Gradient overlay
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, tokens.colors.primary + 'aa')
  g.addColorStop(0.5, 'rgba(0,0,0,0)')
  g.addColorStop(1, tokens.colors.accent + '66')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  addGrain(ctx, w, h, 0.05)
  addVignette(ctx, w, h)
}

function renderDuotone(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens,
  img?: HTMLImageElement
): void {
  if (img) {
    drawImageCover(ctx, img, w, h)
  } else {
    ctx.fillStyle = '#888'
    ctx.fillRect(0, 0, w, h)
  }

  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  const shadow = hexToRgb(tokens.colors.primary)
  const highlight = hexToRgb(tokens.colors.accent)

  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255
    d[i] = Math.round(shadow[0] + (highlight[0] - shadow[0]) * lum)
    d[i + 1] = Math.round(shadow[1] + (highlight[1] - shadow[1]) * lum)
    d[i + 2] = Math.round(shadow[2] + (highlight[2] - shadow[2]) * lum)
  }
  ctx.putImageData(imageData, 0, 0)

  addGrain(ctx, w, h, 0.07)
  addVignette(ctx, w, h)
}

function renderMesh(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens
): void {
  ctx.fillStyle = tokens.colors.bg
  ctx.fillRect(0, 0, w, h)

  const colors = [
    tokens.colors.primary,
    tokens.colors.accent,
    tokens.colors.secondary,
    tokens.colors.surface,
    tokens.colors.primary,
  ]
  const positions: [number, number][] = [
    [0.15, 0.15],
    [0.85, 0.3],
    [0.4, 0.55],
    [0.7, 0.78],
    [0.25, 0.88],
  ]

  positions.forEach(([cx, cy], i) => {
    const [r, g, b] = hexToRgb(colors[i % colors.length])
    const grad = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, w * 0.75)
    grad.addColorStop(0, `rgba(${r},${g},${b},0.8)`)
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  })

  addGrain(ctx, w, h, 0.04)
  addVignette(ctx, w, h)
}

export function renderWallpaper(
  canvas: HTMLCanvasElement,
  style: WallpaperStyle,
  tokens: DesignTokens,
  sourceImage?: HTMLImageElement
): void {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  if (style === 'blur') {
    renderBlur(ctx, W, H, tokens, sourceImage)
  } else if (style === 'duotone') {
    renderDuotone(ctx, W, H, tokens, sourceImage)
  } else {
    renderMesh(ctx, W, H, tokens)
  }
}

export const WALLPAPER_STYLES: { id: WallpaperStyle; label: string; desc: string }[] = [
  { id: 'blur', label: 'Blur + Grain', desc: 'Blurred source image with gradient overlay and film grain' },
  { id: 'duotone', label: 'Duotone', desc: 'Two-color tonal map derived from your palette' },
  { id: 'mesh', label: 'Abstract Mesh', desc: 'Layered radial gradient mesh using palette colors' },
]
