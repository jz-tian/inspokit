import type { DesignTokens, Subject } from '@/types'

export const SOCIAL_FORMATS = [
  'post',
  'portrait',
  'story',
  'carousel-1',
  'carousel-2',
  'carousel-3',
  'carousel-4',
  'carousel-5',
] as const

export type SocialFormat = (typeof SOCIAL_FORMATS)[number]

export const FORMAT_LABELS: Record<SocialFormat, string> = {
  post: 'Post 1:1 (1080×1080)',
  portrait: 'Portrait 4:5 (1080×1350)',
  story: 'Story 9:16 (1080×1920)',
  'carousel-1': 'Carousel Slide 1',
  'carousel-2': 'Carousel Slide 2',
  'carousel-3': 'Carousel Slide 3',
  'carousel-4': 'Carousel Slide 4',
  'carousel-5': 'Carousel Slide 5',
}

const SIZES: Record<SocialFormat, [number, number]> = {
  post: [1080, 1080],
  portrait: [1080, 1350],
  story: [1080, 1920],
  'carousel-1': [1080, 1350],
  'carousel-2': [1080, 1350],
  'carousel-3': [1080, 1350],
  'carousel-4': [1080, 1350],
  'carousel-5': [1080, 1350],
}

type GradStyle = 'linear' | 'radial' | 'mesh'

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

function drawGradientBg(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens,
  style: GradStyle
) {
  if (style === 'linear') {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, tokens.colors.primary)
    g.addColorStop(1, tokens.colors.accent)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  } else if (style === 'radial') {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.4)
    g.addColorStop(0, tokens.colors.accent)
    g.addColorStop(0.6, tokens.colors.primary)
    g.addColorStop(1, tokens.colors.bg)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  } else {
    // mesh
    ctx.fillStyle = tokens.colors.bg
    ctx.fillRect(0, 0, w, h)
    const colors = [tokens.colors.primary, tokens.colors.accent, tokens.colors.secondary]
    const positions: [number, number][] = [
      [0.2, 0.25],
      [0.82, 0.7],
      [0.5, 0.05],
    ]
    positions.forEach(([cx, cy], i) => {
      const [r, g, b] = hexToRgb(colors[i % colors.length])
      const grad = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, w * 0.65)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.75)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    })
  }
}

