# Covenance

A browser-based investigative game. Text and unicode for the world, png
portraits for the people.

**Status:** engine scaffold complete, story is placeholder. Chapter one exists
only to exercise every mechanic end to end — replace it once the real plot is
settled.

## Running it

```bash
npm run dev          # dev server with hot reload  → http://localhost:5173/
npm run build        # type-check + bundle to dist/
npm run preview      # serve the built bundle
npm run check:story  # validate the story graph without a browser
```

`check:story` walks every scene looking for choices that point at scenes which
don't exist, clues granted or required by id that were never defined, scenes
nothing links to, and gated choices with no explanation. It exits non-zero when
the graph is broken, so it works in a pre-commit hook. The browser runs the
same check on every dev boot and prints to the console.

## How it fits together

```
src/
  engine/       game machinery — knows nothing about the plot
    types.ts      the whole data model; start here
    state.ts      save/load, flags, clues, suspicion, requirement checks
    choices.ts    which options are visible, and which are locked
    deduction.ts  the verdict board: terms, propositions, scoring
    text.ts       {name}/{they} interpolation, html escaping
    game.ts       the controller: owns state, wires events, renders
    validate.ts   walks the story graph looking for broken references
  story/        the plot — knows nothing about rendering
    clues.ts      every clue, keyed by id
    deduction.ts  the word pool and the propositions built from it
    act-01.ts     the boundary stone   ← placeholder prose, replace freely
    act-02.ts     the fold
    act-03.ts     the high table, the trial, the endings
    index.ts      assembles the acts, names the start scene
  data/         content the story leans on
    character.ts  pronoun sets, approaches, portrait slots
    art.ts        unicode scene art
  ui/
    views.ts      pure state → html. No mutation, no listeners.
scripts/
  check-story.ts  command-line story validation
public/
  portraits/      drop character pngs here
```

The split that matters: **`engine/` never imports from `story/`** — except
`validate.ts`, which has to, by definition. Rewriting the plot never means
touching the machinery.

## Writing a scene

```ts
{
  id: 'vestry',
  location: 'The vestry — after dark',
  art: 'interior',              // key from data/art.ts, or literal unicode
  portrait: 'sister-ivo',       // omit for narration
  speaker: 'Sister Ivo',
  body: `Prose. Blank lines make paragraphs.

  {They} {is} not going to like this.`,   // pronoun tokens conjugate
  onEnter: { clues: ['register-gap'], flags: { saw_vestry: true } },
  choices: [
    { text: 'Ask about the year.', goto: 'ivo-year', once: true },
    {
      text: 'Read the register yourself.',
      goto: 'ivo-register',
      needs: { approach: 'lettered' },
      lockedHint: 'You would not know what you were looking at.',
    },
    { text: 'Leave.', goto: 'chapel' },
  ],
}
```

`onEnter` fires the **first time** a scene is entered, never again — so a clue
can't be collected twice by walking back and forth.

### Gating choices

| Field   | Effect                                                                 |
| ------- | ---------------------------------------------------------------------- |
| `needs` | Shown but **locked**, with `lockedHint` explaining why. A visible goal. |
| `once`  | Disappears after being taken. Good for dialogue menus.                 |
| `if`    | Hidden entirely. For logic the player should never see.                |
| act     | Hidden automatically once the rite has passed that act by.             |

`needs` accepts `clue`, `flag`, `term`, `approach`, `minClues`, `maxSuspicion`,
and the generic `flagAtMost` / `flagAtLeast`. All ids are checked against
reality at boot, so a typo becomes an error rather than a dead button.

`flagAtMost` is how the procession applies pressure — an option that closes
once you've spent too long:

```ts
{
  text: 'Walk back up the road you came in on.',
  goto: 'look-road',
  needs: { flagAtMost: { measures: 2 } },
  lockedHint: 'The fold has come down that road behind you.',
}
```

The distinction between `needs` and `if` is a design one. A locked choice tells
the player there is something here they haven't earned yet — that's a hook. A
hidden choice tells them nothing. Prefer `needs` unless the existence of the
option would itself be a spoiler.

### Flags

```ts
onEnter: { flags: { trust: { add: 1 }, met_thale: true } }
```

Numbers increment with `{ add: n }`; anything else is set outright. Read them
back with `needs: { flag: 'met_thale' }`, which tests truthiness.

## Acts: the rite is a procession

The game is three acts walked in order, and **it only goes forward**. Tag a
scene with the act it belongs to:

```ts
{ id: 'stone-hub', act: 1, ... }
```

Entering a scene from a later act advances the game, and every choice pointing
back into a finished act closes itself automatically. Authors tag scenes; the
engine shuts the door behind the rite. Nobody has to remember to prune the
return journey by hand.

Two consequences worth knowing:

- **Content can be permanently missed.** That's the point — a curious player
  lingers and finds what a hurried one never sees.
- **Endings can't link back into the story**, because by then every act is
  closed. Use an action instead of a `goto`:

  ```ts
  choices: [{ text: 'Back to the title.', action: 'title' }]
  ```

  The validator errors on a choice with both, or neither.

### Act boundaries

