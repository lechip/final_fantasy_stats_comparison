<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { STAT_AXES, statsAtLevel } from '../../lib/stats.js'
import { useComparison } from '../../composables/useComparison.js'

const { selectedCharacters, currentCheckpoint } = useComparison()

const rows = computed(() =>
  STAT_AXES.map((axis) => {
    const values = selectedCharacters.value.map(
      (c) => statsAtLevel(c, currentCheckpoint.value)[axis.key],
    )
    const max = Math.max(...values)
    return { label: axis.label, desc: axis.desc, values, max }
  }),
)

// Themed tooltip describing each stat (teleported to body so the scrollable
// panel never clips it). Mouse = hover; touch = tap to toggle, tap-away to
// dismiss; keyboard = reveal on focus.
const tip = ref(null) // { desc, x, y }
function place(x, y, desc) {
  tip.value = {
    desc,
    x: Math.max(8, Math.min(x + 14, window.innerWidth - 244)),
    y: Math.min(y + 16, window.innerHeight - 90),
  }
}

let docBound = false
function onDocDown(e) {
  if (!(e.target.closest && e.target.closest('.stat-name'))) hideTip()
}
function hideTip() {
  tip.value = null
  if (docBound) {
    document.removeEventListener('pointerdown', onDocDown, true)
    docBound = false
  }
}

// Mouse only: show/follow on hover, hide on leave.
function onHover(e, desc) {
  if (e.pointerType === 'mouse') place(e.clientX, e.clientY, desc)
}
function onLeave(e) {
  if (!e || e.pointerType === 'mouse') hideTip()
}
// Touch / pen: tap toggles; a tap elsewhere dismisses it.
function onTap(e, desc) {
  if (e.pointerType === 'mouse') return
  if (tip.value && tip.value.desc === desc) {
    hideTip()
    return
  }
  place(e.clientX, e.clientY, desc)
  if (!docBound) {
    document.addEventListener('pointerdown', onDocDown, true)
    docBound = true
  }
}
// Keyboard only: reveal on focus-visible (not the focus that follows a tap).
function onFocus(e, desc) {
  let keyboard = false
  try {
    keyboard = e.target.matches(':focus-visible')
  } catch {
    keyboard = false // browser without :focus-visible support
  }
  if (keyboard) {
    const r = e.target.getBoundingClientRect()
    place(r.right, r.top, desc)
  }
}
onUnmounted(hideTip)
</script>

<template>
  <div class="legend-table">
    <p v-if="!selectedCharacters.length" class="empty pixel-shadow">
      Select up to 4 characters above to compare their stats.
    </p>
    <table v-else>
      <thead>
        <tr>
          <th class="stat-col pixel-shadow">STAT</th>
          <th v-for="c in selectedCharacters" :key="c.id" :style="{ color: c.color }">
            <span class="dot" :style="{ background: c.color }"></span>
            <span class="cname">{{ c.name }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.label">
          <td class="stat-col pixel-shadow">
            <span
              class="stat-name"
              tabindex="0"
              :aria-label="`${row.label}: ${row.desc}`"
              @pointerenter="onHover($event, row.desc)"
              @pointermove="onHover($event, row.desc)"
              @pointerleave="onLeave"
              @pointerup="onTap($event, row.desc)"
              @focus="onFocus($event, row.desc)"
              @blur="hideTip"
              >{{ row.label }}</span
            >
          </td>
          <td
            v-for="(v, i) in row.values"
            :key="i"
            class="num"
            :class="{ best: selectedCharacters.length > 1 && v === row.max }"
          >
            {{ v.toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <div
        v-if="tip"
        class="stat-tooltip ff-window pixel-shadow"
        :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
      >
        {{ tip.desc }}
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.legend-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.empty {
  color: var(--ff-muted);
  font-size: 10px;
  text-align: center;
  padding: 24px 12px;
  line-height: 1.8;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
}
th,
td {
  padding: 6px 6px;
  text-align: right;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  white-space: nowrap;
}
thead th {
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, #2c46b4, #1b2b76);
  font-size: 8px;
}
.stat-col {
  text-align: left;
  color: var(--ff-muted);
}
.stat-name {
  cursor: help;
  border-bottom: 1px dotted var(--ff-muted);
  outline: none;
}
.stat-name:hover,
.stat-name:focus {
  color: var(--ff-text);
  border-bottom-color: var(--ff-accent);
}
.num {
  font-variant-numeric: tabular-nums;
}
.best {
  color: var(--ff-accent);
}
.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.cname {
  vertical-align: middle;
}
</style>

<!-- Teleported tooltip lives at the document root; style it globally. -->
<style>
.stat-tooltip {
  position: fixed;
  z-index: 1000;
  max-width: 230px;
  padding: 8px 10px;
  font-family: var(--font-pixel);
  font-size: 8px;
  line-height: 1.7;
  color: var(--ff-text);
  pointer-events: none;
}
</style>
