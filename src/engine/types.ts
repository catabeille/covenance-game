/**
 * Core data model for the game.
 *
 * The whole story is a graph: scenes point at other scenes by id, choices are
 * gated on clues and flags. Nothing here touches the DOM — this file is the
 * vocabulary that the story files and the renderer both speak.
 */

/* ------------------------------------------------------------------ */
/* The player character                                                */
/* ------------------------------------------------------------------ */

/** A pronoun set, complete enough to conjugate around. */
export type PronounSet = {
  id: string
  label: string
  /** they */
  subject: string
  /** them */
  object: string
  /** their */
  possessive: string
  /** theirs */
  possessivePronoun: string
  /** themself */
  reflexive: string
  /** true for they/them — drives "they are" vs "she is" */
  plural: boolean
}

/**
 * How the player approaches an investigation. Gates a handful of choices so
 * two playthroughs uncover the case by different routes.
 */
export type ApproachId = 'observant' | 'disarming' | 'lettered'

export type Approach = {
  id: ApproachId
  name: string
  glyph: string
  blurb: string
}

export type Character = {
  name: string
  pronouns: PronounSet
  /**
   * The approach chosen at creation. Kept for flavour and for the opening —
   * what the player can actually *do* lives in GameState.approaches, which
   * grows as the rite proceeds.
   */
  approach: ApproachId
  /** Key into PORTRAITS — resolves to a png under /portraits/. */
  portraitId: string
}

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

export type ClueCategory = 'person' | 'place' | 'object' | 'testimony'

export type Clue = {
  id: string
  name: string
  category: ClueCategory
  /** What gets written in the notebook when it is found. */
  text: string
  /**
   * Where this belongs in the argument, low to high. Not the order it is
   * found — the order it must be *said* in for the case to land: observation,
   * then transport, then the lie, then the erasure, then the institution.
   *
   * Only relative order matters, so leave gaps and insert freely.
   */
  sequence: number
}

/* ------------------------------------------------------------------ */
/* Story graph                                                         */
/* ------------------------------------------------------------------ */

export type FlagValue = boolean | number | string

/** Something a scene or choice does to the world. */
export type Effect = {
  /** Clue ids to record in the notebook. */
  clues?: string[]
  /** Term ids to make available on the verdict board. */
  terms?: string[]
  /**
   * Approaches the player picks up here. Someone teaches you to read the old
   * hand; someone decides you can be spoken to plainly. Granted at act
   * boundaries so a thorough player eventually sees everything.
   */
  approaches?: ApproachId[]
  /** Gifts pressed on the player by the fold. See data/gifts.ts. */
  gifts?: string[]
  /** Tools the player chose to pick up. See data/tools.ts. */
  tools?: string[]
  /** Flags to set. Numbers can be incremented with { add: n }. */
  flags?: Record<string, FlagValue | { add: number }>
}

/**
 * Something the fold gives you. In Act I these arrive constantly and without
 * being asked for — a rosary, a coin, bread, a hand on the arm. They are not
 * inventory. They are a debt being quietly assembled, and how many you are
 * still carrying at the end says something about what you accepted.
 */
export type Gift = {
  id: string
  name: string
  glyph: string
  /** What it meant when it was given. */
  text: string
}

/**
 * Something the player *chose* to pick up, unlike a gift — the fold presses
 * gifts on you whether you want them or not; a tool sits there until you
 * decide it's worth carrying. Some choices check for one with `needs: {
 * tool: 'id' }`, the same way they check for a clue or a term.
 */
export type Tool = {
  id: string
  name: string
  glyph: string
  /** What it is, in the notebook. */
  text: string
}

/* ------------------------------------------------------------------ */
/* Deduction                                                           */
/* ------------------------------------------------------------------ */

/**
 * The verdict board works the way Obra Dinn and The Case of the Golden Idol
 * work: clues are raw material, and the player states a conclusion by filling
 * blanks in a sentence from a pool of words they have learned. The deduction
 * happens in the player's head. The game only checks the answer.
 */
export type TermKind = 'person' | 'act' | 'object' | 'reason' | 'place' | 'party'

export type Term = {
  id: string
  label: string
  kind: TermKind
}

export type Slot = {
  id: string
  /** Only terms of this kind are offered, which keeps the pool readable. */
  kind: TermKind
  /** Term id that is actually correct. */
  solution: string
}

export type Proposition = {
  id: string
  /** Short heading on the board, e.g. "How he arrived". */
  title: string
  /** "He was carried by {culprit}, using {means}." — tokens are slot ids. */
  template: string
  slots: Slot[]
  /** The board only shows this once the player could plausibly answer it. */
  needs?: Requirement
}

/**
 * A declarative gate. Declarative rather than a predicate so `validate.ts` can
 * check the referenced ids actually exist, and so the UI can explain *why* an
 * option is locked instead of silently hiding it.
 */
export type Requirement = {
  clue?: string
  flag?: string
  /** Satisfied when the player has *acquired* this approach — see GameState. */
  approach?: ApproachId
  /** "You do not have enough yet." Gates options behind real legwork. */
  minClues?: number
  /** Requires a term to have been learned. */
  term?: string
  /** Requires a tool the player chose to pick up. See data/tools.ts. */
  tool?: string
  /** Requires suspicion to be at or below this. Pressure, made legible. */
  maxSuspicion?: number
  /**
   * Generic numeric gates. `flagAtMost: { measures: 2 }` closes an option once
   * the procession has moved on — the rite waits for no one.
   */
  flagAtMost?: Record<string, number>
  flagAtLeast?: Record<string, number>
}

