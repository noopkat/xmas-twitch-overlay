require('dotenv').config();
const IRC = require('irc-framework');
const skateboard = require('skateboard');

const bot = new IRC.Client();
let socket = null;
const queue = [];

function botConnect(callback) {
  bot.connect({
    host: 'irc.chat.twitch.tv',
    port: 6667,
    nick: process.env.TWITCH_NICK,
    password: process.env.TWITCH_TOKEN
  });

  bot.on('registered', () => {
    console.log('reg happened!');

    const channel = bot.channel('#noopkat');
    channel.join();
    return callback();
  });
};

function dequeue() {
  if (queue.length && socket) {
    const nick = queue.shift();
    socket.write(nick); 
  }
}

botConnect(() => {
  skateboard({}, (stream) => {
    socket = stream;
  });
  
  bot.matchMessage(/merry christmas|happy holidays/i, (event) => {
    console.log(event);
    queue.push(event.nick);
  });
  
  const queueInterval = setInterval(dequeue, 5500);
});
