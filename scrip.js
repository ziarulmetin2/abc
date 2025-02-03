// script.js

document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
  
  function initApp() {
    setInterval(updateTime, 1000);
    updateTime();
    
    document.querySelectorAll('.photo').forEach(photo => {
        photo.addEventListener('click', () => {
            const imgUrl = photo.style.backgroundImage.replace('url("', '').replace('")', '');
            document.querySelector('.zoomed-photo').style.display = 'flex';
            document.getElementById('zoomedImg').src = imgUrl;
        });
    });
  }
  
  function updateTime() {
    const now = new Date();
    document.getElementById('clock').innerHTML = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('statusTime').textContent = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').innerHTML = now.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  
  function openApp(appId) {
    document.querySelectorAll('.modal').forEach(el => el.style.display = 'none');
    if(appId) {
        document.getElementById(appId).style.display = 'block';
        if(appId === 'labyrinth') labyrinthGameInit();
    }
  }
  
  function closeApp() {
    openApp(null);
    window.removeEventListener('keydown', labyrinthKeyHandler);
    document.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.onclick = null;
    });
  }
  
  // --- Sistem de mesagerie ---
  const chats = {
    ana: {
        messages: [
            { type: 'received', text: 'Am documentele despre cazul Maria. Să ne întâlnim?', time: '10:32' },
            { type: 'sent', text: 'Da, unde?', time: '10:33' }
        ]
    },
    mihai: {
        messages: [
            { type: 'received', text: 'Codul seifului este 4587!', time: '09:45' },
            { type: 'sent', text: 'Mulțumesc, verific imediat!', time: '09:46' }
        ]
    },
    elena: {
        messages: [
            { type: 'received', text: 'Ai grijă la Mihai! Nu e de încredere.', time: '23:15' }
        ]
    }
  };
  
  function openChat(contact) {
    document.querySelectorAll('.conversation-window').forEach(c => c.style.display = 'none');
    document.querySelector(`#${contact}-chat`).style.display = 'flex';
    updateChat(contact);
  }
  
  function closeChat() {
    document.querySelectorAll('.conversation-window').forEach(c => c.style.display = 'none');
  }
  
  function updateChat(contact) {
    const container = document.querySelector(`#${contact}-chat .message-container`);
    container.innerHTML = '';
    chats[contact].messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        messageDiv.innerHTML = `<p>${msg.text}</p><span class="message-time">${msg.time}</span>`;
        container.appendChild(messageDiv);
    });
  }
  
  function sendMessage(contact) {
    const input = document.querySelector(`#${contact}-input`);
    const text = input.value.trim();
    if(text) {
        const time = new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
        chats[contact].messages.push({ type: 'sent', text: text, time: time });
        input.value = '';
        updateChat(contact);
  
        if(contact === 'ana') {
            setTimeout(() => {
                const aiResponse = getAIResponse(text);
                chats[contact].messages.push({
                    type: 'received',
                    text: aiResponse,
                    time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
                });
                updateChat(contact);
            }, 1500);
        } else {
            setTimeout(() => {
                chats[contact].messages.push({
                    type: 'received',
                    text: 'Voi reveni cu detalii...',
                    time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
                });
                updateChat(contact);
            }, 1500);
        }
    }
  }
  
  function getAIResponse(message) {
    message = message.toLowerCase();
    if(message.includes("trapa")) return "Ai declanșat alarma secretă! Capcana a fost activată.";
    if(message.includes("salut")) return "Salut, ce pot face pentru tine?";
    if(message.includes("ce faci")) return "Sunt aici, pregătită să te ajut cu informații despre caz.";
    
    const responses = [
        "Spune-mi mai multe...",
        "Interesant, continuă...",
        "Nu sunt sigură ce vrei să spui, explică-te!",
        "Asta e doar începutul. Ai curajul să continui?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  function closeZoom() {
    document.querySelector('.zoomed-photo').style.display = 'none';
  }
  
  // --- Joc Secret ---
  let secretCode = [3, 1, 4, 2];
  let attempts = 0;
  
  function showPasswordPrompt() {
    document.getElementById('gameModal').style.display = 'block';
    document.getElementById('passwordPrompt').style.display = 'block';
    document.getElementById('gameContent').style.display = 'none';
    document.getElementById('passwordInput').value = '';
  }
  
  function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    resetGame();
  }
  
  function resetGame() {
    attempts = 0;
    document.getElementById('numberDisplay').innerHTML = '_ _ _ _';
    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('numberInput').value = '';
  }
  
  function checkPassword() {
    if(document.getElementById('passwordInput').value === '1234') {
        document.getElementById('passwordPrompt').style.display = 'none';
        document.getElementById('gameContent').style.display = 'block';
        resetGame();
    } else {
        alert('Parolă incorectă. Ești avertizat...');
    }
  }
  
  function checkNumber() {
    let input = document.getElementById('numberInput');
    let guess = parseInt(input.value);
    if(guess === secretCode[attempts]) {
        let display = document.getElementById('numberDisplay').innerHTML.split(' ');
        display[attempts] = guess;
        document.getElementById('numberDisplay').innerHTML = display.join(' ');
        attempts++;
        input.value = '';
        if(attempts === 4) {
            document.getElementById('gameResult').innerHTML = '🎉 Parola finală: CAMERA105';
            document.getElementById('gameResult').style.color = '#4CAF50';
        }
    } else {
        document.getElementById('gameResult').innerHTML = '❌ Combinație greșită!';
        document.getElementById('gameResult').style.color = '#f44336';
        setTimeout(resetGame, 1000);
    }
  }
  
  // --- Labirint ---
  const maze = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,1],
    [1,1,1,1,0,1,0,1,0,1],
    [1,0,0,1,0,0,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ];
  let player = { x: 1, y: 1 };
  const cellSize = 40;
  const goal = { x: 8, y: 8 };
  
  function labyrinthGameInit() {
    player = { x: 1, y: 1 };
    drawMaze();
    document.getElementById('labyrinthMessage').textContent = "Găsește codul secret!";
    window.addEventListener('keydown', labyrinthKeyHandler);
  }
  
  function drawMaze() {
    const canvas = document.getElementById('labyrinthCanvas');
    const ctx = canvas.getContext('2d');
    
    for(let y = 0; y < maze.length; y++){
        for(let x = 0; x < maze[y].length; x++){
            ctx.fillStyle = maze[y][x] === 1 ? "#000" : "#fff";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "#ccc";
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    
    ctx.fillStyle = "#0084ff";
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize/2, player.y * cellSize + cellSize/2, cellSize/3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = "#31a24c";
    ctx.fillRect(goal.x * cellSize + 10, goal.y * cellSize + 10, cellSize - 20, cellSize - 20);
  }
  
  function labyrinthKeyHandler(e) {
    const directions = {
        "ArrowUp": 'up',
        "ArrowDown": 'down',
        "ArrowLeft": 'left',
        "ArrowRight": 'right'
    };
    if(directions[e.key]) movePlayer(directions[e.key]);
  }
  
  function movePlayer(direction) {
    let newX = player.x;
    let newY = player.y;
    
    switch(direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
    }
    
    if(maze[newY] && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        checkLabyrinthWin();
    }
  }
  
  function checkLabyrinthWin() {
    if(player.x === goal.x && player.y === goal.y) {
        document.getElementById('labyrinthMessage').textContent = "Bravo! Codul secret: LAB123";
        window.removeEventListener('keydown', labyrinthKeyHandler);
    }
  }