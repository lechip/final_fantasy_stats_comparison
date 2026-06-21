import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock Chart.js so we can inspect the config the component builds without a
// real canvas/WebGL context.
vi.mock('chart.js', () => {
  const Chart = vi.fn(function (el, cfg) {
    this.config = cfg
    this.data = cfg.data
    this.update = vi.fn()
    this.destroy = vi.fn()
  })
  Chart.register = vi.fn()
  return {
    Chart,
    RadarController: class {},
    RadialLinearScale: class {},
    PointElement: class {},
    LineElement: class {},
    Filler: class {},
    Tooltip: class {},
  }
})

import { Chart } from 'chart.js'
import StatRadar from '../../src/components/StatRadar.vue'
import { useComparison } from '../../src/composables/useComparison.js'
import { CHECKPOINTS } from '../../src/lib/stats.js'

const store = useComparison()

beforeEach(() => {
  Chart.mockClear()
  store.selectedIds.value = ['terra', 'sabin', 'relm']
  store.levelIndex.value = CHECKPOINTS.findIndex((c) => c.level === 50)
})

const lastConfig = () => Chart.mock.calls[0][1]

describe('StatRadar', () => {
  it('creates one radar dataset per selected character', () => {
    mount(StatRadar)
    const cfg = lastConfig()
    expect(cfg.type).toBe('radar')
    expect(cfg.data.datasets.map((d) => d.label)).toEqual(['Terra', 'Sabin', 'Relm'])
  })

  it('feeds six normalised (0..100) values plus the real numbers per dataset', () => {
    mount(StatRadar)
    const ds = lastConfig().data.datasets[0] // Terra
    expect(ds.data).toHaveLength(6)
    for (const v of ds.data) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(100)
    }
    expect(ds._real.HP).toBe(3719) // real value carried for the tooltip
    expect(ds.borderColor).toBe('#5AD17A') // Terra's colour
  })

  it('tooltip shows the real value, not the normalised percentage', () => {
    mount(StatRadar)
    const cfg = lastConfig()
    const ds = cfg.data.datasets[0]
    const ctx = { chart: { data: cfg.data }, dataIndex: 0, dataset: ds }
    expect(cfg.options.plugins.tooltip.callbacks.label(ctx)).toBe('Terra — HP: 3,719')
  })

  it('hides the meaningless radial tick numbers', () => {
    mount(StatRadar)
    expect(lastConfig().options.scales.r.ticks.display).toBe(false)
  })
})
