/**
 * Game state: creation, mutation, persistence.
 *
 * Every change to the world goes through applyEffect() so there is exactly one
 * place to look when a flag ends up wrong.
 */

import type {
  ApproachId,
  Character,
  Effect,
  FlagValue,
  GameState,
  Requirement,
} from './types.ts'
import { APPROACHES, PORTRAITS, PRONOUN_SETS } from '../data/character.ts'

const SAVE_KEY = 'covenance:save:v1'

/** Bump when GameState changes shape; old saves are then discarded on load. */
const SAVE_VERSION = 7

/**
 * How suspicious the village is of you. Kept as an ordinary numeric flag so
 * story files raise it with the same `{ add: 1 }` syntax as anything else.
 */
export const SUSPICION = 'suspicion'

export function defaultCharacter(): Character {
  return {
    name: '',
    pronouns: PRONOUN_SETS[0]!,
    approach: APPROACHES[0]!.id,
    portraitId: PORTRAITS[0]!.id,
  }
}

export function createState(character: Character, startSceneId: string): GameState {
  return {
    version: SAVE_VERSION,
    character,
    sceneId: startSceneId,
    act: 1,
    walkerX: {},
    approaches: [character.approach],
    clues: [],
    terms: [],
    gifts: [],
    tools: [],
    ordering: [],
    assertions: {},
    flags: {},
    visited: [],
    taken: [],
  }
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export function hasClue(state: GameState, clueId: string): boolean {
  return state.clues.includes(clueId)
}

export function hasTerm(state: GameState, termId: string): boolean {
  return state.terms.includes(termId)
}

export function hasTool(state: GameState, toolId: string): boolean {
  return state.tools.includes(toolId)
}

export function hasApproach(state: GameState, approach: ApproachId): boolean {
  return state.approaches.includes(approach)
}

function numericFlag(state: GameState, key: string): number {
  const value = state.flags[key]
  return typeof value === 'number' ? value : 0
}

/** Current suspicion level. Absent flag reads as zero. */
export function suspicion(state: GameState): number {
  const value = state.flags[SUSPICION]
  return typeof value === 'number' ? value : 0
}

export function getFlag(state: GameState, key: string): FlagValue | undefined {
  return state.flags[key]
}

/** Flags are truthy-tested, so `flag: 'x'` means "x is set and not false/0/''". */
export function flagIsSet(state: GameState, key: string): boolean {
  return Boolean(state.flags[key])
}

export function hasVisited(state: GameState, sceneId: string): boolean {
  return state.visited.includes(sceneId)
}

export function choiceKey(sceneId: string, choiceText: string): string {
  return `${sceneId}::${choiceText}`
}

export function hasTaken(state: GameState, sceneId: string, choiceText: string): boolean {
  return state.taken.includes(choiceKey(sceneId, choiceText))
}

/** True when every clause of the requirement is satisfied. */
export function meetsRequirement(state: GameState, req: Requirement | undefined): boolean {
  if (!req) return true
  if (req.clue !== undefined && !hasClue(state, req.clue)) return false
  if (req.flag !== undefined && !flagIsSet(state, req.flag)) return false
  if (req.approach !== undefined && !hasApproach(state, req.approach)) return false
  if (req.minClues !== undefined && state.clues.length < req.minClues) return false
  if (req.term !== undefined && !hasTerm(state, req.term)) return false
  if (req.tool !== undefined && !hasTool(state, req.tool)) return false
  if (req.maxSuspicion !== undefined && suspicion(state) > req.maxSuspicion) return false

  for (const [key, limit] of Object.entries(req.flagAtMost ?? {})) {
    if (numericFlag(state, key) > limit) return false
  }
  for (const [key, floor] of Object.entries(req.flagAtLeast ?? {})) {
    if (numericFlag(state, key) < floor) return false
  }

  return true
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

/** What an effect actually changed, so the UI can announce it. */
export type EffectResult = {
  clues: string[]
  terms: string[]
  approaches: ApproachId[]
  gifts: string[]
  tools: string[]
}

export function emptyEffectResult(): EffectResult {
  return { clues: [], terms: [], approaches: [], gifts: [], tools: [] }
}

/**
 * Apply an effect in place. Returns what was newly gained, so the UI can
 * announce it ("Noted: ...") without having to diff state itself.
 */
export function applyEffect(state: GameState, effect: Effect | undefined): EffectResult {
  if (!effect) return emptyEffectResult()

  const newClues: string[] = []
  for (const clueId of effect.clues ?? []) {
    if (!state.clues.includes(clueId)) {
      state.clues.push(clueId)
      newClues.push(clueId)
    }
  }

  const newTerms: string[] = []
  for (const termId of effect.terms ?? []) {
    if (!state.terms.includes(termId)) {
      state.terms.push(termId)
      newTerms.push(termId)
    }
  }

  const newGifts: string[] = []
  for (const giftId of effect.gifts ?? []) {
    if (!state.gifts.includes(giftId)) {
      state.gifts.push(giftId)
      newGifts.push(giftId)
    }
  }

  const newTools: string[] = []
  for (const toolId of effect.tools ?? []) {
    if (!state.tools.includes(toolId)) {
      state.tools.push(toolId)
      newTools.push(toolId)
    }
  }

  const newApproaches: ApproachId[] = []
  for (const approach of effect.approaches ?? []) {
    if (!state.approaches.includes(approach)) {
      state.approaches.push(approach)
      newApproaches.push(approach)
    }
  }

  for (const [key, value] of Object.entries(effect.flags ?? {})) {
    if (typeof value === 'object' && value !== null && 'add' in value) {
      const current = state.flags[key]
      const base = typeof current === 'number' ? current : 0
      state.flags[key] = base + value.add
    } else {
      state.flags[key] = value
    }
  }

  return {
    clues: newClues,
    terms: newTerms,
    approaches: newApproaches,
    gifts: newGifts,
    tools: newTools,
  }
}

/** How warmly the fold is treating you. Higher is warmer. */
export function reverence(state: GameState): number {
  const value = state.flags['reverence']
  return typeof value === 'number' ? value : 0
}

/** The rite only ever moves forward. */
export function advanceAct(state: GameState, act: number): void {
  if (act > state.act) state.act = act
}

export function markVisited(state: GameState, sceneId: string): void {
  if (!state.visited.includes(sceneId)) state.visited.push(sceneId)
}

export function markTaken(state: GameState, sceneId: string, choiceText: string): void {
  const key = choiceKey(sceneId, choiceText)
  if (!state.taken.includes(key)) state.taken.push(key)
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

export function save(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch (err) {
    // Private-browsing modes and full quotas both land here. A failed save
    // should never interrupt play, so log and carry on.
    console.warn('[covenance] could not write save:', err)
  }
}

/** Returns null when there is no save, or the save is from an older shape. */
export function load(): GameState | null {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(SAVE_KEY)
  } catch (err) {
    console.warn('[covenance] could not read save:', err)
    return null
  }
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as GameState
    if (parsed.version !== SAVE_VERSION) {
      console.info('[covenance] discarding save from an older version')
      return null
    }
    return parsed
  } catch {
    console.warn('[covenance] save was corrupt; discarding')
    return null
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null
  } catch {
    return false
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* nothing useful to do */
  }
}
