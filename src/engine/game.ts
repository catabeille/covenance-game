/**
 * The controller: owns state, decides what screen we are on, wires events.
 *
 * Rendering is innerHTML from views.ts, so listeners are delegated from the
 * root element rather than bound per element — one listener, no re-binding,
 * nothing to leak.
 */

import type { Character, GameState } from './types.ts'
import type { EffectResult } from './state.ts'
import { visibleChoices } from './choices.ts'
import { availablePropositions, caseIsComplete, setAssertion } from './deduction.ts'
import {
  advanceAct,
  applyEffect,
  clearSave,
  createState,
  defaultCharacter,
  emptyEffectResult,
  hasSave,
  hasVisited,
  load,
  markTaken,
  markVisited,
  save,
} from './state.ts'
import { PORTRAITS, PRONOUN_SETS, SUBSTITUTE_PORTRAIT } from '../data/character.ts'
import { CLUES } from '../story/clues.ts'
import { START_SCENE, getScene } from '../story/index.ts'
import {
  renderCreate,
  renderNotebook,
  renderScene,
  renderTitle,
  renderReckoning,
  renderVerdictBoard,
} from '../ui/views.ts'
import { moveClue } from './reckoning.ts'
import { applyRestingSky, applySky } from '../ui/sky.ts'
import { landmarkInReach, renderWorld } from '../ui/world.ts'
import { WALK_SPEED, getWorld } from '../data/world.ts'
import type { WorldMap } from './types.ts'

type Screen = 'title' | 'create' | 'scene'

/** Only one overlay at a time; they compete for the same screen. */
type Panel = 'none' | 'notebook' | 'verdict' | 'reckoning'

/** Router scenes chain; this caps it so a cycle fails loudly instead of hanging. */
const MAX_ROUTE_HOPS = 16

/** Keys that move the walker. Held rather than tapped, so they are tracked. */
const WALK_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'])

export class Game {
  private root: HTMLElement
  private screen: Screen = 'title'
  private panel: Panel = 'none'
  private state: GameState | null = null
  private draft: Character = defaultCharacter()
  /** What the most recent action gained, for the "Noted" toast. */
  private gained: EffectResult = emptyEffectResult()

  /* Walking state. Live only while a world scene is on screen. */
  private walkWorld: WorldMap | null = null
  private walkX = 0
  private walkFacing: 1 | -1 = 1
  private walkFrame = 0
  private walkLastTime = 0
  private readonly held = new Set<string>()
  private nearId: string | null = null

