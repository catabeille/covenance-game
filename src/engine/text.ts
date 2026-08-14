/**
 * Prose interpolation.
 *
 * Story text is written with tokens so it reads correctly whatever the player
 * chose at creation:
 *
 *   "{Name} pulls {their} coat tight. {They} {is} not welcome here."
 *   -> "Wren pulls their coat tight. They are not welcome here."
 *   -> "Wren pulls her coat tight. She is not welcome here."
 *
 * Capitalising the token capitalises the output: {they} -> they, {They} -> They.
 */

import type { GameState } from './types.ts'

/** Verb forms that have to agree with the pronoun set. */
const VERBS: Record<string, [singular: string, plural: string]> = {
  is: ['is', 'are'],
  was: ['was', 'were'],
  has: ['has', 'have'],
  does: ['does', 'do'],
  isnt: ["isn't", "aren't"],
  wasnt: ["wasn't", "weren't"],
  hasnt: ["hasn't", "haven't"],
  doesnt: ["doesn't", "don't"],
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Replace {tokens} in `input`. Unknown tokens are left verbatim so a typo is
 * visible in-game rather than silently deleting text.
 */
export function interpolate(input: string, state: GameState): string {
  const { character } = state
  const p = character.pronouns

  const table: Record<string, string> = {
    name: character.name,
    they: p.subject,
    them: p.object,
    their: p.possessive,
    theirs: p.possessivePronoun,
    themself: p.reflexive,
  }

  return input.replace(/\{(\w+)\}/g, (whole, rawToken: string) => {
    const token = rawToken as string
    const lower = token.toLowerCase()
    const shouldCapitalise = token[0] === token[0]?.toUpperCase() && token !== lower

    const pronoun = table[lower]
    if (pronoun !== undefined) {
      return shouldCapitalise ? capitalise(pronoun) : pronoun
    }

    const verb = VERBS[lower]
    if (verb !== undefined) {
      const form = p.plural ? verb[1] : verb[0]
      return shouldCapitalise ? capitalise(form) : form
    }

    return whole
  })
}

/** Split interpolated prose into paragraphs for rendering. */
export function paragraphs(input: string, state: GameState): string[] {
  return interpolate(input, state)
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Escape text bound for innerHTML. Every dynamic string goes through this. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
