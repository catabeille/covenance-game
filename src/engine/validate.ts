/**
 * Story integrity check.
 *
 * A narrative game fails in a particular, miserable way: you mistype a scene id
 * in a choice, everything compiles, and three weeks later a playtester hits a
 * dead button. This walks the whole graph at boot and reports every broken
 * reference at once.
 *
 * Runs in dev (see main.ts) and from `npm run check:story`. The built game
 * skips it.
 */

import type { Effect, Requirement, Scene } from './types.ts'
import { CLUES } from '../story/clues.ts'
import { PROPOSITIONS, TERMS } from '../story/deduction.ts'
import { APPROACHES } from '../data/character.ts'
import { WORLDS } from '../data/world.ts'
import { GIFTS } from '../data/gifts.ts'
import { TOOLS } from '../data/tools.ts'

export type StoryReport = {
  errors: string[]
  warnings: string[]
}

export function validateStory(
  scenes: Record<string, Scene>,
  startSceneId: string,
): StoryReport {
  const errors: string[] = []
  const warnings: string[] = []

  const sceneIds = new Set(Object.keys(scenes))
  const clueIds = new Set(Object.keys(CLUES))
  const termIds = new Set(Object.keys(TERMS))
  const approachIds = new Set(APPROACHES.map((a) => a.id))
  const giftIds = new Set(Object.keys(GIFTS))
  const toolIds = new Set(Object.keys(TOOLS))

  if (!sceneIds.has(startSceneId)) {
    errors.push(`START_SCENE "${startSceneId}" does not exist.`)
  }

  const referenced = new Set<string>([startSceneId])

  /** Clue ids hidden in prose as [[clue-id|invisible words]]. */
  const secretsIn = (body: string): string[] =>
    [...body.matchAll(/\[\[([\w-]+)\|(.+?)\]\]/g)].map((m) => m[1] as string)

  /** Shared checks for anything that grants clues or terms. */
  const checkEffect = (effect: Effect | undefined, where: string): void => {
    for (const clueId of effect?.clues ?? []) {
      if (!clueIds.has(clueId)) errors.push(`${where} grants unknown clue "${clueId}".`)
    }
    for (const termId of effect?.terms ?? []) {
      if (!termIds.has(termId)) errors.push(`${where} grants unknown term "${termId}".`)
    }
    for (const giftId of effect?.gifts ?? []) {
      if (!giftIds.has(giftId)) errors.push(`${where} grants unknown gift "${giftId}".`)
    }
    for (const toolId of effect?.tools ?? []) {
      if (!toolIds.has(toolId)) errors.push(`${where} grants unknown tool "${toolId}".`)
    }
  }

  const checkRequirement = (req: Requirement | undefined, where: string): void => {
    if (req?.clue !== undefined && !clueIds.has(req.clue)) {
      errors.push(`${where} requires unknown clue "${req.clue}".`)
    }
    if (req?.term !== undefined && !termIds.has(req.term)) {
      errors.push(`${where} requires unknown term "${req.term}".`)
    }
    if (req?.approach !== undefined && !approachIds.has(req.approach)) {
      errors.push(`${where} requires unknown approach "${req.approach}".`)
    }
    if (req?.tool !== undefined && !toolIds.has(req.tool)) {
      errors.push(`${where} requires unknown tool "${req.tool}".`)
    }
  }

  /* ---------------------------------------------------------------- */
  /* Scenes                                                           */
  /* ---------------------------------------------------------------- */

  for (const scene of Object.values(scenes)) {
    const where = `scene "${scene.id}"`
    const isRouter = scene.route !== undefined

    checkEffect(scene.onEnter, where)

    for (const clueId of secretsIn(scene.body)) {
      if (!clueIds.has(clueId)) {
        errors.push(`${where} hides unknown clue "${clueId}" in its prose.`)
      }
    }

    const isWorld = scene.world !== undefined
    let world: (typeof WORLDS)[string] | undefined

    if (isWorld) {
      world = WORLDS[scene.world as string]
      if (!world) {
        errors.push(`${where} declares world "${scene.world}" but no such world exists.`)
      }
    }

    if (scene.choices.length === 0 && !isRouter && !isWorld) {
      warnings.push(`${where} has no choices — the player will be stranded.`)
    }

    if (world) {
      if (world.landmarks.length === 0) {
        warnings.push(`${where} has a world with no landmarks — the player will be stranded.`)
      }
      for (const mark of world.landmarks) {
        const which = `${where}, landmark "${mark.id}"`

        if (!sceneIds.has(mark.scene)) {
          errors.push(`${which} points at missing scene "${mark.scene}".`)
        }
        referenced.add(mark.scene)

        checkRequirement(mark.needs, which)
        if (mark.x < 0 || mark.x > world.width) {
          errors.push(`${which} sits at x=${mark.x}, outside the world's width (${world.width}).`)
        }
      }
    }

    if (isRouter) {
      const targets = scene.routesTo ?? []
      if (targets.length === 0) {
        errors.push(
          `${where} has a route() but no routesTo. Declare its targets so they can be checked.`,
        )
      }
      for (const target of targets) {
        if (!sceneIds.has(target)) {
          errors.push(`${where} routes to missing scene "${target}".`)
        }
        referenced.add(target)
      }
    } else if (scene.routesTo !== undefined) {
      warnings.push(`${where} declares routesTo but has no route() to use it.`)
    }

    for (const choice of scene.choices) {
      const which = `${where}, choice "${choice.text}"`

      if (choice.goto === undefined && choice.action === undefined) {
        errors.push(`${which} has neither a goto nor an action — it does nothing.`)
      }
      if (choice.goto !== undefined && choice.action !== undefined) {
        errors.push(`${which} has both a goto and an action. Pick one.`)
      }

      if (choice.goto !== undefined) {
        const target = scenes[choice.goto]

        if (target === undefined) {
          errors.push(`${which} points at missing scene "${choice.goto}".`)
        } else {
          // The procession is one-way. A link backwards into a finished act
          // would be silently pruned at runtime, which is how endings end up
          // with no choices at all and the player gets stranded.
          if (
            scene.act !== undefined &&
            target.act !== undefined &&
            target.act < scene.act
          ) {
            errors.push(
              `${which} points back into act ${target.act} from act ${scene.act}. ` +
                `The rite has already closed it, so this choice can never appear.`,
            )
          }

          if (scene.act === undefined && target.act !== undefined) {
            warnings.push(
              `${which} points into act ${target.act}, but ${where} belongs to no act — ` +
                `if the player arrives here later, the choice will be closed. Use an action instead.`,
            )
          }
        }

        referenced.add(choice.goto)
      }

      checkEffect(choice.effect, which)
      checkRequirement(choice.needs, which)

      if (choice.needs !== undefined && choice.lockedHint === undefined) {
        warnings.push(`${which} is gated but has no lockedHint to explain why.`)
      }
    }

    // A scene every one of whose exits is conditional can strand the player.
    // A world scene's exit is "walk to a landmark with no needs", not a
    // choice, so it is checked against the world's own landmarks instead.
    if (isWorld) {
      const openExit = world?.landmarks.some((m) => m.needs === undefined && m.once !== true)
      if (world && !openExit) {
        warnings.push(
          `${where} has no landmark reachable without a condition — the player could be stuck on the road.`,
        )
      }
    } else {
      const unconditionalExits = scene.choices.filter(
        (c) => c.needs === undefined && c.if === undefined && c.once !== true,
      )
      if (scene.choices.length > 0 && unconditionalExits.length === 0 && !isRouter) {
        warnings.push(
          `${where} has no unconditional exit — if every condition fails, the player is stuck.`,
        )
      }
    }
  }

  for (const id of sceneIds) {
    if (!referenced.has(id)) {
      warnings.push(`scene "${id}" is unreachable — nothing points at it.`)
    }
  }

  /* ---------------------------------------------------------------- */
  /* Clues and terms                                                  */
  /* ---------------------------------------------------------------- */

  const grantableClues = new Set<string>()
  const grantableTerms = new Set<string>()
  const grantableTools = new Set<string>()

  for (const scene of Object.values(scenes)) {
    for (const effect of [scene.onEnter, ...scene.choices.map((c) => c.effect)]) {
      for (const id of effect?.clues ?? []) grantableClues.add(id)
      for (const id of effect?.terms ?? []) grantableTerms.add(id)
      for (const id of effect?.tools ?? []) grantableTools.add(id)
    }
    // Hidden clues are granted by being highlighted, not by any effect.
    for (const id of secretsIn(scene.body)) grantableClues.add(id)
  }

  for (const id of clueIds) {
    if (!grantableClues.has(id)) {
      warnings.push(`clue "${id}" is defined but no scene ever grants it.`)
    }
  }
  for (const id of termIds) {
    if (!grantableTerms.has(id)) {
      warnings.push(`term "${id}" is defined but no scene ever grants it.`)
    }
  }
  for (const id of toolIds) {
    if (!grantableTools.has(id)) {
      warnings.push(`tool "${id}" is defined but no scene ever grants it.`)
    }
  }

  /* ---------------------------------------------------------------- */
  /* Verdict board                                                    */
  /* ---------------------------------------------------------------- */

  for (const proposition of PROPOSITIONS) {
    const where = `proposition "${proposition.id}"`
    checkRequirement(proposition.needs, where)

    const slotIds = new Set(proposition.slots.map((s) => s.id))
    const tokens = new Set(
      [...proposition.template.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string),
    )

    for (const slot of proposition.slots) {
      const solution = TERMS[slot.solution]

      if (solution === undefined) {
        errors.push(`${where}, slot "${slot.id}" has unknown solution "${slot.solution}".`)
      } else if (solution.kind !== slot.kind) {
        errors.push(
          `${where}, slot "${slot.id}" expects a ${slot.kind} but its solution ` +
            `"${slot.solution}" is a ${solution.kind} — the correct answer could never be offered.`,
        )
      }

      if (!tokens.has(slot.id)) {
        errors.push(`${where} declares slot "${slot.id}" but never uses {${slot.id}} in its template.`)
      }

      // A blank with nothing to choose between is not a deduction.
      const alternatives = Object.values(TERMS).filter((t) => t.kind === slot.kind)
      if (alternatives.length < 2) {
        warnings.push(
          `${where}, slot "${slot.id}" is the only ${slot.kind} in the game — it has no wrong answers.`,
        )
      }
    }

    for (const token of tokens) {
      if (!slotIds.has(token)) {
        warnings.push(`${where} uses {${token}} in its template but declares no such slot.`)
      }
    }
  }

  return { errors, warnings }
}

/** Print a report to the console, loudly if anything is broken. */
export function reportStory(report: StoryReport): void {
  for (const w of report.warnings) console.warn(`[story] ${w}`)
  for (const e of report.errors) console.error(`[story] ${e}`)

  if (report.errors.length === 0 && report.warnings.length === 0) {
    console.info('[story] graph is intact.')
  }
}