/**
 * Things a choice can do instead of moving to another scene. Endings need
 * this: every scene id belongs to an act the procession has already closed,
 * so there is nowhere left in the story to point at.
 */
export type ChoiceAction = 'title'

export type Choice = {
  text: string
  /** Scene id to travel to. Verified at boot by validateStory(). */
  goto?: string
  /** Leave the story entirely. Mutually exclusive with `goto`. */
  action?: ChoiceAction
  /** Shown greyed-out with `lockedHint` when unmet. */
  needs?: Requirement
  lockedHint?: string
  /** Escape hatch for logic `needs` can't express. Hides the choice entirely. */
  if?: (state: GameState) => boolean
  effect?: Effect
  /** Disappears once taken. Good for "ask about X" dialogue menus. */
  once?: boolean
}

/* ------------------------------------------------------------------ */
/* The walkable world                                                  */
/* ------------------------------------------------------------------ */

/**
 * A place along the road you can walk up to and attend.
 *
 * Landmarks are the spatial form of what used to be a hub scene's choice
 * list — kneeling by the body, reading the stone, speaking to the Warden are
 * now positions rather than menu items.
 */
export type Landmark = {
  id: string
  /** Position along the road, in px from the left edge of the world. */
  x: number
  /** Scene entered when the player attends here. */
  scene: string
  /** Shown in the prompt when standing close enough. */
  label: string
  /** Key into the ART table, drawn as scenery at this position. */
  art?: string
  /** Portrait id, drawn as a standing sprite at this position. */
  sprite?: string
  /** Hidden entirely until met — same semantics as a choice's `needs`. */
  needs?: Requirement
  /** Disappears once its scene has been visited. */
  once?: boolean
}

/**
 * Pure scenery: a mark on the road with nothing behind it. Never attendable,
 * never gated, never near/visited-tracked — just texture, so a long stretch
 * between real landmarks doesn't read as empty space.
 */
export type Waypoint = {
  x: number
  glyph: string
}

export type WorldMap = {
  id: string
  /** Total walkable width in px. */
  width: number
  /** Where the player stands on first arrival. */
  entry: number
  /** Header line, e.g. "The first station". */
  location?: string
  landmarks: Landmark[]
  waypoints?: Waypoint[]
}

export type Scene = {
  id: string
  /**
   * Marks this scene as a walkable space rather than prose. The engine renders
   * the named world map instead of body and choices — so every existing
   * `goto` pointing at this scene returns the player to the road, standing
   * where they left off.
   */
  world?: string
  /**
   * Which act this belongs to. The rite is a procession: entering a scene from
   * a later act advances it, and once it has advanced, every choice pointing
   * back into a finished act closes itself. Authors tag scenes; the engine
   * shuts the door behind them.
   *
   * Omit for scenes that belong to no particular act (endings, routers).
   */
  act?: number
  /** Header line, e.g. "The Boundary Stone — dusk". */
  location?: string
  /** Key into the ART table, or a literal block of unicode art. */
  art?: string
  /** Portrait id for whoever is on screen. Omit for narration. */
  portrait?: string
  /** Name label above the prose when someone is speaking. */
  speaker?: string
  /** Prose. Blank lines separate paragraphs. Supports {name}/{they}/... tokens. */
  body: string
  /** Applied once, the first time the scene is entered. */
  onEnter?: Effect
  /**
   * A router scene: instead of rendering, immediately send the player onward
   * to whichever scene id this returns. How the trial weighs your verdict
   * against the suspicion against you. Runs after onEnter.
   */
  route?: (state: GameState) => string
  /**
   * Every scene id `route` can return. The validator cannot read inside a
   * function, so router scenes declare their targets here — which keeps
   * reachability checking honest and documents the branch at a glance.
   */
  routesTo?: string[]
  choices: Choice[]
}

/* ------------------------------------------------------------------ */
/* Runtime state                                                       */
/* ------------------------------------------------------------------ */

/**
 * Everything that defines a save. Kept plain-JSON serialisable on purpose —
 * arrays rather than Sets — so save/load is just stringify/parse.
 */
export type GameState = {
  version: number
  character: Character
  sceneId: string
  /** How far the procession has got. Only ever moves forward. */
  act: number
  /**
   * Where the player is standing on the road, keyed by world id. Saved, so
   * closing the tab mid-walk puts you back on the same spot.
   */
  walkerX: Record<string, number>
  /**
   * Approaches acquired so far, starting with the one chosen at creation.
   * A thorough player collects all three; a hasty one does not.
   */
  approaches: ApproachId[]
  /** Clue ids, in the order they were found. */
  clues: string[]
  /** Term ids available to fill blanks on the verdict board. */
  terms: string[]
  /** Gift ids the fold has pressed on you. */
  gifts: string[]
  /** Tool ids the player has chosen to pick up. */
  tools: string[]
  /**
   * The order the player intends to lay their evidence out in. Clue ids;
   * anything found but not yet arranged falls in after these, in the order it
   * was found.
   */
  ordering: string[]
  /**
   * What the player currently asserts: proposition id → slot id → term id.
   * Partial answers are kept, so the board can be filled in over time.
   */
  assertions: Record<string, Record<string, string>>
  flags: Record<string, FlagValue>
  /** Scene ids already entered — drives `once` choices and onEnter. */
  visited: string[]
  /** Choice texts taken, for `once` bookkeeping, keyed "sceneId::choiceText". */
  taken: string[]
}
