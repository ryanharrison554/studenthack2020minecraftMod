import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import bot from './bot';
import debugImport from 'debug';

dotenv.config();
bot.login(process.env.CLIENT_TOKEN);

const debug = debugImport('server:server');
const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });
const PORT = normalizePort(process.env.PORT || '3000');

wss.on('connection', (ws: WebSocket, request: any, client: any) => {
    ws.on('message', (message: string) => {
        ws.send(`Received ${message}`);
    })
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