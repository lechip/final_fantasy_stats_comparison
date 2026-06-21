import charactersData from '../data/characters.json'
import levelsData from '../data/levels.json'

export const CHARACTERS = charactersData.characters
export const CHECKPOINTS = levelsData.checkpoints // [{ level, hpBase, mpBase }, ...]
export const DATA_VERSION = levelsData.version

// Radar axis order is fixed. HP/MP vary by level; the rest are level-independent.
// `desc` is the intuitive, formula-free explanation (paraphrased from the
// Final Fantasy Wiki's FFVI stats page) shown as a hover tooltip.
export const STAT_AXES = [
  {
    key: 'hp',
    label: 'HP',
    desc: 'How much health a character has. When it reaches 0, the character is knocked out (KO’d).',
  },
  {
    key: 'mp',
    label: 'MP',
    desc: 'The pool spent to cast spells — how many MP-costing spells a character can use before running out.',
  },
  {
    key: 'vigor',
    label: 'Vigor',
    desc: 'Also called Strength. Increases the damage dealt by physical attacks.',
  },
  {
    key: 'speed',
    label: 'Speed',
    desc: 'Also called Agility. Raises how quickly the ATB gauge fills, so the character gets to act more often.',
  },
  {
    key: 'stamina',
    label: 'Stamina',
    desc: 'Also called Toughness. Improves the chance to survive instant-death attacks, boosts Regen healing, and affects Poison/Sap damage.',
  },
  {
    key: 'magic',
    label: 'Magic',
    desc: 'Also called Magic Power. Increases the damage and potency of magic spells.',
  },
]

const byId = new Map(CHARACTERS.map((c) => [c.id, c]))
export const getCharacter = (id) => byId.get(id)

// Real (in-game) stat values for a character at a given checkpoint.
export function statsAtLevel(character, checkpoint) {
  return {
    hp: checkpoint.hpBase + character.bonus.hp,
    mp: checkpoint.mpBase + character.bonus.mp,
    vigor: character.fixed.vigor,
    speed: character.fixed.speed,
    stamina: character.fixed.stamina,
    magic: character.fixed.magic,
  }
}

// Per-axis maximum used to normalize each spoke to 0..100.
// Fixed stats: the highest natural value among all characters.
// HP/MP: the highest value reached at the TOP checkpoint (so the polygon
// visibly grows on those axes as the level rises, instead of all scaling together).
const TOP = CHECKPOINTS[CHECKPOINTS.length - 1]
export const AXIS_MAX = STAT_AXES.reduce((acc, { key }) => {
  if (key === 'hp' || key === 'mp') {
    acc[key] = Math.max(...CHARACTERS.map((c) => statsAtLevel(c, TOP)[key]))
  } else {
    acc[key] = Math.max(...CHARACTERS.map((c) => c.fixed[key]))
  }
  return acc
}, {})

// Map real stats -> array of 0..100 values in STAT_AXES order (for Chart.js).
export function toNormalized(real) {
  return STAT_AXES.map(({ key }) => Math.round((real[key] / AXIS_MAX[key]) * 1000) / 10)
}
