/**
 * ── ACT I — THE FIRST STATION ────────────────────────────────────────
 *
 * The fold is delighted you have come and will not stop saying so. Bread,
 * coin, a rosary, a hand on the arm. The warmth is entirely genuine — and it
 * is also how the debt gets built. A witness who has been fed and blessed and
 * thanked all morning finds it very hard to say a discourteous thing at the
 * high table.
 *
 * Everyone here is veiled, including you, and it has never once struck you as
 * worth remarking on. That is the point. The reveal in Act III is not that
 * they are hiding something — it is that the covering was issued, obeyed, and
 * forgotten, and that you have been doing it too.
 *
 * Voice: devout and newly questioning. Choices are things the player notices
 * and permits, not demands they make. Nobody is interrogated in this act.
 * ─────────────────────────────────────────────────────────────────────
 */

import type { Scene } from '../engine/types.ts'

const ACT = 1

export const ACT_ONE: Scene[] = [
  {
    id: 'prologue',
    act: ACT,
    location: 'The north road — before the bell',
    art: 'road',
    body: `The rain has stopped, and you take that as it is meant.

You are here because the Covenance cannot renew itself. It wants a witness from outside the fold — no land here, no blood here, nothing to gain — to walk the three stations, watch the oath sworn, and set a hand to it after. Without that hand it is only a crowd of people saying words in a wet field.

Nine of these. Eleven years. You have never once stopped believing in them, and that is not the same as understanding them, and lately you have started to feel the width of the gap.

You are not certain what to do with a grief that has arrived for something not yet lost. You have decided, provisionally, not to put it down.

You settle your veil against the wind, the way you have settled it every day of your life. Someone is already coming up the road with both hands out.`,
    onEnter: { terms: ['fenn'] },
    choices: [{ text: 'Let them reach you.', goto: 'guide' }],
  },

  {
    // A meta aside, not a place — how the interface works, told plainly
    // before the fiction asks anything of the player's hands.
    id: 'guide',
    act: ACT,
    location: 'Before the road starts moving',
    body: `A few things worth knowing before this goes any further.

**Getting around.** Some scenes are a stretch of road. Press **←** and **→** (or click ahead of yourself) to walk it. Stand close enough to a person or a landmark and an option opens at the bottom of the screen — press **↑**, or click it, to attend to them. Elsewhere you will find a numbered list instead; press **1–9**, or click, to choose. A choice with a dashed border is not gone, only locked — it will tell you what you are missing.

**What you carry.** **N** opens your notebook — everything you have learned so far. Once you are holding enough of it, **O** lets you decide what order you would say it in, and **V** lets you stand up and give your verdict. **Esc** closes whatever is open.

**Regard.** Before long you will notice a small row of marks in the corner of the screen. That is Regard — how closely the fold has begun to watch you. It rises when you linger somewhere you were not quite invited to be. Nobody here will ever tell you the number. You will just feel it, in how a door starts opening a little slower than it did yesterday.

None of this needs remembering now. It will make sense the moment it matters.`,
    choices: [{ text: 'Begin.', goto: 'welcome' }],
  },

  {
    id: 'welcome',
    act: ACT,
    location: 'The north road — the fold comes out',
    art: 'road',
    body: `They have been waiting since dawn. That is the first thing you understand, and it moves you more than you were ready for.

Bread and salt held up at the height of an offering. A coin folded into your palm by a man who will not let go until you have taken it. A boy runs the whole way down from the church to press a saint's medal on you and then cannot speak at all, and has to be led away by his sister, and is not embarrassed — only overcome.

*The witness has come.* It goes back up the line like a response in a litany. Not your name. The office. † · †

Thirty veiled faces turned toward you and every one of them glad. You are being loved, and it is not a performance, and it is also useful, and you do not yet have anywhere to put that thought.`,
    onEnter: {
      gifts: ['bread', 'coin', 'medal'],
      flags: { reverence: { add: 3 }, welcomed: true },
    },
    choices: [
      { text: 'Receive it as it is given, and thank them.', goto: 'shrine-arrival' },
      {
        text: 'Notice that not one of them has mentioned the body.',
        goto: 'shrine-arrival',
        effect: { flags: { noticed_the_silence: true } },
      },
    ],
  },

  {
    // Arrival: the description of the place, once. Then you are put on the
    // road and everything here becomes somewhere you can walk to.
    id: 'shrine-arrival',
    act: ACT,
    location: 'The first station — the wayside shrine',
    art: 'boundary-stone',
    body: `The shrine has grown over the boundary stone the way ivy grows over a gate: a cross above, a niche cut into the face, two centuries of small offerings wedged into every crack. Every household that ever swore is written here.

There is a man at the foot of it with his hands folded on his chest. Somebody folded them. The dead do not do that for themselves.

His veil has been put back on. It is not sitting the way a veil sits on the living.

Nobody stands near him. The fold has arranged itself in a wide and perfectly natural circle that happens to have him at the edge of it. Warden Kreon watches you from three paces off. A woman you have never met puts a rosary into your hand, closes your fingers over it, and says she will pray for your discernment.

A lanthorn hangs unclaimed on the gatepost, left by whoever kept the night vigil. Nobody has come back for it yet.`,
    onEnter: {
      flags: { arrived: true },
      terms: ['kreon', 'stone', 'veil'],
      gifts: ['rosary'],
    },
    choices: [
      {
        text: 'Take the lanthorn down. It may be useful.',
        goto: 'shrine',
        effect: { tools: ['lantern'] },
        once: true,
      },
      { text: 'Go down among them.', goto: 'shrine' },
    ],
  },

  {
    // A world scene: the engine renders the road instead of prose, so every
    // `goto: 'shrine'` below returns the player to exactly where they stood.
    id: 'shrine',
    act: ACT,
    world: 'shrine',
    location: 'The first station',
    body: `The fold moves around you and does not hurry. There is time, until there is not.`,
    choices: [],
  },

  /* ---------------------------------------------------------------- */
  /* Attending                                                        */
  /* ---------------------------------------------------------------- */

  {
    id: 'look-body',
    act: ACT,
    location: 'The first station',
    art: 'praying-hands',
    body: `Perhaps sixty. Good coat, worn through at the cuff in the way of a man who writes for a living.

You say the words. Nobody joins you — and then several do, late and quiet, as though they had been waiting to be told it was allowed.

You take his hand to fold it properly and it is cold. The deep cold, the cold that takes hours. The bell has not gone yet. Whatever was done to him was done long before anybody gathered here to sing.

Somebody has arranged his veil very carefully. Whoever did it took trouble over it.`,
    onEnter: { clues: ['body-cold'], flags: { measures: { add: 1 } } },
    choices: [
      {
        text: 'Stay kneeling a moment longer than you need to.',
        goto: 'body-boots',
        needs: { approach: 'observant' },
        lockedHint: 'Something here is wrong and it will not come to you.',
      },
      { text: 'Rise, and cross yourself.', goto: 'shrine' },
    ],
  },

  {
    id: 'body-boots',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    body: `It takes a moment, and then you cannot unsee it.

Three days of rain. The road is a ribbon of mud. You are wearing half of it to the ankle and so is every soul in this field.

His boots are clean.

You go on kneeling, because standing up suddenly would be a kind of announcement, and you are not ready to make one.`,
    onEnter: { clues: ['no-mud'] },
    choices: [{ text: 'Rise slowly, in your own time.', goto: 'shrine' }],
  },

  {
    id: 'look-stone',
    act: ACT,
    location: 'The face of the stone',
    art: 'boundary-stone',
    body: `Above the columns, cut deepest and kept clean of lichen by somebody's hand every year for two centuries:

*THE ELECT SHALL POSSESS LIGHT, JOY, AND PEACE, AND THEY SHALL INHERIT THE EARTH*

And beneath it the names, in the crabbed hands of eleven masons across two hundred years, each cut on the day a household first swore. It is a beautiful thing. You have always thought so and you think so now.

A third of the way down, one has been cut away. Not weathered — cut. The stone inside the wound is pale as a peeled apple and the chisel marks still have edges. Somebody took a household off this shrine within the week.

You put your thumb in the hollow the way you would touch a relic. There is nothing there. Nothing but stone. · † · [[struck-name|Nothing, except that the cut did not go deep, and there is a shadow in it, and the shadow is four letters long, and it says FENN.]]`,
    onEnter: {
      clues: ['fresh-chisel'],
      terms: ['chisel', 'erase-a-name'],
      flags: { measures: { add: 1 } },
    },
    choices: [
      { text: 'Take your hand away.', goto: 'shrine' },
      {
        text: 'Hold the lanthorn close and look again.',
        goto: 'look-stone-lantern',
        needs: { tool: 'lantern' },
        lockedHint: 'You would need a light of your own; this hollow keeps its own shadow.',
        once: true,
      },
    ],
  },

  {
    id: 'look-stone-lantern',
    act: ACT,
    location: 'The face of the stone',
    art: 'boundary-stone',
    body: `You hold the lanthorn close. In sidelight the cut throws a proper shadow, and the shadow is not a smear — it has corners. Somebody used a straightedge before the chisel ever touched the stone.

Whoever did this did not do it in anger. They did it with a ruler.`,
    choices: [{ text: 'Take your hand away.', goto: 'shrine' }],
  },

  {
    id: 'look-road',
    act: ACT,
    location: 'The north road',
    art: 'road',
    body: `You walk twenty paces back the way you came, as though stretching your legs, and crouch where the mud is deepest over a bootlace that does not need attention.

A cart came down here in the night. Narrow-wheeled, one horse. It came as far as the shrine and it turned about, and the ruts say the rest plainly: deep going in, shallow coming out.

It arrived carrying something heavy. It left without it.`,
    onEnter: { clues: ['cart-tracks'], terms: ['cart'], flags: { measures: { add: 1 } } },
    choices: [{ text: 'Straighten up, and go back.', goto: 'shrine' }],
  },

  /* ---------------------------------------------------------------- */
  /* Warden Kreon                                                     */
  /* ---------------------------------------------------------------- */

  {
    id: 'kreon',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `"You will be the witness."

He does not offer his hand. A big man gone careful with age, standing as though the ground beneath him were on loan.

"Ask what you must. I would rather it was asked here than at the table."

Which is a strange thing to say to somebody who has not asked anything.`,
    choices: [
      { text: '"Who was he? Somebody must know his name."', goto: 'kreon-name', once: true },
      { text: '"When did you find him?"', goto: 'kreon-bell', once: true },
      {
        text: '"You could not have seen that, Warden. Not at that hour."',
        goto: 'kreon-press',
        needs: { clue: 'kreon-lie' },
        lockedHint: 'Something in what he said sits badly. You cannot yet say what.',
      },
      { text: 'Thank him, and leave him to it.', goto: 'shrine' },
    ],
  },

  {
    id: 'kreon-name',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `"He is nobody. Came up from the coast a fortnight back, asking after the register, saying he was owed."

A pause exactly one beat too long.

"I did not take his name. There was no cause to."

Behind you somebody presses a second coin into your hand and apologises for the trouble the morning has put you to.`,
    onEnter: {
      flags: { kreon_evasive: true, measures: { add: 1 }, reverence: { add: 1 } },
      terms: ['for-money'],
    },
    choices: [{ text: 'Let it lie. For now.', goto: 'kreon' }],
  },

  {
    id: 'kreon-bell',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `"First bell. I walk the bounds at first bell, every day of my life, and there he was — laid out just so, and the wound at his temple black with it."

He says it the way a man says a thing he has practised saying.`,
    onEnter: { flags: { measures: { add: 1 } } },
    choices: [
      {
        text: 'Say nothing at all, and let the quiet stand.',
        goto: 'kreon-slip',
        needs: { approach: 'disarming' },
        lockedHint: 'He is waiting for you to fill this. You do, and the moment closes.',
      },
      { text: 'Nod, and let him move on.', goto: 'kreon' },
    ],
  },

  {
    id: 'kreon-slip',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `The quiet goes on. He fills it, because men like him always do.

"— black with it, and the coat soaked through, and you could see plain as day the mark on his collar where —"

He stops. ·

First bell is an hour before dawn. You cannot see the colour of a wound at first bell. You cannot see your own hands.

You say nothing. You are not yet certain you want him to know you counted.`,
    onEnter: { clues: ['kreon-lie'] },
    choices: [{ text: 'Keep your face still. It is covered anyway.', goto: 'kreon' }],
  },

  {
    id: 'kreon-press',
    act: ACT,
    location: 'The first station',
    art: 'boundary-stone',
    portrait: 'warden-kreon',
    speaker: 'Warden Kreon',
    body: `You say it gently. You are surprised, after, by how gently.

He looks at you a long moment and something gives way — not guilt. Relief, almost, that somebody has finally counted.

"Aye," he says. "It was not first bell. I will not say more standing here."

Down the slope, a figure in a very good coat has stopped to watch the two of you and does not trouble to pretend otherwise. Nearer to hand, three people who were glad of you a minute ago are not glad of you now.`,
    onEnter: {
      flags: { kreon_pressed: true, suspicion: { add: 1 }, reverence: { add: -1 } },
      terms: ['lysias', 'out-of-fear'],
    },
    choices: [{ text: 'Step back into the circle.', goto: 'kreon' }],
  },

  /* ---------------------------------------------------------------- */
  /* The rite moves on                                                */
  /* ---------------------------------------------------------------- */

  {
    id: 'act-one-close',
    act: ACT,
    location: 'The first station — the bell',
    art: 'boundary-stone',
    body: `The bell goes, flat and close, and the fold begins to move.

They walk around him. Not one of them looks down. That is not squeamishness — it is practice, and practice takes years to acquire.

A woman lays a veil of grey silk over your arm as she passes, says everyone covers at the high table, squeezes your wrist and is gone before you can thank her. You already have one. You do not say so; she meant it kindly, and it is very fine.

Whatever you did not do here you will not now do. The shrine is behind you.`,
    onEnter: { gifts: ['veil'], flags: { act_one_recorded: true } },
    choices: [
      {
        text: 'Hang back and watch them file past. (They will notice.)',
        goto: 'fold-arrival',
        if: (state) => !state.approaches.includes('observant'),
        effect: { approaches: ['observant'], flags: { suspicion: { add: 1 } } },
      },
      {
        text: 'Walk with the stragglers and let them talk. (They will notice.)',
        goto: 'fold-arrival',
        if: (state) => !state.approaches.includes('disarming'),
        effect: { approaches: ['disarming'], flags: { suspicion: { add: 1 } } },
      },
      {
        text: 'Stay at the stone with the old hands a while. (They will notice.)',
        goto: 'fold-arrival',
        if: (state) => !state.approaches.includes('lettered'),
        effect: { approaches: ['lettered'], flags: { suspicion: { add: 1 } } },
      },
      { text: 'Take your place in the procession and go down with them.', goto: 'fold-arrival' },
    ],
  },
]
