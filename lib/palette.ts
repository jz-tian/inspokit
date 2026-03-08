import chroma from 'chroma-js'

type RGB = [number, number, number]

function avgColor(pixels: RGB[]): RGB {
  const n = pixels.length
  return [
    Math.round(pixels.reduce((s, p) => s + p[0], 0) / n),
    Math.round(pixels.reduce((s, p) => s + p[1], 0) / n),
    Math.round(pixels.reduce((s, p) => s + p[2], 0) / n),
  ]
}

function splitBucket(pixels: RGB[]): [RGB[], RGB[]] {
  const ranges = ([0, 1, 2] as const).map(ch => {
    const vals = pixels.map(p => p[ch])
    return Math.max(...vals) - Math.min(...vals)
  })
  const axis = ranges.indexOf(Math.max(...ranges)) as 0 | 1 | 2
  const sorted = [...pixels].sort((a, b) => a[axis] - b[axis])
  const mid = Math.floor(sorted.length / 2)
  return [sorted.slice(0, mid), sorted.slice(mid)]
}

export function medianCut(pixels: RGB[], count: number): string[] {
  let buckets: RGB[][] = [pixels]
  while (buckets.length < count) {
    const largest = buckets.reduce((a, b) => (a.length > b.length ? a : b))
    const idx = buckets.indexOf(largest)
    const [left, right] = splitBucket(largest)
    buckets.splice(idx, 1, left, right)
  }
  return buckets
    .filter(b => b.length > 0)
    .map(b => {
      const [r, g, b2] = avgColor(b)
      return chroma(r, g, b2).hex()
    })
    .slice(0, count)
}

export async function extractPalette(imageEl: HTMLImageElement): Promise<string[]> {
  const canvas = document.createElement('canvas')
  const size = 200
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(imageEl, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const pixels: RGB[] = []
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
    if (a > 128) pixels.push([r, g, b])
  }
  const colors = medianCut(pixels, 6)
  return colors.sort((a, b) => chroma(a).luminance() - chroma(b).luminance())
}
