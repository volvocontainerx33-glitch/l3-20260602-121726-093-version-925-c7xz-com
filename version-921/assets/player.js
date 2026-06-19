import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer() {
  const video = document.querySelector('.video-player');
  const button = document.querySelector('[data-player-start]');
  const wrap = document.querySelector('.player-wrap');

  if (!video) {
    return;
  }

  const hlsSource = video.getAttribute('data-hls-src');

  if (hlsSource) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSource;
    } else if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(hlsSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) {
          hls.destroy();
        }
      });
    }
  }

  function playVideo() {
    if (wrap) {
      wrap.classList.add('is-playing');
    }
    video.play().catch(function () {
      if (button) {
        button.textContent = '再次点击播放';
      }
    });
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    if (wrap) {
      wrap.classList.add('is-playing');
    }
  });

  video.addEventListener('pause', function () {
    if (wrap) {
      wrap.classList.remove('is-playing');
    }
  });
}

document.addEventListener('DOMContentLoaded', setupPlayer);
