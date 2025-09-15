// Custom Cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-active'));
}

// Matrix Effect
function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?/`~';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00d4ff';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 33);
}

// Particles.js
function initParticles() {
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ff0077" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false, "anim": { "enable": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#ff0077", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}

// Terminal Effect
function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.querySelector('.terminal-input');
    const lines = [
        'Initializing portfolio...',
        'Connecting to mainframe...',
        'Access granted.',
        'Type `help` for a list of commands.'
    ];

    let lineIndex = 0;
    function typeLine() {
        if (lineIndex < lines.length) {
            const line = document.createElement('div');
            line.textContent = lines[lineIndex];
            output.appendChild(line);
            lineIndex++;
            setTimeout(typeLine, 500);
        } else {
            input.focus();
        }
    }
    typeLine();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            output.innerHTML += `<div class="terminal-line"><span class="terminal-prompt">user@synthwave-pc:~$</span> ${command}</div>`;
            
            if (command === 'help') {
                output.innerHTML += '<div class="terminal-line">Available commands: about, skills, projects, contact</div>';
            } else if (command === 'about') {
                output.innerHTML += '<div class="terminal-line">I am a passionate developer with a love for retro-futuristic aesthetics.</div>';
            } else if (command === 'skills') {
                output.innerHTML += '<div class="terminal-line">Frontend: React, Vue, Angular | Backend: Node.js, Python | Creative: Three.js, Canvas API</div>';
            } else if (command === 'projects') {
                output.innerHTML += '<div class="terminal-line">Check out my projects in the portfolio sections above!</div>';
            } else if (command === 'contact') {
                output.innerHTML += '<div class="terminal-line">Feel free to use the contact form below or email me at [email protected]</div>';
            } else if (command === 'clear') {
                output.innerHTML = '';
            } else {
                output.innerHTML += `<div class="terminal-line">Command not found: ${command}. Type 'help' for available commands.</div>`;
            }
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });
}

// Skills Chart
function initSkillsChart() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Scroll Reveal
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
}

// 3D Card Hover
function init3DCards() {
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (x - centerX) / -20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// --- Games Section ---
// HTML content for games section
const gamesHTML = `
    <section class="section-container games-section reveal">
        <h2>Cosmic Drift</h2>
        <div class="game-container">
            <canvas id="gameCanvas"></canvas>
        </div>
        <div class="game-controls">
            <button id="startGame" class="game-btn">Start</button>
            <button id="resetGame" class="game-btn">Restart</button>
        </div>
        <div class="mobile-controls">
            <button id="mobileLeft" class="mobile-btn">◀</button>
            <button id="mobileRight" class="mobile-btn">▶</button>
            <button id="mobileUp" class="mobile-btn">▲</button>
            <button id="mobileDown" class="mobile-btn">▼</button>
            <button id="mobileRestart" class="mobile-btn">🔄</button>
        </div>
        <div class="game-info">
            Score: <span id="score">0</span> | Lives: <span id="lives">3</span>
        </div>
    </section>
