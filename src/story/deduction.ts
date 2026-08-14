/**
 * The verdict board: the words the player can learn, and the sentences they
 * fill in with them.
 *
 * The first two propositions are a murder. The third is not — the third is the
 * institution, and it is what the game is actually about. A player can solve
 * the killing completely and still never see what the killing was *for*.
 *
 * The third proposition's answer is the framework inverted. The debt is not a
 * fiction: something is genuinely owed, and the original terms say plainly it
 * was to be borne by the whole fold in equal parts. The Chapter's crime is not
 * invention. It is *selection* — choosing, every renewal, one household to
 * carry alone what everyone was meant to carry together, and calling that a
 * sacrament.
 *
 * Design rule: a proposition is only interesting when the wrong answers are
 * plausible. Every distractor here is something the player has real reason to
 * believe at some point in the story.
 */

import type { Proposition, Term } from '../engine/types.ts'

export const TERMS: Record<string, Term> = {
  /* People -------------------------------------------------------- */
  kreon: { id: 'kreon', label: 'Warden Kreon', kind: 'person' },
  kassia: { id: 'kassia', label: 'Sister Kassia', kind: 'person' },
  lysias: { id: 'lysias', label: 'Lysias Argyros', kind: 'person' },
  chapter: { id: 'chapter', label: 'the Chapter', kind: 'person' },
  orestes: { id: 'orestes', label: 'Orestes the smith', kind: 'person' },
  phaedra: { id: 'phaedra', label: 'Phaedra, who laid him out', kind: 'person' },
  enoch: { id: 'enoch', label: 'Enoch, unveiled', kind: 'person' },
  fold: { id: 'fold', label: 'the fold, all together', kind: 'person' },
  fenn: { id: 'fenn', label: 'the last of the Fenns', kind: 'person' },

  /* Things -------------------------------------------------------- */
  cart: { id: 'cart', label: 'the narrow cart', kind: 'object' },
  chisel: { id: 'chisel', label: 'a mason’s chisel', kind: 'object' },
  register: { id: 'register', label: 'the parish register', kind: 'object' },
  ledger: { id: 'ledger', label: 'the Fifth Ledger', kind: 'object' },
  stone: { id: 'stone', label: 'the boundary stone', kind: 'object' },
  veil: { id: 'veil', label: 'the veil', kind: 'object' },
  'first-terms': { id: 'first-terms', label: 'the terms as first written', kind: 'object' },

  /* Reasons ------------------------------------------------------- */
  'erase-a-name': {
    id: 'erase-a-name',
    label: 'to strike a name out of the record',
    kind: 'reason',
  },
  'for-money': { id: 'for-money', label: 'for what he was owed', kind: 'reason' },
  'out-of-fear': { id: 'out-of-fear', label: 'because somebody was afraid', kind: 'reason' },
  'keep-a-vow': { id: 'keep-a-vow', label: 'to keep an oath already sworn', kind: 'reason' },

  /* Why the fold covers ------------------------------------------- */
  'hide-what-we-are': {
    id: 'hide-what-we-are',
    label: 'we should not see what we are',
    kind: 'reason',
  },
  'honour-the-dead': {
    id: 'honour-the-dead',
    label: 'the dead should be honoured',
    kind: 'reason',
  },
  'ward-the-thing': {
    id: 'ward-the-thing',
    label: 'the thing below should not see our faces',
    kind: 'reason',
  },

  /* What the renewal costs, and who was meant to pay it ------------ */
  'chose-who-paid': {
    id: 'chose-who-paid',
    label: 'choose, each renewal, one house to pay it alone',
    kind: 'act',
  },
  'strike-a-name': {
    id: 'strike-a-name',
    label: 'strike a household out of the record',
    kind: 'act',
  },
  'give-a-tithe': { id: 'give-a-tithe', label: 'take a tithe of the harvest', kind: 'act' },
  'keep-a-vigil': { id: 'keep-a-vigil', label: 'keep a night of vigil at the stone', kind: 'act' },

  /* What is actually owed ----------------------------------------- */
  'debt-shared': {
    id: 'debt-shared',
    label: 'real, and owed by the whole fold together',
    kind: 'party',
  },
  'debt-invented': {
    id: 'debt-invented',
    label: 'a fiction the Chapter wrote for itself',
    kind: 'party',
  },
  'debt-paid': {
    id: 'debt-paid',
    label: 'long since paid, and never closed',
    kind: 'party',
  },
}

export const PROPOSITIONS: Proposition[] = [
  {
    id: 'arrival',
    title: 'How he came to the shrine',
    template: 'He did not die at the shrine. He was brought there by {culprit}, using {means}.',
    slots: [
      { id: 'culprit', kind: 'person', solution: 'kreon' },
      { id: 'means', kind: 'object', solution: 'cart' },
    ],
    // Nothing appears on the board until there are grounds to suspect the body
    // was moved at all.
    needs: { clue: 'cart-tracks' },
  },
  {
    id: 'motive',
    title: 'What he died for',
    template: 'He was killed over {record}, and it was done {reason}.',
    slots: [
      { id: 'record', kind: 'object', solution: 'register' },
      { id: 'reason', kind: 'reason', solution: 'erase-a-name' },
    ],
    needs: { term: 'register' },
  },
  {
    id: 'covenant',
    title: 'What the Covenance is',
    template:
      'The debt is {nature}. What the Chapter did was {crime}. And the fold goes veiled so that {veil}.',
    slots: [
      { id: 'nature', kind: 'party', solution: 'debt-shared' },
      { id: 'crime', kind: 'act', solution: 'chose-who-paid' },
      { id: 'veil', kind: 'reason', solution: 'hide-what-we-are' },
    ],
    // Only appears once the player has read the original terms. Solving the
    // murder is nowhere near enough to reach it.
    needs: { clue: 'first-terms' },
  },
]
