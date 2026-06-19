import { H as Hls } from './hls-vendor-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
    const players = Array.from(document.querySelectorAll('.player-shell'));

    players.forEach(function (player) {
        const video = player.querySelector('video');
        const button = player.querySelector('[data-play-button]');
        const message = player.querySelector('[data-player-message]');
        const source = player.dataset.videoSrc;

        if (!video || !button || !source) {
            return;
        }

        button.addEventListener('click', function () {
            startPlayback(player, video, source, message);
        });
    });
});

function startPlayback(player, video, source, message) {
    player.classList.add('is-loading');
    setMessage(message, '正在加载播放源...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
            playVideo(player, video, message);
        }, { once: true });
        return;
    }

    if (Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            playVideo(player, video, message);
        });

        hls.on(Hls.Events.ERROR, function (_, data) {
            if (data && data.fatal) {
                setMessage(message, '播放源加载失败，请稍后重试。');
                player.classList.remove('is-playing');
            }
        });

        return;
    }

    setMessage(message, '当前浏览器暂不支持 HLS 播放。');
}

function playVideo(player, video, message) {
    const playPromise = video.play();
    player.classList.remove('is-loading');
    player.classList.add('is-playing');
    setMessage(message, '正在播放。');

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
            setMessage(message, '播放已就绪，请在播放器中手动点击播放。');
        });
    }
}

function setMessage(message, text) {
    if (message) {
        message.textContent = text;
    }
}
