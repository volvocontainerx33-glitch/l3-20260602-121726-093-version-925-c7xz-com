import { H as Hls } from "./video-player.esm.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-site-nav]");
  if (!toggle || !nav) {
    return;
  }
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function setupHero() {
  const root = $("[data-hero]");
  if (!root) {
    return;
  }

  const slides = $$(".hero-slide", root);
  const dots = $$("[data-hero-dot]", root);
  if (slides.length <= 1) {
    return;
  }

  let active = 0;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === active));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => show(index));
  });

  window.setInterval(() => show(active + 1), 5200);
}

function setupImageFallback() {
  $$('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('image-error');
    }, { once: true });
  });
}

function setupFilters() {
  const panel = $("[data-filter-panel]");
  const list = $("[data-filter-list]");
  if (!panel || !list) {
    return;
  }

  const keyword = $("[data-filter-keyword]", panel);
  const region = $("[data-filter-region]", panel);
  const year = $("[data-filter-year]", panel);
  const category = $("[data-filter-category]", panel);
  const reset = $("[data-filter-reset]", panel);
  const count = $("[data-filter-count]", panel);
  const cards = $$(".movie-card", list);

  const normalize = (value) => String(value || "").trim().toLowerCase();

  const apply = () => {
    const q = normalize(keyword.value);
    const r = normalize(region.value);
    const y = normalize(year.value);
    const c = normalize(category.value);
    let visible = 0;

    cards.forEach((card) => {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.category
      ].join(" "));

      const ok = (!q || haystack.includes(q)) &&
        (!r || normalize(card.dataset.region) === r) &&
        (!y || normalize(card.dataset.year) === y) &&
        (!c || normalize(card.dataset.category) === c);

      card.classList.toggle("is-hidden", !ok);
      if (ok) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = `${visible} 部影片`;
    }
  };

  [keyword, region, year, category].forEach((control) => {
    if (control) {
      control.addEventListener("input", apply);
      control.addEventListener("change", apply);
    }
  });

  if (reset) {
    reset.addEventListener("click", () => {
      keyword.value = "";
      region.value = "";
      year.value = "";
      category.value = "";
      apply();
    });
  }
}

function setupPlayers() {
  $$('[data-player]').forEach((player) => {
    const video = $('video', player);
    const button = $('[data-play]', player);
    const message = $('[data-player-message]', player);
    const source = player.dataset.videoSrc;
    let hlsInstance = null;

    if (!video || !button || !source) {
      return;
    }

    const showMessage = (text) => {
      if (message) {
        message.textContent = text;
      }
    };

    const attachSource = () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
          if (data && data.fatal) {
            showMessage('播放源暂时无法加载，请刷新页面后重试。');
          }
        });
        return;
      }

      video.src = source;
    };

    button.addEventListener('click', async () => {
      player.classList.add('is-playing');
      showMessage('');
      attachSource();
      try {
        await video.play();
      } catch (error) {
        showMessage('浏览器已阻止自动播放，请再次点击播放器播放。');
        player.classList.remove('is-playing');
      }
    });

    window.addEventListener('pagehide', () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
}

setupMenu();
setupHero();
setupImageFallback();
setupFilters();
setupPlayers();
