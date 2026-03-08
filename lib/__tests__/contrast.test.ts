import { wcagRatio, passesAA, forcePassAA } from '../contrast'

test('white on black passes AA', () => {
  expect(wcagRatio('#ffffff', '#000000')).toBeGreaterThan(7)
})

test('similar colors fail AA', () => {
  expect(passesAA('#888888', '#999999')).toBe(false)
})

test('forcePassAA returns black or white that passes', () => {
  const result = forcePassAA('#888888', '#ffffff')
  expect(['#000000', '#ffffff']).toContain(result)
  expect(passesAA(result, '#ffffff')).toBe(true)
})

test('forcePassAA keeps color if it already passes', () => {
  expect(forcePassAA('#000000', '#ffffff')).toBe('#000000')
})
