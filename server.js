const WebSocket = require('ws');
const port = process.env.PORT || 3000;

const server = new WebSocket.Server({ port });

let buzzedFirst = false;
let players = {};

server.on('connection', socket => {
    console.log('Server: Client connected');

    socket.on('message', message => {
        const data = JSON.parse(message);
        console.log('Server: Received message', data);

        if (data.type === 'buzz' && !buzzedFirst) {
            buzzedFirst = true;
            broadcast(JSON.stringify({ type: 'buzz', user: data.user }));
        } else if (data.type === 'reset') {
            buzzedFirst = false;
            broadcast(JSON.stringify({ type: 'reset' }));
        } else if (data.type === 'join') {
            players[data.user] = { socket, lastPing: Date.now() };
            broadcastPlayers();
        } else if (data.type === 'ping') {
            if (players[data.user]) {
                players[data.user].lastPing = Date.now();
            }
        }
    });

    socket.on('close', () => {
        for (let user in players) {
            if (players[user].socket === socket) {
                delete players[user];
                broadcastPlayers();
                break;
            }
        }
        console.log('Server: Client disconnected');
    });
});

setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (let user in players) {
        if (now - players[user].lastPing > 10000) { // 10 seconds timeout
            delete players[user];
            changed = true;
        }
    }
    if (changed) {
        broadcastPlayers();
    }
}, 5000);

function broadcastPlayers() {
    const playerList = Object.keys(players);
    broadcast(JSON.stringify({ type: 'updatePlayers', players: playerList }));
}

function broadcast(data) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
    console.log('Server: Broadcast message', data);
}

console.log(`Server: Running on port ${port}`);
