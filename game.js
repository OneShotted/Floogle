// Floogle fake search simulation

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

// Some fake domains for the links
const fakeDomains = [
  "floogle.com",
  "funsearch.net",
  "quackpedia.org",
  "randomresults.xyz",
  "bestsearch.io",
  "fakelink.co",
  "searchfunny.biz"
];

// Some quirky snippets
const snippets = [
  "Discover the secrets behind the universe — or maybe just some funny cat videos.",
  "This site contains totally accurate and trustworthy information (probably).",
  "Looking for answers? You're halfway there!",
  "Here lies the answer to all your questions, and some you never thought to ask.",
  "Find out why the sky is blue, or why pizza tastes so good.",
  "A mysterious place where all your search dreams come true.",
  "Uncover hidden gems from the vast depths of the internet.",
  "Where random meets genius and everything is slightly weird.",
  "Experience the joy of unexpected results every time you search.",
  "Your one-stop destination for fun facts and silly tidbits."
];

// Helper to pick random item from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate fake search results based on query
function generateResults(query) {
  const numResults = 7 + Math.floor(Math.random() * 4); // 7 to 10 results

  let results = [];
  for (let i = 0; i < numResults; i++) {
    const title = generateTitle(query, i);
    const domain = randomChoice(fakeDomains);
    const url = `https://${domain}/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}/${i+1}`;
    const snippet = randomChoice(snippets);

    results.push({title, url, snippet});
  }
  return results;
}

// Generate quirky titles incorporating the query
function generateTitle(query, index) {
  const templates = [
    `All about "${query}"`,
    `${query} - Explained!`,
    `Top 10 facts about ${query}`,
    `Why ${query} is so cool`,
    `Learn ${query} in 5 minutes`,
    `The ultimate guide to ${query}`,
    `${query}: Everything you need to know`,
    `The surprising truth about ${query}`,
    `How ${query} changed the world`,
    `Fun with ${query}!`
  ];
  return templates[index % templates.length];
}

// Render the results into the page
function renderResults(results) {
  resultsDiv.innerHTML = "";
  if (results.length === 0) {
    resultsDiv.textContent = "No results found. Try searching for something else!";
    return;
  }
  results.forEach(res => {
    const item = document.createElement('div');
    item.className = "result-item";

    const link = document.createElement('a');
    link.href = res.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "result-title";
    link.textContent = res.title;

    const domain = document.createElement('span');
    domain.className = "result-link";
    domain.textContent = res.url;

    const snippet = document.createElement('p');
    snippet.className = "result-snippet";
    snippet.textContent = res.snippet;

    item.appendChild(link);
    item.appendChild(domain);
    item.appendChild(snippet);

    resultsDiv.appendChild(item);
  });
}

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  const results = generateResults(query);
  renderResults(results);
});
