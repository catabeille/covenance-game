/**
 * What the fold presses on a witness.
 *
 * In Act I these arrive unasked and unrefusable — the village is delighted you
 * have come, and says so with its hands. The warmth is real. It is also the
 * mechanism: a witness who has been fed, blessed and thanked all morning is a
 * witness who will find it very hard to say a discourteous thing at the table.
 *
 * How the fold treats you in Act II is decided by how you behaved in Act I.
 * By Act III nobody is giving you anything.
 */

import type { Gift } from '../engine/types.ts'

export const GIFTS: Record<string, Gift> = {
  rosary: {
    id: 'rosary',
    name: 'A rosary of black seeds',
    glyph: '°',
    text: 'Pressed into your hand by a woman who did not give her name. The beads are worn smooth on one side only, which means somebody prayed the same decade for years.',
  },
  coin: {
    id: 'coin',
    name: 'A coin, still warm',
    glyph: '◉',
    text: 'For your trouble on the road. It is worth rather more than the trouble was, and everyone present watched you take it.',
  },
  bread: {
    id: 'bread',
    name: 'Bread and salt',
    glyph: '❦',
    text: 'Given at the door of the first house you passed. To refuse it would have been an insult; to accept it makes you a guest, and a guest owes something.',
  },
  medal: {
    id: 'medal',
    name: 'A saint’s medal',
    glyph: '✠',
    text: 'St Bride, worn thin. "For the walking," the boy said, and would not take it back, and looked at you the way you look at a relic.',
  },
  wreath: {
    id: 'wreath',
    name: 'A wreath of bound rush',
    glyph: '❧',
    text: 'Woven that morning and given with both hands. The binding knot is the same one used on the boundary stone at every renewal.',
  },
  veil: {
    id: 'veil',
    name: 'A veil of grey silk',
    glyph: '○',
    text: 'For the third station, they said — everyone covers at the high table. It is very old and very fine and it was not made for you.',
  },
}

export function getGift(id: string): Gift | undefined {
  return GIFTS[id]
}
