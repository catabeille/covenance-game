/**
 * The sky.
 *
 * A sun sits on the left horizon and a moon on the right, always — they never
 * leave, they only rise and sink. The page is graded reddish-pink on the left
 * to greyish-blue on the right, and whichever body is ascendant pulls the
 * whole page toward its own colour.
 *
 * The reading is moral, not meteorological:
 *
 *   moon high  →  you are unremarkable. The fold is at ease. Night, quiet.
 *   sun high   →  you are being looked at. Dawn, exposure, judgement.
 *
 * Act III floors the sun high no matter how careful the player has been,
 * because by then it is not the village doing the looking.
 */

import type { GameState } from '../engine/types.ts'
import { suspicion } from '../engine/state.ts'

/** Suspicion at which the sun is fully risen. */
const SUSPICION_CEILING = 8

/** How much of the sky each act is willing to use. The rite escalates. */
const ACT_REACH: Record<number, number> = { 1: 0.42, 2: 0.72, 3: 1 }

/** Act III is judged whatever you did. The sun does not go back down. */
const ACT_THREE_SUN_FLOOR = 0.66

export type Celestial = {
  /** 0 = resting on the horizon, 1 = fully risen. */
  sun: number
  moon: number
  /** 0 = night and safety, 1 = daylight and exposure. Drives the grade. */
  exposure: number
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

export function celestial(state: GameState): Celestial {
  const heat = clamp01(suspicion(state) / SUSPICION_CEILING)
  const reach = ACT_REACH[state.act] ?? 1

  let sun = heat * reach
  const moon = (1 - heat) * reach

  if (state.act >= 3) sun = Math.max(sun, ACT_THREE_SUN_FLOOR)

  return { sun: clamp01(sun), moon: clamp01(moon), exposure: clamp01(sun) }
}

/**
 * Push the sky onto the document element as custom properties. The page
 * background reads these directly, so the whole world re-grades itself
 * whenever suspicion moves — no repaint logic, just three numbers.
 */
export function applySky(state: GameState): void {
  const { sun, moon, exposure } = celestial(state)
  const root = document.documentElement

  root.style.setProperty('--sun-rise', sun.toFixed(3))
  root.style.setProperty('--moon-rise', moon.toFixed(3))
  root.style.setProperty('--exposure', exposure.toFixed(3))
}

/** Reset to a calm night sky for the title and creation screens. */
export function applyRestingSky(): void {
  const root = document.documentElement
  root.style.setProperty('--sun-rise', '0.06')
  root.style.setProperty('--moon-rise', '0.34')
  root.style.setProperty('--exposure', '0.12')
}

/**
 * The horizon band. Ornament either side of each body is drawn from the same
 * script the fold writes its prayers in, so the sky reads as part of the
 * liturgy rather than as weather.
 */
export function renderSky(): string {
  return `
    <div class="sky" aria-hidden="true">
      <div class="sky__band"></div>

      <!--
        Sun and moon keep their real glyphs — they are absolutely positioned,
        so a font substitution costs nothing here. The horizon ornament uses
        daggers and middots, which every monospace font actually ships.
      -->
      <div class="orb orb--sun">
        <span class="orb__rays">°</span>
        <span class="orb__body">☀</span>
      </div>

      <div class="orb orb--moon">
        <span class="orb__body">☾</span>
        <span class="orb__rays">°</span>
      </div>

      <div class="sky__horizon">
        <span>†</span><span>·</span><span>†</span><span>·</span><span>†</span>
        <span>·</span><span>†</span><span>·</span><span>†</span><span>·</span>
        <span>†</span><span>·</span><span>†</span>
      </div>
    </div>`
}
