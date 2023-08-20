import { Composer } from 'grammy'
import type { Context } from '~/bot/context'

import { helpFeature, gameFeature } from './features'

export { Game } from './game'

const composer = new Composer<Context>()

const feature = composer

feature.use(helpFeature)
feature.use(gameFeature)

export { composer as gameFeature }
