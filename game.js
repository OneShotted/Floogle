//dom references
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const autocompleteList = document.getElementById('autocomplete-list');
const luckyBtn = document.getElementById('lucky-btn');
const playGameBtn = document.getElementById('play-game-btn');
const settingsIcon = document.getElementById('settings-icon');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings');
const customLogoInput = document.getElementById('custom-logo');
const logo = document.querySelector('.logo');
const textSizeSelect = document.getElementById('text-size');
const themeSelect = document.getElementById('theme-select');
const searchCountDisplay = document.getElementById('search-count');
const funFactDiv = document.getElementById('fun-fact');
const quizContainer = document.getElementById('quiz-container');
const searchSound = document.getElementById('search-sound');


let currentUser = null;

let searchCount = 0;
let safeSearch = false;
let autoSearch = false;
let suggestOn = true;
let delayMode = false;
let easterEggs = true;
let quizMode = true;
let sponsoredResults = false;
let soundFX = true;
let fakeVirus = false;
let chaosMode = false;

let lastSearchTerm = '';
let quizActive = false;
let quizInterval = null;


const funFacts = [
  "Floogle was created in 2025 to make searching fun!",
  "The first search engine was Archie, created in 1990.",
  "Did you know? The Internet weighs about the same as a strawberry.",
  "Floogle has a secret 90's mode that brings back retro vibes!",
  "Search engines use bots called spiders to crawl the web."
];

// Basic dummy search database
const dummyData = [
  {
    title: "Floogle Official",
    link: "https://floogle.com",
    snippet: "The home of the best fun search engine, Floogle."
  },
  {
    title: "Funny Cat Videos",
    link: "https://youtube.com/cats",
    snippet: "Watch hilarious cat videos on demand."
  },
  {
    title: "Learn JavaScript",
    link: "https://javascript.info",
    snippet: "Comprehensive JavaScript tutorials and examples."
  },
  {
    title: "Space Facts",
    link: "https://nasa.gov/spacefacts",
    snippet: "Explore amazing facts about the universe."
  },
  {
    title: "Retro Gaming",
    link: "https://retrogaming.com",
    snippet: "Your source for classic video games and consoles."
  },
  {
    title: "Math Blaster Game",
    link: "https://mathblaster.com",
    snippet: "Educational math games for kids of all ages."
  }
];

// Autocomplete suggestions
const suggestions = [
  "cats", "dogs", "javascript", "react", "space", "math", "music", "movies",
  "retro games", "news", "weather", "programming", "tutorials", "memes",
];

// Helper: play sound if enabled
function playSound() {
  if (soundFX) {
    searchSound.currentTime = 0;
    searchSound.play();
  }
}

// Update search count display
function updateSearchCount() {
  searchCountDisplay.textContent = `Searches: ${searchCount}`;
}

