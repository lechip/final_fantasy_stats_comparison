<script setup>
import { useComparison } from '../composables/useComparison.js'
import CharacterSprite from './CharacterSprite.vue'

const { CHARACTERS, isSelected, isFull, toggle } = useComparison()
</script>

<template>
  <div class="sprite-bar ff-window">
    <CharacterSprite
      v-for="c in CHARACTERS"
      :key="c.id"
      :character="c"
      :selected="isSelected(c.id)"
      :locked="!isSelected(c.id) && isFull"
      @toggle="toggle"
    />
  </div>
</template>

<style scoped>
.sprite-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
  padding: 8px;
}
</style>
