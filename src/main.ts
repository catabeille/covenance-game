import './style.css'

import { Game } from './engine/game.ts'
import { reportStory, validateStory } from './engine/validate.ts'
import { SCENES, START_SCENE } from './story/index.ts'

// Walk the story graph on every dev boot. Broken scene ids and dangling clue
// references show up in the console the moment you save a story file, instead
// of when someone clicks the wrong button an hour later.
if (import.meta.env.DEV) {
  reportStory(validateStory(SCENES, START_SCENE))
}

const root = document.querySelector<HTMLElement>('#app')
if (!root) throw new Error('Covenance: #app element is missing from index.html')

new Game(root).start()
