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
    console.log('Bot Ready!');
});

bot.on('message', (message: discord.Message) => {
    if (message.content === '!sendTest') {
        bot.users.fetch('621659602471354368').then(me => {
            me.send(JSON.stringify({
                to: '621659602471354368',
                from: '621659602471354368',
                content: 'This is a test message to yourself.'
            }));
        });
        return;
    }

    const onSendError = (reason: string) => {
        reply = {
            to: data.from,
            from: 'server',
            content: reason,
            err: 'Message couldn\'t be delivered',
            status: 403
        };
        bot.users.fetch(data.from).then(user => {
            user.send(reply).catch(reason1 => {
                console.error(`Couldn't deliver error message to ${data.from}. ${reason1}`);
            });
        });
    };
    let data: Message;
    let reply: Message;
    // Parse data
    try {
        data = JSON.parse(message.content);
    } catch (error) {
        // This means that the data isn't JSON
        return;
    }

    // Validate data
    if (!data.to || !data.from || !data.content) {
        console.error(`Invalid request: ${JSON.stringify(data)}`);
        reply = {
            from: 'server',
            to: message.author.id,
            content: 'err',
            err: 'Bad Request',
            status: 500,
        };
        message.channel.send(JSON.stringify(reply)).then(value => {
            console.log(`Sent message: ${JSON.stringify(reply)}`);
            eventEmitter.emit(`messageTo${message.author.id}`, JSON.stringify(reply));
        });
        return;
    }

    // If the original author is not the bot, send the message to intended recipient
    // The use of you here as author and recipient is to prevent duplicate messages being sent. Since all API
    // calls on the front end are made using the bot, we need to send duplicates to both author and recipient so
    // they can keep track of what messages they've sent.
    // I.e. if the message is not a reply
    const author = data.from;
    const recipient = data.to;
    const content = data.content;
    // We want to ignore
    if (data.from !== 'server' && data.to !== 'server' && !data.status && data.from !== 'you' && data.to !== 'you') {
        bot.users.fetch(recipient).then(recipientUser => {
                const messageToRecipient: Message = {
                    to: 'you',
                    from: author,
                    content,
                    status: undefined,
                    err: undefined
                };
                recipientUser.send(JSON.stringify(messageToRecipient)).then(value => {
                    console.log(`Sent message: ${JSON.stringify(messageToRecipient)}`);
                    eventEmitter.emit(`messageTo${recipientUser.id}`, JSON.stringify(messageToRecipient));
                    bot.users.fetch(author).then(user => {
                        reply = {
                            to: recipient,
                            from: 'you',
                            content,
                            err: 'Message sent successfully',
                            status: 200
                        };
                        user.send(JSON.stringify(reply)).then(console.log).catch(onSendError);
                        eventEmitter.emit(`messageTo${author}`, JSON.stringify(reply));
                    });
                });
            });
    // Otherwise, when the intended recipient is the server, it is a command
    } else if (data.to === 'server' || data.from === 'server') {
        return;
    }
});

dotenv.config();
bot.login(process.env.CLIENT_TOKEN);

const debug = debugImport('server:server');
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const PORT = normalizePort(process.env.PORT || '3000');

wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
    // First thing we want to do is send the user all the data about their connections and messages
    const url = new URL(request.url, `http://${request.headers.host}`);
    const userID = url.searchParams.get('id');
    console.log(`New Connection: ${userID}`);
    bot.users.fetch(userID, false).then(user => {
        ws.send('Connected Successfully');
        user.dmChannel.messages.fetch().then(rawMessages => {
            const messages: Message[] = [];
            let data;
            rawMessages.forEach(value => {
                try {
                    data = JSON.parse(value.content);
                } catch (error) {
                    return;
                }
                messages.push(data);
            });
            ws.send(JSON.stringify(messages))
        });
    });
    eventEmitter.on(`messageTo${userID}`, (message: Message) => {
        ws.send(message);
    });

    ws.on('message', (message: string) => {
        ws.send(`Received ${message}`);
    });
});



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
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

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
/*
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
});*/
server.on('listening', onListening);
server.on('error', onError);
server.listen(PORT);