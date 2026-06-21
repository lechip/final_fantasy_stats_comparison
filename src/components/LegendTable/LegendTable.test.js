import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LegendTable from './LegendTable.vue'
import { useComparison } from '../../composables/useComparison.js'
import { CHECKPOINTS } from '../../lib/stats.js'

const store = useComparison()
let wrapper

beforeEach(() => {
  store.selectedIds.value = ['terra', 'sabin', 'relm']
  store.levelIndex.value = CHECKPOINTS.findIndex((c) => c.level === 50)
})
afterEach(() => {
  wrapper?.unmount()
  document.querySelectorAll('.stat-tooltip').forEach((n) => n.remove())
})

const tooltip = () => document.body.querySelector('.stat-tooltip')

describe('rendering', () => {
  it('shows an empty-state prompt with no characters selected', () => {
    store.selectedIds.value = []
    wrapper = mount(LegendTable)
    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('renders exact per-character values at the current level', () => {
    wrapper = mount(LegendTable)
    // Lv50 HP: Terra 3719, Sabin 3737, Relm 3716
    expect(wrapper.text()).toContain('3,719')
    expect(wrapper.text()).toContain('3,737')
    expect(wrapper.text()).toContain('3,716')
    expect(wrapper.findAll('.stat-name').map((s) => s.text())).toEqual([
      'HP', 'MP', 'Vigor', 'Speed', 'Stamina', 'Magic',
    ])
  })

  it('highlights the best value per row only when comparing 2+ characters', () => {
    wrapper = mount(LegendTable)
    expect(wrapper.findAll('.best')).toHaveLength(6) // one per stat row
    wrapper.unmount()
    store.selectedIds.value = ['terra']
    wrapper = mount(LegendTable)
    expect(wrapper.findAll('.best')).toHaveLength(0)
  })
})

describe('stat tooltips', () => {
  it('shows on mouse hover and hides on leave', async () => {
    wrapper = mount(LegendTable)
    const hp = wrapper.findAll('.stat-name')[0]
    await hp.trigger('pointerenter', { pointerType: 'mouse', clientX: 10, clientY: 10 })
    expect(tooltip()?.textContent).toContain('How much health')
    await hp.trigger('pointerleave', { pointerType: 'mouse' })
    expect(tooltip()).toBeNull()
  })

  // Regression: a touch tap used to flash-then-hide because emulated mouseenter
  // showed it and the click toggled it back off.
  it('does NOT show on a touch pointerenter (no flash)', async () => {
    wrapper = mount(LegendTable)
    await wrapper.findAll('.stat-name')[0].trigger('pointerenter', { pointerType: 'touch' })
    expect(tooltip()).toBeNull()
  })

  it('toggles on touch tap (pointerup) and hides on a second tap', async () => {
    wrapper = mount(LegendTable)
    const hp = wrapper.findAll('.stat-name')[0]
    await hp.trigger('pointerup', { pointerType: 'touch', clientX: 10, clientY: 10 })
    expect(tooltip()?.textContent).toContain('How much health')
    await hp.trigger('pointerup', { pointerType: 'touch', clientX: 10, clientY: 10 })
    expect(tooltip()).toBeNull()
  })

  it('switches to another stat on tap', async () => {
    wrapper = mount(LegendTable)
    const names = wrapper.findAll('.stat-name')
    await names[0].trigger('pointerup', { pointerType: 'touch', clientX: 10, clientY: 10 })
    await names[3].trigger('pointerup', { pointerType: 'touch', clientX: 10, clientY: 10 }) // Speed
    expect(tooltip()?.textContent).toContain('ATB')
  })
})
