import { WebSocket } from "ws";
import { Room } from "./room";

export class Chat {
  private users: WebSocket[];
  private rooms: Room[]

  constructor() {
    this.users = [];
    this.rooms = [];
  }

  addUser(user: WebSocket) {
    user.on("message", (message: string) => {
      const [command, roomName, ...rest] = message.split(" ")
      if (command === 'join') {
        let room = this.rooms.find(room => room.name === roomName)

        if (!room) {
          room = new Room(rest[0]);
          this.rooms.push(room);
        }

        room.addUser(user);
      } else if (command === 'msg') {
        const message = rest.join(" ");

        if (message !== '') {
          const room = this.rooms.find(room => room.name === roomName)
          if (room) {
            room.sendMessage(user, message);
          }
        }
      }
    })

    user.on("error", (error: Error) => {
      console.error(error);
    })

    user.on("close", () => {
      this.users.splice(this.users.indexOf(user), 1);
      this.rooms.forEach(room => {
        room.removeUser(user)
      })
    })
  }
}
