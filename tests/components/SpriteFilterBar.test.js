import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SpriteFilterBar from '../../src/components/SpriteFilterBar.vue'
import { useComparison } from '../../src/composables/useComparison.js'

const store = useComparison()
beforeEach(() => {
  store.selectedIds.value = []
  store.setSpriteStyle('remaster')
})

describe('SpriteFilterBar', () => {
  it('renders all 14 character sprites', () => {
    const w = mount(SpriteFilterBar)
    expect(w.findAll('.sprite')).toHaveLength(14)
  })

  it('toggles a character on click', async () => {
    const w = mount(SpriteFilterBar)
    await w.findAll('.sprite')[0].trigger('click') // Terra
    expect(store.isSelected('terra')).toBe(true)
  })

  it('switches sprite style via the toggle', async () => {
    const w = mount(SpriteFilterBar)
    const classic = w.findAll('.style-toggle button').find((b) => b.text() === 'Classic')
    await classic.trigger('click')
    expect(store.spriteStyle.value).toBe('classic')
    expect(classic.classes()).toContain('active')
  })

  it('locks unselected sprites once four are chosen', () => {
    store.selectedIds.value = ['terra', 'locke', 'cyan', 'shadow']
    const w = mount(SpriteFilterBar)
    // Edgar is the 5th character in roster order and is not selected -> locked.
    const edgar = w.findAll('.sprite')[4]
    expect(edgar.classes()).toContain('locked')
    expect(edgar.attributes('disabled')).toBeDefined()
  })
})
