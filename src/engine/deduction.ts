/**
 * The verdict board.
 *
 * The player states conclusions by filling blanks in sentences from a pool of
 * words they have learned. Nothing here tells them whether they are right —
 * scoring exists so the *trial* can weigh their case, not so the board can
 * show ticks and crosses. Feedback before the ending would do the deducing
 * for them.
 */

import type { GameState, Proposition, Term, TermKind } from './types.ts'
import { meetsRequirement } from './state.ts'
import { PROPOSITIONS, TERMS } from '../story/deduction.ts'

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export function getTerm(termId: string): Term | undefined {
  return TERMS[termId]
}

/** Terms the player has learned, of one kind, for a slot's dropdown. */
export function knownTermsOfKind(state: GameState, kind: TermKind): Term[] {
  return state.terms
    .map((id) => TERMS[id])
    .filter((t): t is Term => t !== undefined && t.kind === kind)
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** Propositions whose requirement is met — the board grows as you learn. */
export function availablePropositions(state: GameState): Proposition[] {
  return PROPOSITIONS.filter((p) => meetsRequirement(state, p.needs))
}

export function getAssertion(
  state: GameState,
  propositionId: string,
  slotId: string,
): string | undefined {
  return state.assertions[propositionId]?.[slotId]
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

/** Record an answer. Passing an empty termId clears the blank again. */
export function setAssertion(
  state: GameState,
  propositionId: string,
  slotId: string,
  termId: string,
): void {
  const forProposition = state.assertions[propositionId] ?? {}

  if (termId === '') delete forProposition[slotId]
  else forProposition[slotId] = termId

  state.assertions[propositionId] = forProposition
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export type Score = {
  correct: number
  total: number
  /** Every blank filled, right or wrong. */
  complete: boolean
}

export function scoreProposition(state: GameState, proposition: Proposition): Score {
  let correct = 0
  let filled = 0

  for (const slot of proposition.slots) {
    const answer = getAssertion(state, proposition.id, slot.id)
    if (answer === undefined) continue
    filled += 1
    if (answer === slot.solution) correct += 1
  }

  return {
    correct,
    total: proposition.slots.length,
    complete: filled === proposition.slots.length,
  }
}

export function isSolved(state: GameState, proposition: Proposition): boolean {
  const score = scoreProposition(state, proposition)
  return score.correct === score.total
}

/**
 * The case as a whole, counted across every proposition currently on the
 * board. This is what the trial weighs against the suspicion on you.
 */
export function scoreCase(state: GameState): Score {
  let correct = 0
  let total = 0
  let complete = true

  for (const proposition of availablePropositions(state)) {
    const score = scoreProposition(state, proposition)
    correct += score.correct
    total += score.total
    if (!score.complete) complete = false
  }

  return { correct, total, complete }
}

/** Every blank on every visible proposition is filled — ready to deliver. */
export function caseIsComplete(state: GameState): boolean {
  const available = availablePropositions(state)
  if (available.length === 0) return false
  return available.every((p) => scoreProposition(state, p).complete)
}

/**
 * Split a template into literal text and slot references, so the renderer can
 * lay out "He was carried by [____], using [____]." without parsing strings
 * itself. Unknown tokens stay literal, which makes a typo visible on screen.
 */
export type TemplatePart =
  | { kind: 'text'; text: string }
  | { kind: 'slot'; slotId: string }

export function parseTemplate(proposition: Proposition): TemplatePart[] {
  const slotIds = new Set(proposition.slots.map((s) => s.id))
  const parts: TemplatePart[] = []
  const pattern = /\{(\w+)\}/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(proposition.template)) !== null) {
    const slotId = match[1] as string
    if (!slotIds.has(slotId)) continue

    if (match.index > lastIndex) {
      parts.push({ kind: 'text', text: proposition.template.slice(lastIndex, match.index) })
    }
    parts.push({ kind: 'slot', slotId })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < proposition.template.length) {
    parts.push({ kind: 'text', text: proposition.template.slice(lastIndex) })
  }

  return parts
}
