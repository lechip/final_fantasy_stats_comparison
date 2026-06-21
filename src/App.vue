<script setup>
import { onMounted } from 'vue'
import SpriteFilterBar from './components/SpriteFilterBar.vue'
import LevelControl from './components/LevelControl.vue'
import StatRadar from './components/StatRadar.vue'
import LegendTable from './components/LegendTable.vue'
import GithubLink from './components/GithubLink.vue'
import { runSanityChecks } from './lib/stats.js'

onMounted(() => {
  if (import.meta.env.DEV) runSanityChecks()
})
</script>

<template>
  <div class="app">
    <header class="topbar">
      <h1 class="title pixel-shadow">
        FINAL FANTASY <span class="vi">VI</span>
      </h1>
      <p class="subtitle pixel-shadow">Stat Comparison</p>
    </header>

    <SpriteFilterBar />
    <LevelControl />

    <main class="compare">
      <section class="panel ff-window">
        <h2 class="panel-title pixel-shadow">STATS</h2>
        <div class="panel-body"><StatRadar /></div>
      </section>
      <section class="panel ff-window">
        <h2 class="panel-title pixel-shadow">PARTY</h2>
        <div class="panel-body"><LegendTable /></div>
      </section>
    </main>

    <footer class="caveat">
      Sprites &amp; characters &copy; Square Enix — non-commercial fan project. Stats show natural
      growth (no Esper level-up bonuses).
      <GithubLink />
    </footer>
  </div>
</template>

<style scoped>
.app {
  /* min-height (not height) so the page can grow past one screen on very short
     viewports instead of clipping; the 1fr row still fills the screen when it fits. */
  min-height: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  gap: 10px;
}
.topbar {
  text-align: center;
}
.title {
  margin: 4px 0 0;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--ff-text);
}
.title .vi {
  color: var(--ff-accent);
}
.subtitle {
  margin: 4px 0 0;
  font-size: 9px;
  color: var(--ff-muted);
  letter-spacing: 2px;
}
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  /* Readable floor: the radar shrinks to fit down to ~this height, after which
     the page scrolls (via .app min-height) rather than the chart overflowing. */
  min-height: 280px;
}
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 8px 10px 10px;
}
.panel-title {
  margin: 0 0 6px;
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--ff-accent);
}
.panel-body {
  flex: 1;
  min-height: 0;
}
.caveat {
  text-align: center;
  font-size: 7px;
  line-height: 1.8;
  color: var(--ff-muted);
  padding: 0 8px;
}

@media (max-width: 760px) {
  .compare {
    grid-template-columns: 1fr;
  }
  .panel-body {
    min-height: 330px;
  }
}
</style>
