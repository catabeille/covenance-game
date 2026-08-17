/**
 * ── ACT II — THE FOLD ────────────────────────────────────────────────
 *
 * The warmth of Act I either continues or withdraws, decided entirely by how
 * the player carried themselves at the first station. Nobody announces the
 * change. They simply stop putting things in your hands.
 *
 * This is where the seven live. Each carries one deadly sin and stands against
 * one Noahide law, and between them they close all six feedback channels the
 * framework names — honesty, humility, curiosity, compassion, stewardship,
 * justice. None of them is a villain. That is the horror.
 *
 * The murder is answerable here. What the murder was *for* is only visible to
 * someone who goes looking in the counting room.
 * ─────────────────────────────────────────────────────────────────────
 */

import type { Scene } from '../engine/types.ts'
import { suspicion } from '../engine/state.ts'

const ACT = 2

export const ACT_TWO: Scene[] = [
  {
    // Router: the fold decides how to greet you before you have said anything.
    id: 'fold-arrival',
    act: ACT,
    body: '',
    routesTo: ['fold-warm', 'fold-cool'],
    route: (state) => (suspicion(state) <= 1 ? 'fold-warm' : 'fold-cool'),
    choices: [],
  },

  {
    id: 'fold-warm',
    act: ACT,
    location: 'The second station — the fold',
    art: 'fold',
    body: `The houses turn their backs to the weather and their faces to the church, and the whole village has been swept for you.

It gets worse, or better; you cannot tell which. A chair is carried out into the yard so the witness need not stand. Somebody has made a posset. A very old man takes your hand in both of his and says he has seen four renewals and never one with a witness so attentive, and means it entirely, and you have to look away.

They love you. You have been here two hours.

*Is it always this easy,* you think — and are ashamed of the thought, and cannot quite set it down.`,
    onEnter: { flags: { reverence: { add: 2 }, welcomed_at_fold: true } },
    choices: [{ text: 'Thank them, and go in.', goto: 'fold-hub' }],
  },

  {
    id: 'fold-cool',
    act: ACT,
    location: 'The second station — the fold',
    art: 'fold',
    body: `The houses turn their backs to the weather and their faces to the church. The village has been swept. There is a chair set out in the yard that nobody offers you.

It is not rudeness — that would be easier. It is a very slight adjustment of distance performed by forty people at once without a word passing between them, the way a flock turns.

The old man who has seen four renewals looks at you a moment and then finds something to do with his hands.

Nobody asks for the rosary back. Nobody would be so crude. It simply sits in your pocket now like a thing you have borrowed and not returned.`,
    onEnter: { flags: { reverence: { add: -2 }, chilled_at_fold: true } },
    choices: [{ text: 'Go in anyway.', goto: 'fold-hub' }],
  },

  {
    // A world scene, same as Act I's shrine — every goto pointing at
    // 'fold-hub' returns the player to the road, standing where they left
    // off.
    id: 'fold-hub',
    act: ACT,
    world: 'fold',
    location: 'The second station — the fold',
    art: 'fold',
    body: `The procession files between the houses and into the church, and the singing starts, and does not stop for a long while.

*Righteousness like water flowed before them, and mercy like dew was scattered over the earth. And thus shall it be with them for ever and for ever.*

Forty voices, none of them trained, every one of them certain. It is beautiful. It has always been beautiful, and nothing you are about to learn will make it less so — which is exactly the trouble. Beauty was never proof of anything.`,
    aside: `You are not needed for this part. You are needed at the end of it — which means you have exactly as long as the singing lasts.

Not everybody goes in. There are always those with something to carry, something to stir, something to count, and they stand about the yard in twos and threes with the singing coming out through the door at them, glad of the company.`,
    choices: [],
  },

  /* ---------------------------------------------------------------- */
  /* Sister Kassia — the record                                       */
  /* ---------------------------------------------------------------- */

  {
    id: 'chapel',
    act: ACT,
    location: 'St Bride-at-the-Fold',
    art: 'nave',
    portrait: 'sister-kassia',
    speaker: 'Sister Kassia',
    body: `Cold stone and lamp oil and two hundred years of smoke. The nave is far finer than the village can afford, which is true of every church you have walked into and has never once struck you as strange until this morning.

Sister Kassia is shelving hymnals that do not need shelving, which is what people do when they wish to be found.

"I heard," she says, before you speak. "The whole fold heard. He was asking after the register, you know. I told him what I tell everyone." A pause. "That it is not for reading."`,
    onEnter: { terms: ['kassia', 'register'], flags: { measures: { add: 1 } } },
    choices: [
      {
        text: 'Ask, very politely, whether you might see it.',
        goto: 'kassia-register',
        needs: { approach: 'lettered' },
        lockedHint: 'You would not know what you were looking at, and she would know that.',
      },
      { text: '"What did he want with it?"', goto: 'kassia-man', once: true },
      {
        text: 'Stand with her a while and say nothing.',
        goto: 'kassia-confession',
        needs: { approach: 'disarming', clue: 'register-gap' },
        lockedHint: 'She is waiting to be asked something. You do not know what yet.',
      },
      { text: 'Leave her to her shelves.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'kassia-register',
    act: ACT,
    location: 'The vestry',
    art: 'scroll',
    portrait: 'sister-kassia',
    speaker: 'Sister Kassia',
    body: `She gives it up more easily than she should. Perhaps she has been waiting a long time for somebody who could read it.

Ninety years of baptisms, marriages and burials, unbroken, in six hands. You go through it twice to be certain, and the second time you find you are praying, a little, without having decided to.

One year is missing. Not damaged — excised, cut close to the gutter with a blade, so cleanly the book still lies flat.

The page before ends mid-sentence. The page after begins as though nothing had been lost. Between them, in the gutter, there is nothing at all. · [[marginal-gloss|Nothing but four words in the margin, in a hand trying very hard not to be recognised: they were told it was an honour.]]`,
    onEnter: { clues: ['register-gap'], flags: { suspicion: { add: 1 } } },
    choices: [
      {
        text: 'Unpick a few stitches at the spine with the needle.',
        goto: 'kassia-register-needle',
        needs: { tool: 'winding-needle' },
        lockedHint: 'The binding is sewn shut. You would need something finer than your fingers.',
        once: true,
      },
      { text: 'Close the book gently.', goto: 'chapel' },
    ],
  },

  {
    id: 'kassia-register-needle',
    act: ACT,
    location: 'The vestry',
    art: 'scroll',
    body: `The needle goes in the way it was made to, sliding along a seam meant to be opened and closed by exactly this. Three stitches, no more — you are not trying to take the book apart, only to look.

Between the boards and the cover, folded so thin it has gone soft as cloth: a page that was never numbered, in a hand that matches none of the other six.

You do not read it yet. You sew the three stitches back the way you found them, which is its own kind of promise.`,
    choices: [{ text: 'Close the book gently.', goto: 'chapel' }],
  },

  {
    id: 'kassia-man',
    act: ACT,
    location: 'St Bride-at-the-Fold',
    art: 'nave',
    portrait: 'sister-kassia',
    speaker: 'Sister Kassia',
    body: `"He wanted a year. One year, he said, and he would go.

"I asked why that one, and he said —" She stops, and starts again more carefully. "He said he was the last person alive who could be certain it had happened at all."

She straightens a hymnal that is already straight.

"He had his veil in his hand when he said it. Not on. In his hand. I have thought about that more than I have thought about anything else."`,
    onEnter: {
      clues: ['the-dead-mans-claim'],
      terms: ['keep-a-vow'],
      flags: { measures: { add: 1 } },
    },
    choices: [{ text: 'Let the singing fill the gap.', goto: 'chapel' }],
  },

  {
    id: 'kassia-confession',
    act: ACT,
    location: 'The vestry',
    art: 'vestry',
    portrait: 'sister-kassia',
    speaker: 'Sister Kassia',
    body: `The quiet goes on until she cannot bear it.

"I have known which year it was since I was twenty-three. I have kept this book thirty-one years. Do you understand what I am telling you? Not that I found it out. That I *kept* it."

She lays her hand flat on the cover, the way you hold down a thing that is trying to get up.

"They call that obedience." She turns toward you properly for the first time. "You are very young to be a witness. I have had a great deal longer than you to decide whether I agree."`,
    onEnter: { clues: ['kassia-knew'], terms: ['fold'], flags: { suspicion: { add: 1 } } },
    choices: [{ text: 'Let her have the quiet back.', goto: 'chapel' }],
  },

  /* ---------------------------------------------------------------- */
  /* The yard — the seven                                             */
  /* ---------------------------------------------------------------- */

  {
    id: 'aglaia',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'aglaia-simeon',
    speaker: 'Aglaia Simeon',
    body: `Her veil is white silk embroidered nearly to stiffness — finer than the priest's, and she knows it, and wants you to have noticed.

"Twenty-two years I have kept the faces. Regilding, mostly. They go dark with the smoke." She tilts her head toward the door. "Go and look at the third from the left when they have finished. I have brought her on wonderfully."

She touches her own veil where her jaw would be. She does it while she is praying, too; you will notice that later.`,
    onEnter: { flags: { met_aglaia: true, measures: { add: 1 } } },
    choices: [{ text: 'Say you will look.', goto: 'fold-hub' }],
  },

  {
    id: 'chrysanthe',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'chrysanthe-barsabbas',
    speaker: 'Chrysanthe Barsabbas',
    body: `Good grey wool, plainer than she can afford, and she counts the box twice while she talks to you. The second time is slower.

"It comes up short most years. Not much. There is always a reason — a bad harvest, a death, somebody's roof." She shrugs. "I make it good out of my own and I do not make a performance of it."

Every word is true. You would have to know the whole of it for many years to see the shape, and nobody here has ever been permitted to see the whole of anything.`,
    onEnter: { flags: { met_chrysanthe: true, measures: { add: 1 } } },
    choices: [{ text: 'Thank her for her trouble.', goto: 'fold-hub' }],
  },

  {
    id: 'erato',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'erato-salome',
    speaker: 'Erato Salome',
    body: `She has stepped out mid-verse to breathe. Her veil is worn a little loose; she sings the descant with her eyes open, which is not done.

"You will want to know about the north field," she says, far too quickly, before you have asked about anything at all. "Everyone will tell you it goes to the Chapter this year. Eleven acres, poor drainage, unclaimed."

A beat.

"There is no one to claim it. That is what unclaimed means. I have said that sentence to myself so many times it has stopped meaning anything, which I expect was the idea."

Then, differently — quieter, and as though it had been waiting a long while behind the other thing:

"It is not poor drainage. I have lain in that field. The ground does not dry, in any season, in any weather, and nothing roots deep in it, and if you put your ear to it you will keep very still for a while and then get up and go home and not mention it."

She turns the tuning-fork over in her fingers while she says it — the one she strikes to hold forty voices to a single note, has done since she was nine years old, and has not once let them wander.`,
    onEnter: {
      clues: ['unclaimed-field'],
      flags: { met_erato: true, measures: { add: 1 } },
    },
    choices: [
      {
        text: 'Ask if you might borrow the tuning-fork.',
        goto: 'fold-hub',
        effect: { tools: ['tuning-fork'] },
        once: true,
      },
      { text: 'Let her go back in.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'phaedra',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'phaedra-kayin',
    speaker: 'Phaedra Kayin',
    body: `Black, heavy, the oldest veil in the fold. She is the midwife, and she lays out the dead, and she did him this morning.

"I did his hands. Somebody had done them already, badly, so I did them again properly." She says it the way you would say you had straightened a picture. "And his veil. He had it off, you know. In his hand. I put it back on him — you cannot leave a man like that."

She still has the needle through her cuff, the one she uses for winding a shroud closed — small, curved, meant for cloth too far gone to pin.

She looks at you for slightly too long.

"You will want to know who told the Chapter which house to strike, three renewals back. Everybody will say they cannot imagine. Everybody can imagine."`,
    onEnter: {
      terms: ['phaedra'],
      flags: { met_phaedra: true, suspicion: { add: 1 }, measures: { add: 1 } },
    },
    choices: [
      {
        text: 'Ask if you might keep the needle. She will understand why better than you do.',
        goto: 'fold-hub',
        effect: { tools: ['winding-needle'] },
        once: true,
      },
      { text: 'Say nothing to that. Not yet.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'demetria',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'demetria-thomas',
    speaker: 'Demetria Thomas',
    body: `Her veil is stained at the mouth, honestly, without any shame in it at all. She puts food into your hands before she says a word and she is genuinely, uncomplicatedly delighted that you have come.

"There is a dish for the renewal. My mother's, her mother's. You start it the night before and it must be — " she makes a small gesture " — begun while it is still going. That is how it is done. That is how it has always been done."

She says this the way one says anything one has never once been asked to defend.

"Eat. You have walked a long way and you have had a nasty morning."`,
    onEnter: {
      gifts: ['bread'],
      flags: { met_demetria: true, reverence: { add: 1 }, measures: { add: 1 } },
    },
    choices: [{ text: 'Eat, because refusing would wound her.', goto: 'fold-hub' }],
  },

  {
    id: 'orestes',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'orestes-iakov',
    speaker: 'Orestes Iakov',
    body: `His veil sits crooked, knocked loose and never resettled — which scandalises everybody nearly as much as if he had taken it off outright — and there is still a chisel in his apron.

"Rot in the stone, they told me." He is drunk, and precise with it. "Rot. In granite. I have been a mason since I was nine years old and I cut a household off that shrine last Tuesday because a man in a good coat told me there was *rot in the granite.*"

He laughs, once, with nothing in it.

"Say it in the yard and they call you a drunk. Which I am. Which is very convenient for somebody, and I have had a week to work out who."`,
    onEnter: {
      terms: ['orestes'],
      flags: { met_orestes: true, measures: { add: 1 } },
    },
    choices: [
      { text: 'Let him say it. Somebody should hear it.', goto: 'fold-hub' },
      {
        text: 'Ask if you might take the chisel. He is too far gone to miss it.',
        goto: 'fold-hub',
        effect: { tools: ['mason-chisel'] },
        once: true,
      },
    ],
  },

  {
    id: 'hypnos',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'hypnos-joseph',
    speaker: 'Hypnos Joseph',
    body: `His veil sits very slightly askew. He is the magistrate, and nobody in the yard is asking him for anything, and he seems content with that.

"Oh — nothing formal, no. Not for a long while." He counts on his fingers, gives up. "Nineteen years? We settle things between neighbours here. It is friendlier. Nobody wants a court in a place this size."

He is kind. He is tired. He agrees with the last thing anybody said to him.

Nineteen years. Two renewals. Not one hearing in which any of it could have been set down, and questioned, and answered.`,
    onEnter: {
      clues: ['no-court'],
      flags: { met_hypnos: true, measures: { add: 1 } },
    },
    choices: [{ text: 'Leave him to his quiet afternoon.', goto: 'fold-hub' }],
  },

  /* ---------------------------------------------------------------- */
  /* Lysias Argyros                                                   */
  /* ---------------------------------------------------------------- */

  {
    id: 'lysias',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'factor-lysias',
    speaker: 'Lysias Argyros',
    body: `The very good coat belongs to somebody who has been waiting to be approached and has arranged to look as though they have not.

Their veil is a different weave from everyone else's — town work, and newer.

"Lysias," they say. "You will be the witness. Splendid. It is a tedious office and I am glad it is not mine."

The smile arrives on time and stays exactly as long as it ought to.`,
    onEnter: { terms: ['lysias'], flags: { measures: { add: 1 } } },
    choices: [
      { text: '"And what is your office?"', goto: 'lysias-office', once: true },
      {
        text: 'Watch what their hands do while they talk.',
        goto: 'lysias-hands',
        needs: { approach: 'observant' },
        lockedHint: 'There is a tell here somewhere and it goes straight past you.',
      },
      { text: 'Excuse yourself.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'lysias-office',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'factor-lysias',
    speaker: 'Lysias Argyros',
    body: `"Factor to the Chapter. I come out for the renewals, see the thing done properly, and carry the paperwork home."

They say *paperwork* the way a butcher says *cut*.

"You will find the fold very willing. They always are. It is a great comfort to them, the Covenance — knowing the terms have not changed in two hundred years."

*Terms.* You have said the whole rite aloud nine times and you are entirely certain that word is not in it.`,
    onEnter: { clues: ['lysias-office'], terms: ['chapter', 'ledger'] },
    choices: [{ text: 'Keep the word. Say nothing.', goto: 'lysias' }],
  },

  {
    id: 'lysias-hands',
    act: ACT,
    location: 'The church yard',
    art: 'cathedral',
    portrait: 'factor-lysias',
    speaker: 'Lysias Argyros',
    body: `They talk with their hands entirely still. Folded — the way you fold somebody else's.

Once, while explaining how very sad it all is, they glance down the hill toward the shrine. Not at the body. Two feet to the left of it, where a narrow cart would have to stop if it meant to turn about.`,
    onEnter: { flags: { lysias_watched: true, suspicion: { add: 1 } } },
    choices: [{ text: 'Look away first.', goto: 'lysias' }],
  },

  /* ---------------------------------------------------------------- */
  /* The counting room — the act's real prize                         */
  /* ---------------------------------------------------------------- */

  {
    id: 'counting-room',
    act: ACT,
    location: 'The counting room',
    art: 'vestry',
    body: `It is not locked. Nothing here is locked; that is the whole confidence of the arrangement.

Five ledgers on the shelf, and it is the fifth that matters. Renewal years going back, one to a page, every page tidy. On every renewal page, in the same clean column, one holding passes to the Chapter. Never a large one. Never one with anybody left to argue over it.

It arrives already balanced. That is what stops you — not the theft, the *tidiness*. Somebody wrote this, and nobody in the fold has ever been in the room when it was written.

A name off the shrine, a year out of the book, a field changed hands — and the fold sings, and means it, and has no idea. A people who do not know the fire is lit do not think to ask who is feeding it.

There is a map folded into the back board, and you open it because you are the sort of person who opens things, and then you stand very still.

The holdings taken across two hundred years do not fall where cheap land falls. They *close*. · † · [[converging-fields|Renewal by renewal, a ring drawing inward on one point of ground north of the fold, and the north field — eleven acres, poor drainage, unclaimed, taken this year — is the last piece of the ring.]]

Whatever the Chapter has been doing, it has not been collecting fields. It has been buying its way toward something, one dead household at a time, and it has nearly arrived.

Beneath the ledgers, a decree two hundred and six years old in a Chapter hand: the fold shall go veiled before God, *their aspect being unseemly to the rite.*

It cites authority. *And Azazel taught men to make swords, and knives, and shields, and breastplates, and made known to them the metals of the earth and the art of working them, and bracelets, and ornaments, and the use of antimony, and the beautifying of the eyelids, and all kinds of costly stones, and all coloring tinctures.*

A passage about what was *taught* to men, turned into a ruling about what men *are*. You read it three times and cannot make it mean what they made it mean — and then you put your own hand up to your own veil and find you cannot remember being taught that either.

A silence, well kept, outlasts an army. Somebody here learned that a very long time ago and has never had to learn anything else.`,
    onEnter: {
      clues: ['ledger-pattern', 'veil-decree'],
      terms: [
        'strike-a-name',
        'give-a-tithe',
        'keep-a-vigil',
        'hide-what-we-are',
        'honour-the-dead',
        'ward-the-thing',
      ],
      flags: { suspicion: { add: 2 } },
    },
    choices: [
      { text: 'Look for whatever is older than the ledgers.', goto: 'archive' },
      {
        text: 'Strike the tuning-fork against the shelf wall and listen.',
        goto: 'counting-room-hollow',
        needs: { tool: 'tuning-fork' },
        lockedHint: 'You would need something to strike it with, and an ear for where a wall stops being a wall.',
        once: true,
      },
      { text: 'Put it all back exactly as you found it.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'counting-room-hollow',
    act: ACT,
    location: 'The counting room',
    art: 'vestry',
    body: `You strike it once, the way she does before every practice, and lay the stem against the plaster the way you have seen her lay it against a chorister's collarbone when a voice will not come true.

Most of the wall answers dead and flat. One handspan of it sings back.

You do not open it. You are not sure yet what you would be opening it for, or who put a hollow behind a wall in a room that is never locked, because nothing in it was ever supposed to need hiding.`,
    choices: [{ text: 'Step back from the wall.', goto: 'fold-hub' }],
  },

  {
    id: 'archive',
    act: ACT,
    location: 'The counting room — the older box',
    art: 'vestry',
    body: `At the bottom, in a box nobody has opened in your lifetime, the terms as they were first written.

It is short. That is the first shock — the whole Covenance is nine lines, and the fold recites forty.

The debt is real. It is set down plainly, and it is not small, and there is no suggestion anywhere that anybody doubted it.

And then the lines you have never once heard sung:

*The father falls to soil, and the son grows into his place, and stands guard until his own turn to fall. Each generation a trustee, and none of them an owner. The price shall be borne of the whole fold, in equal parts, that no house bear it alone.*

Not a punishment. The shape of care, handed down and down, and meant never to be kept for long.

You read it four times. Nothing in the nine lines says one household. Nothing says a name struck off. Nothing says *chosen*. Somebody added that — and has gone on adding it every renewal for two hundred years, and calling it the terms, and the fold has been singing the addition and weeping at it.`,
    onEnter: {
      clues: ['first-terms'],
      terms: ['first-terms', 'debt-shared', 'debt-invented', 'debt-paid', 'chose-who-paid'],
      flags: { suspicion: { add: 1 } },
    },
    choices: [
      {
        text: 'Read the hand itself — who wrote the additions, and when.',
        goto: 'archive-hand',
        needs: { approach: 'lettered' },
        lockedHint: 'The later hands mean nothing to you. You can see there are several.',
      },
      {
        text: 'Pry up the false bottom with the chisel.',
        goto: 'archive-chisel',
        needs: { tool: 'mason-chisel' },
        lockedHint: 'The board looks loose, if you had something to lift it with.',
        once: true,
      },
      { text: 'Put it back. Put all of it back.', goto: 'fold-hub' },
    ],
  },

  {
    id: 'archive-chisel',
    act: ACT,
    location: 'The counting room — the older box',
    art: 'vestry',
    body: `The board under the box is loose, and a chisel is a chisel whatever it was last used for. It comes up on the second try.

Underneath: nothing written down. A boy's boot, small, one of a pair, gone soft and grey with the years. Nobody has catalogued a boot. Nobody was ever going to.

You put the board back exactly as it was. Some things are not evidence. Some things are just where somebody put their grief so they would not have to carry it every day.`,
    choices: [{ text: 'Close the box very carefully.', goto: 'fold-hub' }],
  },

  {
    id: 'archive-hand',
    act: ACT,
    location: 'The counting room — the older box',
    art: 'vestry',
    body: `Four hands. You can date them within a decade each, which is the one genuinely useful thing eleven years of this work has given you.

The nine lines are the first hand and the oldest, and they read like something written by people who still thought a promise ran both ways.

The second hand adds nothing at all. Scribes — a century of them, and you can see where one gave way to the next — setting it down exactly as they received it, the way a trustee sets a thing down.

The clause about a chosen household is the **third** hand, and the third hand also wrote the decree about the veils, in the same year, in the same ink. You check the fifth ledger, and check it again: two hundred and six years ago this Chapter was buying land badly, briefly, desperately.

They did not receive the terms. They amended them in a bad year and never amended them back — and the fourth hand is scribes again, another century of them, copying the amendment faithfully without once looking behind it, because that is what a scribe is for and nobody had told them there was anything behind it to look at.

Somebody in the room when it was written decided a silence would hold. It has held for two hundred and six years.`,
    onEnter: { flags: { knows_the_forgery: true, suspicion: { add: 1 } } },
    choices: [{ text: 'Close the box very carefully.', goto: 'fold-hub' }],
  },

  /* ---------------------------------------------------------------- */
  /* The rite moves on                                                */
  /* ---------------------------------------------------------------- */

  {
    id: 'act-two-close',
    act: ACT,
    location: 'The fold — the singing stops',
    art: 'fold',
    body: `The singing stops mid-verse, exactly where it is meant to, and the fold comes out of the church and turns uphill.

One station left. At the top of it there is a table, and on the table a page, and at the foot of the page a space the width of your name.`,
    choices: [
      {
        text: 'Let them go ahead, and watch who walks with whom. (They will notice.)',
        goto: 'table-hub',
        if: (state) => !state.approaches.includes('observant'),
        effect: { approaches: ['observant'], flags: { suspicion: { add: 1 } } },
      },
      {
        text: 'Fall in beside the ones still arguing. (They will notice.)',
        goto: 'table-hub',
        if: (state) => !state.approaches.includes('disarming'),
        effect: { approaches: ['disarming'], flags: { suspicion: { add: 1 } } },
      },
      {
        text: 'Stay in the empty church with the book a moment longer. (They will notice.)',
        goto: 'table-hub',
        if: (state) => !state.approaches.includes('lettered'),
        effect: { approaches: ['lettered'], flags: { suspicion: { add: 1 } } },
      },
      { text: 'Go up with the rest of them.', goto: 'table-hub' },
    ],
  },
]
