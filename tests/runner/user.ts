import type { User } from "@grammyjs/types"

export class MockUser {
  #user: User
  constructor(user: User) {
    this.#user = user
  }
}

export function mockUser(id: number, is_bot: boolean = false): User {
  return {
    last_name: "Tester",
    id,
    first_name: `mock-${id}`,
    username: `@test${id}`,
    is_bot,
  }
}
