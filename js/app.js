const icons = [ 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bomb', 'fa-bicycle', 'fa-star', 'fa-heart', 'fa-bell', 'fa-camera', 'fa-cloud', 'fa-coffee', 'fa-fire', 'fa-flask', 'fa-gamepad', 'fa-globe', 'fa-music', 'fa-rocket', 'fa-sun-o', 'fa-tree', 'fa-umbrella', 'fa-wrench', 'fa-apple', 'fa-android', 'fa-linux', 'fa-windows', 'fa-bug', 'fa-space-shuttle', 'fa-moon-o', 'fa-car' ];

let currentLevel = 1;
let openCards = [];
let moves = 0;
let onFirstclk = 0;
let second = 0, minute = 0;
let interval;
let totalPairs = 0;
let matchedPairs = 0;

const deck = document.getElementById('deck');
const movesContainer = document.querySelector('.moves');
const timerElement = document.querySelector('.timer');
const starsContainer = document.querySelector('.stars');
const levelTitle = document.getElementById('level-title');

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fa fa-sun-o"></i> Light Mode' : '<i class="fa fa-moon-o"></i> Dark Mode';
});

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getLevelConfig() {
  if (currentLevel === 1) return { grid: 4, pairs: 8 }; // 4x4
  if (currentLevel === 2) return { grid: 6, pairs: 18 }; // 6x6
  return { grid: 8, pairs: 32 }; // 8x8
}

function initGame() {
  stopTimer();
  second = 0; minute = 0; moves = 0; onFirstclk = 0; matchedPairs = 0; openCards = [];
  movesContainer.innerHTML = moves;
  timerElement.innerHTML = '0 mins 0 secs';
  updateStars();

  const config = getLevelConfig();
  totalPairs = config.pairs;
  levelTitle.innerHTML = `Level ${currentLevel} (${config.grid}x${config.grid})`;

  deck.style.gridTemplateColumns = `repeat(${config.grid}, 1fr)`;
  deck.style.gridTemplateRows = `repeat(${config.grid}, 1fr)`;

  let cardSize = config.grid === 4 ? '125px' : config.grid === 6 ? '90px' : '65px';
  if(window.innerWidth < 800) cardSize = config.grid === 4 ? '75px' : config.grid === 6 ? '55px' : '40px';

  let selectedIcons = icons.slice(0, totalPairs);
  let gameCards = shuffle([...selectedIcons, ...selectedIcons]);

  deck.innerHTML = '';
  gameCards.forEach(icon => {
    const li = document.createElement('li');
    li.classList.add('card');
    li.dataset.card = icon;
    li.style.width = cardSize;
    li.style.height = cardSize;
    li.innerHTML = `<i class="fa ${icon}"></i>`;
    li.addEventListener('click', onCardClick);
    deck.appendChild(li);
  });
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (card.classList.contains('open') || card.classList.contains('match') || openCards.length >= 2) return;

  if (onFirstclk === 0) {
    onFirstclk = 1;
    interval = setInterval(() => {
      second++;
      if (second === 60) { minute++; second = 0; }
      timerElement.innerHTML = `${minute} mins ${second} secs`;
    }, 1000);
  }

  card.classList.add('open', 'show');
  openCards.push(card);

  if (openCards.length === 2) {
    moves++;
    movesContainer.innerHTML = moves;
    updateStars();

    if (openCards[0].dataset.card === openCards[1].dataset.card) {
      openCards[0].classList.add('match');
      openCards[1].classList.add('match');
      openCards = [];
      matchedPairs++;
      if (matchedPairs === totalPairs) {
        setTimeout(winGame, 500);
      }
    } else {
      setTimeout(() => {
        openCards[0].classList.remove('open', 'show');
        openCards[1].classList.remove('open', 'show');
        openCards = [];
      }, 600);
    }
  }
}

function stopTimer() { clearInterval(interval); }

function updateStars() {
  const config = getLevelConfig();
  const par = config.pairs * 1.5; 
  let numStars = 3;
  if (moves > par) numStars = 2;
  if (moves > par * 1.5) numStars = 1;

  starsContainer.innerHTML = '';
  for(let i=0; i<numStars; i++) {
    starsContainer.innerHTML += '<li><i class="fa fa-star"></i></li>';
  }
}

function winGame() {
  stopTimer();
  
  // Fire amazing confetti!
  var duration = 3 * 1000;
  var end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#02ccba', '#aa7ecd', '#38bdf8']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#02ccba', '#aa7ecd', '#38bdf8']
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  document.querySelector('.modal-background').classList.remove('hide');
  document.getElementById('modal-moves').innerHTML = moves;
  document.getElementById('modal-time').innerHTML = timerElement.innerHTML;
  document.getElementById('modal-stars').innerHTML = starsContainer.innerHTML;
  
  const nextBtn = document.getElementById('next-level-btn');
  if (currentLevel < 3) {
    nextBtn.style.display = 'inline-block';
    document.getElementById('modal-heading').innerHTML = 'LEVEL COMPLETE!!!';
  } else {
    nextBtn.style.display = 'none';
    document.getElementById('modal-heading').innerHTML = 'YOU BEAT THE GAME!!!';
  }
}

document.getElementById('next-level-btn').addEventListener('click', () => {
  document.querySelector('.modal-background').classList.add('hide');
  currentLevel++;
  initGame();
});

document.querySelector('.restart').addEventListener('click', () => {
  document.querySelector('.modal-background').classList.add('hide');
  initGame();
});

initGame();