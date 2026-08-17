/**
 * Unicode scene art.
 *
 * The world is drawn in the script the fold prays in: crosses, ornament,
 * architecture. Buildings get detail — a church is where these people put
 * everything they had — and the landscape gets almost none. Trees are sparse
 * and thin on purpose.
 *
 * ── GLYPH RULE ───────────────────────────────────────────────────────
 * Only characters that real monospace fonts actually contain:
 *
 *   box drawing    ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ═ ║ ╔ ╗ ╚ ╝ ╱ ╲
 *   block elements ░ ▒ ▓ █
 *   punctuation    † ‡ · °
 *   geometry       ○
 *   plain ascii    o and friends, which never fail
 *
 * Do NOT reach for Coptic (⳹), Georgian (჻), dot-punctuation (⁘ ⁙), Dingbats
 * (✠ ❧) or the small Geometric Shapes (· o) here, however good they look. They
 * are missing from monospace fonts, so the browser substitutes a different font
 * for that one character — and a substituted glyph is a different width, which
 * shears every line of the piece out of column. Ornament is not worth a broken
 * drawing.
 *
 * Verified against this machine's fonts: ░▒▓ † ‡ · ° ○ render; o does not.
 *
 * Keep pieces at or under 44 columns. The renderer preserves whitespace
 * exactly, so what you type is what appears.
 * ─────────────────────────────────────────────────────────────────────
 */

