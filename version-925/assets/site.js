const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.hero-dot'));
let heroIndex = 0;
let heroTimer = null;

function showHero(index) {
  if (!heroSlides.length) {
    return;
  }
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === heroIndex);
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === heroIndex);
  });
}

function startHero() {
  if (heroSlides.length < 2) {
    return;
  }
  heroTimer = window.setInterval(() => {
    showHero(heroIndex + 1);
  }, 5200);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }
    showHero(index);
    startHero();
  });
});

showHero(0);
startHero();

const searchInputs = Array.from(document.querySelectorAll('.search-input'));
const filterSelects = Array.from(document.querySelectorAll('.filter-select'));

function filterCards() {
  const cards = Array.from(document.querySelectorAll('.movie-card'));
  const query = searchInputs.map(input => input.value.trim().toLowerCase()).find(Boolean) || '';
  const selected = filterSelects.map(select => select.value).find(Boolean) || '';
  cards.forEach(card => {
    const text = (card.getAttribute('data-search') || '').toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesSelected = !selected || text.includes(selected.toLowerCase());
    card.style.display = matchesQuery && matchesSelected ? '' : 'none';
  });
}

searchInputs.forEach(input => {
  input.addEventListener('input', filterCards);
});

filterSelects.forEach(select => {
  select.addEventListener('change', filterCards);
});
