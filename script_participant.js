const joinButton = document.getElementById('join');
const nameInput = document.getElementById('name-input');
const buzzerButton = document.getElementById('buzzer');
const nameForm = document.getElementById('name-form');
const playerInfo = document.getElementById('player-info');
const playerNameDisplay = document.getElementById('player-name');

const socket = new WebSocket('wss://quiznite.onrender.com'); // Ensure this URL is correct

let userName = '';

socket.addEventListener('open', () => {
    console.log('Participant: Connected to the server');
});

joinButton.addEventListener('click', () => {
    userName = nameInput.value;
    if (userName) {
        socket.send(JSON.stringify({ type: 'join', user: userName }));
        console.log('Participant: Sent join message', userName); // Debugging statement
        nameForm.style.display = 'none';
        playerNameDisplay.textContent = `Player: ${userName}`;
        playerInfo.style.display = 'block';
    }
});

buzzerButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'buzz', user: userName }));
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Participant: Received message', data);
    if (data.type === 'reset') {
        buzzerButton.disabled = false;
    }
});
