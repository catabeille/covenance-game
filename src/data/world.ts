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
  },
}

export function getWorld(id: string): WorldMap | undefined {
  return WORLDS[id]
}