Each boundary offers the same trade: linger and learn an approach at the cost
of being noticed, or go quietly with the fold and learn nothing. The plain
"go with them" option is **unconditional by design** — if every exit from a
scene were conditional, a player could be stranded, and the validator warns
about exactly that.

## The verdict board

Clues are raw material. The player states a conclusion by filling blanks in a
sentence from a pool of words they have learned:

```ts
// story/deduction.ts
export const TERMS: Record<string, Term> = {
  thale: { id: 'thale', label: 'Warden Thale', kind: 'person' },
  cart:  { id: 'cart',  label: 'the narrow cart', kind: 'object' },
}

export const PROPOSITIONS: Proposition[] = [
  {
    id: 'arrival',
    title: 'How he came to the stone',
    template: 'He was brought there by {culprit}, using {means}.',
    slots: [
      { id: 'culprit', kind: 'person', solution: 'thale' },
      { id: 'means',   kind: 'object', solution: 'cart' },
    ],
    needs: { clue: 'cart-tracks' },   // when this appears on the board
  },
]
```

Terms are granted like clues — `effect: { terms: ['cart'] }` — and a slot only
offers terms of its own `kind`, which keeps each dropdown readable.

**The board never says whether an answer is right.** Feedback before the ending
would do the deducing for the player. The only thing it reports is whether
every blank is filled.

A proposition is only interesting when the wrong answers are plausible. The
validator warns if a slot's kind has fewer than two terms in the whole game —
a blank with one option isn't a deduction.

## The reckoning — ordering the evidence

Being thorough makes you conspicuous. This is how it gets paid back.

Every clue carries a `sequence` — where it belongs in the **argument**, which is
emphatically not the order it is found in. Before speaking, the player arranges
what they hold; a case that runs clean washes up to `MAX_REDEMPTION` (6) off
suspicion at the trial.

Both that constant and the trial's threshold are calibrated against *measured*
playthroughs — a careful run reaches suspicion ~3, a completionist run 9–13.
Re-run the simulation after adding scenes that raise suspicion, or the mechanic
silently stops mattering.

```ts
{ id: 'register-gap', sequence: 10, ... }   // open with their own book
{ id: 'kreon-lie',    sequence: 140, ... }  // the murder lands last
```

Scoring is **pairwise, not positional** — for every pair of held clues, only
their relative order counts. Which clues a player has varies enormously between
runs, and an absolute position check would punish them for the gaps in their
evidence rather than for their reasoning about it. Clues sharing a `sequence`
are genuinely interchangeable and never counted against.

The player is never shown a number, only a sentence — *"It runs clean from the
first line to the last"* down to *"This is a pile, not an argument."*

> **A trap worth remembering.** The first version sequenced clues in discovery
> order, which made the mechanic free: a player who touched nothing already
> scored near-perfect. The simulation caught it. If you add clues, sequence them
> by where they belong in the *telling*.

## Suspicion and the trial

Suspicion is an ordinary numeric flag, so scenes raise it like anything else:

```ts
onEnter: { flags: { suspicion: { add: 1 } } }
```

Prying in places you were told not to raises it. It's shown in the HUD as
unlabelled pips — visible, never explained, so the player feels the village
turning without a number to optimise against. Gate on it with
`needs: { maxSuspicion: 2 }`.

The trial is a **router scene**: it renders nothing, weighs the case, and sends
the player to whichever ending they earned.

```ts
{
  id: 'trial-resolve',
  body: '',
  routesTo: ['end-clean', 'end-narrow', 'end-doubt', 'end-wrong', 'end-guilty'],
  route: (state) => {
    const score = scoreCase(state)
    const heat = suspicion(state)
    if (score.correct === score.total) return heat >= 3 ? 'end-narrow' : 'end-clean'
    ...
  },
  choices: [],
}
```

`routesTo` is not optional bookkeeping — the validator can't read inside a
function, so router scenes declare their targets there or it errors. That keeps
reachability checking honest.

Getting it wrong while suspicion is high is how you lose: the village has an
account of its own, and it is about you.

### Prose tokens

`{name}` `{they}` `{them}` `{their}` `{theirs}` `{themself}`, plus verbs that
have to agree: `{is}` `{was}` `{has}` `{does}` and their negations. Capitalise
the token to capitalise the output — `{They}` → "They" / "She".

Unknown tokens are left in the text verbatim rather than silently deleted, so a
typo is visible on screen instead of quietly eating a word.

Prose also supports `**bold**` and `*italic*`. Everything is HTML-escaped
first.

## Art

Scene art lives in `src/data/art.ts` as plain unicode blocks. Keep pieces at or
under about 44 columns so they survive a narrow window — the renderer preserves
whitespace exactly, so what you type is what appears.

Character portraits go in `public/portraits/` — see the README there. Every
portrait falls back to a unicode glyph, so **the game is fully playable before
any art exists**, and picks up each png the moment you add it, with no code
change.

## Controls

- `1`–`9` — take the numbered choice
- `N` — notebook
- `O` — the reckoning (order your evidence)
- `V` — verdict board
- `Esc` — close any panel

Progress saves to `localStorage` after every choice. Bump `SAVE_VERSION` in
`src/engine/state.ts` when `GameState` changes shape; old saves are then
discarded on load instead of crashing.