// --- UPDATED renderResults function ---
function renderResults(term) {
  resultsDiv.innerHTML = '';

  const filteredData = safeSearch
    ? dummyData.filter(r => !r.title.toLowerCase().includes('funny'))
    : dummyData;

  const matches = filteredData.filter(r =>
    r.title.toLowerCase().includes(term.toLowerCase()) ||
    r.snippet.toLowerCase().includes(term.toLowerCase())
  );

  matches.forEach(r => {
    const item = document.createElement('div');
    item.classList.add('result-item');
    item.innerHTML = `
      <a href="${r.link}" class="result-title" target="_blank" rel="noopener noreferrer">${r.title}</a>
      <div class="result-link">${r.link}</div>
      <div class="result-snippet">${r.snippet}</div>
    `;
    resultsDiv.appendChild(item);
  });

  const funnyTemplates = [
    "5 facts about ({term}) that will shock you!",
    "Why everyone is talking about ({term})",
    "The ultimate guide to ({term})",
    "Top 10 memes related to ({term})",
    "How ({term}) changed the world",
    "Secrets about ({term}) you didn't know",
    "Is ({term}) the next big thing? Experts weigh in"
  ];

  const funnyLinks = [
    "https://gettricked.net",
    "https://yournotsmart.co",
    "https://tomfoolery.info",
    "https://wikipodium.rizz",
    "https://info.pro",
    "https://newinformation.com",
    "https://freshavacado.net"
  ];

  for (let i = 0; i < funnyTemplates.length; i++) {
    const title = funnyTemplates[i].replace(/\(\{term\}\)/g, term);
    const fakeLink = funnyLinks[i];

    const item = document.createElement('div');
    item.classList.add('result-item');
    item.innerHTML = `
      <a href="${fakeLink}" class="result-title" target="_blank" rel="noopener noreferrer">${title}</a>
      <div class="result-link">${fakeLink}</div>
      <div class="result-snippet">Click here to find out more about "${term}"!</div>
    `;
    resultsDiv.appendChild(item);
  }

  if (matches.length === 0 && funnyTemplates.length === 0) {
    resultsDiv.innerHTML = `<p>No results found for <strong>${term}</strong>.</p>`;
  }
}
// --- END UPDATED renderResults ---

// Show autocomplete suggestions
function showSuggestions(value) {
  autocompleteList.innerHTML = '';
  if (!value || !suggestOn) return;
  const filtered = suggestions.filter(s => s.startsWith(value.toLowerCase())).slice(0, 5);
  filtered.forEach(s => {
    const div = document.createElement('div');
    div.textContent = s;
    div.addEventListener('click', () => {
      searchInput.value = s;
      autocompleteList.innerHTML = '';
      if (autoSearch) doSearch(s);
    });
    autocompleteList.appendChild(div);
  });
}

// Handle search action
function doSearch(term) {
  if (!term.trim()) return;
  lastSearchTerm = term;
  searchCount++;
  updateSearchCount();
  renderResults(term);
  playSound();

  if (quizMode && !quizActive && searchCount % 3 === 0) {
    startQuiz();
  }
}

 // Lucky button: open first matching result
function feelingLucky() {
  if (!lastSearchTerm) return;
  const filteredData = safeSearch ? dummyData.filter(r => !r.title.toLowerCase().includes('funny')) : dummyData;
  const firstMatch = filteredData.find(r => r.title.toLowerCase().includes(lastSearchTerm.toLowerCase()) || r.snippet.toLowerCase().includes(lastSearchTerm.toLowerCase()));
  if (firstMatch) {
    window.open(firstMatch.link, '_blank');
  }
}

}

// Settings panel toggle
settingsIcon.addEventListener('click', () => {
  settingsPanel.classList.toggle('show');
});
closeSettingsBtn.addEventListener('click', () => {
  settingsPanel.classList.remove('show');
});

// Sync settings inputs
customLogoInput.addEventListener('input', () => {
  logo.textContent = customLogoInput.value.trim() || "Floogle";
});
textSizeSelect.addEventListener('change', () => {
  document.body.classList.remove('small', 'medium', 'large');
  document.body.classList.add(textSizeSelect.value);
});
themeSelect.addEventListener('change', () => {
  document.body.className = '';
  document.body.classList.add(themeSelect.value);
  document.body.classList.add(textSizeSelect.value);
});

document.getElementById('toggle-safe').addEventListener('change', e => safeSearch = e.target.checked);
document.getElementById('toggle-auto').addEventListener('change', e => autoSearch = e.target.checked);
document.getElementById('toggle-suggest').addEventListener('change', e => suggestOn = e.target.checked);
document.getElementById('toggle-delay').addEventListener('change', e => delayMode = e.target.checked);
document.getElementById('toggle-easter').addEventListener('change', e => easterEggs = e.target.checked);
document.getElementById('toggle-quiz').addEventListener('change', e => quizMode = e.target.checked);
document.getElementById('toggle-sponsored').addEventListener('change', e => sponsoredResults = e.target.checked);
document.getElementById('toggle-sound').addEventListener('change', e => soundFX = e.target.checked);
document.getElementById('toggle-virus').addEventListener('change', e => fakeVirus = e.target.checked);
document.getElementById('toggle-chaos').addEventListener('change', e => chaosMode = e.target.checked);

