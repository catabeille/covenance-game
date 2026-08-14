/**
 * Every clue in the game, keyed by id.
 *
 * The framework names six virtues, each a channel by which a living system
 * gets feedback about itself. The Covenance is a machine for closing all six,
 * and most of these are a moment where one is found shut:
 *
 *   honesty      informational   a year cut out, a name chiselled off
 *   humility     epistemic       the veil, and the decree that imposed it
 *   curiosity    environmental   "it is not for reading"
 *   compassion   social          warmth converted into debt
 *   stewardship  ecological      eleven acres entered as unclaimed
 *   justice      institutional   nineteen years without a court
 *
 * `sequence` is where a clue belongs in the *argument*, which is deliberately
 * not the order it is found in — see engine/reckoning.ts. The case opens with
 * the fold's own documents, which nobody can accuse of malice, and the killing
 * lands last as the thing the machine required.
 */

import type { Clue } from '../engine/types.ts'

export const CLUES: Record<string, Clue> = {
  /* ---------------------------------------------------------------- */
  /* The record — what they revere, and what was done to it            */
  /* ---------------------------------------------------------------- */

  'register-gap': {
    id: 'register-gap',
    name: 'A gap in the register',
    category: 'testimony',
    text: 'Ninety years unbroken in six hands, and then one year excised — cut close to the gutter with a blade, so cleanly that the book still lies flat. Not lost. Removed, by somebody who wanted it to go on lying flat.',
    sequence: 10,
  },
  'fresh-chisel': {
    id: 'fresh-chisel',
    name: 'A fresh cut in the shrine',
    category: 'place',
    text: 'A household struck off the face of the boundary stone. The stone inside the wound is pale as a peeled apple and the chisel marks still have edges. Done within the week — days before the renewal that would have required it.',
    sequence: 20,
  },
  'struck-name': {
    id: 'struck-name',
    name: 'The name under the cut',
    category: 'place',
    text: 'The chisel did not go deep enough. Held at the right angle, in the right light, the ghost of it is still legible: FENN. Somebody was in a hurry, or had not the heart to finish.',
    sequence: 30,
  },
  'first-terms': {
    id: 'first-terms',
    name: 'The terms as first written',
    category: 'object',
    text: 'The oldest copy, in the oldest hand, and it does not say what the fold says. *Each generation a trustee, and none of them an owner. The price shall be borne of the whole fold, in equal parts, that no house bear it alone.* The debt is real. It was never meant to fall on one family, and it was never meant to be kept for long.',
    sequence: 40,
  },
  'marginal-gloss': {
    id: 'marginal-gloss',
    name: 'A gloss in the margin',
    category: 'testimony',
    text: 'Beside the cut, in a hand trying hard not to be recognised: *they were told it was an honour.* Somebody watched it happen, understood exactly what they were watching, and wrote four words.',
    sequence: 50,
  },

  /* ---------------------------------------------------------------- */
  /* The veil — humility, closed by decree                             */
  /* ---------------------------------------------------------------- */

  'veil-decree': {
    id: 'veil-decree',
    name: 'The decree of covering',
    category: 'object',
    text: 'Two hundred and six years ago the Chapter ruled that the fold go veiled before God, *their aspect being unseemly to the rite* — and cited, for authority, the passage on Azazel: the metals of the earth and the art of working them, and bracelets, and ornaments, and the beautifying of the eyelids. A text about what was *taught* to men, turned into a ruling about what men *are*. Not a custom that grew. An instruction, issued once, obeyed ever since by people who no longer remember it was ever a ruling.',
    sequence: 60,
  },
  'what-is-under': {
    id: 'what-is-under',
    name: 'What is under the veil',
    category: 'person',
    text: 'Fur. A dense soft pelt the colour of wet ash, a long jaw, ears folded flat from a lifetime of folding. Not Enoch alone — Enoch is only the one who took it off. It is what the whole fold is, and what the whole fold has been taught to find unseemly.',
    sequence: 70,
  },

  /* ---------------------------------------------------------------- */
  /* Testimony                                                         */
  /* ---------------------------------------------------------------- */

  'the-dead-mans-claim': {
    id: 'the-dead-mans-claim',
    name: 'What he came to say',
    category: 'testimony',
    text: 'The last of the household struck out three renewals ago. He did not come for restitution. He came to stand at the shrine with his veil in his hand and say his own name where the fold could hear it — the one thing the rite cannot survive.',
    sequence: 80,
  },
  'kassia-knew': {
    id: 'kassia-knew',
    name: 'Sister Kassia knew',
    category: 'testimony',
    text: 'Thirty-one years keeping a book she knew had a year cut out of it, and why. She calls that obedience. She has had a long time to decide whether she agrees, and has not sounded certain for some while.',
    sequence: 90,
  },

  /* ---------------------------------------------------------------- */
  /* The institution                                                   */
  /* ---------------------------------------------------------------- */

  'ledger-pattern': {
    id: 'ledger-pattern',
    name: 'The Fifth Ledger',
    category: 'object',
    text: 'Every renewal year, one page, one clean column: a holding passes to the Chapter. Never a large one. Never one with anybody left to argue. A name off the stone, a year out of the book, a field changed hands — and the fold sings. It is a ledger that arrives already balanced, and nobody has ever been in the room when it was written.',
    sequence: 100,
  },
  'converging-fields': {
    id: 'converging-fields',
    name: 'The fields do not scatter',
    category: 'place',
    text: 'Draw the holdings the Chapter has taken across two hundred years and they do not fall where cheap land falls. They close. Renewal by renewal, a ring drawing inward on one point of ground north of the fold — and the north field, taken this year, is the last piece of it.',
    sequence: 105,
  },
  'no-court': {
    id: 'no-court',
    name: 'Nineteen years without a court',
    category: 'testimony',
    text: 'The magistrate has convened nothing since before the last renewal. Everything is settled between neighbours, which means settled by whichever neighbour has more. There is no mechanism here by which any of this could ever have been tested.',
    sequence: 110,
  },
  'lysias-office': {
    id: 'lysias-office',
    name: 'What Lysias actually is',
    category: 'person',
    text: 'Not of the village. Factor to the Chapter — sent out for renewals to see the thing done properly and carry the paperwork home. Speaks of *terms*, a word that appears nowhere in the rite the fold actually says.',
    sequence: 120,
  },
  'unclaimed-field': {
    id: 'unclaimed-field',
    name: 'Eleven acres, unclaimed',
    category: 'place',
    text: 'The north field reverts to the Chapter this renewal, entered as unclaimed. It is unclaimed because the household that would have claimed it was struck out of the book that records claims. The paperwork is immaculate.',
    sequence: 130,
  },

  /* ---------------------------------------------------------------- */
  /* The mechanism — and your own hand on it                           */
  /* ---------------------------------------------------------------- */

  'attestation-clause': {
    id: 'attestation-clause',
    name: 'The attestation clause',
    category: 'object',
    text: '*...whereupon the Covenance standeth for a further term of years.* **Whereupon** — not whereafter. The renewal does not become lawful and then get witnessed. It becomes lawful *because* it is witnessed. No deal is struck at that table. It is only witnessed — and you are the witnessing.',
    sequence: 140,
  },
  'unfit-clause': {
    id: 'unfit-clause',
    name: 'The clause beneath the clause',
    category: 'object',
    text: 'A fifth line, smaller, later: *and where no witness may be had, or where the witness proveth unfit, the Chapter may attest in his stead.* They do not need you. They need somebody, and they would much prefer it were you.',
    sequence: 150,
  },

  /* ---------------------------------------------------------------- */
  /* The death — last, because it is the consequence, not the subject  */
  /* ---------------------------------------------------------------- */

  'body-cold': {
    id: 'body-cold',
    name: 'The body is cold',
    category: 'object',
    text: 'The deep cold, the cold that takes hours. The bell had not gone. Whatever was done to him was done long before anyone gathered at the shrine to sing.',
    sequence: 160,
  },
  'no-mud': {
    id: 'no-mud',
    name: 'Clean boots',
    category: 'object',
    text: 'Three days of rain and a road like a ribbon of mud, and not a speck of it on him. He did not walk to the shrine.',
    sequence: 170,
  },
  'cart-tracks': {
    id: 'cart-tracks',
    name: 'Cart tracks',
    category: 'place',
    text: 'Narrow-wheeled, one horse, as far as the shrine and then turned about. Deep going in, shallow coming out. It arrived carrying something heavy and it left without it.',
    sequence: 180,
  },
  'kreon-lie': {
    id: 'kreon-lie',
    name: 'Kreon misspoke',
    category: 'testimony',
    text: 'He says he found the body at first bell, and then describes the colour of the wound. First bell is an hour before dawn. At first bell you cannot see your own hands.',
    sequence: 190,
  },
}

/** Ordering for the notebook, so related evidence groups together. */
export const CATEGORY_ORDER: Clue['category'][] = ['person', 'place', 'object', 'testimony']

export const CATEGORY_LABEL: Record<Clue['category'], string> = {
  person: 'People',
  place: 'Places',
  object: 'Things',
  testimony: 'What was said',
}
