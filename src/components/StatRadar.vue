<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { STAT_AXES, statsAtLevel, toNormalized } from '../lib/stats.js'
import { useComparison } from '../composables/useComparison.js'

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const { selectedCharacters, currentCheckpoint } = useComparison()
const canvas = ref(null)
let chart = null

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function buildData() {
  return {
    labels: STAT_AXES.map((s) => s.label),
    datasets: selectedCharacters.value.map((c) => {
      const real = statsAtLevel(c, currentCheckpoint.value)
      const realByLabel = {}
      STAT_AXES.forEach((s) => (realByLabel[s.label] = real[s.key]))
      return {
        label: c.name,
        data: toNormalized(real),
        _real: realByLabel,
        borderColor: c.color,
        backgroundColor: hexToRgba(c.color, 0.14),
        pointBackgroundColor: c.color,
        pointBorderColor: c.color,
        borderWidth: 2,
        pointRadius: 3,
      }
    }),
  }
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 200 },
  layout: { padding: 12 },
  plugins: {
    legend: { display: false },
    tooltip: {
      titleFont: { family: '"Press Start 2P", monospace', size: 9 },
      bodyFont: { family: '"Press Start 2P", monospace', size: 9 },
      callbacks: {
        label: (ctx) => {
          const axis = ctx.chart.data.labels[ctx.dataIndex]
          return `${ctx.dataset.label} — ${axis}: ${ctx.dataset._real[axis].toLocaleString()}`
        },
      },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: { display: false, stepSize: 25, backdropColor: 'transparent' },
      grid: { color: 'rgba(255,255,255,0.18)' },
      angleLines: { color: 'rgba(255,255,255,0.18)' },
      pointLabels: { color: '#ffffff', font: { family: '"Press Start 2P", monospace', size: 9 } },
    },
  },
}

onMounted(() => {
  chart = new Chart(canvas.value, { type: 'radar', data: buildData(), options })
})
onBeforeUnmount(() => chart?.destroy())

watch(
  [selectedCharacters, currentCheckpoint],
  () => {
    if (!chart) return
    chart.data = buildData()
    chart.update()
  },
  { deep: true },
)
</script>

<template>
  <div class="radar-wrap">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.radar-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
}
</style>
