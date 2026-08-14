/**
 * The reckoning: putting the evidence in an order before you speak.
 *
 * Being thorough makes you conspicuous — every extra hour at the shrine is an
 * hour the fold watched you spend there. This is how that gets paid back. A
 * player who gathered a great deal and can lay it out as an *argument* is
 * forgiven a great deal; a player who gathered the same pile and empties it on
 * the table in the order they happened to find it is not.
 *
 * Scoring is pairwise, not positional. For every pair of clues the player
 * holds, we ask only whether they are in the right order relative to each
 * other. That matters because which clues you have varies enormously between
 * runs — an absolute position check would punish someone for the gaps in their
 * evidence rather than for their reasoning about it.
 *
 * The canonical order in clues.ts is deliberately *not* the order things are
 * discovered in. An outsider accusing a beloved institution in front of a
 * devout crowd cannot open by calling their Warden a liar; they open with the
 * institution's own documents, which nobody can accuse of malice, and let the
 * killing land last as the thing the machine required. Sequencing it as
 * discovery order made the whole mechanic free — a player who touched nothing
 * already scored near-perfect.
 */

import type { Clue, GameState } from './types.ts'
import { CLUES } from '../story/clues.ts'

/**
 * The most suspicion a perfectly ordered case can wash off.
 *
 * Tune this against the actual suspicion range of a thorough playthrough, not
 * in the abstract. A completionist run currently reaches 9–13; the trial's
 * threshold sits at 8. So this has to be large enough that a well-told case
 * pulls the top of that range under the line, and small enough that it cannot
 * rescue somebody who pried at everything and then rambled.
 */
export const MAX_REDEMPTION = 6

/** Below this, the ordering is not coherent enough to help at all. */
const REDEMPTION_FLOOR = 0.5

export type Direction = 'up' | 'down'

/**
 * The player's arrangement, as clues. Anything found but never moved sits
 * after the arranged ones, in the order it was found, so the list is always
 * complete without forcing anyone to touch it.
 */
export function arrangedClues(state: GameState): Clue[] {
  const held = new Set(state.clues)

  const arranged = state.ordering.filter((id) => held.has(id))
  const rest = state.clues.filter((id) => !arranged.includes(id))

  return [...arranged, ...rest]
    .map((id) => CLUES[id])
    .filter((c): c is Clue => c !== undefined)
}

/** Move one clue a single place. Normalises the stored ordering as it goes. */
export function moveClue(state: GameState, clueId: string, direction: Direction): void {
  const order = arrangedClues(state).map((c) => c.id)
  const from = order.indexOf(clueId)
  if (from === -1) return

  const to = direction === 'up' ? from - 1 : from + 1
  if (to < 0 || to >= order.length) return

  const moved = order[from] as string
  order[from] = order[to] as string
  order[to] = moved

  state.ordering = order
}

/**
 * How much of the argument holds together, 0–1.
 *
 * Every pair of held clues is either concordant (they appear in the same
 * relative order as the canonical sequence) or not. Pairs that share a
 * sequence number are ignored — they are genuinely interchangeable, and
 * nobody should be marked down for guessing which came first.
 */
export function concordance(state: GameState): number {
  const clues = arrangedClues(state)
  if (clues.length < 2) return 0

  let concordant = 0
  let comparable = 0

  for (let i = 0; i < clues.length; i += 1) {
    for (let j = i + 1; j < clues.length; j += 1) {
      const earlier = clues[i] as Clue
      const later = clues[j] as Clue

      if (earlier.sequence === later.sequence) continue

      comparable += 1
      if (earlier.sequence < later.sequence) concordant += 1
    }
  }

  return comparable === 0 ? 0 : concordant / comparable
}

/**
 * Suspicion washed off by a well-told case.
 *
 * Scaled by how much evidence is actually being ordered: arranging three
 * clues perfectly is not the same feat as arranging eleven, and should not
 * buy the same forgiveness.
 */
export function redemption(state: GameState): number {
  const clues = arrangedClues(state)
  if (clues.length < 3) return 0

  const quality = concordance(state)
  if (quality < REDEMPTION_FLOOR) return 0

  // Remap [floor, 1] onto [0, 1] so a barely-coherent case earns barely anything.
  const scaled = (quality - REDEMPTION_FLOOR) / (1 - REDEMPTION_FLOOR)
  const weight = Math.min(1, clues.length / 8)

  return Math.round(scaled * weight * MAX_REDEMPTION)
}

/** Wording for the player. Never a number — they are telling a story, not solving a puzzle. */
export function reckoningVerdict(state: GameState): string {
  const clues = arrangedClues(state)
  if (clues.length < 3) return 'Too little to shape into anything yet.'

  const quality = concordance(state)
  if (quality >= 0.95) return 'It runs clean from the first line to the last.'
  if (quality >= 0.8) return 'It holds together. One or two things sit oddly.'
  if (quality >= 0.6) return 'The bones are there. The order keeps working against you.'
  if (quality >= 0.4) return 'It wanders. Anyone listening would lose the thread.'
  return 'This is a pile, not an argument.'
}
