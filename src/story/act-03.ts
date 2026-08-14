/**
 * ── ACT III — THE HIGH TABLE ─────────────────────────────────────────
 *
 * Everything here is watched — not by the fold especially, but by everything
 * at once, the way a devout person feels watched in an empty room. The sun is
 * floored high in this act no matter how careful the player has been (see
 * ui/sky.ts). By now it is not the village doing the looking.
 *
 * The rite cannot complete without the witness's hand, which means the
 * outsider is not a bystander. They are the mechanism.
 *
 * The good ending is not a rescue. The debt is real and it stays real; what
 * changes is who carries it. What gets written on the back of the page is
 * built badly, at first, by hands still learning the trade — and that is the
 * point, not a caveat.
 * ─────────────────────────────────────────────────────────────────────
 */

import type { Scene } from '../engine/types.ts'
import { availablePropositions, scoreCase, scoreProposition } from '../engine/deduction.ts'
import { suspicion } from '../engine/state.ts'
import { redemption } from '../engine/reckoning.ts'
import { PROPOSITIONS } from './deduction.ts'

const ACT = 3

/** The proposition that actually matters. Solving the murder is not enough. */
const COVENANT = PROPOSITIONS.find((p) => p.id === 'covenant')!

export const ACT_THREE: Scene[] = [
  {
    id: 'table-hub',
    act: ACT,
    location: 'The third station — the high table',
    art: 'high-table',
    body: `The table is old and set out in the open, because the Covenance is sworn where anyone might see it. That is the point. That has always been the point. You have always found it moving and you find it moving now, and that is the difficulty.

No bargain is struck here. Nothing is negotiated, nothing offered, nothing refused. It is a place where a thing is only *witnessed* — and you have come to understand, somewhere between the shrine and this hill, that witnessing is not the small office you took it for.

The fold stands in a half-circle. Nobody speaks. Every veil turned toward you with an attention so complete that it stops being warmth and becomes something else: the attention of a congregation at the elevation, waiting to be told the thing they believe is true.

Kreon at one end of the table. Lysias at the other. Between them a single page and a pen laid across it like a bar.

You are covered, as everyone is covered. Nobody will sit until you have signed.

You have the strong and unshakeable sense of being looked at from somewhere considerably further up the hill than this.`,
    onEnter: { flags: { at_table: true } },
    choices: [
      { text: 'Read the page before you touch the pen.', goto: 'attestation', once: true },
      {
        text: 'Ask Kreon, in front of them all, what it was if not first bell.',
        goto: 'kreon-open',
        needs: { flag: 'kreon_pressed' },
        lockedHint: 'He never gave you the second half of that sentence.',
      },
      {
        text: 'Ask Lysias which holding falls to the Chapter this year.',
        goto: 'lysias-cornered',
        needs: { clue: 'ledger-pattern' },
        lockedHint: 'You would be guessing, and Lysias does not lose to guesses.',
      },
      {
        text: 'Look at the one standing at the back who has not moved.',
        goto: 'enoch',
        needs: { clue: 'veil-decree' },
        lockedHint: 'There is somebody at the back of the crowd you keep almost noticing.',
      },
      { text: 'Stand, and give your verdict.', goto: 'verdict-delivery' },
    ],
  },

  {
    id: 'attestation',
    act: ACT,
    location: 'The high table',
    art: 'altar-host',
    body: `Four lines. You have signed nine of these and never once read past the third.

*...and the witness, being of no holding within this fold and of no blood therein, attesteth that the renewal was lawfully done, whereupon the Covenance standeth for a further term of years.*

**Whereupon.** Not *whereafter*. The renewal does not become lawful and then get witnessed.

It becomes lawful **because** it is witnessed.

Nine times. Nine fields, nine names, nine folds singing, and at the foot of every page your own hand. Eleven years an instrument, and you thought you were the audience.

Beneath the fourth line the vellum is bare. · † · [[unfit-clause|Bare except for a fifth line, in a smaller and much later hand: and where no witness may be had, or where the witness proveth unfit, the Chapter may attest in his stead.]]`,
    onEnter: { clues: ['attestation-clause'], flags: { read_the_page: true } },
    choices: [{ text: 'Put the page down very carefully.', goto: 'table-hub' }],
  },

  {
    id: 'kreon-open',
    act: ACT,
    location: 'The high table',
    art: 'high-table',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `He does not look at Lysias, which tells you exactly where the weight is coming from.

"It was the night before," he says, to the table. "He came to me the night before and told me what he meant to do. Stand at the shrine with his veil in his hand and say his own name where the fold could hear it.

"I told him it would not be allowed. He said he knew that. He said it was rather the point."

A long breath. "I did not strike him. I carried him. God forgive me, I did the tidying, and I put his veil back on him because I could not look at him without it."

And there it is, the oldest arrangement there has ever been: somebody found the killing inconvenient to the rule, so they kept the body and sold the story. Kreon kept the body. He has been keeping it since before dawn. Somebody else has been selling the story for two hundred years.

Nobody gasps. That is the worst of it. Forty people take this in silence and go on looking at *you*.`,
    onEnter: { flags: { kreon_confessed: true, suspicion: { add: 1 } } },
    choices: [{ text: 'Let them hear the silence after it.', goto: 'table-hub' }],
  },

  {
    id: 'lysias-cornered',
    act: ACT,
    location: 'The high table',
    art: 'high-table',
    portrait: 'factor-lysias',
    speaker: 'Lysias Argyros',
    body: `Lysias does not flinch, because flinching is for people who think they might lose.

"The north field. Eleven acres, poor drainage." A small shrug. "It reverts to the Chapter on renewal, as unclaimed. There is nobody to claim it. That is what *unclaimed* means."

"You will want to be careful," they add, pleasantly, "about implying that there was."

Behind them the fold has not moved. Not one of them has moved. You have the sudden, cold, entirely devotional certainty of being weighed — and that the scale is not standing in this field.`,
    onEnter: { flags: { lysias_cornered: true, suspicion: { add: 1 } } },
    choices: [{ text: 'Be careful. For a moment longer.', goto: 'table-hub' }],
  },

  /* ---------------------------------------------------------------- */
  /* Enoch                                                            */
  /* ---------------------------------------------------------------- */

  {
    id: 'enoch',
    act: ACT,
    location: 'The high table — the back of the crowd',
    art: 'high-table',
    portrait: 'enoch-aletheia',
    speaker: 'Enoch Aletheia',
    body: `They have been at the back the whole day. They were at the shrine. They were in the yard. You have looked directly at them four times and each time your eye has gone somewhere else, and you cannot now say why.

They take the veil off.

Fur. A dense soft pelt the colour of wet ash, a long jaw, wide-set dark eyes, ears unfolding slowly from a lifetime of being folded flat.

You wait for the fold to cry out. Nobody cries out.

They look away. Every one of them. Not in horror — in *embarrassment*, the way you look away from somebody doing something shameful in public, and in that moment you understand the whole of it, because your own hand has gone up to your own veil to check that it is still sitting properly.

"There," says Enoch, mildly. "That is all it is. That is what they told us was unseemly."`,
    onEnter: {
      clues: ['what-is-under'],
      terms: ['enoch'],
      flags: { saw_enoch: true, suspicion: { add: 1 } },
    },
    choices: [
      {
        text: '"Then what is owed? Truly?"',
        goto: 'enoch-debt',
        once: true,
      },
      { text: 'Look at them. Do not look away.', goto: 'table-hub' },
    ],
  },

  {
    id: 'enoch-debt',
    act: ACT,
    location: 'The high table — the back of the crowd',
    art: 'high-table',
    portrait: 'enoch-aletheia',
    speaker: 'Enoch Aletheia',
    body: `"Owed? Yes. Something is owed. It was always real — that part they never had to invent."

They fold the veil over one arm the way you would fold a coat you had finished with.

"It was never a price. It was a *relation*. The father falls to soil and the son grows into his place and stands guard until his own turn to fall — that is all it ever was. Handed down. Meant never to be kept for long." A pause. "It was not very much, when it was carried between all of you."

"Your Chapter found it cheaper to give us something else. One house. Every renewal. Chosen."

"We were never asked whether that was acceptable to us. It was not. It has never been. But you cannot refuse a thing that is not offered to you, and we were not being spoken to. We were being *appeased*." Something moves in the long jaw. "The old answers were rough, but at least they still required somebody to listen."

They look at the table, and the page, and the pen laid across it like a bar.

"Two hundred years I have sat at the back of that church listening to a parish sing about a debt, and paying it in a currency nobody ever asked for."`,
    onEnter: { flags: { knows_the_true_debt: true } },
    choices: [{ text: 'Go back to the table.', goto: 'table-hub' }],
  },

  /* ---------------------------------------------------------------- */
  /* The trial                                                        */
  /* ---------------------------------------------------------------- */

  {
    id: 'verdict-delivery',
    act: ACT,
    location: 'The high table',
    art: 'cross',
    body: `They are all looking at you. The pen is still lying across the page like a bar.

Whatever you say now you will not get to say again. If your account does not hold there is another one already waiting — one in which a stranger came down the north road on the morning a man was found dead and asked a very great many questions about a single name.

Be sure of the order before you speak. They will not hear a stranger accuse a neighbour. They might hear their own book.`,
    choices: [
      { text: 'Speak.', goto: 'trial-resolve' },
      { text: 'Not yet. Step back from the table.', goto: 'table-hub' },
    ],
  },

  {
    // A router scene: renders nothing. Weighs the case and sends the player to
    // whichever ending they earned.
    id: 'trial-resolve',
    body: '',
    routesTo: [
      'end-new-covenant',
      'end-new-covenant-costly',
      'end-murder-only',
      'end-renewed',
      'end-guilty',
    ],
    route: (state) => {
      const overall = scoreCase(state)

      // Being thorough made you conspicuous. Laying it out as an argument
      // rather than a pile is how that gets paid back.
      const heat = Math.max(0, suspicion(state) - redemption(state))

      // A proposition the player never unlocked cannot count in their favour.
      // Without this guard, someone who investigated nothing has an empty
      // board, scores a vacuous 0 out of 0, and walks off with the best ending.
      const readTheTerms = availablePropositions(state).some((p) => p.id === COVENANT.id)
      const institution = scoreProposition(state, COVENANT)

      const sawTheMachine = readTheTerms && institution.correct === institution.total
      const solidCase =
        overall.total > 0 && overall.correct >= Math.ceil(overall.total * 0.75)

      // Thresholds are calibrated against measured playthroughs: a careful run
      // lands near 3, a completionist run at 9–13, and MAX_REDEMPTION is 6.
      if (sawTheMachine && solidCase) {
        return heat >= 8 ? 'end-new-covenant-costly' : 'end-new-covenant'
      }
      if (solidCase) return 'end-murder-only'
      return heat >= 3 ? 'end-guilty' : 'end-renewed'
    },
    choices: [],
  },

  /* ---------------------------------------------------------------- */
  /* Endings                                                          */
  /* ---------------------------------------------------------------- */

  {
    id: 'end-new-covenant',
    location: 'The high table',
    art: 'high-table',
    body: `You do not sign it.

You start where they cannot argue: with their own book, and their own stone, and the nine lines in the oldest hand at the bottom of a box nobody has opened in your lifetime. *The price shall be borne of the whole fold, in equal parts, that no house bear it alone.*

You read it twice, because they have been trained for two centuries not to hear it quickly.

Then the rest. The additions, in the third hand. The decree about the veils, in the same third hand, in the same bad year. The clean column in the ledger. And at the end — only at the end, when it can no longer be mistaken for the subject — a man who died because he meant to stand here and say his own name.

Naming the fire correctly is the first work. There is a second, and no third that skips them.

So you turn the page over and write on the back.

Nine lines, because nine was enough the first time. That the debt is real and it is ours. That each generation is a trustee and none of them an owner. That the price is borne of the whole fold in equal parts, that no house bear it alone, and that no office chooses which house does. That any covenant which must be kept in the dark is not a covenant but a debt collected by force — and that this one is therefore void, and the older one stands.

It says nothing whatever about what anybody's face may look like.

Somebody says, quietly, that it ought to have a name, and somebody else says the name, and it is not a name any of them would have dared say out loud this morning.

Kassia signs it second. Orestes signs fourth and has to be helped, being drunk and crying. Kreon signs and then sits down on the wet grass like a man setting down something he has carried a very long way.

No veils come off tonight. That part comes later, badly, by hands still learning the trade. But Enoch is standing at the front now, and nobody is looking away.

Somebody starts the hymn — the only one everybody knows, the one they sang this morning while you were three rooms away reading a ledger that arrived already balanced.

*Righteousness like water flowed before them, and mercy like dew was scattered over the earth.*

The same words. Not one syllable different. They have been singing it for two hundred years over a machine, and tonight they are singing it over nine lines that mean it, and you find you cannot get through the second verse.

*And thus shall it be with them for ever and for ever.*

It is not a prophecy. It is a description of the work.

The moon comes up over the shoulder of the hill while they are still queueing to make their marks.

**Ending: the Covenant of the Dragon.**`,
    choices: [{ text: '—', goto: 'chapter-end' }],
  },

  {
    id: 'end-new-covenant-costly',
    location: 'The high table',
    art: 'high-table',
    body: `You do not sign it, and you are right, and it very nearly does not matter.

You have spent the day prying at a village's oldest wound in front of the village, and Lysias has spent the day making sure it was noticed. When you finally say it, half the fold is already braced to disbelieve you — not because it is unlikely, but because of who is saying it.

This is the price the fire charges first, and it always charges it first: for a long moment you are the only person in the field who has noticed, and being the only one is unsurvivable.

Then Kassia lays her hand flat on the register and says she has kept this book thirty-one years and the stranger is telling the truth.

One more person who has also noticed. That is the whole of what it takes, and it is not a price you had to pay alone after all, and you will not understand until much later how close it came.

After that it comes apart quickly.

The new nine lines get written. They get signed. It is a shorter list of names than it should have been, and some of those who did not sign will not meet your eye, and that will still be true in ten years.

You keep the rosary. You are not certain you are entitled to it.

**Ending: the Covenant of the Dragon, at cost.**`,
    choices: [{ text: '—', goto: 'chapter-end' }],
  },

  {
    id: 'end-murder-only',
    location: 'The high table',
    art: 'fold',
    body: `You lay out the killing, and the killing holds.

Kreon is taken. The fold is appalled the way people are appalled by weather — sincerely, and with no sense whatever that it implicates them. Lysias expresses profound regret, offers the Chapter's help with the burial, and has the north field entered as unclaimed before the week is out.

You sign the page. Of course you sign it. The renewal was lawfully done, and everything you proved was about one frightened man.

They give you a second medal as you go. It will be twenty years before anybody stands at that shrine and says a name aloud, and you will not be there, because you will be at the next renewal, and the one after that, signing.

The nine lines are still at the bottom of the box. Nobody opens it.

**Ending: a murder solved, a machine untouched.**`,
    choices: [{ text: '—', goto: 'chapter-end' }],
  },

  {
    id: 'end-renewed',
    location: 'The high table',
    art: 'fold',
    body: `You say it, and it does not hold, and everybody knows it does not hold before you have finished saying it.

Nobody is cruel. Lysias is generous, even — a hard morning, an unpleasant sight, an understandable confusion in a young witness. *You are not to panic*, they say, kindly, and put the pen back into your hand.

You will spend years working out what, exactly, you were being spared.

The Covenance stands for a further term of years. You sign, because that is the office, and the office is what you are.

You will think about the boots for the rest of your life.

**Ending: renewed.**`,
    choices: [{ text: '—', goto: 'chapter-end' }],
  },

  {
    id: 'end-guilty',
    location: 'The high table',
    art: 'high-table',
    body: `You say it, and it does not hold, and into the silence afterward Lysias observes — mildly, almost kindly — what a very great deal of trouble you have gone to over a man you say you never met.

Who came down the north road on the morning he was found. Who has spent the day asking after one particular name. Who has been, all told, remarkably interested.

The account that replaces yours is far simpler than yours. It fits. It is about you.

And they do not need your hand after all. There is a clause for a witness who proves unfit, and Lysias knows exactly where it sits on the page, and reads it aloud in a clear and carrying voice while forty people you had breakfast with look at the ground.

Every one of them still covered. Every one of them exactly as they were told to be.

**Ending: found unfit.**`,
    choices: [{ text: '—', goto: 'chapter-end' }],
  },

  {
    id: 'chapter-end',
    location: 'End of the vertical slice',
    art: 'boundary-stone',
    body: `**End of the slice.**

Three acts that close behind you. A fold whose warmth answers to how you carried yourself in the last one. Gifts that build a debt. Words hidden in the page for anyone who thinks to scrub at them. A sky that reddens with the attention you have drawn. A verdict board that checks nothing until you stand — and an order you must put your evidence in before anyone will hear it.

Seven citizens, each carrying one sin and standing against one law, between them closing every channel by which this place might have learned what was being done to it.

And underneath all of it a debt that was always real, always shared, and hoarded by one office for two hundred years.

*If this reality was built, another can be built. Badly, at first, by hands still learning the trade. But built.*`,
    choices: [{ text: 'Back to the title.', action: 'title' }],
  },
]