// Search input autocomplete
searchInput.addEventListener('input', e => {
  if (delayMode) {
    clearTimeout(searchInput.delayTimeout);
    searchInput.delayTimeout = setTimeout(() => {
      if (autoSearch) doSearch(e.target.value);
    }, 800);
  } else {
    if (autoSearch) doSearch(e.target.value);
  }
  showSuggestions(e.target.value);
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const term = searchInput.value.trim();
  if (delayMode) {
    setTimeout(() => doSearch(term), 500);
  } else {
    doSearch(term);
  }
  autocompleteList.innerHTML = '';
});

luckyBtn.addEventListener('click', feelingLucky);

// Display a random fun fact every 20 seconds
function showFunFact() {
  funFactDiv.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
}
showFunFact();
setInterval(showFunFact, 20000);

// Quiz system
function startQuiz() {
  quizActive = true;
  quizContainer.innerHTML = '';
  const q = {
    question: "What year was Floogle created?",
    options: ["2023", "2024", "2025", "2026"],
    answer: 2
  };
  const quizEl = document.createElement('div');
  quizEl.innerHTML = `<p><strong>Quiz:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.margin = '4px';
    btn.onclick = () => {
      if (i === q.answer) {
        alert("Correct!");
      } else {
        alert("Wrong! Try again next time.");
      }
      quizContainer.innerHTML = '';
      quizActive = false;
    };
    quizEl.appendChild(btn);
  });
  quizContainer.appendChild(quizEl);
}

// ==== Game Hub and Minigames ====

const gameHub = document.getElementById('game-hub');
const gameContainer = document.getElementById('game-container');
const closeGameHubBtn = document.getElementById('close-game-hub');

playGameBtn.addEventListener('click', () => {
  gameHub.classList.remove('hidden');
  resultsDiv.style.display = 'none';
  quizContainer.style.display = 'none';
  funFactDiv.style.display = 'none';
  searchForm.style.display = 'none';
  logo.style.display = 'none';
});

closeGameHubBtn.addEventListener('click', () => {
  gameHub.classList.add('hidden');
  gameContainer.innerHTML = '';
  resultsDiv.style.display = 'block';
  quizContainer.style.display = 'block';
  funFactDiv.style.display = 'block';
  searchForm.style.display = 'block';
  logo.style.display = 'block';
});

// Helper to clear game state and listeners
function clearGame() {
  gameContainer.innerHTML = '';
  document.onkeydown = null;
  document.onkeyup = null;
}

// Game selection handler
gameHub.querySelectorAll('.game-list button').forEach(btn => {
  btn.addEventListener('click', () => {
    clearGame();
    const game = btn.getAttribute('data-game');
    switch (game) {
      case 'duck': startDuckCatcher(); break;
      case 'math': startMathBlaster(); break;
      case 'reaction': startReactionTest(); break;
      case 'memory': startMemoryFlip(); break;
      case 'dodge': startAvoidBombs(); break;
      case 'typing': startTypingSpeed(); break;
    }
  });
});

/* === 1. Duck Catcher === */
function startDuckCatcher() {
  gameContainer.innerHTML = `
    <h3>Duck Catcher 🐤</h3>
    <p>Click as many ducks as you can in 15 seconds!</p>
    <div id="duck-game-area" style="position:relative; width:300px; height:300px; background:#def; border:2px solid #333; margin:auto; border-radius:8px; user-select:none;"></div>
    <p id="duck-score">Score: 0</p>
    <button id="duck-start">Start</button>
  `;

  const gameArea = document.getElementById('duck-game-area');
  const scoreDisplay = document.getElementById('duck-score');
  const startBtn = document.getElementById('duck-start');

  let score = 0;
  let intervalId = null;
  let timeLeft = 15;
  let countdownId = null;

  startBtn.onclick = () => {
    score = 0;
    timeLeft = 15;
    scoreDisplay.textContent = `Score: ${score}`;
    startBtn.disabled = true;
    gameArea.innerHTML = '';

    intervalId = setInterval(() => {
      const duck = document.createElement('div');
      duck.classList.add('duck');
      duck.style.top = Math.random() * (300 - 40) + 'px';
      duck.style.left = Math.random() * (300 - 40) + 'px';
      duck.title = "Click me!";
      duck.onclick = () => {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        duck.remove();
      };
      gameArea.appendChild(duck);
      setTimeout(() => {
        if (duck.parentElement) duck.remove();
      }, 1000);
    }, 600);

    countdownId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        clearInterval(countdownId);
        alert(`Time's up! Your score: ${score}`);
        startBtn.disabled = false;
        gameArea.innerHTML = '';
      }
    }, 1000);
  };
}

