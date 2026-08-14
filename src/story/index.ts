/**
 * The assembled story.
 *
 * Three acts, walked in order. The rite is a procession: entering a scene from
 * a later act advances the game, and every route back into a finished act
 * closes itself. See `Scene.act` and `engine/choices.ts`.
 */

import type { Scene } from '../engine/types.ts'
import { ACT_ONE } from './act-01.ts'
import { ACT_TWO } from './act-02.ts'
import { ACT_THREE } from './act-03.ts'

/** Where a new game begins. */
export const START_SCENE = 'prologue'

const ALL_SCENES: Scene[] = [...ACT_ONE, ...ACT_TWO, ...ACT_THREE]

/**
 * Scenes by id. Built eagerly so a duplicate id is caught at import time
 * rather than silently shadowing an earlier scene.
 */
export const SCENES: Record<string, Scene> = (() => {
  const map: Record<string, Scene> = {}
  const duplicates: string[] = []

  for (const scene of ALL_SCENES) {
    if (map[scene.id] !== undefined) duplicates.push(scene.id)
    map[scene.id] = scene
  }

  if (duplicates.length > 0) {
    throw new Error(`Duplicate scene id(s): ${duplicates.join(', ')}`)
  }
  return map
})()

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
