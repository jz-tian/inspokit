import { generateLandingHTML } from '../generators/landing'
import type { DesignTokens } from '../../types'

const mockTokens: DesignTokens = {
  colors: {
    bg: '#0a0a0a',
    surface: '#1a1a1a',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    text: '#f5f5f5',
    textMuted: 'rgba(245,245,245,0.55)',
  },
  radii: { sm: '4px', md: '8px', lg: '16px', full: '9999px' },
  shadows: {
    sm: '0 1px 4px rgba(0,0,0,.2)',
    md: '0 4px 16px rgba(0,0,0,.25)',
    lg: '0 8px 32px rgba(0,0,0,.3)',
  },
  fontWeights: { body: 400, heading: 700 },
  fontPairing: {
    id: 1,
    heading: 'Playfair Display',
    body: 'Inter',
    importUrl:
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap',
  },
  gradients: {
    linear: 'linear-gradient(135deg,#3b82f6,#f59e0b)',
    radial: 'radial-gradient(#f59e0b,#3b82f6)',
    mesh: 'radial-gradient(ellipse at 20% 30%, #3b82f6b3 0%, transparent 60%)',
  },
}

test('generates valid HTML for hero-left', () => {
  const html = generateLandingHTML('hero-left', mockTokens)
  expect(html).toContain('<!DOCTYPE html>')
  expect(html).toContain('--color-bg')
  expect(html).toContain('<nav')
  expect(html).toContain('<footer')
})

test('generates valid HTML for centered', () => {
  const html = generateLandingHTML('centered', mockTokens)
  expect(html).toContain('<!DOCTYPE html>')
  expect(html).toContain('centered')
})

test('generates valid HTML for split', () => {
  const html = generateLandingHTML('split', mockTokens)
  expect(html).toContain('<!DOCTYPE html>')
})

test('all 3 templates generate without throwing', () => {
  for (const tpl of ['hero-left', 'centered', 'split'] as const) {
    expect(() => generateLandingHTML(tpl, mockTokens)).not.toThrow()
  }
})

test('includes Google Font import', () => {
  const html = generateLandingHTML('hero-left', mockTokens)
  expect(html).toContain('fonts.googleapis.com')
})

test('includes feature cards', () => {
  const html = generateLandingHTML('hero-left', mockTokens)
  expect(html).toContain('Feature One')
  expect(html).toContain('Feature Two')
})
