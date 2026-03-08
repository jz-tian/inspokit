import { medianCut } from '../palette'

type RGB = [number, number, number]

test('medianCut returns exactly N colors', () => {
  const pixels: RGB[] = Array.from({ length: 100 }, (_, i) => [i * 2, i, 255 - i])
  const result = medianCut(pixels, 6)
  expect(result).toHaveLength(6)
})

test('each color is a valid hex string', () => {
  const pixels: RGB[] = Array.from({ length: 50 }, (_, i) => [i * 5, 100, 200])
  const result = medianCut(pixels, 6)
  result.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/i))
})

test('medianCut handles small pixel arrays', () => {
  const pixels: RGB[] = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
  const result = medianCut(pixels, 3)
  expect(result).toHaveLength(3)
})

test('same input always produces same output (deterministic)', () => {
  const pixels: RGB[] = Array.from({ length: 80 }, (_, i) => [i * 3, 128, 200 - i])
  const r1 = medianCut(pixels, 6)
  const r2 = medianCut(pixels, 6)
  expect(r1).toEqual(r2)
})
