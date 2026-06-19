document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initQuerySearch();
    initImageFallbacks();
});

function initMenu() {
    const button = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-nav-links]');

    if (!button || !nav) {
        return;
    }

    button.addEventListener('click', function () {
        nav.classList.toggle('open');
    });
}

function initHero() {
    const hero = document.querySelector('[data-hero]');

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let activeIndex = 0;
    let timer = null;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    }

    function startTimer() {
        stopTimer();
        timer = window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    function stopTimer() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            startTimer();
        });
    });

    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);

    showSlide(0);
    startTimer();
}

function initFilters() {
    const searchInput = document.getElementById('movieSearch');
    const grid = document.querySelector('.filterable-grid');
    const countNode = document.querySelector('[data-result-count]');
    const buttons = Array.from(document.querySelectorAll('[data-filter]'));

    if (!grid) {
        return;
    }

    const cards = Array.from(grid.querySelectorAll('.movie-card'));
    let activeFilter = 'all';

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
        const query = normalize(searchInput ? searchInput.value : '');
        let visible = 0;

        cards.forEach(function (card) {
            const haystack = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.genre,
                card.dataset.year,
                card.dataset.category,
                card.textContent
            ].join(' '));

            const matchesQuery = !query || haystack.includes(query);
            const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
            const shouldShow = matchesQuery && matchesFilter;

            card.style.display = shouldShow ? '' : 'none';

            if (shouldShow) {
                visible += 1;
            }
        });

        if (countNode) {
            countNode.textContent = '正在显示 ' + visible + ' 部影片';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            buttons.forEach(function (item) {
                item.classList.remove('active');
            });

            button.classList.add('active');
            activeFilter = button.dataset.filter || 'all';
            applyFilter();
        });
    });

    applyFilter();
}

function initQuerySearch() {
    const input = document.getElementById('movieSearch');

    if (!input) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query) {
        input.value = query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function initImageFallbacks() {
    const images = Array.from(document.querySelectorAll('img'));

    images.forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('image-not-found');
            image.alt = image.alt || '影片封面';
        }, { once: true });
    });
}
