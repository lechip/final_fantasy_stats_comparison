<script setup>
import { ref } from 'vue'
import { spriteUrl } from '../lib/assets.js'

const props = defineProps({
  character: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])
const failed = ref(false)
</script>

<template>
  <button
    type="button"
    class="sprite"
    :class="{ selected, locked }"
    :style="{ '--c': character.color }"
    :disabled="locked"
    :title="locked ? 'Deselect another character first (max 4)' : character.name"
    :aria-pressed="selected"
    @click="emit('toggle', character.id)"
  >
    <span class="img-box">
      <img
        v-if="!failed"
        :src="spriteUrl(character.sprite)"
        :alt="character.name"
        @error="failed = true"
      />
      <span v-else class="fallback" :style="{ background: character.color }">{{
        character.name[0]
      }}</span>
    </span>
    <span class="name pixel-shadow">{{ character.name }}</span>
  </button>
</template>

<style scoped>
.sprite {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 56px;
  padding: 4px 2px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--ff-text);
  font-family: inherit;
}
.img-box {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 2px solid transparent;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.25);
  transition:
    border-color 0.12s,
    box-shadow 0.12s,
    filter 0.12s;
}
.img-box img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.fallback {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  color: #0a1024;
  font-size: 16px;
  text-shadow: none;
}
.name {
  font-size: 7px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Deselected: grayed out */
.sprite:not(.selected) .img-box {
  filter: grayscale(1) brightness(0.6);
}
.sprite:not(.selected) .name {
  color: var(--ff-muted);
}

/* Selected: glow in the character's color */
.sprite.selected .img-box {
  border-color: var(--c);
  box-shadow:
    0 0 0 1px var(--c),
    0 0 10px color-mix(in srgb, var(--c) 60%, transparent);
}
.sprite.selected .name {
  color: var(--c);
}

/* Locked (4 already chosen) */
.sprite.locked {
  cursor: not-allowed;
  opacity: 0.35;
}

.sprite:not(.locked):hover .img-box {
  border-color: var(--ff-border-light);
}
</style>
