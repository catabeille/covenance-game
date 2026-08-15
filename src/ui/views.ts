/**
 * Pure rendering: state in, HTML string out. No event wiring, no mutation.
 *
 * Interactive elements carry `data-action` (and sometimes `data-value` /
 * `data-index`); game.ts listens once on the root and dispatches on those.
 */

import type { Character, GameState, Scene } from '../engine/types.ts'
import type { EffectResult } from '../engine/state.ts'
import { escapeHtml, interpolate, paragraphs } from '../engine/text.ts'
import { visibleChoices } from '../engine/choices.ts'
import { suspicion } from '../engine/state.ts'
import {
  availablePropositions,
  caseIsComplete,
  getAssertion,
  getTerm,
  knownTermsOfKind,
  parseTemplate,
} from '../engine/deduction.ts'
import { DIVIDER, resolveArt } from '../data/art.ts'
import {
  APPROACHES,
  PORTRAITS,
  PRONOUN_SETS,
  findPortrait,
} from '../data/character.ts'
import { CATEGORY_LABEL, CATEGORY_ORDER, CLUES } from '../story/clues.ts'
import { getGift } from '../data/gifts.ts'
import { getTool } from '../data/tools.ts'
import { renderSky } from './sky.ts'
import { arrangedClues, concordance, reckoningVerdict } from '../engine/reckoning.ts'

/** Acts are shown as numerals — it is a rite, not a level select. */
function romanNumeral(n: number): string {
  const numerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  return numerals[n] ?? String(n)
}

/**
 * Minimal inline markup for prose. Escaped first, so story text can never
 * inject markup by accident.
 *
 *   **bold**  *italic*
 *   [[clue-id|words written in milk]]
 *
 * The last one is invisible: rendered in the page's own background colour, so
 * it reads as blank parchment until the player drags a selection across it.
 * Scribes hid things in margins; so does this. Selecting it records the clue —
 * see Game.onSelectionChange.
 */
function prose(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(
      /\[\[([\w-]+)\|(.+?)\]\]/g,
      (_whole, clueId: string, hidden: string) =>
        `<span class="secret" data-secret="${clueId}">${hidden}</span>`,
    )
}

/**
 * A portrait renders both the image and a glyph fallback; game.ts hides the
 * glyph once the image loads. That way the game is fully playable before any
 * png exists, and gains art the moment a file is dropped in.
 */
function portraitHtml(portraitId: string | undefined): string {
  if (!portraitId) return ''
  const portrait = findPortrait(portraitId)
  if (!portrait) return ''

  return `
    <figure class="portrait" data-portrait>
      <span class="portrait__glyph" aria-hidden="true">${escapeHtml(portrait.glyph)}</span>
      <img class="portrait__img" src="${escapeHtml(portrait.file)}"
           alt="${escapeHtml(portrait.label)}" data-portrait-img />
    </figure>`
}

/* ------------------------------------------------------------------ */
/* Title                                                               */
/* ------------------------------------------------------------------ */

export function renderTitle(canContinue: boolean): string {
  return `
    <main class="screen screen--title">
      <pre class="title__mark" aria-hidden="true">${escapeHtml(resolveArt('boundary-stone') ?? '')}</pre>
      <h1 class="title__name">Covenance</h1>
      <p class="title__tagline">An oath is only a promise that someone is watching.</p>
      <nav class="menu">
        ${
          canContinue
            ? `<button class="btn btn--primary" data-action="continue">Continue</button>`
            : ''
        }
        <button class="btn ${canContinue ? '' : 'btn--primary'}" data-action="new-game">
          ${canContinue ? 'Begin again' : 'Begin'}
        </button>
      </nav>
      ${canContinue ? `<p class="menu__note">Beginning again will overwrite your saved game.</p>` : ''}
    </main>`
}

/* ------------------------------------------------------------------ */
/* Character creation                                                  */
/* ------------------------------------------------------------------ */

