/**
 * Deciding which choices a player can see, and which are visible-but-locked.
 *
 * Lives in one place because the renderer and the click handler must agree
 * exactly on the list — if they disagree, clicking "Ask about the register"
 * silently runs "Leave".
 */

import type { Choice, GameState, Scene } from './types.ts'
import { hasTaken, meetsRequirement } from './state.ts'
import { getScene } from '../story/index.ts'

export type ResolvedChoice = {
  choice: Choice
  /** Requirement unmet: shown, greyed, with its lockedHint. */
  locked: boolean
}

/**
 * The four ways a choice can be filtered:
 *   `if`     — hidden entirely (logic the player should never see)
 *   `once`   — hidden after being taken (spent dialogue)
 *   act      — hidden because the procession has left that place behind
 *   `needs`  — shown but locked (a visible goal to work towards)
 *
 * The act check is automatic: authors tag scenes with the act they belong to
 * and the engine closes the door behind the rite. Nobody has to remember to
 * prune the return journey by hand.
 */
export function visibleChoices(state: GameState, scene: Scene): ResolvedChoice[] {
  const out: ResolvedChoice[] = []

  for (const choice of scene.choices) {
    if (choice.if !== undefined && !choice.if(state)) continue
    if (choice.once === true && hasTaken(state, scene.id, choice.text)) continue
    if (choice.goto !== undefined && pointsIntoAClosedAct(state, choice.goto)) continue

    out.push({ choice, locked: !meetsRequirement(state, choice.needs) })
  }

  return out
}

/** True when the target belongs to an act the procession has already passed. */
function pointsIntoAClosedAct(state: GameState, sceneId: string): boolean {
  const target = getScene(sceneId)
  if (!target || target.act === undefined) return false
  return target.act < state.act
}
