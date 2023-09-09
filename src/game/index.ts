import { Composer } from 'grammy'
import type { Context } from '~/bot/context'

import { helpFeature, gameFeature, devGameFeature } from './features'

export { Game } from './game'

const composer = new Composer<Context>()

const feature = composer

if (process.env.NODE_ENV === 'development') {
  feature.use(devGameFeature)
}

feature.use(helpFeature)
feature.use(gameFeature)

export { composer as gameFeature }
