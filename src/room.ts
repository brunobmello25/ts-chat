import WebSocket from 'ws'

export class Room {
  private users: WebSocket[]

  constructor(public name: string) {
    this.users = []
  }

  addUser(user: WebSocket) {
    if (!this.users.includes(user)) {
      this.users.push(user)
    }
  }

  removeUser(user: WebSocket) {
    if (this.users.includes(user)) {
      this.users.splice(this.users.indexOf(user), 1)
    }
  }

  sendMessage(from: WebSocket, message: string) {
    for (const user of this.users) {
      if (user !== from) {
        user.send(`${from}: ${message}`)
      }
    }
  }
}
