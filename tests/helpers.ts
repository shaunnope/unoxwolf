import type { Update, User } from '@grammyjs/types';

export const generateUser = (id: number, username: string): User => {

    return {
        last_name: "Test Lastname",
        id,
        first_name: "Test",
        username,
        is_bot: false,
      }
}

export const generateMessage = (message: string): Update => {
    return {
      update_id: 10000,
      message: {
        date: 1441645532,
        chat: {
          last_name: "Test Lastname",
          id: 1111111,
          first_name: "Test",
          username: "Test",
          type: "private",
        },
        message_id: 1365,
        from: {
          last_name: "Test Lastname",
          id: 1111111,
          first_name: "Test",
          username: "Test",
          is_bot: false,
        },
        text: message,
      },
    };
  }
