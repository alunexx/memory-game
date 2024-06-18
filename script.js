let level = 1;
let score = 0;
let timer = 60;
let interval;
let isPaused = false;
let isSoundOn = true;

const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const nextLevelButton = document.getElementById('next-level');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const restartButton = document.getElementById('restart');
const soundToggleButton = document.getElementById('sound-toggle');

function createBoard(level) {
  gameBoard.innerHTML = '';
  const totalPairs = level + 1;
  const cardValues = generateCardValues(totalPairs);
  cardValues.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${value}</div>
        <div class="card-back"></div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
  setBoardStyle(totalPairs);
}

function setBoardStyle(totalPairs) {
  const columns = Math.ceil(Math.sqrt(totalPairs * 2));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
}

function generateCardValues(totalPairs) {
  const values = [];
  for (let i = 1; i <= totalPairs; i++) {
    values.push(i, i);
  }
  return values.sort(() => 0.5 - Math.random());
}

function flipCard() {
  if (this.classList.contains('flip') || this.classList.contains('matched') || isPaused) return;
  this.classList.add('flip');
  playSound('flip');
  const flippedCards = document.querySelectorAll('.card.flip:not(.matched)');
  if (flippedCards.length === 2) {
    checkForMatch(flippedCards);
  }
}

function checkForMatch(cards) {
  const [card1, card2] = cards;
  if (card1.textContent === card2.textContent) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    playSound('match');
    score += 10;
    updateScore();
    if (document.querySelectorAll('.card.matched').length === document.querySelectorAll('.card').length) {
      clearInterval(interval);
      nextLevelButton.style.display = 'block';
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
    }, 1000);
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateLevel() {
  levelDisplay.textContent = `Level: ${level}`;
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${timer}s`;
}

function startTimer() {
  interval = setInterval(() => {
    if (!isPaused) {
      timer--;
      updateTimer();
      if (timer === 0) {
        clearInterval(interval);
        alert('Time\'s up! Game over.');
        resetGame();
      }
    }
  }, 1000);
}

function playSound(type) {
  if (!isSoundOn) return;
  let audio;
  if (type === 'flip') {
    audio = new Audio('https://raw.githubusercontent.com/alunexx/memory-game/main/flip.mp3');
  } else if (type === 'match') {
    audio = new Audio('https://raw.githubusercontent.com/alunexx/memory-game/main/match.mp3');
  }
  if (audio) {
    audio.play();
  }
}

function toggleSound() {
  isSoundOn = !isSoundOn;
  soundToggleButton.textContent = `Sound: ${isSoundOn ? 'On' : 'Off'}`;
}

function resetGame() {
  level = 1;
  score = 0;
  timer = 60;
  isPaused = false;
  updateLevel();
  updateScore();
  updateTimer();
  createBoard(level);
  startTimer();
}

function pauseGame() {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

function restartGame() {
  clearInterval(interval);
  resetGame();
}

nextLevelButton.addEventListener('click', () => {
  nextLevelButton.style.display = 'none';
  level++;
  timer = 60;
  updateLevel();
  updateTimer();
  createBoard(level);
  startTimer();
});

startButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', pauseGame);
restartButton.addEventListener('click', restartGame);
soundToggleButton.addEventListener('click', toggleSound);

// Initial setup for touch sensitivity and pinch-to-zoom
let scale = 1;
const el = document.getElementById('game-board');

el.addEventListener('touchmove', function (event) {
  if (event.scale !== undefined) {
    scale = event.scale;
  }
  el.style.transform = `scale(${scale})`;
}, false);

resetGame();
