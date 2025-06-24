const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');
const searchSound = document.getElementById('search-sound');
const searchCountDisplay = document.getElementById('search-count');
const luckyBtn = document.getElementById('lucky-btn');
const funFactDiv = document.getElementById('fun-fact');
const themeSelect = document.getElementById('theme-select');
const autocompleteList = document.getElementById('autocomplete-list');
const quizContainer = document.getElementById('quiz-container');

let searchCount = 0;
let history = [];

const fakeDomains = ["floogle.com", "funsearch.net", "quackpedia.org", "randomresults.xyz", "fakelink.co"];
const snippets = [
  "Probably unrelated, but still interesting.",
  "This has nothing to do with your search. Enjoy!",
  "Possibly useful, possibly not.",
  "Here's something that might surprise you.",
  "This may or may not be fake news.",
  "Sponsored: Buy Floogle-branded socks!",
  "You won't believe what happened next...",
  "Not clickbait. We promise.",
  "Definitely a real website.",
  "Fact-checked by imaginary experts."
];

const autocompleteWords = ["duck facts", "cat memes", "floogle dance", "why is the sky blue", "how to fake a search engine", "random nonsense", "top 10 dinosaurs"];

const funFacts = [
  "Floogle is the #1 search engine in the Multiverse.",
  "You just searched faster than 98% of our users.",
  "The word 'floogle' means 'to pretend to search'.",
  "No ducks were harmed in the making of this search engine.",
  "You searched. We delivered (kinda)."
];

const easterEggs = {
  "do a barrel roll": () => document.body.style.transform = "rotate(360deg)",
  "floogle rules": () => alert("Floogle is love, Floogle is life."),
  "konami code": () => alert("🎮 You've unlocked god mode (in your imagination).")
};

const quiz = {
  question: "What color is the Floogle logo?",
  options: ["Red", "Blue", "Green", "Invisible"],
  answer: "Blue"
};

themeSelect.addEventListener('change', () => {
  document.body.className = themeSelect.value;
});

function updateSearchCount() {
  searchCount++;
  searchCountDisplay.textContent = `Searches: ${searchCount}`;
  localStorage.setItem('floogleCount', searchCount);
}

function generateResults(query) {
  if (easterEggs[query.toLowerCase()]) {
    easterEggs[query.toLowerCase()]();
    return [];
  }

  const count = 7 + Math.floor(Math.random() * 4);
  const results = [];
  for (let i = 0; i < count; i++) {
    const title = `${query} - ${["Guide", "Tips", "Info", "Secrets", "Myths"][i % 5]}`;
    const domain = fakeDomains[Math.floor(Math.random() * fakeDomains.length)];
    const url = `https://${domain}/${query.replace(/\s+/g, '-')}/${i + 1}`;
    const snippet = snippets[Math.floor(Math.random() * snippets.length)];
    results.push({ title, url, snippet });
  }
  return results;
}

function renderResults(results) {
  resultsDiv.innerHTML = "";
  results.forEach(res => {
    const div = document.createElement("div");
    div.className = "result-item";

    const link = document.createElement("a");
    link.href = res.url;
    link.className = "result-title";
    link.textContent = res.title;
    link.target = "_blank";

    const url = document.createElement("div");
    url.className = "result-link";
    url.textContent = res.url;

    const snippet = document.createElement("div");
    snippet.className = "result-snippet";
    snippet.textContent = res.snippet;

    div.appendChild(link);
    div.appendChild(url);
    div.appendChild(snippet);
    resultsDiv.appendChild(div);
  });
}

function showFunFact() {
  funFactDiv.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
}

function showQuiz() {
  const qDiv = document.createElement("div");
  qDiv.innerHTML = `<strong>${quiz.question}</strong><br>`;
  quiz.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === quiz.answer) {
        alert("Correct! 🎉");
      } else {
        alert("Wrong! Try again.");
      }
    };
    qDiv.appendChild(btn);
  });
  quizContainer.innerHTML = "";
  quizContainer.appendChild(qDiv);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  updateSearchCount();
  searchSound.play();
  history.push(query);
  renderResults(generateResults(query));
  showFunFact();
  showQuiz();
});

luckyBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (!query) return;
  const res = generateResults(query);
  if (res.length > 0) window.open(res[0].url, "_blank");
});

input.addEventListener("input", () => {
  const val = input.value.toLowerCase();
  autocompleteList.innerHTML = "";
  if (!val) return;
  const matches = autocompleteWords.filter(word => word.startsWith(val));
  matches.forEach(match => {
    const div = document.createElement("div");
    div.textContent = match;
    div.onclick = () => {
      input.value = match;
      autocompleteList.innerHTML = "";
    };
    autocompleteList.appendChild(div);
  });
});

// Restore search count
const stored = localStorage.getItem("floogleCount");
if (stored) {
  searchCount = parseInt(stored);
  searchCountDisplay.textContent = `Searches: ${searchCount}`;
}