/* === 2. Math Blaster === */
function startMathBlaster() {
  gameContainer.innerHTML = `
    <h3>Math Blaster 🧠</h3>
    <p>Solve as many math problems as you can in 30 seconds!</p>
    <div id="math-question"></div>
    <input id="math-answer" type="number" autocomplete="off" />
    <button id="math-submit">Submit</button>
    <p id="math-feedback"></p>
    <p id="math-score">Score: 0</p>
    <button id="math-start">Start</button>
  `;

  const questionEl = document.getElementById('math-question');
  const answerInput = document.getElementById('math-answer');
  const submitBtn = document.getElementById('math-submit');
  const feedbackEl = document.getElementById('math-feedback');
  const scoreEl = document.getElementById('math-score');
  const startBtn = document.getElementById('math-start');

  let correctAnswer = null;
  let score = 0;
  let timeLeft = 30;
  let timerId = null;
  let active = false;

  function newQuestion() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let qText = '';
    switch (op) {
      case '+': correctAnswer = a + b; qText = `${a} + ${b} = ?`; break;
      case '-': correctAnswer = a - b; qText = `${a} - ${b} = ?`; break;
      case '*': correctAnswer = a * b; qText = `${a} × ${b} = ?`; break;
    }
    questionEl.textContent = qText;
    feedbackEl.textContent = '';
    answerInput.value = '';
    answerInput.focus();
  }

  function endGame() {
    active = false;
    clearInterval(timerId);
    feedbackEl.textContent = `Game over! Final score: ${score}`;
    startBtn.disabled = false;
    submitBtn.disabled = true;
    answerInput.disabled = true;
  }

  submitBtn.onclick = () => {
    if (!active) return;
    const val = parseInt(answerInput.value, 10);
    if (val === correctAnswer) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      feedbackEl.textContent = 'Correct!';
    } else {
      feedbackEl.textContent = 'Wrong, try again!';
    }
    newQuestion();
  };

  startBtn.onclick = () => {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = 'Score: 0';
    feedbackEl.textContent = '';
    answerInput.disabled = false;
    submitBtn.disabled = false;
    startBtn.disabled = true;
    active = true;
    newQuestion();

    timerId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  };
}

