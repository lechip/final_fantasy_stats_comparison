<script setup>
import { useComparison } from '../composables/useComparison.js'
import CharacterSprite from './CharacterSprite.vue'

const { CHARACTERS, isSelected, isFull, toggle, spriteStyle, setSpriteStyle } = useComparison()
</script>

<template>
  <div class="sprite-panel ff-window">
    <div class="panel-head">
      <span class="head-label pixel-shadow">SPRITES</span>
      <div class="style-toggle" role="group" aria-label="Sprite style">
        <button
          type="button"
          class="pixel-shadow"
          :class="{ active: spriteStyle === 'remaster' }"
          :aria-pressed="spriteStyle === 'remaster'"
          @click="setSpriteStyle('remaster')"
        >
          Remaster
        </button>
        <button
          type="button"
          class="pixel-shadow"
          :class="{ active: spriteStyle === 'classic' }"
          :aria-pressed="spriteStyle === 'classic'"
          @click="setSpriteStyle('classic')"
        >
          Classic
        </button>
      </div>
    </div>
    <div class="sprite-bar">
      <CharacterSprite
        v-for="c in CHARACTERS"
        :key="c.id"
        :character="c"
        :selected="isSelected(c.id)"
        :locked="!isSelected(c.id) && isFull"
        @toggle="toggle"
      />
    </div>
  </div>
</template>

<style scoped>
.sprite-panel {
  padding: 6px 8px 8px;
}
.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding: 0 2px;
}
.head-label {
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--ff-accent);
}
.style-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--ff-border-light);
  border-radius: 5px;
  overflow: hidden;
}
.style-toggle button {
  font-family: inherit;
  font-size: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.25);
  color: var(--ff-muted);
  border: none;
  cursor: pointer;
}
.style-toggle button.active {
  background: var(--ff-accent);
  color: #1a1230;
  text-shadow: none;
}
.style-toggle button:not(.active):hover {
  color: var(--ff-text);
}
.sprite-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
}
</style>
