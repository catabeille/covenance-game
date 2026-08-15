/**
 * The walkable procession.
 *
 * Each act is a stretch of road you walk left to right. What used to be a hub
 * scene's list of choices is now a row of positions: the body, the stone, the
 * road back, the Warden. You approach a thing and attend to it, and the prose
 * scene opens exactly as before.
 *
 * Left is where you came from and where the sun sits. Right is where the rite
 * is going and where the moon sits. Walking right is always walking on.
 */

import type { WorldMap } from '../engine/types.ts'

/** How close you must stand before a landmark can be attended, in px. */
export const ATTEND_RANGE = 70

/** Walking speed, px per second. */
export const WALK_SPEED = 190

export const WORLDS: Record<string, WorldMap> = {
  shrine: {
    id: 'shrine',
    width: 1220,
    entry: 300,
    location: 'The first station — the wayside shrine',
    landmarks: [
      {
        id: 'road-back',
        x: 70,
        scene: 'look-road',
        label: 'Look back along the road',
        art: 'road',
        // Closes once the fold has trampled it, same gate the choice used.
        needs: { flagAtMost: { measures: 2 } },
      },
      {
        id: 'the-body',
        x: 320,
        scene: 'look-body',
        label: 'Kneel by him',
        art: 'the-fallen',
      },
      {
        id: 'the-stone',
        x: 560,
        scene: 'look-stone',
        label: 'Read the face of the stone',
        art: 'boundary-stone',
      },
      {
        id: 'kreon',
        x: 850,
        scene: 'kreon',
        label: 'Speak with Warden Kreon',
        sprite: 'warden-kreon',
      },
      {
        id: 'the-bell',
        x: 1150,
        scene: 'act-one-close',
        label: 'Take your place. Let the rite begin',
      },
    ],
    // Waymarkers along a pilgrimage road — texture only, nothing to attend.
    // Without these, the gaps between real landmarks read as an empty
    // hallway rather than a road anyone has walked before.
    waypoints: [
      { x: 190, glyph: '†' },
      { x: 440, glyph: '·' },
      { x: 690, glyph: '°' },
      { x: 970, glyph: '·' },
      { x: 1090, glyph: '†' },
    ],
    stars: [
      { x: 40, top: 12, glyph: '°' },
      { x: 135, top: 26, glyph: '·' },
      { x: 230, top: 16, glyph: '†' },
      { x: 410, top: 30, glyph: '·' },
      { x: 495, top: 10, glyph: '°' },
      { x: 640, top: 22, glyph: '·' },
      { x: 730, top: 8, glyph: '†' },
      { x: 930, top: 26, glyph: '·' },
      { x: 1020, top: 14, glyph: '°' },
      { x: 1180, top: 24, glyph: '·' },
    ],
  },

  fold: {
    id: 'fold',
    width: 2650,
    entry: 150,
    location: 'The second station — the fold',
    landmarks: [
      {
        id: 'chapel-door',
        x: 150,
        scene: 'chapel',
        label: 'Go into the church',
        sprite: 'sister-kassia',
      },
      {
        id: 'aglaia',
        x: 380,
        scene: 'aglaia',
        label: 'The one gilding the saints',
        sprite: 'aglaia-simeon',
        once: true,
      },
      {
        id: 'chrysanthe',
        x: 600,
        scene: 'chrysanthe',
        label: 'The one with the tithe-box',
        sprite: 'chrysanthe-barsabbas',
        once: true,
      },
      {
        id: 'erato',
        x: 820,
        scene: 'erato',
        label: 'The one who was singing and has stepped out',
        sprite: 'erato-salome',
        once: true,
      },
      {
        id: 'phaedra',
        x: 1040,
        scene: 'phaedra',
        label: 'The one who laid him out',
        sprite: 'phaedra-kayin',
        once: true,
      },
      {
        id: 'demetria',
        x: 1260,
        scene: 'demetria',
        label: 'The one carrying the feast',
        sprite: 'demetria-thomas',
        once: true,
      },
      {
        id: 'orestes',
        x: 1480,
        scene: 'orestes',
        label: 'The one drinking by the wall',
        sprite: 'orestes-iakov',
        once: true,
      },
      {
        id: 'hypnos',
        x: 1700,
        scene: 'hypnos',
        label: 'The one nobody is asking anything of',
        sprite: 'hypnos-joseph',
        once: true,
      },
      {
        id: 'lysias',
        x: 1950,
        scene: 'lysias',
        label: 'The one in the very good coat',
        sprite: 'factor-lysias',
      },
      {
        id: 'counting-room',
        x: 2200,
        scene: 'counting-room',
        label: 'Ask where the Chapter keeps its accounts',
        art: 'vestry',
        // Closes to nobody who hasn't earned the reason to go looking.
        needs: { clue: 'lysias-office' },
      },
      {
        id: 'close',
        x: 2500,
        scene: 'act-two-close',
        label: 'Go up when the singing stops',
        art: 'fold',
      },
    ],
    waypoints: [
      { x: 270, glyph: '·' },
      { x: 490, glyph: '†' },
      { x: 710, glyph: '·' },
      { x: 930, glyph: '°' },
      { x: 1150, glyph: '·' },
      { x: 1370, glyph: '†' },
      { x: 1590, glyph: '·' },
      { x: 1830, glyph: '·' },
      { x: 2080, glyph: '†' },
      { x: 2350, glyph: '·' },
    ],
    stars: [
      { x: 60, top: 10, glyph: '·' },
      { x: 200, top: 24, glyph: '°' },
      { x: 320, top: 14, glyph: '·' },
      { x: 470, top: 28, glyph: '†' },
      { x: 590, top: 8, glyph: '·' },
      { x: 740, top: 20, glyph: '°' },
      { x: 870, top: 12, glyph: '·' },
      { x: 1010, top: 26, glyph: '†' },
      { x: 1130, top: 16, glyph: '·' },
      { x: 1280, top: 30, glyph: '°' },
      { x: 1410, top: 10, glyph: '·' },
      { x: 1560, top: 22, glyph: '†' },
      { x: 1680, top: 14, glyph: '·' },
      { x: 1830, top: 28, glyph: '°' },
      { x: 1950, top: 8, glyph: '·' },
      { x: 2100, top: 24, glyph: '†' },
      { x: 2220, top: 16, glyph: '·' },
      { x: 2370, top: 30, glyph: '°' },
      { x: 2500, top: 12, glyph: '·' },
      { x: 2610, top: 22, glyph: '†' },
    ],
  },

  'high-table': {
    id: 'high-table',
    width: 1450,
    entry: 100,
    location: 'The third station — the high table',
    landmarks: [
      {
        id: 'attestation',
        x: 200,
        scene: 'attestation',
        label: 'Read the page before you touch the pen',
        art: 'altar-host',
        once: true,
      },
      {
        id: 'kreon',
        x: 480,
        scene: 'kreon-open',
        label: 'Ask Kreon, in front of them all, what it was if not first bell',
        sprite: 'warden-kreon',
        // Same gate the choice used — he has to have been pressed already.
        needs: { flag: 'kreon_pressed' },
      },
      {
        id: 'lysias',
        x: 760,
        scene: 'lysias-cornered',
        label: 'Ask Lysias which holding falls to the Chapter this year',
        sprite: 'factor-lysias',
        needs: { clue: 'ledger-pattern' },
      },
      {
        id: 'enoch',
        x: 1040,
        scene: 'enoch',
        label: 'Look at the one standing at the back who has not moved',
        sprite: 'enoch-aletheia',
        needs: { clue: 'veil-decree' },
      },
      {
        id: 'verdict',
        x: 1350,
        scene: 'verdict-delivery',
        label: 'Stand, and give your verdict',
        art: 'cross',
      },
    ],
    waypoints: [
      { x: 340, glyph: '·' },
      { x: 620, glyph: '†' },
      { x: 900, glyph: '·' },
      { x: 1200, glyph: '†' },
    ],
    stars: [
      { x: 50, top: 12, glyph: '·' },
      { x: 160, top: 26, glyph: '°' },
      { x: 280, top: 16, glyph: '·' },
      { x: 400, top: 30, glyph: '†' },
      { x: 560, top: 10, glyph: '·' },
      { x: 680, top: 22, glyph: '°' },
      { x: 820, top: 14, glyph: '·' },
      { x: 950, top: 28, glyph: '†' },
      { x: 1100, top: 18, glyph: '·' },
      { x: 1230, top: 24, glyph: '°' },
      { x: 1350, top: 12, glyph: '·' },
      { x: 1420, top: 32, glyph: '†' },
    ],
  },
}

export function getWorld(id: string): WorldMap | undefined {
  return WORLDS[id]
}