/* === 3. Reaction Test === */
function startReactionTest() {
  gameContainer.innerHTML = `
    <h3>Reaction Test ⚡</h3>
    <p>Click the box as soon as it turns green!</p>
    <div id="reaction-box"></div>
    <p id="reaction-message"></p>
    <button id="reaction-start">Start</button>
  `;

  const box = document.getElementById('reaction-box');
  const message = document.getElementById('reaction-message');
  const startBtn = document.getElementById('reaction-start');

  let timeoutId = null;
  let startTime = 0;
  let waiting = false;

  box.classList.remove('ready');
  message.textContent = '';

  startBtn.onclick = () => {
    box.classList.remove('ready');
    message.textContent = 'Wait for green...';
    startBtn.disabled = true;
    waiting = true;

    const delay = Math.floor(Math.random() * 4000) + 2000;
    timeoutId = setTimeout(() => {
      box.classList.add('ready');
      startTime = Date.now();
      message.textContent = 'Click!';
      waiting = false;
    }, delay);
  };

  box.onclick = () => {
    if (waiting) {
      // Too early
      clearTimeout(timeoutId);
      message.textContent = 'Too soon! Click Start to try again.';
      startBtn.disabled = false;
      waiting = false;
    } else if (box.classList.contains('ready')) {
      const reactionTime = Date.now() - startTime;
      message.textContent = `Your reaction time: ${reactionTime} ms`;
      box.classList.remove('ready');
      startBtn.disabled = false;
    }
  };
}

/* === 4. Memory Flip === */
function startMemoryFlip() {
  gameContainer.innerHTML = `
    <h3>Memory Flip 🃏</h3>
    <p>Match all pairs by flipping cards.</p>
    <div id="memory-grid"></div>
    <p id="memory-message"></p>
    <button id="memory-reset">Restart</button>
  `;

  const grid = document.getElementById('memory-grid');
  const message = document.getElementById('memory-message');
  const resetBtn = document.getElementById('memory-reset');

  // Cards (8 pairs)
  const cardsData = ['🍎', '🐱', '🚗', '🌟', '🎵', '🍕', '⚽', '🐠'];
  let cards = [...cardsData, ...cardsData];
  cards = shuffle(cards);

  let flippedCards = [];
  let matchedCount = 0;
  let busy = false;

  function shuffle(array) {
    for(let i = array.length -1; i >0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCard(content, index) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.index = index;
    card.textContent = '';
    card.onclick = () => {
      if (busy || card.classList.contains('flipped')) return;
      flipCard(card);
    };
    card.dataset.content = content;
    return card;
  }

  function flipCard(card) {
    if (flippedCards.length === 2) return;
    card.classList.add('flipped');
    card.textContent = card.dataset.content;
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  function checkMatch() {
    busy = true;
    const [c1, c2] = flippedCards;
    if (c1.dataset.content === c2.dataset.content) {
      matchedCount++;
      flippedCards = [];
      busy = false;
      if (matchedCount === cardsData.length) {
        message.textContent = "You matched all pairs! 🎉";
      }
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c1.textContent = '';
        c2.classList.remove('flipped');
        c2.textContent = '';
        flippedCards = [];
        busy = false;
      }, 1000);
    }
  }

  function setup() {
    grid.innerHTML = '';
    cards = shuffle(cardsData.concat(cardsData));
    matchedCount = 0;
    flippedCards = [];
    busy = false;
    message.textContent = '';
    for(let i=0; i<cards.length; i++) {
      const card = createCard(cards[i], i);
      grid.appendChild(card);
    }
  }

  resetBtn.onclick = () => {
    setup();
  };

  setup();
}

