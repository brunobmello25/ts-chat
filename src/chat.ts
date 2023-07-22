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
    user.on("message", (data) => {
      const message = data.toString();

      const [command, ...rest] = message.trim().split(" ")

      if (command === 'join') this.handleJoin(rest, user);
      if (command === 'msg') this.handleMsg(rest, user);
      if (command === "exit") this.handleExit(rest, user)
    })

    user.on("error", (error: Error) => {
      console.error(error);
    })

    user.on("close", () => {
      this.removeUser(user)
    })
  }

  private findRoom(name: string): Room | undefined {
    return this.rooms.find(room => room.name === name)
  }

  private handleJoin(data: string[], user: WebSocket) {
    const [roomName] = data;

    let room = this.rooms.find(room => room.name === roomName)

    if (!room) {
      room = new Room(data[0]);
      this.rooms.push(room);
    }

    room.addUser(user);
  }

  private handleMsg(data: string[], user: WebSocket) {
    const [roomName, ...msgData] = data
    const message = msgData.join(' ')

    const room = this.findRoom(roomName)

    if (!room || message === '') {
      console.error(`room ${roomName} doesn't exist`)
      user.send(`room ${roomName} doesn't exist`)
      return;
    }

    room.sendMessage(user, message)
  }

  private handleExit(data: string[], user: WebSocket) {
    const [roomName] = data

    const room = this.findRoom(roomName);

    if (!room) {
      console.error(`room ${roomName} doesn't exist`)
      user.send(`room ${roomName} doesn't exist`)
      return;
    }

    room.removeUser(user);
  }

  private removeUser(user: WebSocket) {
    this.users.splice(this.users.indexOf(user), 1);
    this.rooms.forEach(room => {
      room.removeUser(user)
    })
  }
}

