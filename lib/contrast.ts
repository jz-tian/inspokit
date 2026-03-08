import chroma from 'chroma-js'

export function wcagRatio(fg: string, bg: string): number {
  return chroma.contrast(fg, bg)
}

export function passesAA(fg: string, bg: string): boolean {
  return wcagRatio(fg, bg) >= 4.5
}

/** Returns fg as-is if it passes AA against bg, else returns black or white (whichever has higher contrast) */
export function forcePassAA(fg: string, bg: string): string {
  if (passesAA(fg, bg)) return fg
  const onBlack = wcagRatio('#000000', bg)
  const onWhite = wcagRatio('#ffffff', bg)
  return onBlack > onWhite ? '#000000' : '#ffffff'
}
