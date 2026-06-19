(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      nav.hidden = expanded;
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-slide") || 0);
        show(index);
        start();
      });
    });

    var hero = document.querySelector(".hero-slider");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }
    start();
  }

  function collectText(card) {
    var fields = [
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-type"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-year"),
      card.textContent
    ];
    return fields.join(" ").toLowerCase();
  }

  function initFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".site-search"));
    var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
    var lists = Array.prototype.slice.call(document.querySelectorAll(".searchable-list"));
    if (!inputs.length && !chips.length) {
      return;
    }

    var activeChip = "";

    function apply() {
      var query = inputs.map(function (input) {
        return input.value.trim().toLowerCase();
      }).filter(Boolean).join(" ");
      var keyword = [query, activeChip.toLowerCase()].filter(Boolean).join(" ");

      lists.forEach(function (list) {
        var cards = Array.prototype.slice.call(list.children).filter(function (child) {
          return child.matches(".movie-card, .rank-item");
        });
        var visibleCount = 0;
        cards.forEach(function (card) {
          var text = collectText(card);
          var visible = !keyword || keyword.split(/\s+/).every(function (word) {
            return text.indexOf(word) !== -1;
          });
          card.hidden = !visible;
          if (visible) {
            visibleCount += 1;
          }
        });
        var empty = list.parentElement.querySelector(".empty-result");
        if (empty) {
          empty.hidden = visibleCount !== 0;
        }
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", apply);
    });

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (item) {
          item.classList.remove("active");
        });
        chip.classList.add("active");
        activeChip = chip.getAttribute("data-filter") || "";
        apply();
      });
    });

    if (chips[0]) {
      chips[0].classList.add("active");
    }
  }

  function initPlayer() {
    var video = document.getElementById("movie-player");
    var config = document.getElementById("play-config");
    var button = document.getElementById("play-button");
    var shell = document.querySelector(".player-shell");
    var message = document.querySelector(".player-message");
    if (!video || !config || !button || !shell) {
      return;
    }

    var src = "";
    var hls = null;
    var started = false;

    try {
      src = JSON.parse(config.textContent || "{}").src || "";
    } catch (error) {
      src = "";
    }

    function revealMessage() {
      if (message) {
        message.hidden = false;
      }
    }

    function attach() {
      if (!src) {
        revealMessage();
        return false;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        return true;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return true;
      }
      revealMessage();
      return false;
    }

    function begin() {
      if (!started) {
        started = attach();
      }
      if (!started) {
        return;
      }
      button.classList.add("is-hidden");
      video.play().catch(function () {
        button.classList.remove("is-hidden");
      });
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      begin();
    });

    shell.addEventListener("click", function (event) {
      if (event.target === shell) {
        begin();
      }
    });

    video.addEventListener("click", function () {
      if (!started) {
        begin();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
