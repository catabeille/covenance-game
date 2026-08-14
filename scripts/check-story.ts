/**
 * Story integrity check, runnable from the command line:
 *
 *   npm run check:story
 *
 * The same validation the browser runs in dev, but usable in a terminal or a
 * pre-commit hook. Exits non-zero when the graph is broken.
 *
 * Node 24 strips TypeScript types natively, so this runs with plain `node` —
 * no build step, no extra dependency.
 */

import { validateStory } from '../src/engine/validate.ts'
import { SCENES, START_SCENE } from '../src/story/index.ts'

const report = validateStory(SCENES, START_SCENE)

for (const warning of report.warnings) {
  console.warn(`  warn   ${warning}`)
}
for (const error of report.errors) {
  console.error(`  ERROR  ${error}`)
}

const sceneCount = Object.keys(SCENES).length

if (report.errors.length > 0) {
  console.error(
    `\n${report.errors.length} error(s) across ${sceneCount} scenes. The graph is broken.`,
  )
  throw new Error('Story validation failed')
}

console.log(
  `\nStory graph intact: ${sceneCount} scenes, ${report.warnings.length} warning(s).`,
)
