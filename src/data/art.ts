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
  /* The road in. Few trees, and none of them well. -------------------- */
  road: String.raw`
               †
       ╱╲                    ╱╲
      ╱░░╲                  ╱░╲
       ║║                    ║
  ────────────────────────────────
          ╲              ╱
           ╲____________╱
              ·   ·   ·
`,

  /* A body laid out at the roadside, hands folded, veil settled. ------ */
  'the-fallen': String.raw`


        ┌───────────┐
        │     ·     │
        └───────────┘
   ───────────────────────
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
                  †
              ╱╲  ║  ╱╲
        ╱╲   ╱  ╲ ║ ╱  ╲   ╱╲
       ╱  ╲ ╱ †  ╲║╱  † ╲ ╱  ╲
      ╱    ╲│    │║│    │╱    ╲
      │○ ○ ○│○ ○ ○║○ ○ ○│○ ○ ○ │
      │┃ ┃ ┃│┃ ┃ ┃║┃ ┃ ┃│┃ ┃ ┃ │
    ──┴─────┴─────┴┴─────┴─────┴──
    ──────────────────────────────
        ·          ·          ·
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

  /* The Chapter's altar — the IHS host, above the table you sign at. --- */
  'altar-host': String.raw`
      /'\ /'\
     |>:IHS:<|
     _-\ / \ /-_
     '._ '---' _.'
      \ '''-''' /
       '.     .'
         (ooo)
          ) (
         /   \
        '-...-'
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
