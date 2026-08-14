/**
 * Character-creation options. Purely data — add rows here and the creation
 * screen picks them up without further changes.
 */

import type { Approach, PronounSet } from '../engine/types.ts'

/**
 * they/them is first so it is the default selection: it is the set that is
 * correct for a character whose player has not told us anything yet.
 */
export const PRONOUN_SETS: PronounSet[] = [
  {
    id: 'they',
    label: 'they / them',
    subject: 'they',
    object: 'them',
    possessive: 'their',
    possessivePronoun: 'theirs',
    reflexive: 'themself',
    plural: true,
  },
  {
    id: 'she',
    label: 'she / her',
    subject: 'she',
    object: 'her',
    possessive: 'her',
    possessivePronoun: 'hers',
    reflexive: 'herself',
    plural: false,
  },
  {
    id: 'he',
    label: 'he / him',
    subject: 'he',
    object: 'him',
    possessive: 'his',
    possessivePronoun: 'his',
    reflexive: 'himself',
    plural: false,
  },
]

/**
 * The investigative approach. Each one unlocks choices the others cannot take,
 * so the same case reads differently on a second run.
 */
export const APPROACHES: Approach[] = [
  {
    id: 'observant',
    name: 'Observant',
    glyph: '◉',
    blurb: 'You read rooms, not people. Scuffs, stains, the angle a thing fell.',
  },
  {
    id: 'disarming',
    name: 'Disarming',
    glyph: '❧',
    blurb: 'People tell you things they meant to keep. You are easy to talk to.',
  },
  {
    id: 'lettered',
    name: 'Lettered',
    glyph: '✦',
    blurb: 'Ledgers, registries, old church hands. Paper remembers what people deny.',
  },
]

/**
 * Portrait slots. `file` is looked up under /public/portraits/ — drop a png in
 * with a matching name and it appears. Until then the `glyph` stands in, so the
 * game is fully playable before any art exists.
 */
export type PortraitOption = {
  id: string
  label: string
  file: string
  glyph: string
}

/**
 * Stands in for any portrait not drawn yet. The chain is: the character's own
 * png, then this, then the unicode glyph if even this is missing — so the game
 * degrades one step at a time and is never broken by absent art.
 *
 * Delete this file and every undrawn character falls back to its glyph again.
 */
export const SUBSTITUTE_PORTRAIT = '/portraits/substitute-png.png'

/** Native size of the pixel art. The frame is an exact 2x of this. */
export const PORTRAIT_PIXEL_WIDTH = 50
export const PORTRAIT_PIXEL_HEIGHT = 80

export const PORTRAITS: PortraitOption[] = [
  { id: 'mc-01', label: 'First', file: '/portraits/mc-01.png', glyph: '☾' },
  { id: 'mc-02', label: 'Second', file: '/portraits/mc-02.png', glyph: '✧' },
  { id: 'mc-03', label: 'Third', file: '/portraits/mc-03.png', glyph: '❈' },
  { id: 'mc-04', label: 'Fourth', file: '/portraits/mc-04.png', glyph: '⁂' },
]

/**
 * Portraits for everyone who isn't the player. Same fallback rules: each shows
 * its glyph until a matching png appears in /public/portraits/.
 *
 * Every citizen of the fold is veiled. What the veil is for is the question the
 * game is actually about — see `Enoch Aletheia`, the only one who takes it off.
 *
 * The seven citizens each carry one deadly sin and stand against one of the
 * seven Noahide laws. They are not villains. They are a functioning parish, and
 * the point is that the machine runs on ordinary people being ordinarily awful
 * in seven different directions at once. Full character notes live in the cast
 * bible; keep the ids here stable, they are referenced by scenes.
 */
export const CAST_PORTRAITS: Record<string, PortraitOption> = {
  /* Principals ---------------------------------------------------- */
  'warden-kreon': {
    id: 'warden-kreon',
    label: 'Warden Kreon Ithamar',
    file: '/portraits/warden-kreon.png',
    glyph: '⚱',
  },
  'sister-kassia': {
    id: 'sister-kassia',
    label: 'Sister Kassia Miriam',
    file: '/portraits/sister-kassia.png',
    glyph: '✝',
  },
  'factor-lysias': {
    id: 'factor-lysias',
    label: 'Lysias Argyros',
    file: '/portraits/factor-lysias.png',
    glyph: '⚖',
  },

  /* The seven ----------------------------------------------------- */
  'aglaia-simeon': {
    id: 'aglaia-simeon',
    label: 'Aglaia Simeon',
    file: '/portraits/aglaia-simeon.png',
    glyph: '✧',
  },
  'chrysanthe-barsabbas': {
    id: 'chrysanthe-barsabbas',
    label: 'Chrysanthe Barsabbas',
    file: '/portraits/chrysanthe-barsabbas.png',
    glyph: '◉',
  },
  'erato-salome': {
    id: 'erato-salome',
    label: 'Erato Salome',
    file: '/portraits/erato-salome.png',
    glyph: '❧',
  },
  'phaedra-kayin': {
    id: 'phaedra-kayin',
    label: 'Phaedra Kayin',
    file: '/portraits/phaedra-kayin.png',
    glyph: '†',
  },
  'demetria-thomas': {
    id: 'demetria-thomas',
    label: 'Demetria Thomas',
    file: '/portraits/demetria-thomas.png',
    glyph: '❦',
  },
  'orestes-iakov': {
    id: 'orestes-iakov',
    label: 'Orestes Iakov',
    file: '/portraits/orestes-iakov.png',
    glyph: '‡',
  },
  'hypnos-joseph': {
    id: 'hypnos-joseph',
    label: 'Hypnos Joseph',
    file: '/portraits/hypnos-joseph.png',
    glyph: '☾',
  },

  /* The eighth ---------------------------------------------------- */
  'enoch-aletheia': {
    id: 'enoch-aletheia',
    label: 'Enoch Aletheia',
    file: '/portraits/enoch-aletheia.png',
    glyph: '✦',
  },
}

export function findPortrait(id: string): PortraitOption | undefined {
  return PORTRAITS.find((p) => p.id === id) ?? CAST_PORTRAITS[id]
}
