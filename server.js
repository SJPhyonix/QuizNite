const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

let buzzedFirst = false;
let players = [];

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
            players.push(data.user);
            broadcast(JSON.stringify({ type: 'updatePlayers', players }));
        } else if (data.type === 'unlock') {
            broadcast(JSON.stringify({ type: 'unlock' }));
        }
    });

    socket.on('close', () => {
        console.log('Server: Client disconnected');
    });
});

function broadcast(data) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
    console.log('Server: Broadcast message', data);
}

console.log('Server: Running on ws://192.168.0.67:3000');