export function renderCreate(draft: Character): string {
  const pronounOptions = PRONOUN_SETS.map(
    (p) => `
      <button class="chip ${p.id === draft.pronouns.id ? 'chip--on' : ''}"
              data-action="set-pronouns" data-value="${escapeHtml(p.id)}">
        ${escapeHtml(p.label)}
      </button>`,
  ).join('')

  const approachOptions = APPROACHES.map(
    (a) => `
      <button class="card ${a.id === draft.approach ? 'card--on' : ''}"
              data-action="set-approach" data-value="${escapeHtml(a.id)}">
        <span class="card__glyph" aria-hidden="true">${escapeHtml(a.glyph)}</span>
        <span class="card__name">${escapeHtml(a.name)}</span>
        <span class="card__blurb">${escapeHtml(a.blurb)}</span>
      </button>`,
  ).join('')

  const portraitOptions = PORTRAITS.map(
    (p) => `
      <button class="slot ${p.id === draft.portraitId ? 'slot--on' : ''}"
              data-action="set-portrait" data-value="${escapeHtml(p.id)}"
              title="${escapeHtml(p.file)}">
        <span class="portrait__glyph" aria-hidden="true">${escapeHtml(p.glyph)}</span>
        <img class="portrait__img" src="${escapeHtml(p.file)}"
             alt="${escapeHtml(p.label)}" data-portrait-img />
      </button>`,
  ).join('')

  return `
    <main class="screen screen--create">
      <h1 class="create__heading">Who is walking down into Covenance?</h1>

      <section class="field">
        <label class="field__label" for="name-input">Name</label>
        <input id="name-input" class="field__input" type="text" maxlength="24"
               placeholder="Wren" value="${escapeHtml(draft.name)}"
               data-name-input autocomplete="off" spellcheck="false" />
      </section>

      <section class="field">
        <span class="field__label">Pronouns</span>
        <div class="chips">${pronounOptions}</div>
      </section>

      <section class="field">
        <span class="field__label">Approach</span>
        <p class="field__hint">
          Where you begin. It opens doors the others cannot — and the rite will
          teach you the rest, if you give it the time.
        </p>
        <div class="cards">${approachOptions}</div>
      </section>

      <section class="field">
        <span class="field__label">Portrait</span>
        <p class="field__hint">
          Drop your pngs into <code>public/portraits/</code>. Until then these stand in.
        </p>
        <div class="slots">${portraitOptions}</div>
      </section>

      <nav class="menu menu--row">
        <button class="btn" data-action="quit-to-title">Back</button>
        <button class="btn btn--primary" data-action="begin" data-begin>Walk down</button>
      </nav>
      <p class="create__error" data-create-error hidden>Give yourself a name first.</p>
    </main>`
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export function renderScene(
  state: GameState,
  scene: Scene,
  gained: EffectResult,
  worldHtml?: string,
): string {
  const art = resolveArt(scene.art)

  const body = paragraphs(scene.body, state)
    .map((p) => `<p>${prose(p)}</p>`)
    .join('')

  const choices = visibleChoices(state, scene)
    .map(({ choice, locked }, index) => {
      const label = prose(interpolate(choice.text, state))
      if (locked) {
        const hint = choice.lockedHint ?? 'Not yet.'
        return `
          <li>
            <button class="choice choice--locked" disabled aria-disabled="true">
              <span class="choice__text">${label}</span>
              <span class="choice__hint">${escapeHtml(interpolate(hint, state))}</span>
            </button>
          </li>`
      }
      return `
        <li>
          <button class="choice" data-action="choose" data-index="${index}">
            <span class="choice__key" aria-hidden="true">${index + 1}</span>
            <span class="choice__text">${label}</span>
          </button>
        </li>`
    })
    .join('')

  const gainedItems = [
    ...gained.clues.map((id) => CLUES[id]?.name ?? id),
    ...gained.terms.map((id) => getTerm(id)?.label ?? id),
    ...gained.gifts.map((id) => {
      const gift = getGift(id)
      return gift ? `${gift.glyph} ${gift.name}` : id
    }),
    ...gained.tools.map((id) => {
      const tool = getTool(id)
      return tool ? `${tool.glyph} ${tool.name}` : id
    }),
    ...gained.approaches.map((id) => {
      const approach = APPROACHES.find((a) => a.id === id)
      return approach ? `${approach.glyph} you have learned to be ${approach.name}` : id
    }),
  ]

  const toast =
    gainedItems.length > 0
      ? `<div class="toast" role="status">
           <span class="toast__label">Noted</span>
           ${gainedItems
             .map((label) => `<span class="toast__clue">${escapeHtml(label)}</span>`)
             .join('<span class="toast__sep" aria-hidden="true">·</span>')}
         </div>`
      : ''

  const boardOpen = availablePropositions(state).length > 0
  const heat = suspicion(state)

  return `
    ${renderSky()}
    <main class="screen screen--scene">
      <header class="hud">
        <span class="hud__act">${romanNumeral(state.act)}</span>
        <span class="hud__location">${escapeHtml(scene.location ?? '')}</span>
        <span class="hud__spacer"></span>
        ${heat > 0 ? renderSuspicion(heat) : ''}
        <button class="btn btn--ghost" data-action="toggle-notebook">
          <span class="hud__key">N</span> Notebook <span class="hud__count">${state.clues.length}/${Object.keys(CLUES).length}</span>
        </button>
        ${
          state.clues.length >= 3
            ? `<button class="btn btn--ghost" data-action="toggle-reckoning"><span class="hud__key">O</span> Order</button>`
            : ''
        }
        ${
          boardOpen
            ? `<button class="btn btn--ghost" data-action="toggle-verdict">
                 <span class="hud__key">V</span> Verdict${caseIsComplete(state) ? ' <span class="hud__ready">●</span>' : ''}
               </button>`
            : ''
        }
        <button class="btn btn--ghost" data-action="quit-to-title" title="Your progress is saved">Title</button>
      </header>

      ${
        art && !scene.portrait
          ? `<pre class="art" aria-hidden="true">${escapeHtml(art)}</pre>`
          : ''
      }

      <div class="stage ${art && scene.portrait ? 'stage--backed' : ''}">
        ${
          art && scene.portrait
            ? `<pre class="stage__backdrop" aria-hidden="true">${escapeHtml(art)}</pre>`
            : ''
        }
        ${portraitHtml(scene.portrait)}
        <div class="prose">
          ${scene.speaker ? `<p class="speaker">${escapeHtml(scene.speaker)}</p>` : ''}
          ${body}
        </div>
      </div>

      ${toast}

      ${
        worldHtml
          ? worldHtml
          : `
      <pre class="divider" aria-hidden="true">${escapeHtml(DIVIDER)}</pre>

      <ul class="choices">${choices}</ul>`
      }
    </main>`
}

/* ------------------------------------------------------------------ */
/* Notebook                                                            */
/* ------------------------------------------------------------------ */

export function renderNotebook(state: GameState): string {
  const found = state.clues
    .map((id) => CLUES[id])
    .filter((c): c is NonNullable<typeof c> => c !== undefined)

  const sections = CATEGORY_ORDER.map((category) => {
    const items = found.filter((c) => c.category === category)
    if (items.length === 0) return ''
    return `
      <section class="note__section">
        <h3 class="note__heading">${escapeHtml(CATEGORY_LABEL[category])}</h3>
        <ul class="note__list">
          ${items
            .map(
              (c) => `
              <li class="note__item">
                <p class="note__name">${escapeHtml(c.name)}</p>
                <p class="note__text">${prose(c.text)}</p>
              </li>`,
            )
            .join('')}
        </ul>
      </section>`
  }).join('')

  const total = Object.keys(CLUES).length

  const gifts = state.gifts
    .map((id) => getGift(id))
    .filter((g): g is NonNullable<typeof g> => g !== undefined)

  const giftSection =
    gifts.length === 0
      ? ''
      : `
      <section class="note__section">
        <h3 class="note__heading">What they have given you</h3>
        <ul class="note__list">
          ${gifts
            .map(
              (g) => `
              <li class="note__item">
                <p class="note__name">
                  <span class="note__glyph">${escapeHtml(g.glyph)}</span>
                  ${escapeHtml(g.name)}
                </p>
                <p class="note__text">${prose(g.text)}</p>
              </li>`,
            )
            .join('')}
        </ul>
      </section>`

  const tools = state.tools
    .map((id) => getTool(id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined)

  const toolSection =
    tools.length === 0
      ? ''
      : `
      <section class="note__section">
        <h3 class="note__heading">What you have taken</h3>
        <ul class="note__list">
          ${tools
            .map(
              (t) => `
              <li class="note__item">
                <p class="note__name">
                  <span class="note__glyph">${escapeHtml(t.glyph)}</span>
                  ${escapeHtml(t.name)}
                </p>
                <p class="note__text">${prose(t.text)}</p>
              </li>`,
            )
            .join('')}
        </ul>
      </section>`

  return `
    <div class="overlay" data-action="close-overlay">
      <aside class="notebook" role="dialog" aria-label="Notebook" data-stop>
        <header class="notebook__head">
          <h2>Notebook</h2>
          <span class="notebook__count">${found.length} of ${total} recovered</span>
          <button class="btn btn--ghost" data-action="close-panels" aria-label="Close">✕</button>
        </header>
        ${
          found.length === 0
            ? `<p class="notebook__empty">Nothing written down yet. Look at things; let people talk.</p>`
            : sections
        }
        ${toolSection}
        ${giftSection}
      </aside>
    </div>`
}

/* ------------------------------------------------------------------ */
/* Suspicion                                                           */
/* ------------------------------------------------------------------ */

const SUSPICION_MAX = 5

/**
 * Suspicion is shown, never explained. The player should feel the village
 * turning without being handed a number to optimise against.
 */
function renderSuspicion(heat: number): string {
  const filled = Math.min(heat, SUSPICION_MAX)
  const pips =
    '◆'.repeat(filled) + '◇'.repeat(Math.max(0, SUSPICION_MAX - filled))

  return `
    <span class="heat ${filled >= 4 ? 'heat--high' : ''}"
          title="How the village is beginning to look at you">
      <span class="heat__label">Regard</span>
      <span class="heat__pips" aria-label="Suspicion ${filled} of ${SUSPICION_MAX}">${pips}</span>
    </span>`
}

/* ------------------------------------------------------------------ */
/* The reckoning — putting the evidence in an order                    */
/* ------------------------------------------------------------------ */

/**
 * Deliberately gives no score and no ticks. The player is told whether the
 * thing reads as an argument, in words, the way a person would tell them —
 * never how many pairs are concordant.
 */
export function renderReckoning(state: GameState): string {
  const clues = arrangedClues(state)

  const rows = clues
    .map(
      (clue, index) => `
      <li class="step">
        <span class="step__index">${index + 1}</span>
        <div class="step__body">
          <p class="step__name">${escapeHtml(clue.name)}</p>
          <p class="step__text">${prose(clue.text)}</p>
        </div>
        <div class="step__moves">
          <button class="nudge" data-action="move-clue"
                  data-clue="${escapeHtml(clue.id)}" data-dir="up"
                  ${index === 0 ? 'disabled' : ''}
                  aria-label="Move &quot;${escapeHtml(clue.name)}&quot; earlier">↑</button>
          <button class="nudge" data-action="move-clue"
                  data-clue="${escapeHtml(clue.id)}" data-dir="down"
                  ${index === clues.length - 1 ? 'disabled' : ''}
                  aria-label="Move &quot;${escapeHtml(clue.name)}&quot; later">↓</button>
        </div>
      </li>`,
    )
    .join('')

  return `
    <div class="overlay overlay--center" data-action="close-overlay">
      <aside class="board" role="dialog" aria-label="The reckoning" data-stop>
        <header class="board__head">
          <h2>The order you will say it in</h2>
          <button class="btn btn--ghost" data-action="close-panels" aria-label="Close">✕</button>
        </header>

        <p class="board__intro">
          You will get one telling, and the order you found things in is not the
          order to say them in. They will not hear a stranger accuse a neighbour.
          They might hear their own ledger — and ask, for the first time, who was
          in the room when it was written.
        </p>

        ${
          clues.length === 0
            ? `<p class="notebook__empty">You have nothing to arrange yet.</p>`
            : `<ol class="steps">${rows}</ol>`
        }

        <p class="board__status ${
          concordance(state) >= 0.8 ? 'board__status--ready' : ''
        }">${escapeHtml(reckoningVerdict(state))}</p>
      </aside>
    </div>`
}

/* ------------------------------------------------------------------ */
/* Verdict board                                                       */
/* ------------------------------------------------------------------ */

/**
 * Fill-in-the-blank propositions. Deliberately gives no feedback on whether an
 * answer is right — the deduction belongs to the player. The only thing the
 * board reports is whether every blank is filled.
 */
export function renderVerdictBoard(state: GameState): string {
  const propositions = availablePropositions(state)

  const body = propositions
    .map((proposition) => {
      const sentence = parseTemplate(proposition)
        .map((part) => {
          if (part.kind === 'text') return escapeHtml(part.text)

          const slot = proposition.slots.find((s) => s.id === part.slotId)
          if (!slot) return ''

          const chosen = getAssertion(state, proposition.id, slot.id) ?? ''
          const options = knownTermsOfKind(state, slot.kind)

          const optionHtml = options
            .map(
              (term) =>
                `<option value="${escapeHtml(term.id)}" ${
                  term.id === chosen ? 'selected' : ''
                }>${escapeHtml(term.label)}</option>`,
            )
            .join('')

          return `<select class="blank ${chosen ? 'blank--filled' : ''}"
                          data-action="assert"
                          data-prop="${escapeHtml(proposition.id)}"
                          data-slot="${escapeHtml(slot.id)}"
                          aria-label="${escapeHtml(slot.kind)}">
                    <option value="">· · · · ·</option>
                    ${optionHtml}
                  </select>`
        })
        .join('')

      return `
        <section class="prop">
          <h3 class="prop__title">${escapeHtml(proposition.title)}</h3>
          <p class="prop__sentence">${sentence}</p>
        </section>`
    })
    .join('')

  const ready = caseIsComplete(state)

  return `
    <div class="overlay overlay--center" data-action="close-overlay">
      <aside class="board" role="dialog" aria-label="Verdict" data-stop>
        <header class="board__head">
          <h2>Your verdict</h2>
          <button class="btn btn--ghost" data-action="close-panels" aria-label="Close">✕</button>
        </header>

        <p class="board__intro">
          Say what you believe happened. Nothing here is checked until you
          stand up and deliver it.
        </p>

        ${body}

        <p class="board__status ${ready ? 'board__status--ready' : ''}">
          ${
            ready
              ? 'Every blank is filled. You can deliver this when you are ready.'
              : 'There are blanks left. You may deliver it unfinished, but it will not hold.'
          }
        </p>
      </aside>
    </div>`
}
