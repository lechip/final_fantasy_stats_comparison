import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import CharacterSprite from '../../src/components/CharacterSprite.vue'
import { useComparison } from '../../src/composables/useComparison.js'
import { getCharacter } from '../../src/lib/stats.js'

const terra = getCharacter('terra')
const store = useComparison()

beforeEach(() => store.setSpriteStyle('remaster'))

function mountSprite(props = {}) {
  return mount(CharacterSprite, {
    props: { character: terra, selected: false, locked: false, ...props },
  })
}

describe('CharacterSprite', () => {
  it('renders the name and the current-style sprite', () => {
    const w = mountSprite()
    expect(w.text()).toContain('Terra')
    expect(w.find('img').attributes('src')).toContain('sprites/remaster/terra.png')
  })

  it('reflects the selected and locked states', () => {
    expect(mountSprite({ selected: true }).classes()).toContain('selected')
    const locked = mountSprite({ locked: true })
    expect(locked.classes()).toContain('locked')
    expect(locked.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits toggle with the character id on click', async () => {
    const w = mountSprite()
    await w.find('button').trigger('click')
    expect(w.emitted('toggle')[0]).toEqual(['terra'])
  })

  it('falls back to a coloured initial when the image fails to load', async () => {
    const w = mountSprite()
    await w.find('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('.fallback').text()).toBe('T')
  })

  it('swaps the sprite source when the style changes', async () => {
    const w = mountSprite()
    store.setSpriteStyle('classic')
    await nextTick()
    expect(w.find('img').attributes('src')).toContain('sprites/classic/terra.png')
  })
})
