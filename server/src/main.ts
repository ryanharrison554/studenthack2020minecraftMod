import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import debugImport from 'debug';
import Message from "./types/message";
import { EventEmitter } from "events";

// Create discord bot and login
import discord from 'discord.js';
const bot = new discord.Client();

const eventEmitter = new EventEmitter();

bot.once('ready', () => {
    // tslint:disable-next-line:no-console
    console.log('Bot Ready!');
});

bot.on('message', (message: discord.Message) => {
    if (!message.author.bot) {
        const data: Message = JSON.parse(message.content);
        // Send the message to the given user
        message.client.users.fetch(data.to)
            .then(recipient => {
                recipient.send(JSON.stringify({
                    content: data.content,
                    from: message.author.id
                }));
            })
            .catch(reason => {
                message.channel.send(reason);
            });
    }
});

dotenv.config();
bot.login(process.env.CLIENT_TOKEN);

const debug = debugImport('server:server');
const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });
const PORT = normalizePort(process.env.PORT || '3000');

wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
    // First thing we want to do is send the user all the data about their connections and messages
    const url = new URL(request.url, `http://${request.headers.host}`);
    const userID = url.searchParams.get('id');
    const user = bot.users.fetch(userID);
    eventEmitter.on(`messageTo${userID}`, (message: Message) => {
        ws.send(message);
    });

    ws.on('message', (message: string) => {
        ws.send(`Received ${message}`);
    });
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // tslint:disable-next-line:no-console
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            // tslint:disable-next-line:no-console
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

function authenticate(req:any, callback:any) {
    return;
}

// Authenticate the user when they first try to create a web socket
server.on('upgrade', (request, socket, head) => {
    authenticate(request, (err: any, client: any) => {
        if (err || !client) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destory();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            wss.emit('connection', ws, request, client);
        });
    });
});
server.on('listening', onListening);
server.on('error', onError);
server.listen(PORT);