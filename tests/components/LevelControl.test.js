import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LevelControl from '../../src/components/LevelControl.vue'
import { useComparison } from '../../src/composables/useComparison.js'
import { CHECKPOINTS } from '../../src/lib/stats.js'

const store = useComparison()
beforeEach(() => {
  store.levelIndex.value = CHECKPOINTS.findIndex((c) => c.level === 50)
})

describe('LevelControl', () => {
  it('shows the current level and one tick per checkpoint', () => {
    const w = mount(LevelControl)
    expect(w.find('.val').text()).toContain('Lv 50')
    const ticks = w.findAll('.tick')
    expect(ticks).toHaveLength(CHECKPOINTS.length)
    expect(ticks.map((t) => t.text())).toEqual(['10', '30', '50', '70', '99'])
  })

  it('jumps to a checkpoint when its tick is clicked', async () => {
    const w = mount(LevelControl)
    await w.findAll('.tick').find((t) => t.text() === '99').trigger('click')
    expect(store.currentCheckpoint.value.level).toBe(99)
    expect(w.find('.val').text()).toContain('Lv 99')
  })

  it('updates the level when the slider moves', async () => {
    const w = mount(LevelControl)
    await w.find('input[type="range"]').setValue(0)
    expect(store.currentCheckpoint.value.level).toBe(10)
  })
})
