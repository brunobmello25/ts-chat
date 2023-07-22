import WebSocket from 'ws';
import readline from 'readline/promises'
import { json } from 'stream/consumers';

const client = new WebSocket('ws://localhost:8080');

client.on('open', () => {
  client.send("join banana1")
  client.send("join banana2")
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function main() {
  const roomName = (await rl.question('Enter room name: ')).trim();

  const client = new WebSocket(`ws://localhost:8080`);


  client.on('open', () => {
    client.send(`join ${roomName}`)
  });

  client.on('message', (message) => {
    console.log(message.toString())
  });

  client.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });


  // Use readline to get user input
  rl.on('line', (line) => {
    line = line.trim();
    if (line === '') {
      // If user inputs an empty string, close the connection
      client.close();
      console.log('Connection closed');
      rl.close();
      process.exit(0)
    } else {
      // Otherwise, send the user's input as a message to the server
      client.send(`msg ${roomName} ${line}`);
    }
  });
}

main()
//
