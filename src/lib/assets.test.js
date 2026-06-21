import { describe, it, expect } from 'vitest'
import { spriteUrl } from './assets.js'

const BASE = import.meta.env.BASE_URL // '/' under test

describe('spriteUrl', () => {
  it('defaults to the Pixel Remaster set', () => {
    expect(spriteUrl('terra.png')).toBe(`${BASE}sprites/remaster/terra.png`)
  })

  it('builds a path for the classic set', () => {
    expect(spriteUrl('umaro.png', 'classic')).toBe(`${BASE}sprites/classic/umaro.png`)
  })

  it('is prefixed by the base URL so it survives a Pages sub-path', () => {
    expect(spriteUrl('mog.png')).toMatch(/sprites\/remaster\/mog\.png$/)
    expect(spriteUrl('mog.png').startsWith(BASE)).toBe(true)
  })
})
