import { ref, computed } from 'vue'
import { CHARACTERS, CHECKPOINTS, getCharacter } from '../lib/stats.js'

// Single shared instance (module scope) — no Pinia needed for two pieces of state.
const MAX = 4

// Default to a mid checkpoint (Lv 50) and a contrasting starter party.
const levelIndex = ref(CHECKPOINTS.findIndex((c) => c.level === 50))
const selectedIds = ref(['terra', 'sabin', 'relm'])

// Sprite art set: 'remaster' (Pixel Remaster) or 'classic' (SNES).
const spriteStyle = ref('remaster')
const setSpriteStyle = (s) => {
  spriteStyle.value = s
}

const currentCheckpoint = computed(() => CHECKPOINTS[levelIndex.value])
const isFull = computed(() => selectedIds.value.length >= MAX)
const isSelected = (id) => selectedIds.value.includes(id)

const selectedCharacters = computed(() =>
  selectedIds.value.map(getCharacter).filter(Boolean),
)

function toggle(id) {
  if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id)
  } else if (!isFull.value) {
    selectedIds.value = [...selectedIds.value, id]
  }
}

export function useComparison() {
  return {
    MAX,
    CHARACTERS,
    CHECKPOINTS,
    levelIndex,
    currentCheckpoint,
    selectedIds,
    selectedCharacters,
    isFull,
    isSelected,
    toggle,
    spriteStyle,
    setSpriteStyle,
  }
}
