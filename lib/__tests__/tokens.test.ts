import { generateTokens, tokensToCSS, tokensToJSON } from '../tokens'
import type { Controls } from '../../types'

const palette = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560', '#f5f5f5']
const controls: Controls = { roundedness: 0.5, boldness: 0.5, contrast: 0.5 }

test('generateTokens returns valid tokens with hex colors', () => {
  const tokens = generateTokens(palette, controls, null)
  expect(tokens.colors.bg).toMatch(/^#/)
  expect(tokens.colors.text).toMatch(/^#/)
  expect(tokens.fontPairing).toBeDefined()
  expect(tokens.fontPairing.heading).toBeTruthy()
})

test('tokensToCSS produces CSS variables', () => {
  const tokens = generateTokens(palette, controls, null)
  const css = tokensToCSS(tokens)
  expect(css).toContain(':root')
  expect(css).toContain('--color-bg')
  expect(css).toContain('--color-primary')
})

test('tokensToJSON is valid JSON', () => {
  const tokens = generateTokens(palette, controls, null)
  const json = tokensToJSON(tokens)
  expect(() => JSON.parse(json)).not.toThrow()
})

test('roundedness=1 produces larger radius than roundedness=0', () => {
  const hi = generateTokens(palette, { ...controls, roundedness: 1 }, null)
  const lo = generateTokens(palette, { ...controls, roundedness: 0 }, null)
  expect(parseInt(hi.radii.md)).toBeGreaterThan(parseInt(lo.radii.md))
})

test('font override 2 uses Space Grotesk', () => {
  const tokens = generateTokens(palette, controls, 2)
  expect(tokens.fontPairing.heading).toBe('Space Grotesk')
})

test('text color passes WCAG AA against bg', () => {
  const tokens = generateTokens(palette, controls, null)
  const { passesAA } = require('../contrast')
  expect(passesAA(tokens.colors.text, tokens.colors.bg)).toBe(true)
})
