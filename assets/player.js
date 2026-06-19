function startMoviePlayer(videoId, coverId, url) {
  const video = document.getElementById(videoId);
  const cover = document.getElementById(coverId);

  if (!video || !cover) {
    return;
  }

  let ready = false;

  function load() {
    if (!ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
      ready = true;
    }
    cover.classList.add('hide');
    video.controls = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  cover.addEventListener('click', load);
  video.addEventListener('click', () => {
    if (!ready) {
      load();
    }
  });
}
