import WebSocket from 'ws'
import { Chat } from './chat'

const server = new WebSocket.Server({ port: 8080 })

const chat = new Chat();

server.on('connection', function (socket) {
  chat.addUser(socket);
})


server.on('error', function (error) {
  console.error('error', error);
})
