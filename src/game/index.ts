import { Composer } from "grammy"
import type { Context } from "~/bot/context"

import { config } from "~/config"
import { devGameFeature, gameFeature, helpFeature } from "./features"

export { Game } from "./game"

const composer = new Composer<Context>()

const feature = composer

if (config.isDev) {
  feature.use(devGameFeature)
}

feature.use(helpFeature)
feature.use(gameFeature)

export { composer as gameFeature }