export const ART: Record<string, string> = {
  /* The road in — a full horizon, not a huddle in the middle of the
     frame. This is the one piece meant to run wall to wall in a scene
     with no portrait beside it, so it breaks the usual 44-column ceiling
     on purpose; composed on a column grid rather than hand-typed, to
     keep the slopes lined up.
     Also doubles as the `road-back` landmark's icon out on the shrine
     road, drawn much smaller there — keep this one no wider than it was,
     or that landmark balloons far past its neighbours. The wider variant
     for the two full-screen "north road" scenes lives at `road-wide`. --- */
  road: String.raw`
    †                           †               †
    ╱╲      ╱╲   ╱╲             ╱╲       ╱╲     ╱╲      ╱╲
   ╱░░╲    ╱░░╲ ╱░░╲           ╱░░╲     ╱░░╲   ╱░░╲    ╱░░╲
  ╱░░░░╲    ║║   ║║           ╱░░░░╲     ║║   ╱░░░░╲    ║║
────────────────────────────────────────────────────────────────
                        ╲              ╱
                         ╲____________╱
                            ·   ·   ·
`,

  /* The wider "north road" banner for `prologue` and `welcome` — same
     family as `road` above but extended on both sides, with one tree
     swapped for a wayside chapel. Not used as a landmark icon. --------- */
  'road-wide': String.raw`
             †                 †                 †                                   †
   ╱╲       ╱╲       ╱╲       ┌┴┐      ╱╲       ╱╲       ╱╲       ╱╲       ╱╲       ╱╲       ╱╲
  ╱░░╲     ╱░░╲     ╱░░╲      │‡│     ╱░░╲     ╱░░╲     ╱░░╲     ╱░░╲     ╱░░╲     ╱░░╲     ╱░░╲
   ║║     ╱░░░░╲     ║║       └─┘      ║║     ╱░░░░╲     ║║     ╱░░░░╲     ║║     ╱░░░░╲     ║║
───────────────────────────────────────────────────────────────────────────────────────────────────
                                          ╲            ╱
                                          ╲____________╱
                                              ·   ·   ·
`,

  /* A single roadside tree, for scattering rather than a whole scene. -- */
  tree: String.raw`
   ╱╲
  ╱░░╲
   ║║
`,

  /* A distant peak, for the horizon line behind a village or a road —
     scattered at the far edges of a world, never up close. ------------- */
  mountain: String.raw`
  †
  ╱╲
 ╱░░╲
╱░░░░╲
`,

  /* An ordinary house — background texture for a street of them, next to
     the grander named buildings. --------------------------------------- */
  house: String.raw`
   ╱╲
  ╱──╲
 │○  ○│
 │    │
 └────┘
`,

  /* A body laid out at the roadside, hands folded, veil settled. The
     ground rule matches the box's own width rather than overrunning it —
     wider, and this landmark's footprint balloons past its neighbours on
     the shrine road (it stands only 20px from the walker's entry point,
     so any extra bleed reads as overlapping the character). ----------- */
  'the-fallen': String.raw`


        ┌───────────┐
        │     ·     │
        └───────────┘
        ─────────────
`,

  /* The first station: a shrine grown over a boundary stone. ---------- */
  'boundary-stone': String.raw`
                  †
              ┌───────┐
              │   ‡   │
             ╱         ╲
        ·   │   ┌───┐   │   ·
            │   │ † │   │
            │   └───┘   │
            └───────────┘
         ·  ═══════════  ·
   ────────────────────────────────
`,

  /* St Bride-at-the-Fold, from the yard. ------------------------------ */
  cathedral: String.raw`
                 †
                ╱╲
               ╱ ‡╲
              ╱────╲
         ┌───╯      ╰───┐
    †    │  ○  ○  ○  ○  │    †
   ╱╲    │ ╔╗ ╔╗ ╔╗ ╔╗  │   ╱╲
  ╱  ╲   │ ║║ ║║ ║║ ║║  │  ╱  ╲
 ╱────╲──┴─┴┴─┴┴─┴┴─┴┴──┴──╱────╲
 │oo oo│     ┌───────┐     │oo oo│
 │oo oo│     │   ‡   │     │oo oo│
 │     │     │       │     │     │
 └─────┴─────┴───────┴─────┴─────┘
 ─────────────────────────────────
`,

  /* The title mark: the boundary stone flanked by the fold's two small
     chapels, wide enough to stand alone on the title screen. ----------- */
  'title-mark': String.raw`
                              †
                          ┌───────┐
   †                      │   ‡   │                   †
  ╱╲                     ╱         ╲                 ╱╲
 ╱‡ ╲               ·   │   ┌───┐   │   ·           ╱‡ ╲
╱    ╲                  │   │ † │   │              ╱    ╲
│ ○  ○│                 │   └───┘   │              │ ○  ○│
│ ┃  ┃│                 └───────────┘              │ ┃  ┃│
└──────┘             ·  ═══════════  ·             └──────┘
               ────────────────────────────────
`,

  /* The same church, the first time — taller, for the arrival. --------- */
  'cathedral-grand': String.raw`
        †            †            †
       ╱╲            ╱╲           ╱╲
      ╱░░╲          ╱‡░╲         ╱░░╲
     ╱────╲        ╱────╲       ╱────╲
    │ ○  ○ │  ┌────╯    ╰────┐  │ ○  ○ │
    │ ║  ║ │  │   ○  ○  ○    │  │ ║  ║ │
    ├──────┤  │  ╔╗  ╔╗  ╔╗  │  ├──────┤
    │oo  oo│──┴──┴┴──┴┴──┴┴──┴──│oo  oo│
    │oo  oo│       ┌──────┐     │oo  oo│
    │      │       │  ‡   │     │      │
    └──────┴───────┴──────┴─────┴──────┘
    ═══════════════════════════════════
      ·      ·       ·      ·      ·
`,

  /* Inside the nave, looking at the altar. ---------------------------- */
  nave: String.raw`
 ╔════════════════════════════════════════╗
 ║    ╭─╮    ╭─╮    ╭─╮    ╭─╮            ║
 ║    │○│ †  │†│ †  │○│ †  │†│    †       ║
 ║   ╱│ │╲  ╱│ │╲  ╱│ │╲  ╱│ │╲           ║
 ║  ┃ ╰─╯ ┃┃ ╰─╯ ┃┃ ╰─╯ ┃┃ ╰─╯ ┃          ║
 ║  ┃     ┃┃     ┃┃     ┃┃     ┃          ║
 ║                                        ║
 ║             ╭─────────╮                ║
 ║             │    ‡    │                ║
 ║      ·      │ ═══════ │      ·         ║
 ║────┴────────┴─────────┴───────┴──────  ║
 ║  ▓░▓░   ▓░▓░    ▓░▓░    ▓░▓░   ▓░▓░    ║
 ╚════════════════════════════════════════╝
`,

  /* The vestry, and the counting room: where the books are kept. ------ */
  vestry: String.raw`
 ┌──────────────────────────────┐
 │  ▓▓▓▓▓   ┌─────┐   ▓▓▓▓▓  †  │
 │  ▓▓▓▓▓   │  ‡  │   ▓▓▓▓▓     │
 │  ▓▓▓▓▓   │     │   ▓▓▓▓▓     │
 │          └─────┘             │
 │   ·  ══════════════════   ·  │
 │      oooooooooooooooo        │
 └──────────────────────────────┘
`,

  /* The fold: houses turned inward, the crowd standing under them. ---- */
  fold: String.raw`
   †                         †                     †
  ╱╲                     ╱╲  ║  ╱╲                ╱╲
 ╱‡ ╲              ╱╲   ╱  ╲ ║ ╱  ╲   ╱╲         ╱‡ ╲
╱    ╲            ╱  ╲ ╱ †  ╲║╱  † ╲ ╱  ╲       ╱    ╲
│ ○  ○│          ╱    ╲│    │║│    │╱    ╲      │ ○  ○│
│ ┃  ┃│          │○ ○ ○│○ ○ ○║○ ○ ○│○ ○ ○ │     │ ┃  ┃│
└──────┘         │┃ ┃ ┃│┃ ┃ ┃║┃ ┃ ┃│┃ ┃ ┃ │     └──────┘
               ──┴─────┴─────┴┴─────┴─────┴──
  ────────────────────────────────────────────────────
    ·              ·          ·          ·         ·
`,

  /* The third station. Nothing to stand behind. ----------------------- */
  'high-table': String.raw`
      †                        †
       ·                      ·
   ·  ┌────────────────────────┐  ·
      │  ═══  ═══  ‡  ═══  ═══ │
      └──┬──────────────────┬──┘
         │                  │
   ──────┴──────────────────┴──────
     ·        ·         ·        ·
`,

  /* ------------------------------------------------------------------
   * A second register: figurative pieces adapted from classic punctuation-
   * cursive ASCII art (Joan Stark's religious set; a scroll after Lev
   * Lawrence's Megillat Esther) rather than drawn in the architectural
   * house style above. Deliberately different — these mark a small set of
   * singular moments, not places. Still plain ASCII, still ≤44 columns.
   * ------------------------------------------------------------------ */

  /* A body knelt over, hands folded — the first station's dead man. ---- */
  'praying-hands': String.raw`
          _.-/')
         // / / )
      .=// / / / )
     //'/ / / / /
    // /     ' /
   ||         /
    \\       /
     ))    .'
    //    /
          /
`,

  /* A bare cross. Nothing to stand behind. ----------------------------- */
  cross: String.raw`
         .-.
       __| |__
      [__   __]
         | |
         | |
         | |
         '-'
`,

  /* The Chapter's altar — a monstrance holding the host, above the table
     you sign at. Kept in the same architectural box-drawing hand as the
     buildings rather than the cursive-ASCII register below, since this
     is the thing you're meant to actually read clearly before signing. */
  'altar-host': String.raw`
          †
       ┌──○──┐
       │  ‡  │
       │ ○ ○ │
       └──┬──┘
      ════┴════
        ·   ·
`,

  /* An old scroll, dense with a hand nobody in the fold still reads. --- */
  scroll: String.raw`
    .--""--.                .--""--.
   /        \              /        \
  |   ()()   |============|   ()()   |
   \        /              \        /
    '------'----------------'------'
    | .-.-.-.-.-.-.-.-.-.-.-.-.-.-. |
    | '-'-'-'-'-'-'-'-'-'-'-'-'-'-' |
    '--------------------------------'
          ||                ||
          ""                ""
`,
}

/** Ornamented rule between prose and choices. */
export const DIVIDER = '·  ─────────────  †  ─────────────  ·'

/**
 * Resolve a scene's `art` field: a known key, or a literal block passed
 * straight through. Returns null for scenes with no art.
 */
export function resolveArt(key: string | undefined): string | null {
  if (!key) return null
  const known = ART[key]
  if (known !== undefined) return known.replace(/^\n/, '').replace(/\n$/, '')
  // Not a key — treat it as literal art authored inline in the scene.
  return key.replace(/^\n/, '').replace(/\n$/, '')
}
