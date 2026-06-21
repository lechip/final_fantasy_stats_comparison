<script setup>
import { useComparison } from '../../composables/useComparison.js'

const { CHECKPOINTS, levelIndex, currentCheckpoint } = useComparison()
const maxIndex = CHECKPOINTS.length - 1
</script>

<template>
  <div class="level-control ff-window">
    <div class="head">
      <span class="lbl pixel-shadow">LEVEL</span>
      <span class="val pixel-shadow">Lv {{ currentCheckpoint.level }}</span>
    </div>
    <input
      class="slider"
      type="range"
      min="0"
      :max="maxIndex"
      step="1"
      :value="levelIndex"
      aria-label="Character level checkpoint"
      @input="levelIndex = Number($event.target.value)"
    />
    <div class="ticks">
      <button
        v-for="(cp, i) in CHECKPOINTS"
        :key="cp.level"
        type="button"
        class="tick pixel-shadow"
        :class="{ active: i === levelIndex }"
        @click="levelIndex = i"
      >
        {{ cp.level }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.level-control {
  padding: 8px 14px 10px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}
.lbl {
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--ff-muted);
}
.val {
  font-size: 13px;
  color: var(--ff-accent);
}
.slider {
  width: 100%;
  margin: 2px 0;
  accent-color: var(--ff-accent);
  cursor: pointer;
}
.ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}
.tick {
  background: transparent;
  border: none;
  color: var(--ff-muted);
  font-family: inherit;
  font-size: 8px;
  cursor: pointer;
  padding: 2px 4px;
}
.tick.active {
  color: var(--ff-accent);
}
.tick:hover {
  color: var(--ff-text);
}
</style>
