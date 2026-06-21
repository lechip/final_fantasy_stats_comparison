import { describe, it, expect, beforeEach } from 'vitest'
import { useComparison } from './useComparison.js'
import { CHECKPOINTS } from '../lib/stats.js'

// Module-scoped singleton — reset to defaults before each test.
const store = useComparison()
const LV50 = CHECKPOINTS.findIndex((c) => c.level === 50)

beforeEach(() => {
  store.selectedIds.value = ['terra', 'sabin', 'relm']
  store.levelIndex.value = LV50
  store.setSpriteStyle('remaster')
})

describe('defaults', () => {
  it('starts mid-level (Lv 50) with a three-character party', () => {
    expect(store.currentCheckpoint.value.level).toBe(50)
    expect(store.selectedIds.value).toEqual(['terra', 'sabin', 'relm'])
    expect(store.MAX).toBe(4)
  })

  it('derives selectedCharacters from the ids, in order', () => {
    expect(store.selectedCharacters.value.map((c) => c.id)).toEqual(['terra', 'sabin', 'relm'])
  })
})

describe('toggle', () => {
  it('adds an unselected character', () => {
    store.toggle('edgar')
    expect(store.isSelected('edgar')).toBe(true)
    expect(store.selectedIds.value).toHaveLength(4)
  })

  it('removes an already-selected character', () => {
    store.toggle('terra')
    expect(store.isSelected('terra')).toBe(false)
    expect(store.selectedIds.value).toHaveLength(2)
  })

  it('locks at four — a fifth selection is ignored', () => {
    store.toggle('edgar') // 4th
    expect(store.isFull.value).toBe(true)
    store.toggle('cyan') // 5th, blocked
    expect(store.isSelected('cyan')).toBe(false)
    expect(store.selectedIds.value).toHaveLength(4)
  })

  it('frees a slot again after deselecting', () => {
    store.toggle('edgar') // full
    store.toggle('terra') // free one
    expect(store.isFull.value).toBe(false)
    store.toggle('cyan')
    expect(store.isSelected('cyan')).toBe(true)
  })
})

describe('level + sprite style', () => {
  it('updates the current checkpoint when the level index changes', () => {
    store.levelIndex.value = CHECKPOINTS.findIndex((c) => c.level === 99)
    expect(store.currentCheckpoint.value.level).toBe(99)
  })

  it('switches the sprite style', () => {
    store.setSpriteStyle('classic')
    expect(store.spriteStyle.value).toBe('classic')
  })
})
