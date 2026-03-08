/** Analyses image pixels to infer atmosphere, mood, and creative direction */

export interface Vibe {
  label: string          // e.g. "Golden Hour"
  emoji: string          // single emoji
  description: string    // one evocative sentence
  mood: string           // e.g. "warm · intimate · nostalgic"
  energy: 'low' | 'medium' | 'high'
  warmth: 'warm' | 'cool' | 'neutral'
  brightness: 'dark' | 'mid' | 'bright'
  saturation: 'muted' | 'balanced' | 'vivid'
  copyTone: string       // suggested copy tone for landing pages
}

interface PixelStats {
  avgLum: number        // 0–1
  lumVariance: number   // contrast proxy
  avgSat: number        // 0–1
  avgHue: number        // 0–360
  hueVariance: number
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

export function analysePixels(imageEl: HTMLImageElement): PixelStats {
  const canvas = document.createElement('canvas')
  const size = 120
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(imageEl, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  let sumLum = 0, sumSat = 0, sumHue = 0, sumSin = 0, sumCos = 0
  let count = 0

  for (let i = 0; i < data.length; i += 8) {  // stride 2px
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 128) continue
    const [h, s, l] = rgbToHsl(r, g, b)
    sumLum += l
    sumSat += s
    sumHue += h
    // circular mean for hue
    sumSin += Math.sin(h * Math.PI / 180)
    sumCos += Math.cos(h * Math.PI / 180)
    count++
  }
  if (count === 0) return { avgLum: 0.5, lumVariance: 0.1, avgSat: 0.3, avgHue: 0, hueVariance: 0 }

  const avgLum = sumLum / count
  const avgSat = sumSat / count
  // circular mean hue
  const avgHue = (Math.atan2(sumSin / count, sumCos / count) * 180 / Math.PI + 360) % 360

  // variance pass for luminance
  let varSum = 0
  for (let i = 0; i < data.length; i += 8) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 128) continue
    const [, , l] = rgbToHsl(r, g, b)
    varSum += (l - avgLum) ** 2
  }
  const lumVariance = Math.sqrt(varSum / count)

  // hue spread (std dev of circular distance)
  let hueVarSum = 0
  for (let i = 0; i < data.length; i += 8) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 128) continue
    const [h] = rgbToHsl(r, g, b)
    let d = Math.abs(h - avgHue)
    if (d > 180) d = 360 - d
    hueVarSum += d * d
  }
  const hueVariance = Math.sqrt(hueVarSum / count)

  return { avgLum, lumVariance, avgSat, avgHue, hueVariance }
}

export function classifyVibe(stats: PixelStats): Vibe {
  const { avgLum, lumVariance, avgSat, avgHue } = stats

  const brightness: Vibe['brightness'] = avgLum < 0.35 ? 'dark' : avgLum > 0.65 ? 'bright' : 'mid'
  const saturation: Vibe['saturation'] = avgSat < 0.18 ? 'muted' : avgSat > 0.45 ? 'vivid' : 'balanced'
  const warmth: Vibe['warmth'] =
    (avgHue < 60 || avgHue > 300) ? 'warm' :
    (avgHue > 160 && avgHue < 260) ? 'cool' : 'neutral'
  const contrast = lumVariance > 0.22 ? 'high' : lumVariance > 0.1 ? 'medium' : 'low'

  // Match to named vibes
  if (brightness === 'dark' && contrast === 'high') {
    return {
      label: 'Cinematic Depth',
      emoji: '🎞',
      description: 'Dramatic contrasts and shadow — the atmosphere of a film still.',
      mood: 'dramatic · mysterious · powerful',
      energy: 'high', warmth, brightness, saturation,
      copyTone: 'Bold and authoritative. Short, punchy sentences. Let silence carry weight.',
    }
  }
  if (brightness === 'dark' && saturation === 'vivid') {
    return {
      label: 'Neon Nights',
      emoji: '🌃',
      description: 'Electric colour against darkness — urban energy after midnight.',
      mood: 'electric · edgy · alive',
      energy: 'high', warmth, brightness, saturation,
      copyTone: 'High-energy and direct. Use contrast. Make every word count.',
    }
  }
  if (brightness === 'dark' && saturation === 'muted') {
    return {
      label: 'Nordic Dusk',
      emoji: '🌫',
      description: 'Muted and contemplative — the quietude of a Scandinavian winter.',
      mood: 'still · introspective · refined',
      energy: 'low', warmth, brightness, saturation,
      copyTone: 'Restrained and thoughtful. Understate everything. Quality over quantity.',
    }
  }
  if (warmth === 'warm' && brightness !== 'dark' && saturation !== 'muted') {
    return {
      label: 'Golden Hour',
      emoji: '🌅',
      description: 'Bathed in amber light — the magic of late afternoon warmth.',
      mood: 'warm · nostalgic · intimate',
      energy: 'medium', warmth, brightness, saturation,
      copyTone: 'Warm and personal. Tell a story. Make people feel something.',
    }
  }
  if (warmth === 'cool' && brightness === 'bright' && saturation === 'muted') {
    return {
      label: 'Nordic Light',
      emoji: '🏔',
      description: 'Cool and crystalline — the clarity of open sky and clean air.',
      mood: 'clean · serene · minimal',
      energy: 'low', warmth, brightness, saturation,
      copyTone: 'Precise and calm. Say exactly what you mean. No filler.',
    }
  }
  if (saturation === 'vivid' && brightness === 'bright') {
    return {
      label: 'Tropical Vivid',
      emoji: '🌺',
      description: 'Saturated and alive — the exuberance of tropical colour.',
      mood: 'joyful · bold · energetic',
      energy: 'high', warmth, brightness, saturation,
      copyTone: 'Enthusiastic and vibrant. Use exclamation. Celebrate.',
    }
  }
  if (brightness === 'bright' && saturation === 'muted' && warmth !== 'warm') {
    return {
      label: 'Ethereal Bloom',
      emoji: '🌸',
      description: 'Soft and luminous — like morning light through sheer curtains.',
      mood: 'dreamy · delicate · poetic',
      energy: 'low', warmth, brightness, saturation,
      copyTone: 'Gentle and evocative. Use imagery. Let the words breathe.',
    }
  }
  if (warmth === 'neutral' && saturation === 'balanced') {
    return {
      label: 'Editorial Cool',
      emoji: '📐',
      description: 'Considered and geometric — the aesthetic of a design magazine.',
      mood: 'confident · structured · modern',
      energy: 'medium', warmth, brightness, saturation,
      copyTone: 'Clean and confident. Short headlines, detailed body. Let design talk.',
    }
  }
  // Fallback
  return {
    label: 'Earthy & Organic',
    emoji: '🌿',
    description: 'Grounded and textured — the richness of natural materials.',
    mood: 'grounded · honest · tactile',
    energy: 'medium', warmth, brightness, saturation,
    copyTone: 'Authentic and unpretentious. Connect to craft and origin.',
  }
}

export function extractVibe(imageEl: HTMLImageElement): Vibe {
  const stats = analysePixels(imageEl)
  return classifyVibe(stats)
}
