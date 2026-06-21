<script setup>
import { computed } from 'vue'
import { STAT_AXES, statsAtLevel } from '../lib/stats.js'
import { useComparison } from '../composables/useComparison.js'

const { selectedCharacters, currentCheckpoint } = useComparison()

const rows = computed(() =>
  STAT_AXES.map((axis) => ({
    label: axis.label,
    values: selectedCharacters.value.map((c) => statsAtLevel(c, currentCheckpoint.value)[axis.key]),
  })),
)
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
          <td class="stat-col pixel-shadow">{{ row.label }}</td>
          <td v-for="(v, i) in row.values" :key="i" class="num">{{ v.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
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
.num {
  font-variant-numeric: tabular-nums;
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
