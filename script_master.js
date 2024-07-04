const resultDiv = document.getElementById('result');
const resetButton = document.getElementById('reset');
const unlockButton = document.getElementById('unlock');
const playersList = document.getElementById('players-list');

const socket = new WebSocket('ws://81.107.83.168:3000'); // Update to your public IP and port

socket.addEventListener('open', () => {
    console.log('Master: Connected to the server');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Master: Received message', data);
    if (data.type === 'buzz') {
        resultDiv.textContent = `${data.user} buzzed in first!`;
    } else if (data.type === 'updatePlayers') {
        updatePlayersList(data.players);
    }
});

resetButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'reset' }));
    resultDiv.textContent = 'Waiting for buzzes...';
});

unlockButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'unlock' }));
});

function updatePlayersList(players) {
    playersList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playersList.appendChild(li);
    });
}
