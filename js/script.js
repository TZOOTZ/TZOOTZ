document.addEventListener('DOMContentLoaded', function() {
    // 1. Carrusel de videos (TZOOTZ TV)
    const videoFolder = "videos/"; // Cambia por tu ruta real
    const videoFiles = ["clip1.mp4", "clip2.mp4", "clip3.mp4"]; // Ejemplo
    const tvElement = document.querySelector('.video-carousel');

    let currentVideo = 0;
    function playNextVideo() {
        tvElement.src = videoFolder + videoFiles[currentVideo];
        tvElement.onended = function() {
            currentVideo = (currentVideo + 1) % videoFiles.length;
            playNextVideo();
        };
    }
    if (videoFiles.length > 0) playNextVideo();

    // 2. Listado de música (simulado)
    const songs = [
        { title: "NOISE_001", file: "music/001.mp3" },
        { title: "GLITCH_ALPHA", file: "music/alpha.wav" }
    ];
    const songList = document.getElementById('song-list');
    songs.forEach(song => {
        const player = new Audio(song.file);
        const item = document.createElement('div');
        item.className = 'song-item';
        item.textContent = `> ${song.title}`;
        item.onclick = () => player.play();
        songList.appendChild(item);
    });

    // 3. Links de desarrollo
    const devLinks = [
        { name: "APP_ORBITAL", url: "https://orbital.tzootz.com" },
        { name: "GAME_VORTEX", url: "https://vortex.surge.sh" }
    ];
    const devContainer = document.getElementById('dev-links');
    devLinks.forEach(link => {
        const item = document.createElement('a');
        item.className = 'dev-link';
        item.textContent = `> ${link.name}`;
        item.href = link.url;
        item.target = "_blank";
        devContainer.appendChild(item);
    });
});