/* === 5. Avoid the Bombs === */
function startAvoidBombs() {
  gameContainer.innerHTML = `
    <h3>Avoid the Bombs 💣</h3>
    <p>Use arrow keys (or WASD) to move. Avoid falling bombs!</p>
    <div id="dodge-game-area"></div>
    <p id="dodge-score">Score: 0</p>
    <button id="dodge-start">Start</button>
  `;

  const gameArea = document.getElementById('dodge-game-area');
  const scoreDisplay = document.getElementById('dodge-score');
  const startBtn = document.getElementById('dodge-start');

  const width = 320;
  const height = 320;
  const playerSize = 40;
  const bombSize = 30;

  let playerX = width / 2 - playerSize / 2;
  let playerY = height - playerSize - 10;
  let bombs = [];
  let score = 0;
  let intervalId = null;
  let bombSpeed = 3;
  let gameOver = false;

  let keys = {};

  function createBomb() {
    const x = Math.random() * (width - bombSize);
    return { x, y: 0 };
  }

  function draw() {
    gameArea.innerHTML = '';
    // Draw player
    const player = document.createElement('div');
    player.id = 'player-square';
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    gameArea.appendChild(player);
    // Draw bombs
    bombs.forEach(b => {
      const bomb = document.createElement('div');
      bomb.classList.add('bomb');
      bomb.style.left = b.x + 'px';
      bomb.style.top = b.y + 'px';
      gameArea.appendChild(bomb);
    });
  }

  function update() {
    if (gameOver) return;

    // Move player
    if (keys['ArrowLeft'] || keys['a']) {
      playerX = Math.max(0, playerX - 6);
    }
    if (keys['ArrowRight'] || keys['d']) {
      playerX = Math.min(width - playerSize, playerX + 6);
    }
    if (keys['ArrowUp'] || keys['w']) {
      playerY = Math.max(0, playerY - 6);
    }
    if (keys['ArrowDown'] || keys['s']) {
      playerY = Math.min(height - playerSize, playerY + 6);
    }

    // Move bombs
    bombs.forEach(b => {
      b.y += bombSpeed;
    });

    // Remove bombs that left screen & add score
    bombs = bombs.filter(b => {
      if (b.y > height) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        return false;
      }
      return true;
    });

    // Randomly add new bombs
    if (Math.random() < 0.04) {
      bombs.push(createBomb());
    }

    // Check collisions
    for (const b of bombs) {
      if (
        b.x < playerX + playerSize &&
        b.x + bombSize > playerX &&
        b.y < playerY + playerSize &&
        b.y + bombSize > playerY
      ) {
        gameOver = true;
        alert(`Game Over! Your score: ${score}`);
        clearInterval(intervalId);
        startBtn.disabled = false;
        return;
      }
    }

    draw();
  }

  startBtn.onclick = () => {
    bombs = [];
    score = 0;
    gameOver = false;
    playerX = width / 2 - playerSize / 2;
    playerY = height - playerSize - 10;
    scoreDisplay.textContent = `Score: 0`;
    startBtn.disabled = true;
    draw();
    intervalId = setInterval(update, 20);
  };

  document.onkeydown = e => {
    keys[e.key] = true;
  };
  document.onkeyup = e => {
    keys[e.key] = false;
  };
}

/* === 6. Typing Speed === */
function startTypingSpeed() {
  gameContainer.innerHTML = `
    <h3>Typing Speed Test ⌨️</h3>
    <p>Type the sentence as fast and accurately as you can!</p>
    <div id="typing-text"></div>
    <input id="typing-input" type="text" autocomplete="off" />
    <p id="typing-message"></p>
    <button id="typing-start">Start</button>
  `;

  const textEl = document.getElementById('typing-text');
  const inputEl = document.getElementById('typing-input');
  const messageEl = document.getElementById('typing-message');
  const startBtn = document.getElementById('typing-start');

  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Floogle is a fun and quirky search engine.",
    "JavaScript is a versatile programming language.",
    "Typing tests improve your keyboard skills."
  ];

  let currentSentence = '';
  let startTime = 0;
  let finished = false;

  startBtn.onclick = () => {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    textEl.textContent = currentSentence;
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.focus();
    messageEl.textContent = '';
    finished = false;
    startTime = Date.now();
    startBtn.disabled = true;
  };

  inputEl.addEventListener('input', () => {
    if (finished) return;
    if (inputEl.value === currentSentence) {
      finished = true;
      const timeTaken = (Date.now() - startTime) / 1000;
      messageEl.textContent = `Well done! Time: ${timeTaken.toFixed(2)} seconds`;
      inputEl.disabled = true;
      startBtn.disabled = false;
    }
  });
}

