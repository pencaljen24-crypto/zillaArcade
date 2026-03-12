const games = [
  {
    "id": "2048",
    "title": "2048",
    "description": "Join the numbers and get to the 2048 tile!",
    "url": "https://play2048.co/",
    "thumbnail": "https://picsum.photos/seed/2048/400/300"
  },
  {
    "id": "hextris",
    "title": "Hextris",
    "description": "Fast-paced puzzle game inspired by Tetris.",
    "url": "https://hextris.io/",
    "thumbnail": "https://picsum.photos/seed/hextris/400/300"
  },
  {
    "id": "flappy-bird",
    "title": "Flappy Bird (Clone)",
    "description": "The classic bird-flapping challenge.",
    "url": "https://flappybird.io/",
    "thumbnail": "https://picsum.photos/seed/bird/400/300"
  },
  {
    "id": "snake",
    "title": "Snake",
    "description": "Classic snake game. Eat the food, grow longer.",
    "url": "https://www.google.com/logos/2010/pacman10-i.html",
    "thumbnail": "https://picsum.photos/seed/snake/400/300"
  },
  {
    "id": "tetris",
    "title": "Tetris",
    "description": "The world-famous block-stacking puzzle game.",
    "url": "https://tetris.com/play-tetris",
    "thumbnail": "https://picsum.photos/seed/tetris/400/300"
  },
  {
    "id": "slope",
    "title": "Slope",
    "description": "Drive a ball down a steep slope. Avoid obstacles.",
    "url": "https://slopegame.io/",
    "thumbnail": "https://picsum.photos/seed/slope/400/300"
  }
];

const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const libraryView = document.getElementById('libraryView');
const playerView = document.getElementById('playerView');
const gameIframe = document.getElementById('gameIframe');
const playerTitle = document.getElementById('playerTitle');
const playerDescription = document.getElementById('playerDescription');
const iframeContainer = document.getElementById('iframeContainer');
const recentSection = document.getElementById('recentSection');
const recentGrid = document.getElementById('recentGrid');

let isFullscreen = false;
let recentGames = JSON.parse(localStorage.getItem('recentGames') || '[]');

function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'glass-card group cursor-pointer rounded-2xl overflow-hidden';
  card.onclick = () => playGame(game);
  
  card.innerHTML = `
    <div class="aspect-video overflow-hidden relative">
      <img 
        src="${game.thumbnail}" 
        alt="${game.title}"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerpolicy="no-referrer"
      >
      <div class="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-colors flex items-center justify-center">
        <div class="bg-white text-black p-3 rounded-full opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"></rect><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"></path></svg>
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col gap-1">
      <h3 class="font-bold text-lg group-hover:text-indigo-400 transition-colors">${game.title}</h3>
      <p class="text-sm text-white/40 line-clamp-2">${game.description}</p>
    </div>
  `;
  return card;
}

function renderGames(filteredGames) {
  gameGrid.innerHTML = '';
  
  if (filteredGames.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    filteredGames.forEach(game => {
      gameGrid.appendChild(createGameCard(game));
    });
  }
}

function renderRecentGames() {
  if (recentGames.length === 0) {
    recentSection.classList.add('hidden');
    return;
  }

  recentSection.classList.remove('hidden');
  recentGrid.innerHTML = '';
  // Show only top 4 recent games
  recentGames.slice(0, 4).forEach(game => {
    recentGrid.appendChild(createGameCard(game));
  });
}

function addToRecent(game) {
  // Remove if already exists to move to top
  recentGames = recentGames.filter(g => g.id !== game.id);
  recentGames.unshift(game);
  // Keep only last 8
  recentGames = recentGames.slice(0, 8);
  localStorage.setItem('recentGames', JSON.stringify(recentGames));
  renderRecentGames();
}

function playGame(game) {
  libraryView.classList.add('hidden');
  playerView.classList.remove('hidden');
  gameIframe.src = game.url;
  playerTitle.textContent = game.title;
  playerDescription.textContent = game.description;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  addToRecent(game);
}

function showLibrary() {
  playerView.classList.add('hidden');
  libraryView.classList.remove('hidden');
  gameIframe.src = '';
  setIsFullscreen(false);
  renderRecentGames();
}

function toggleFullscreen() {
  setIsFullscreen(!isFullscreen);
}

function setIsFullscreen(value) {
  isFullscreen = value;
  if (isFullscreen) {
    iframeContainer.classList.add('fixed', 'inset-0', 'z-50', 'rounded-none');
    iframeContainer.classList.remove('aspect-video', 'rounded-2xl');
  } else {
    iframeContainer.classList.remove('fixed', 'inset-0', 'z-50', 'rounded-none');
    iframeContainer.classList.add('aspect-video', 'rounded-2xl');
  }
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = games.filter(game => 
    game.title.toLowerCase().includes(query) || 
    game.description.toLowerCase().includes(query)
  );
  renderGames(filtered);
});

// Initial render
renderGames(games);
renderRecentGames();
