(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startHero() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.dataset.slide || 0));
        startHero();
      });
    });

    showSlide(0);
    startHero();
  }

  var filterGroup = document.querySelector('[data-filter-group]');
  var cardList = document.querySelector('[data-card-list]');

  if (filterGroup && cardList) {
    var filterButtons = Array.prototype.slice.call(filterGroup.querySelectorAll('button'));
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.dataset.filter || 'all';

        filterButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });

        cards.forEach(function (card) {
          var text = [card.dataset.genre, card.dataset.tags, card.dataset.type, card.dataset.region].join(' ');
          card.hidden = value !== 'all' && text.indexOf(value) === -1;
        });
      });
    });
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-cover');
    var source = video ? video.dataset.src : '';
    var initialized = false;
    var hls = null;

    function initPlayer() {
      if (!video || initialized || !source) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      }
    }

    function playVideo() {
      initPlayer();

      if (button) {
        button.classList.add('hidden');
      }

      if (video) {
        var request = video.play();

        if (request && typeof request.catch === 'function') {
          request.catch(function () {
            if (button) {
              button.classList.remove('hidden');
            }
          });
        }
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });

      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('hidden');
        }
      });

      video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
          button.classList.remove('hidden');
        }
      });
    }
  });

  var searchForm = document.querySelector('[data-search-form]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchStatus = document.querySelector('[data-search-status]');

  if (searchForm && searchResults && window.MOVIE_INDEX) {
    var searchInput = searchForm.querySelector('input[name="q"]');
    var typeSelect = searchForm.querySelector('select[name="type"]');
    var params = new URLSearchParams(window.location.search);

    if (params.get('q')) {
      searchInput.value = params.get('q');
    }

    function cardTemplate(movie) {
      return [
        '<article class="movie-card">',
        '<a class="poster-shell" href="./' + movie.file + '">',
        '<img src="' + movie.cover + '" alt="' + movie.title + ' 海报" loading="lazy" onerror="this.style.display=\'none\'; this.parentElement.classList.add(\'is-empty\');">',
        '<span class="poster-badge">' + movie.year + '</span>',
        '</a>',
        '<div class="card-body">',
        '<div class="card-meta"><span>' + movie.region + '</span><span>' + movie.type + '</span></div>',
        '<h3><a href="./' + movie.file + '">' + movie.title + '</a></h3>',
        '<p>' + movie.oneLine + '</p>',
        '<div class="tag-row"><span>' + movie.category + '</span><span>' + movie.year + '</span></div>',
        '</div>',
        '</article>'
      ].join('');
    }

    function runSearch() {
      var query = (searchInput.value || '').trim().toLowerCase();
      var type = typeSelect.value || 'all';

      if (!query && type === 'all') {
        searchResults.innerHTML = '';
        searchStatus.textContent = '输入关键词后显示匹配影片';
        return;
      }

      var result = window.MOVIE_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.category, movie.oneLine].join(' ').toLowerCase();
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchType = type === 'all' || movie.type === type;
        return matchQuery && matchType;
      }).slice(0, 120);

      searchResults.innerHTML = result.map(cardTemplate).join('');
      searchStatus.textContent = result.length ? '已显示匹配影片' : '没有找到匹配影片';
    }

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch();
    });

    searchInput.addEventListener('input', runSearch);
    typeSelect.addEventListener('change', runSearch);
    runSearch();
  }
})();
