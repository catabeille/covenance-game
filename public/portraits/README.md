# Portraits

Pixel art, **50 × 80**, served from the site root — a file here at
`public/portraits/erato-salome.png` is referenced in code as
`/portraits/erato-salome.png`.

Drop a file in and it appears. The dev server hot-reloads, so if the game is
open you will see it within a second. No code change, no rebuild.

## Rendering

- Frames are **100 × 160** — an exact **2×** of the source, in whole pixels.
  Pixel art only stays crisp on integer scale factors; at 1.7× or 2.3× the
  browser invents partial source pixels and `image-rendering: pixelated` turns
  that into visibly uneven blockiness. Narrow screens drop to a clean 1×.
- `object-fit: contain`, so anything that is not exactly 5:8 letterboxes rather
  than losing its head and feet to a crop.
- Transparency works well. The panel behind is `#15181e`.
- If the native size ever changes, update `.portrait` / `.slot` in `style.css`
  to a whole multiple of it.

## The fallback chain

1. The character's own png
2. `substitute-png.png` — stands in for anyone not drawn yet
3. The unicode glyph, if even the substitute is missing

So the game is never broken by absent art, and it degrades one step at a time.
Delete the substitute and every undrawn character reverts to its glyph.

## Filenames

**Player — 4 slots**

`mc-01.png` · `mc-02.png` · `mc-03.png` · `mc-04.png`

Veiled, like everyone. Broad on purpose.

**Principals — 3**

| File | Character |
| ---- | --------- |
| `warden-kreon.png` | Warden Kreon Ithamar — carried the body, did the tidying |
| `sister-kassia.png` | Sister Kassia Miriam — kept the register thirty-one years |
| `factor-lysias.png` | Lysias Argyros — factor to the Chapter, hands always folded |

**The seven — one deadly sin, one Noahide law**

| File | Character | Sin ↔ Law |
| ---- | --------- | --------- |
| `aglaia-simeon.png` | Aglaia Simeon | Pride ↔ idolatry |
| `chrysanthe-barsabbas.png` | Chrysanthe Barsabbas | Greed ↔ theft |
| `erato-salome.png` ✔ | Erato Salome | Lust ↔ adultery |
| `phaedra-kayin.png` ✔ | Phaedra Kayin | Envy ↔ murder |
| `demetria-thomas.png` | Demetria Thomas | Gluttony ↔ flesh from the living |
| `orestes-iakov.png` ✔ | Orestes Iakov | Wrath ↔ blasphemy |
| `hypnos-joseph.png` ✔ | Hypnos Joseph | Sloth ↔ courts of justice |

**The eighth — 1**

`enoch-aletheia.png` — the only one drawn unveiled. Furred: dense soft pelt the
colour of wet ash, long jaw, ears unfolding from a lifetime of being folded flat.
Gentle, not monstrous.

To add a character, add a row to `CAST_PORTRAITS` in `src/data/character.ts` and
give the scene a `portrait: 'your-id'`.
