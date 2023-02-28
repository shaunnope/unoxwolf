// import { session, Bot } from 'grammy'
// import { BotContext } from '../app/types'
// const { reply, fork } = Bot

// const randomPhoto = 'https://picsum.photos/200/300/?random'
// const sayYoMiddleware = fork((ctx) => ctx.reply('yo'))

// export const initBot = (bot: Bot<BotContext>) => {
//     // Register session middleware
//   bot.use(session())

//   // Register logger middleware
//   bot.use((ctx, next) => {
//     const start = Date.now()
//     return next().then(() => {
//       const ms = Date.now() - start
//       console.log('response time %sms', ms)
//     })
//   })

//   bot.start((ctx) => {
//       ctx.reply("Hi there! I am Horace, here to provide you with personalised scheduling and reminders via Telegram since 2022. Tap on /help to learn more about my various features.\n\nTry me now!")
//   })
    
//   bot.help((ctx) => ctx.reply('Send me a sticker'))
  
//   bot.command('info', (ctx) => {
//     ctx.reply(ctx.message.text.split(" ").toLocaleString())
//   })

// }

// export const basicBot = (bot: Bot<BotContext>) => {
//   // Text messages handling
//   bot.hears('Hey', sayYoMiddleware, (ctx) => {
//     ctx.session ??= { heyCounter: 0 }
//     ctx.session.heyCounter++
//     return ctx.replyWithMarkdown(`_Hey counter:_ ${ctx.session.heyCounter}`)
//   })

//   // Command handling
//   bot.command('answer', sayYoMiddleware, (ctx) => {
//     console.log(ctx.message)
//     return ctx.replyWithMarkdownV2('*42*')
//   })

//   bot.command('cat', (ctx) => ctx.replyWithPhoto(randomPhoto))

//   // Streaming photo, in case Telegram doesn't accept direct URL
//   bot.command('cat2', (ctx) => ctx.replyWithPhoto({ url: randomPhoto }))

//   // Look ma, reply middleware factory
//   bot.command('foo', reply('http://coub.com/view/9cjmt'))

//   // Wow! RegEx
//   bot.hears(/reverse (.+)/, (ctx) =>
//     ctx.reply(ctx.match[1].split('').reverse().join(''))
//   )

//   // Login widget events
//   bot.on('connected_website', (ctx) => ctx.reply('Website connected'))

//   // Telegram passport events
//   bot.on('passport_data', (ctx) => ctx.reply('Telegram passport connected'))
  
//   // Random location on some text messages
//   bot.on('text', (ctx, next) => {
//     if (Math.random() > 0.2) {
//       return next()
//     }
//     return Promise.all([
//       ctx.replyWithLocation(Math.random() * 180 - 90, Math.random() * 180 - 90),
//       next(),
//     ])
//   })

//   bot.on('sticker', (ctx) => ctx.reply('👍'))
//   bot.hears('hi', (ctx) => ctx.reply('Hey there'))
//   bot.command('oldschool', (ctx) => ctx.reply('Hello'))
//   bot.command('hipster', Telegraf.reply('λ'))

//   bot.command('me', (ctx) => {
//     let msg = ctx.message;
//     console.log(msg);
//     ctx.reply(msg.text.toLocaleString())
//   })
  
//   bot.command('roll', (ctx) => {
//     ctx.replyWithDice()
//   })
// }