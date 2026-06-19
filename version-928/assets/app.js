(function () {
  var nav = document.querySelector('.main-nav');
  var toggle = document.querySelector('.menu-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-missing');
    }, { once: true });
  });

  var hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function () {
      var move = Math.min(window.scrollY * 0.18, 80);
      hero.style.backgroundPosition = 'center calc(50% + ' + move + 'px)';
    }, { passive: true });
  }

  var searchInput = document.querySelector('[data-filter-search]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!items.length) {
      return;
    }
    var keyword = normalize(searchInput && searchInput.value);
    var region = normalize(regionFilter && regionFilter.value);
    var type = normalize(typeFilter && typeFilter.value);
    var year = normalize(yearFilter && yearFilter.value);
    var visible = 0;

    items.forEach(function (item) {
      var text = normalize(item.getAttribute('data-search-text'));
      var ok = true;
      if (keyword && text.indexOf(keyword) === -1) {
        ok = false;
      }
      if (region && normalize(item.getAttribute('data-region')) !== region) {
        ok = false;
      }
      if (type && normalize(item.getAttribute('data-type')) !== type) {
        ok = false;
      }
      if (year && normalize(item.getAttribute('data-year')) !== year) {
        ok = false;
      }
      item.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  [searchInput, regionFilter, typeFilter, yearFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
    applyFilters();
  }

  function attachPlayer(player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');
    var src = player.getAttribute('data-video-src');
    var ready = false;

    function prepare() {
      if (ready || !video || !src) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        player.__hls = hls;
      } else {
        video.src = src;
      }
    }

    function play() {
      prepare();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
    }
  }

  document.querySelectorAll('[data-video-src]').forEach(attachPlayer);
})();