function drawDecorativeShapes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens
) {
  // Subtle circle accent top-right
  ctx.beginPath()
  ctx.arc(w * 0.9, h * 0.1, w * 0.18, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()

  // Small circle bottom-left
  ctx.beginPath()
  ctx.arc(w * 0.08, h * 0.9, w * 0.1, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fill()

  // Accent bar
  ctx.fillStyle = tokens.colors.accent
  ctx.fillRect(w * 0.08, h * 0.39, w * 0.07, Math.max(3, w * 0.004))
}

function drawText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens,
  slideNum?: number
) {
  const heading = slideNum ? `Slide ${slideNum} of 5` : 'Your Brand'
  const sub = slideNum
    ? slideNum < 5
      ? 'Swipe to continue →'
      : 'That&apos;s a wrap. Visit us.'
    : 'Design systems that inspire'

  const headingSize = Math.round(w * 0.075)
  const subSize = Math.round(w * 0.038)
  const margin = w * 0.08
  const yBase = h * 0.44

  // Heading
  ctx.fillStyle = tokens.colors.text
  ctx.font = `${tokens.fontWeights.heading} ${headingSize}px serif`
  ctx.textAlign = 'left'
  ctx.fillText(heading, margin, yBase)

  // Sub
  ctx.fillStyle = tokens.colors.textMuted.startsWith('rgba')
    ? tokens.colors.text + '99'
    : tokens.colors.text + '99'
  ctx.font = `${tokens.fontWeights.body} ${subSize}px sans-serif`
  ctx.fillText(sub, margin, yBase + headingSize * 1.4)
}

/** Draw a subject-inspired visual motif on the canvas */
function drawSubjectMotif(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  subject: Subject,
  color: string
) {
  ctx.save()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.09

  const s = w / 200 // scale factor

  switch (subject.category) {
    case 'bird': {
      // Spread wings at upper portion of card
      ctx.translate(w * 0.68, h * 0.22)
      ctx.scale(s * 2.2, s * 2.2)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-14, -16, -42, -10, -62, 8)
      ctx.bezierCurveTo(-36, 2, -16, 14, 0, 0)
      ctx.bezierCurveTo(16, 14, 36, 2, 62, 8)
      ctx.bezierCurveTo(42, -10, 14, -16, 0, 0)
      ctx.fill()
      // Tail
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-5, 8, -7, 22, 0, 27)
      ctx.bezierCurveTo(7, 22, 5, 8, 0, 0)
      ctx.fill()
      break
    }
    case 'flower': {
      // 8-petal flower in lower-right
      ctx.translate(w * 0.78, h * 0.72)
      ctx.scale(s * 3.2, s * 3.2)
      for (let angle = 0; angle < 360; angle += 45) {
        ctx.save()
        ctx.rotate((angle * Math.PI) / 180)
        ctx.beginPath()
        ctx.ellipse(0, -28, 10, 23, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.beginPath()
      ctx.arc(0, 0, 12, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'person': {
      // Elegant fashion silhouette — head + flowing dress
      ctx.translate(w * 0.82, h * 0.28)
      ctx.scale(s * 2.5, s * 2.5)
      ctx.beginPath()
      ctx.arc(0, -48, 13, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-13, -34)
      ctx.bezierCurveTo(-14, -14, -26, 18, -32, 60)
      ctx.lineTo(32, 60)
      ctx.bezierCurveTo(26, 18, 14, -14, 13, -34)
      ctx.fill()
      break
    }
    case 'coastal': {
      // Wave band across bottom third
      ctx.translate(0, h * 0.72)
      for (let layer = 0; layer < 3; layer++) {
        ctx.save()
        ctx.globalAlpha = 0.07 - layer * 0.018
        ctx.beginPath()
        ctx.moveTo(-10, layer * 28)
        for (let x = 0; x <= w + 10; x += 8) {
          const y = Math.sin((x * 0.012) + layer * 1.6) * 24 + layer * 28
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w + 10, h)
        ctx.lineTo(-10, h)
        ctx.fill()
        ctx.restore()
      }
      break
    }
    case 'landscape': {
      // Mountain ridge at bottom
      ctx.translate(0, h * 0.68)
      ctx.beginPath()
      ctx.moveTo(-20, h)
      ctx.lineTo(w * 0.15, h * 0.1)
      ctx.lineTo(w * 0.3, h * 0.35)
      ctx.lineTo(w * 0.5, -h * 0.05)
      ctx.lineTo(w * 0.65, h * 0.25)
      ctx.lineTo(w * 0.82, h * 0.05)
      ctx.lineTo(w + 20, h * 0.4)
      ctx.lineTo(w + 20, h)
      ctx.fill()
      break
    }
    case 'urban': {
      // Building skyline right side
      ctx.translate(w * 0.55, h)
      const buildings = [
        { x: 0, bw: 55, bh: -h * 0.38 },
        { x: 60, bw: 38, bh: -h * 0.22 },
        { x: 103, bw: 62, bh: -h * 0.48 },
        { x: 170, bw: 45, bh: -h * 0.31 },
        { x: 220, bw: 70, bh: -h * 0.42 },
      ]
      buildings.forEach(b => ctx.fillRect(b.x, 0, b.bw, b.bh))
      break
    }
    default: {
      // Abstract circles for food, animal, unknown
      const spots: [number, number, number][] = [[0.8, 0.15, 0.14], [0.15, 0.75, 0.09], [0.88, 0.65, 0.06]]
      spots.forEach(([cx, cy, r]) => {
        ctx.save()
        ctx.globalAlpha = 0.06
        ctx.beginPath()
        ctx.arc(cx * w, cy * h, r * w, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }
  }

  ctx.restore()
}

/** Large ghosted subject label — editorial typographic background element */
function drawSubjectTypo(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  subject: Subject,
  color: string
) {
  ctx.save()
  ctx.globalAlpha = 0.055
  ctx.fillStyle = color
  const size = Math.round(w * 0.22)
  ctx.font = `900 ${size}px serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText(subject.label.toUpperCase(), w * 0.94, h * 0.97)
  ctx.restore()
}

function drawBranding(ctx: CanvasRenderingContext2D, w: number, h: number, tokens: DesignTokens) {
  ctx.fillStyle = tokens.colors.text + '55'
  ctx.font = `400 ${Math.round(w * 0.026)}px sans-serif`
  ctx.textAlign = 'right'
  ctx.fillText('Brand · @handle', w * 0.92, h * 0.95)
}

function drawCarouselProgress(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tokens: DesignTokens,
  slide: number
) {
  const total = 5
  const barW = (w * 0.6) / total
  const gap = 4
  const startX = w * 0.2
  const y = h * 0.96

  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i < slide ? tokens.colors.accent : 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.roundRect(startX + i * (barW + gap), y - 3, barW - gap, 4, 2)
    ctx.fill()
  }
}

export function renderSocialTemplate(
  canvas: HTMLCanvasElement,
  format: SocialFormat,
  tokens: DesignTokens,
  subjects: Subject[] = []
): void {
  const [w, h] = SIZES[format]
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const slideNum = format.startsWith('carousel-')
    ? parseInt(format.split('-')[1])
    : undefined

  // Pick gradient style based on format
  const styles: GradStyle[] = ['linear', 'radial', 'mesh', 'linear', 'radial']
  const styleIdx =
    format === 'post'
      ? 0
      : format === 'portrait'
        ? 1
        : format === 'story'
          ? 2
          : (slideNum! - 1) % 3

  drawGradientBg(ctx, w, h, tokens, styles[styleIdx])

  // Subject-derived visual elements
  if (subjects.length > 0) {
    drawSubjectMotif(ctx, w, h, subjects[0], tokens.colors.text)
    drawSubjectTypo(ctx, w, h, subjects[0], tokens.colors.text)
  }

  drawDecorativeShapes(ctx, w, h, tokens)
  drawText(ctx, w, h, tokens, slideNum)
  drawBranding(ctx, w, h, tokens)

  if (slideNum) {
    drawCarouselProgress(ctx, w, h, tokens, slideNum)
  }
}
