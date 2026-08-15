/**
 * Rendering the walkable road.
 *
 * The stage is one wide strip translated horizontally under a fixed viewport —
 * a camera, in effect. Everything is absolutely positioned by its `x`, so the
 * data in world.ts is the only place a position is decided.
 *
 * Movement itself lives in game.ts; this file only draws.
 */

import type { GameState, Landmark, WorldMap, Waypoint, Star } from '../engine/types.ts'
import { escapeHtml } from '../engine/text.ts'
import { meetsRequirement, hasVisited } from '../engine/state.ts'
import { resolveArt } from '../data/art.ts'
import { findPortrait } from '../data/character.ts'
import { ATTEND_RANGE } from '../data/world.ts'

/** Landmarks the player can currently see on the road. */
export function visibleLandmarks(state: GameState, world: WorldMap): Landmark[] {
  return world.landmarks.filter((mark) => {
    if (!meetsRequirement(state, mark.needs)) return false
    if (mark.once === true && hasVisited(state, mark.scene)) return false
    return true
  })
}

/** The landmark within reach of where the player is standing, if any. */
export function landmarkInReach(
  state: GameState,
  world: WorldMap,
  x: number,
): Landmark | undefined {
  let best: Landmark | undefined
  let bestDistance = ATTEND_RANGE

  for (const mark of visibleLandmarks(state, world)) {
    const distance = Math.abs(mark.x - x)
    if (distance <= bestDistance) {
      best = mark
      bestDistance = distance
    }
  }
  return best
}

function landmarkHtml(mark: Landmark, inReach: boolean, visited: boolean): string {
  const art = resolveArt(mark.art)
  const portrait = mark.sprite ? findPortrait(mark.sprite) : undefined

  const figure = portrait
    ? `<figure class="walk__sprite" data-portrait>
         <span class="portrait__glyph" aria-hidden="true">${escapeHtml(portrait.glyph)}</span>
         <img class="portrait__img" src="${escapeHtml(portrait.file)}"
              alt="${escapeHtml(portrait.label)}" data-portrait-img />
       </figure>`
    : art
      ? `<pre class="walk__art" aria-hidden="true">${escapeHtml(art)}</pre>`
      : `<span class="walk__mark" aria-hidden="true">†</span>`

  return `
    <div class="walk__landmark ${inReach ? 'is-near' : ''} ${visited ? 'is-visited' : ''}"
         style="left:${mark.x}px" data-landmark="${escapeHtml(mark.id)}">
      ${figure}
      <span class="walk__label">
        ${visited ? '<span class="walk__check" aria-hidden="true">✓</span> ' : ''}${escapeHtml(mark.label)}
      </span>
    </div>`
}

function waypointHtml(point: Waypoint): string {
  return `<span class="walk__waypoint" aria-hidden="true" style="left:${point.x}px">${escapeHtml(point.glyph)}</span>`
}

function starHtml(star: Star): string {
  return `<span class="walk__star" aria-hidden="true" style="left:${star.x}px;top:${star.top}%">${escapeHtml(star.glyph)}</span>`
}

export function renderWorld(state: GameState, world: WorldMap, x: number): string {
  const near = landmarkInReach(state, world, x)

  const marks = visibleLandmarks(state, world)
    .map((mark) => landmarkHtml(mark, mark.id === near?.id, hasVisited(state, mark.scene)))
    .join('')

  const waypoints = (world.waypoints ?? []).map(waypointHtml).join('')
  const stars = (world.stars ?? []).map(starHtml).join('')

  const walker = findPortrait(state.character.portraitId)

  return `
    <section class="walk" data-walk aria-label="${escapeHtml(world.location ?? 'The road')}">
      <div class="walk__viewport" data-walk-viewport>
        <div class="walk__stage" data-walk-stage style="width:${world.width}px">
          ${stars}
          ${waypoints}
          ${marks}

          <div class="walk__walker" data-walker style="left:${x}px">
            <figure class="walk__sprite walk__sprite--you" data-portrait>
              <span class="portrait__glyph" aria-hidden="true">${escapeHtml(walker?.glyph ?? '·')}</span>
              <img class="portrait__img" src="${escapeHtml(walker?.file ?? '')}"
                   alt="You" data-portrait-img />
            </figure>
          </div>

          <div class="walk__ground" style="width:${world.width}px"></div>
        </div>
      </div>

      <footer class="walk__hud">
        <div class="walk__dpad">
          <button class="walk__pad" type="button" data-walk="left" aria-label="Walk left">‹</button>
          <button class="walk__pad" type="button" data-walk="right" aria-label="Walk right">›</button>
        </div>
        <div class="walk__status" data-walk-status>${
          near
            ? `<button class="walk__attend" data-action="attend" data-scene="${escapeHtml(near.scene)}">
                 <span class="walk__key">↑</span> ${escapeHtml(near.label)}
               </button>`
            : `<span class="walk__hint"><span class="walk__key">← →</span> walk the road</span>`
        }
        </div>
      </footer>
    </section>`
}