`;

// Game system variables
let canvas, ctx;
let player, asteroids, bullets;
let score, lives;
let gameRunning, keys;

// Game settings
const settings = {
    playerSpeed: 5,
    bulletSpeed: 7,
    bulletCooldown: 200,
    asteroidSpeed: 2,
    maxAsteroids: 10,
    collisionRadius: 15
};

// Game Objects
class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.radius = 10;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0077';
        ctx.shadowColor = '#ff0077';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    update() {
        if (keys['ArrowLeft'] || keys['KeyA']) this.x -= settings.playerSpeed;
        if (keys['ArrowRight'] || keys['KeyD']) this.x += settings.playerSpeed;
        if (keys['ArrowUp'] || keys['KeyW']) this.y -= settings.playerSpeed;
        if (keys['ArrowDown'] || keys['KeyS']) this.y += settings.playerSpeed;

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }
}

class Asteroid {
    constructor() {
        this.radius = 10 + Math.random() * 20;
        this.x = Math.random() * canvas.width;
        this.y = -this.radius;
        this.speed = settings.asteroidSpeed + Math.random();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    update() {
        this.y += this.speed;
    }
}

class Bullet {
    constructor() {
        this.x = player.x;
        this.y = player.y;
        this.radius = 3;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0077';
        ctx.shadowColor = '#ff0077';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    update() {
        this.y -= settings.bulletSpeed;
    }
}

// Game Functions
function initGameSystem() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = canvas.width * 0.75;

    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('resetGame').addEventListener('click', resetGame);
    document.getElementById('mobileLeft').addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowLeft'] = true; });
    document.getElementById('mobileRight').addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowRight'] = true; });
    document.getElementById('mobileUp').addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowUp'] = true; });
    document.getElementById('mobileDown').addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowDown'] = true; });
    document.getElementById('mobileRestart').addEventListener('touchstart', (e) => { e.preventDefault(); resetGame(); });
    document.querySelectorAll('.mobile-btn').forEach(btn => {
        btn.addEventListener('touchend', (e) => { e.preventDefault(); keys = {}; });
    });

    updateUI();
    gameLoop();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
        setInterval(() => {
            if (gameRunning) {
                bullets.push(new Bullet());
            }
        }, settings.bulletCooldown);
    }
}

function resetGame() {
    player = new Player();
    asteroids = [];
    bullets = [];
    score = 0;
    lives = 3;
    gameRunning = true;
    keys = {};
    updateUI();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const dx = bullets[i].x - asteroids[j].x;
            const dy = bullets[i].y - asteroids[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullets[i].radius + asteroids[j].radius) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                score += 10;
                updateUI();
                break;
            }
        }
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const dx = player.x - asteroids[i].x;
        const dy = player.y - asteroids[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + asteroids[i].radius) {
            lives--;
            updateUI();
            asteroids.splice(i, 1);
            if (lives <= 0) {
                endGame();
            }
            break;
        }
    }
}

function endGame() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
}

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (asteroids.length < settings.maxAsteroids) {
        asteroids.push(new Asteroid());
    }

    player.update();
    player.draw();
    
    for (const asteroid of asteroids) {
        asteroid.update();
        asteroid.draw();
    }
    
    for (const bullet of bullets) {
        bullet.update();
        bullet.draw();
    }
    
    asteroids = asteroids.filter(a => a.y < canvas.height + a.radius);
    bullets = bullets.filter(b => b.y > 0);
    
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// --- Music Section ---
// HTML content for music section
const musicHTML = `
    <section class="section-container music-player-container reveal">
        <h2>Synthwave Radio</h2>
        <button id="music-toggle">Play Music</button>
        <div id="music-info"></div>
        <div class="volume-control-container">
            <span>Volume:</span>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="0.5">
        </div>
        <div id="audio-visualizer"></div>
        <audio id="audioPlayer" src="https://synthwave-music-example.com/track.mp3" loop></audio>
    </section>
`;

// Music player and visualizer
let audioCtx, analyser, dataArray, source, audioPlayer;
let isPlaying = false;

function initAudioVisualizer() {
    audioPlayer = document.getElementById('audioPlayer');
    
    if (window.AudioContext) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        source = audioCtx.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        const visualizer = document.getElementById('audio-visualizer');
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            visualizer.appendChild(bar);
        }
    }
}

function drawAudioVisualizer() {
    if (!analyser || !isPlaying) return;
    requestAnimationFrame(drawAudioVisualizer);
    analyser.getByteFrequencyData(dataArray);

    const bars = document.getElementById('audio-visualizer').children;
    for (let i = 0; i < bars.length; i++) {
        const barHeight = dataArray[i * 4] / 255 * 100;
        bars[i].style.height = `${barHeight}%`;
    }
}

function initMusicToggle() {
    const toggleBtn = document.getElementById('music-toggle');
    const musicInfo = document.getElementById('music-info');
    const visualizer = document.getElementById('audio-visualizer');
    const volumeSlider = document.getElementById('volume-slider');

    toggleBtn.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (isPlaying) {
            audioPlayer.pause();
            toggleBtn.textContent = 'Play Music';
            musicInfo.textContent = 'Music Paused';
            toggleBtn.classList.remove('music-on-animation');
            visualizer.style.opacity = '0';
            isPlaying = false;
        } else {
            audioPlayer.play();
            toggleBtn.textContent = 'Pause Music';
            musicInfo.textContent = 'Playing: Synthwave Tune';
            toggleBtn.classList.add('music-on-animation');
            visualizer.style.opacity = '1';
            isPlaying = true;
            drawAudioVisualizer();
        }
    });

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });

    audioPlayer.volume = volumeSlider.value;
}


// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Check if device supports advanced features
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Add dynamic content
    document.getElementById('games-section-container').innerHTML = gamesHTML;
    document.getElementById('music-section-container').innerHTML = musicHTML;

    // Run initializers
    if (!isMobile) {
        initCursor();
        initMatrix();
        initParticles();
    }
    
    initTerminal();
    initSkillsChart();
    initScrollReveal();
    init3DCards();
    initGameSystem();
    initAudioVisualizer();
    initMusicToggle();
});

// Handle window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
