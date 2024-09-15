import type { Chat, Update, User } from "@grammyjs/types"

/** Random step */
function step(val: number): number {
  return Math.floor(Math.random() * val)
}

export class MockChat {
  #chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat
  message_id: number
  update_id: number

  constructor(chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat) {
    this.#chat = chat

    this.message_id = 0
    this.update_id = 0
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
