/**
 * Things the player can choose to pick up, as opposed to gifts.ts — the fold
 * presses gifts on you whether you want them or not, and that is the point of
 * them. A tool just sits there. Taking one is a real choice with no social
 * cost either way, and having it can unlock a choice elsewhere the same way a
 * clue or a term does: `needs: { tool: 'id' }`.
 *
 * This file currently has one entry as a working example of the mechanism —
 * see `look-stone` / `look-stone-lantern` in story/act-01.ts for the pickup
 * and the payoff it gates. Add more freely; nothing else needs to change.
 */

import type { Tool } from '../engine/types.ts'

export const TOOLS: Record<string, Tool> = {
  lantern: {
    id: 'lantern',
    name: 'A lanthorn',
    glyph: '†',
    text: 'Left on the gatepost by whoever kept the night vigil. Enough light to see a shadow properly, in a place too dark for one.',
  },
  /*
   * The next three carry a glyph borrowed from the cast portrait they came
   * from — a small visual "this is theirs" in the notebook. Each one is made
   * for holding something shut, and is put to the opposite use once taken.
   */
  'tuning-fork': {
    id: 'tuning-fork',
    name: "Erato's tuning-fork",
    glyph: '❧',
    text: 'What she strikes to hold forty voices to a single note. Ring it against something solid and listen for where the note changes.',
  },
  'winding-needle': {
    id: 'winding-needle',
    name: "Phaedra's winding-needle",
    glyph: '†',
    text: 'Small, curved, meant for cloth too far gone to pin — the one she uses for winding a shroud closed. Good for unpicking a seam nobody else could find in the first place.',
  },
  'mason-chisel': {
    id: 'mason-chisel',
    name: "Orestes's chisel",
    glyph: '‡',
    text: 'Still warm from his apron. He cuts names off stone for a living. It will pry up a board as readily as it ever cut anything off a shrine.',
  },
}

export function getTool(id: string): Tool | undefined {
  return TOOLS[id]
}
