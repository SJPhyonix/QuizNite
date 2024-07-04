const resultDiv = document.getElementById('result');
const resetButton = document.getElementById('reset');
const playersList = document.getElementById('players-list');

const socket = new WebSocket('wss://quiznite.onrender.com'); // Render service URL

socket.addEventListener('open', () => {
    console.log('Master: Connected to the server');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Master: Received message', data);
    if (data.type === 'buzz') {
        resultDiv.textContent = `${data.user} buzzed in first!`;
    } else if (data.type === 'updatePlayers') {
        console.log('Master: Updating players list', data.players); // Debugging statement
        updatePlayersList(data.players);
    }
});

resetButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'reset' }));
    resultDiv.textContent = 'Waiting for buzzes...';
});

function updatePlayersList(players) {
    playersList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playersList.appendChild(li);
    });
}
