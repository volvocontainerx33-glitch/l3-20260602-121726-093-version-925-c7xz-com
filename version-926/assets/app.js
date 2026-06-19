(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var navigation = document.querySelector('[data-navigation]');

    if (menuButton && navigation) {
        menuButton.addEventListener('click', function () {
            navigation.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeSlide = 0;
    var slideTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
            slide.classList.toggle('is-active', current === activeSlide);
        });
        dots.forEach(function (dot, current) {
            dot.classList.toggle('is-active', current === activeSlide);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        clearInterval(slideTimer);
        slideTimer = setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function filterCards() {
        if (!searchInput || !cards.length) {
            return;
        }
        var keyword = searchInput.value.trim().toLowerCase();
        var visibleCount = 0;
        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-genre') || '',
                card.getAttribute('data-year') || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            var matched = haystack.indexOf(keyword) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visibleCount += 1;
            }
        });
        if (emptyState) {
            emptyState.classList.toggle('is-visible', visibleCount === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    var configElement = document.getElementById('video-config');
    var video = document.getElementById('player-video');
    var cover = document.querySelector('[data-player-cover]');

    if (configElement && video && cover) {
        var videoConfig = {};
        try {
            videoConfig = JSON.parse(configElement.textContent || '{}');
        } catch (error) {
            videoConfig = {};
        }
        var loaded = false;
        function loadVideo() {
            if (loaded || !videoConfig.src) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoConfig.src;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(videoConfig.src);
                hls.attachMedia(video);
            } else {
                video.src = videoConfig.src;
            }
        }
        function startVideo() {
            loadVideo();
            cover.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        }
        cover.addEventListener('click', startVideo);
        video.addEventListener('click', function () {
            if (!loaded) {
                startVideo();
            }
        });
    }
})();