  constructor(root: HTMLElement) {
    this.root = root
    this.root.addEventListener('click', this.onClick)
    this.root.addEventListener('input', this.onInput)
    this.root.addEventListener('change', this.onChange)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.onBlur)
    document.addEventListener('selectionchange', this.onSelectionChange)
  }

  start(): void {
    this.render()
  }

  /* ---------------------------------------------------------------- */
  /* Transitions                                                      */
  /* ---------------------------------------------------------------- */

  private beginNewGame(): void {
    const name = this.draft.name.trim()
    if (name === '') {
      this.root.querySelector<HTMLElement>('[data-create-error]')?.removeAttribute('hidden')
      this.root.querySelector<HTMLInputElement>('[data-name-input]')?.focus()
      return
    }

    const state = createState({ ...this.draft, name }, START_SCENE)
    this.gained = this.enterScene(state, START_SCENE)
    this.state = state
    this.screen = 'scene'
    this.panel = 'none'
    save(state)
    this.render()
  }

  private continueGame(): void {
    const loaded = load()
    if (!loaded) {
      this.screen = 'title'
      this.render()
      return
    }
    this.state = loaded
    this.gained = emptyEffectResult()
    this.screen = 'scene'
    this.panel = 'none'
    this.render()
  }

  /**
   * Move into a scene, applying its onEnter the first time only, then
   * following any `route` it defines. Returns everything newly gained along
   * the way — a router scene can grant things before handing off.
   */
  private enterScene(state: GameState, sceneId: string): EffectResult {
    const gained = emptyEffectResult()
    const seen = new Set<string>()
    let current = sceneId

    for (let hop = 0; hop < MAX_ROUTE_HOPS; hop += 1) {
      if (seen.has(current)) {
        console.error(`[covenance] route cycle at scene "${current}"; stopping here.`)
        break
      }
      seen.add(current)

      state.sceneId = current
      const scene = getScene(current)
      if (!scene) break

      // Walking into a later act *is* the rite moving on. Everything behind
      // closes itself the moment this happens.
      if (scene.act !== undefined) advanceAct(state, scene.act)

      if (!hasVisited(state, current)) {
        const result = applyEffect(state, scene.onEnter)
        gained.clues.push(...result.clues)
        gained.terms.push(...result.terms)
        gained.approaches.push(...result.approaches)
        gained.gifts.push(...result.gifts)
        markVisited(state, current)
      }

      if (!scene.route) break

      const next = scene.route(state)
      if (!next || next === current) break
      current = next
    }

    return gained
  }

  private choose(index: number): void {
    const state = this.state
    if (!state) return

    const scene = getScene(state.sceneId)
    if (!scene) return

    const resolved = visibleChoices(state, scene)[index]
    if (!resolved || resolved.locked) return

    const { choice } = resolved

    markTaken(state, scene.id, choice.text)
    const fromChoice = applyEffect(state, choice.effect)

    if (choice.action === 'title') {
      save(state)
      this.quitToTitle()
      return
    }

    if (choice.goto === undefined) {
      console.error(`[covenance] choice "${choice.text}" has neither goto nor action.`)
      return
    }

    const fromScene = this.enterScene(state, choice.goto)

    this.gained = {
      clues: [...fromChoice.clues, ...fromScene.clues],
      terms: [...fromChoice.terms, ...fromScene.terms],
      approaches: [...fromChoice.approaches, ...fromScene.approaches],
      gifts: [...fromChoice.gifts, ...fromScene.gifts],
    }
    this.panel = 'none'
    save(state)
    this.render()
  }

  private quitToTitle(): void {
    if (this.state) save(this.state)
    this.panel = 'none'
    this.screen = 'title'
    this.render()
  }

  private togglePanel(which: Panel): void {
    this.panel = this.panel === which ? 'none' : which
    this.render()
  }

  /* ---------------------------------------------------------------- */
  /* Events                                                           */
  /* ---------------------------------------------------------------- */

  private onClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null
    const actionEl = target?.closest<HTMLElement>('[data-action]')
    if (!actionEl) return

    const action = actionEl.dataset['action']
    const value = actionEl.dataset['value']

    // The backdrop closes on click; the panel sitting on top of it must not.
    if (action === 'close-overlay' && target?.closest('[data-stop]')) return

    switch (action) {
      case 'new-game':
        clearSave()
        this.draft = defaultCharacter()
        this.screen = 'create'
        this.render()
        break

      case 'continue':
        this.continueGame()
        break

      case 'set-pronouns': {
        const set = PRONOUN_SETS.find((p) => p.id === value)
        if (set) this.draft.pronouns = set
        this.render()
        break
      }

      case 'set-approach':
        if (value === 'observant' || value === 'disarming' || value === 'lettered') {
          this.draft.approach = value
        }
        this.render()
        break

      case 'set-portrait': {
        const portrait = PORTRAITS.find((p) => p.id === value)
        if (portrait) this.draft.portraitId = portrait.id
        this.render()
        break
      }

      case 'begin':
        this.beginNewGame()
        break

      case 'choose':
        this.choose(Number(actionEl.dataset['index']))
        break

      case 'toggle-notebook':
        this.togglePanel('notebook')
        break

      case 'toggle-verdict':
        this.togglePanel('verdict')
        break

      case 'toggle-reckoning':
        this.togglePanel('reckoning')
        break

      case 'move-clue': {
        const state = this.state
        const clueId = actionEl.dataset['clue']
        const dir = actionEl.dataset['dir']
        if (!state || !clueId || (dir !== 'up' && dir !== 'down')) break

        moveClue(state, clueId, dir)
        save(state)
        this.render()

        // Keep the keyboard on the button that just moved, so a run of nudges
        // does not send focus back to the top of the list each time.
        this.root
          .querySelector<HTMLElement>(
            `[data-action="move-clue"][data-clue="${CSS.escape(clueId)}"][data-dir="${dir}"]`,
          )
          ?.focus()
        break
      }

      case 'close-overlay':
      case 'close-panels':
        this.panel = 'none'
        this.render()
        break

      case 'attend': {
        const sceneId = actionEl.dataset['scene']
        if (sceneId) this.attend(sceneId)
        break
      }

      case 'quit-to-title':
        this.quitToTitle()
        break
    }
  }

  /** Name field updates the draft without re-rendering, so focus survives. */
  private onInput = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (!target?.matches('[data-name-input]')) return

    this.draft.name = (target as HTMLInputElement).value
    if (this.draft.name.trim() !== '') {
      this.root.querySelector<HTMLElement>('[data-create-error]')?.setAttribute('hidden', '')
    }
  }

  /**
   * Verdict board answers. Updated in place rather than by re-rendering, so a
   * keyboard user does not lose their position on the board after every pick.
   */
  private onChange = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const select = target?.closest<HTMLSelectElement>('select[data-action="assert"]')
    const state = this.state
    if (!select || !state) return

    const propositionId = select.dataset['prop']
    const slotId = select.dataset['slot']
    if (!propositionId || !slotId) return

    setAssertion(state, propositionId, slotId, select.value)
    save(state)

    select.classList.toggle('blank--filled', select.value !== '')
    this.refreshVerdictStatus()
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null
    const tag = target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

    if (event.key === 'Escape' && this.panel !== 'none') {
      this.panel = 'none'
      this.render()
      return
    }

    if (this.screen !== 'scene') return

    if (event.key === 'n' || event.key === 'N') {
      this.togglePanel('notebook')
      return
    }

    if ((event.key === 'v' || event.key === 'V') && this.state) {
      if (availablePropositions(this.state).length > 0) this.togglePanel('verdict')
      return
    }

    if ((event.key === 'o' || event.key === 'O') && this.state) {
      if (this.state.clues.length >= 3) this.togglePanel('reckoning')
      return
    }

    if (this.panel !== 'none') return

    // On the road, the arrow keys walk and up attends. Digits do nothing —
    // there is no choice list to number.
    if (this.walkWorld) {
      if (WALK_KEYS.has(event.key)) {
        this.held.add(event.key)
        event.preventDefault()
        return
      }
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'Enter') {
        const near = landmarkInReach(this.state!, this.walkWorld, this.walkX)
        if (near) this.attend(near.scene)
        event.preventDefault()
      }
      return
    }

    // 1–9 select the nth choice, matching the numbers shown beside them.
    if (/^[1-9]$/.test(event.key)) {
      this.choose(Number(event.key) - 1)
    }
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    if (WALK_KEYS.has(event.key)) this.held.delete(event.key)
  }

  /** Releasing focus must not leave the walker sliding forever. */
  private onBlur = (): void => {
    this.held.clear()
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  private render(): void {
    this.stopWalking()
    this.root.innerHTML = this.html()
    this.wirePortraits()
    this.wireSecrets()

    if (this.screen === 'scene' && this.state) applySky(this.state)
    else applyRestingSky()

    const world = this.currentWorld()
    if (world) this.startWalking(world)

    if (this.screen === 'create') {
      this.root.querySelector<HTMLInputElement>('[data-name-input]')?.focus()
    }
  }

  private html(): string {
    switch (this.screen) {
      case 'title':
        return renderTitle(hasSave())

      case 'create':
        return renderCreate(this.draft)

      case 'scene': {
        const state = this.state
        if (!state) return renderTitle(hasSave())

        const scene = getScene(state.sceneId)
        if (!scene) {
          return `<main class="screen"><p class="error">
            Missing scene "${state.sceneId}". The story graph is broken —
            check the console for the validation report.
          </p></main>`
        }

        // A world scene is a stretch of road, not prose. Every existing
        // `goto` aimed at it therefore returns the player to the road.
        if (scene.world !== undefined) {
          const world = getWorld(scene.world)
          if (world) {
            const x = state.walkerX[world.id] ?? world.entry
            return (
              renderScene(state, scene, this.gained, renderWorld(state, world, x)) +
              this.overlayHtml(state)
            )
          }
        }

        const overlay =
          this.panel === 'notebook'
            ? renderNotebook(state)
            : this.panel === 'verdict'
              ? renderVerdictBoard(state)
              : this.panel === 'reckoning'
                ? renderReckoning(state)
                : ''

        return renderScene(state, scene, this.gained) + overlay
      }
    }
  }

  private overlayHtml(state: GameState): string {
    if (this.panel === 'notebook') return renderNotebook(state)
    if (this.panel === 'verdict') return renderVerdictBoard(state)
    if (this.panel === 'reckoning') return renderReckoning(state)
    return ''
  }

  /* ---------------------------------------------------------------- */
  /* Walking                                                          */
  /* ---------------------------------------------------------------- */

  /** The world the player is currently standing in, if any. */
  private currentWorld(): WorldMap | null {
    if (this.screen !== 'scene' || !this.state) return null
    const scene = getScene(this.state.sceneId)
    if (!scene?.world) return null
    return getWorld(scene.world) ?? null
  }

  private startWalking(world: WorldMap): void {
    const state = this.state
    if (!state) return

    this.walkWorld = world
    this.walkX = state.walkerX[world.id] ?? world.entry
    this.nearId = landmarkInReach(state, world, this.walkX)?.id ?? null
    this.walkLastTime = performance.now()

    this.updateCamera()
    cancelAnimationFrame(this.walkFrame)
    this.walkFrame = requestAnimationFrame(this.step)
  }

  private stopWalking(): void {
    cancelAnimationFrame(this.walkFrame)
    this.walkFrame = 0
    this.walkWorld = null
    this.held.clear()
  }

  /**
   * The walk loop. Only transforms and one prompt change per frame — a full
   * re-render at 60fps would rebuild the whole scene, drop the player's text
   * selection and thrash the DOM for no reason.
   */
  private step = (now: number): void => {
    const world = this.walkWorld
    const state = this.state
    if (!world || !state) return

    const dt = Math.min(0.05, (now - this.walkLastTime) / 1000)
    this.walkLastTime = now

    const left = this.held.has('ArrowLeft') || this.held.has('a')
    const right = this.held.has('ArrowRight') || this.held.has('d')
    const dir = (right ? 1 : 0) - (left ? 1 : 0)

    if (dir !== 0) {
      this.walkX = Math.max(0, Math.min(world.width, this.walkX + dir * WALK_SPEED * dt))
      this.walkFacing = dir > 0 ? 1 : -1
      state.walkerX[world.id] = Math.round(this.walkX)
      this.updateCamera()
      this.updateProximity(state, world)
    }

    this.walkFrame = requestAnimationFrame(this.step)
  }

  private updateCamera(): void {
    const world = this.walkWorld
    if (!world) return

    const walker = this.root.querySelector<HTMLElement>('[data-walker]')
    const stage = this.root.querySelector<HTMLElement>('[data-walk-stage]')
    const viewport = this.root.querySelector<HTMLElement>('[data-walk-viewport]')
    if (!walker || !stage || !viewport) return

    walker.style.left = `${this.walkX}px`
    walker.style.setProperty('--facing', String(this.walkFacing))

    // Keep the walker centred until the road runs out at either end.
    const half = viewport.clientWidth / 2
    const maxScroll = Math.max(0, world.width - viewport.clientWidth)
    const scroll = Math.max(0, Math.min(maxScroll, this.walkX - half))
    stage.style.transform = `translateX(${-scroll}px)`
  }

  /** Swap the attend prompt when the nearest landmark changes. */
  private updateProximity(state: GameState, world: WorldMap): void {
    const near = landmarkInReach(state, world, this.walkX)
    const nextId = near?.id ?? null
    if (nextId === this.nearId) return
    this.nearId = nextId

    for (const el of this.root.querySelectorAll<HTMLElement>('[data-landmark]')) {
      el.classList.toggle('is-near', el.dataset['landmark'] === nextId)
    }

    const hud = this.root.querySelector<HTMLElement>('.walk__hud')
    if (!hud) return

    hud.innerHTML = near
      ? `<button class="walk__attend" data-action="attend" data-scene="${near.scene}">
           <span class="walk__key">↑</span> ${near.label}
         </button>`
      : `<span class="walk__hint"><span class="walk__key">← →</span> walk the road</span>`
  }

  private attend(sceneId: string): void {
    const state = this.state
    if (!state) return

    if (this.walkWorld) state.walkerX[this.walkWorld.id] = Math.round(this.walkX)
    this.stopWalking()

    this.gained = this.enterScene(state, sceneId)
    this.panel = 'none'
    save(state)
    this.render()
  }

  /** Update the board's "ready" line and the HUD dot without a full re-render. */
  private refreshVerdictStatus(): void {
    const state = this.state
    if (!state) return

    const ready = caseIsComplete(state)

    const status = this.root.querySelector<HTMLElement>('.board__status')
    if (status) {
      status.classList.toggle('board__status--ready', ready)
      status.textContent = ready
        ? 'Every blank is filled. You can deliver this when you are ready.'
        : 'There are blanks left. You may deliver it unfinished, but it will not hold.'
    }

    const hudButton = this.root.querySelector<HTMLElement>('[data-action="toggle-verdict"]')
    if (hudButton) {
      hudButton.innerHTML = ready ? 'Verdict <span class="hud__ready">●</span>' : 'Verdict'
    }
  }

  /**
   * Words hidden in the page — written in the background's own colour, the way
   * a scribe hides a gloss in a margin. Dragging a selection across one
   * reveals it and records the clue.
   *
   * Anything already found stays legible, so a reader never has to remember
   * where they scrubbed.
   */
  private wireSecrets(): void {
    const state = this.state
    if (!state) return

    for (const el of this.root.querySelectorAll<HTMLElement>('.secret[data-secret]')) {
      const clueId = el.dataset['secret']
      if (clueId && state.clues.includes(clueId)) el.classList.add('secret--found')
    }
  }

  private onSelectionChange = (): void => {
    const state = this.state
    if (!state || this.screen !== 'scene') return

    const selection = document.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return

    const revealed: string[] = []

    for (const el of this.root.querySelectorAll<HTMLElement>('.secret[data-secret]')) {
      if (!selection.containsNode(el, true)) continue

      el.classList.add('secret--found')
      const clueId = el.dataset['secret']
      if (clueId && !state.clues.includes(clueId)) revealed.push(clueId)
    }

    if (revealed.length === 0) return

    const result = applyEffect(state, { clues: revealed })
    save(state)

    // Re-rendering would drop the player's selection mid-drag, so announce the
    // find by hand and leave the page alone.
    this.gained = { ...emptyEffectResult(), clues: result.clues }
    this.announceFind(result.clues)
  }

  /** Slot a toast into the live page without a full re-render. */
  private announceFind(clueIds: string[]): void {
    if (clueIds.length === 0) return

    const existing = this.root.querySelector('.toast')
    const html = `
      <span class="toast__label">Noted</span>
      ${clueIds
        .map((id) => `<span class="toast__clue">${CLUES[id]?.name ?? id}</span>`)
        .join('<span class="toast__sep" aria-hidden="true">·</span>')}`

    if (existing) {
      existing.innerHTML = html
      return
    }

    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.setAttribute('role', 'status')
    toast.innerHTML = html
    this.root.querySelector('.divider')?.before(toast)
  }

  /**
   * Portraits show a unicode glyph until a real png loads. Flipping on `load`
   * (rather than hiding on `error`) means a missing file needs no error path —
   * it simply never flips, and the glyph stands.
   */
  private wirePortraits(): void {
    const images = this.root.querySelectorAll<HTMLImageElement>('[data-portrait-img]')

    for (const img of images) {
      const parent = img.parentElement
      if (!parent) continue

      const markLoaded = () => parent.classList.add('has-img')

      // A character with no png of their own falls back to the substitute
      // rather than straight to the glyph, so an undrawn cast still reads as
      // a cast. The guard stops a missing substitute looping forever.
      const fallBack = () => {
        if (img.dataset['substituted'] === 'true') return
        img.dataset['substituted'] = 'true'
        img.src = SUBSTITUTE_PORTRAIT
      }

      if (img.complete) {
        if (img.naturalWidth > 0) markLoaded()
        else fallBack()
      }

      img.addEventListener('load', markLoaded)
      img.addEventListener('error', fallBack)
    }
  }
}
