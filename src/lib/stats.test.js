import { describe, it, expect } from 'vitest'
import {
  CHARACTERS,
  CHECKPOINTS,
  STAT_AXES,
  AXIS_MAX,
  getCharacter,
  statsAtLevel,
  toNormalized,
} from './stats.js'

const terra = getCharacter('terra')
const lv50 = CHECKPOINTS.find((c) => c.level === 50)
const lv99 = CHECKPOINTS.find((c) => c.level === 99)

describe('data integrity', () => {
  it('has the 14 playable characters with unique ids and colors', () => {
    expect(CHARACTERS).toHaveLength(14)
    expect(new Set(CHARACTERS.map((c) => c.id)).size).toBe(14)
    expect(new Set(CHARACTERS.map((c) => c.color)).size).toBe(14)
  })

  it('each character has the fixed stats and hp/mp bonuses', () => {
    for (const c of CHARACTERS) {
      expect(c).toMatchObject({ id: expect.any(String), name: expect.any(String), sprite: expect.any(String) })
      for (const k of ['vigor', 'speed', 'stamina', 'magic']) {
        expect(typeof c.fixed[k]).toBe('number')
      }
      expect(typeof c.bonus.hp).toBe('number')
      expect(typeof c.bonus.mp).toBe('number')
    }
  })

  it('exposes 5 checkpoints with a monotonic, anchor-verified HP/MP curve', () => {
    expect(CHECKPOINTS.map((c) => c.level)).toEqual([10, 30, 50, 70, 99])
    expect(CHECKPOINTS.find((c) => c.level === 10).hpBase).toBe(173) // known anchor
    for (let i = 1; i < CHECKPOINTS.length; i++) {
      expect(CHECKPOINTS[i].hpBase).toBeGreaterThan(CHECKPOINTS[i - 1].hpBase)
      expect(CHECKPOINTS[i].mpBase).toBeGreaterThan(CHECKPOINTS[i - 1].mpBase)
    }
  })

  it('defines the six radar axes in order, each with a description', () => {
    expect(STAT_AXES.map((s) => s.key)).toEqual(['hp', 'mp', 'vigor', 'speed', 'stamina', 'magic'])
    for (const axis of STAT_AXES) expect(axis.desc.length).toBeGreaterThan(10)
  })

  it('total HP at the top checkpoint never exceeds the 9999 cap', () => {
    const maxHp = Math.max(...CHARACTERS.map((c) => statsAtLevel(c, lv99).hp))
    expect(maxHp).toBeLessThanOrEqual(9999)
  })
})

describe('getCharacter', () => {
  it('returns the character for a known id', () => {
    expect(getCharacter('terra').name).toBe('Terra')
  })
  it('returns undefined for an unknown id', () => {
    expect(getCharacter('chocobo')).toBeUndefined()
  })
})

describe('statsAtLevel', () => {
  it('adds the universal baseline to the per-character bonus for HP/MP', () => {
    const s = statsAtLevel(terra, lv50) // baseline hp 3679 / mp 598, terra bonus +40 / +16
    expect(s.hp).toBe(3679 + 40)
    expect(s.mp).toBe(598 + 16)
  })

  it('returns the fixed stats verbatim', () => {
    const s = statsAtLevel(terra, lv50)
    expect(s).toMatchObject({ vigor: 31, speed: 33, stamina: 28, magic: 39 })
  })

  it('grows HP/MP with level but leaves the four fixed stats unchanged', () => {
    const low = statsAtLevel(terra, CHECKPOINTS[0])
    const high = statsAtLevel(terra, lv99)
    expect(high.hp).toBeGreaterThan(low.hp)
    expect(high.mp).toBeGreaterThan(low.mp)
    expect(high.vigor).toBe(low.vigor)
    expect(high.speed).toBe(low.speed)
    expect(high.stamina).toBe(low.stamina)
    expect(high.magic).toBe(low.magic)
  })
})

describe('AXIS_MAX', () => {
  it('uses the highest natural value for fixed stats', () => {
    expect(AXIS_MAX.vigor).toBe(57) // Umaro
    expect(AXIS_MAX.speed).toBe(40) // Locke
    expect(AXIS_MAX.stamina).toBe(46) // Umaro
    expect(AXIS_MAX.magic).toBe(44) // Relm
  })
  it('uses the highest level-99 total for HP/MP', () => {
    expect(AXIS_MAX.hp).toBe(9748 + 60) // Umaro bonus
    expect(AXIS_MAX.mp).toBe(989 + 18) // Relm bonus
  })
})

describe('toNormalized', () => {
  it('returns six values within 0..100 in axis order', () => {
    const n = toNormalized(statsAtLevel(terra, lv50))
    expect(n).toHaveLength(6)
    for (const v of n) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(100)
    }
  })

  it('puts the stat leader at 100 on its axis', () => {
    const umaro = getCharacter('umaro')
    const n = toNormalized(statsAtLevel(umaro, lv99))
    expect(n[STAT_AXES.findIndex((s) => s.key === 'hp')]).toBe(100) // top HP at Lv99
    expect(n[STAT_AXES.findIndex((s) => s.key === 'vigor')]).toBe(100) // top Vigor
    expect(n[STAT_AXES.findIndex((s) => s.key === 'stamina')]).toBe(100) // top Stamina
  })

  it('shrinks the HP/MP axes at lower levels (normalised to the Lv99 ceiling)', () => {
    const i = STAT_AXES.findIndex((s) => s.key === 'hp')
    const low = toNormalized(statsAtLevel(terra, CHECKPOINTS[0]))[i]
    const high = toNormalized(statsAtLevel(terra, lv99))[i]
    expect(high).toBeGreaterThan(low)
    expect(low).toBeLessThan(20)
  })
})
