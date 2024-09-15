import type { Chat, Update, User } from "@grammyjs/types"

/** Random step */
function step(val: number): number {
  return Math.floor(Math.random() * val)
}

type NonChannelChat = Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat

export class MockChat {
  #chat: NonChannelChat
  message_id: number
  update_id: number

  constructor(chat: NonChannelChat) {
    this.#chat = chat

    this.message_id = 0
    this.update_id = 0
  }

  get user() {
    if (this.#chat.type === "private") {
      return {
        ...this.#chat,
        is_bot: false,
      } as User
    }
  }

  static fromUser(user: User): MockChat {
    return new MockChat({
      type: "private",
      ...user,
    })
  }

  static fromUsers(users: User[]): MockChat[] {
    return users.map(user => MockChat.fromUser(user))
  }

  mockMessage(user: User, text: string): Update {
    this.message_id += step(10)
    this.update_id += step(10)
    return {
      update_id: this.update_id,
      message: {
        date: Date.now(),
        chat: this.#chat,
        message_id: this.message_id,
        from: user,
        text,
      },
    }
  }

  mockCommand(user: User, command: string, params?: string): Update {
    const text = params === undefined ? `/${command}` : `/${command} ${params}`
    const message = this.mockMessage(user, text)
    // if (message.message === undefined) return message
    message.message!.entities = [
      {
        offset: 0,
        length: command.length + 1,
        type: "bot_command",
      },
    ]

    return message
  }
}

export class ChannelContext {

}
