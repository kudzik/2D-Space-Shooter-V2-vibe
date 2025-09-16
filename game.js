class SpaceShooterGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.lives = 3;
        this.highScore = this.loadHighScore();

        this.playerSpeed = 0.1;
        this.bulletSpeed = 0.8;
        this.enemySpeed = 0.02;
        this.enemySpawnRate = 2000;
        this.baseEnemySpawnRate = 2000;
        this.shotCooldown = 1000;
        this.baseShotCooldown = 1000;
        this.fireRateMultiplier = 1.0;
        this.lastShot = 0;
        this.gameStartTime = Date.now();

        this.powerUpActive = false;
        this.powerUpEndTime = 0;

        this.keys = {};
        this.enemySpawnInterval = null;
        this.powerUpSpawnInterval = null;
        this.audioContext = null;
        this.audioEnabled = false;
        this.isGameOver = false;
        this.setupControls();
        this.initAudio();
    }

    init() {
        // Scena
        this.scene = new THREE.Scene();

        // Kamera ortograficzna
        this.camera = new THREE.OrthographicCamera(
            -10, 10, 10, -10, 0.1, 1000
        );
        this.camera.position.z = 5;

        // Renderer
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);

        // Tło z gwiazdami
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);

        // Twórz gracza
        this.createPlayer();

        // Spawn wrogów i power-upów
        this.startEnemySpawn();
        this.startPowerUpSpawn();

        // Inicjalizuj UI
        this.initUI();

        // Pętla animacji
        this.animate();

        console.log('SpaceShooterGame initialized');
    }

    createPlayer() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('img/statek-gracza.png');

        const geometry = new THREE.PlaneGeometry(1, 1.3);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, -8, 0);
        this.scene.add(this.player);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    createEnemy() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('img/enemy_1.png');

        const geometry = new THREE.PlaneGeometry(1, 1.4);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const enemy = new THREE.Mesh(geometry, material);
        enemy.position.set(
            (Math.random() - 0.5) * 18, // Losowa pozycja X (-9 do 9)
            10, // Start z góry ekranu
            0
        );

        this.enemies.push(enemy);
        this.scene.add(enemy);
    }

    startEnemySpawn() {
        this.enemySpawnInterval = setInterval(() => {
            this.createEnemy();
            this.updateDifficulty();
        }, this.enemySpawnRate);
    }
    
    updateDifficulty() {
        const gameTime = (Date.now() - this.gameStartTime) / 1000; // sekundy
        const difficultyMultiplier = Math.max(0.3, 1 - (gameTime * 0.01)); // zmniejsza o 1% co sekundę
        const newSpawnRate = Math.floor(this.baseEnemySpawnRate * difficultyMultiplier);
        
        if (newSpawnRate !== this.enemySpawnRate) {
            this.enemySpawnRate = newSpawnRate;
            clearInterval(this.enemySpawnInterval);
            this.startEnemySpawn();
            console.log(`Difficulty increased! Enemy spawn rate: ${this.enemySpawnRate}ms`);
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown) return;

        // Główny pocisk
        const geometry = new THREE.CylinderGeometry(0.05, 0.08, 0.4, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff971d,
            emissive: 0xf6b900
        });
        const bullet = new THREE.Mesh(geometry, material);

        // Efekt świecenia
        const glowGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff7200,
            transparent: true,
            opacity: .8
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);

        // Grupuj pocisk z efektem
        const bulletGroup = new THREE.Group();
        bulletGroup.add(bullet);
        bulletGroup.add(glow);

        bulletGroup.position.copy(this.player.position);
        bulletGroup.position.y += 0.6;

        this.bullets.push(bulletGroup);
        this.scene.add(bulletGroup);

        this.lastShot = now;
        this.playShootSound();
    }

    update() {
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updatePowerUps();
        this.checkCollisions();
        this.updatePowerUpStatus();
    }

    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.position.y -= this.enemySpeed;

            // Usuń wroga po wyjściu poza ekran
            if (enemy.position.y < -10) {
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.y += this.bulletSpeed;

            // Usuń pocisk po wyjściu poza ekran
            if (bullet.position.y > 10) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }

    updatePlayer() {
        if (!this.player || this.isGameOver) return;

        // Sterowanie WASD / strzałki
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.position.y += this.playerSpeed;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.position.y -= this.playerSpeed;
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.position.x -= this.playerSpeed;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.position.x += this.playerSpeed;
        }

        // Strzelanie
        if (this.keys['Space']) {
            this.shoot();
        }

        // Ogranicz ruch do granic ekranu
        this.player.position.x = Math.max(-9, Math.min(9, this.player.position.x));
        this.player.position.y = Math.max(-9, Math.min(9, this.player.position.y));
    }

    checkCollisions() {
        // Kolizje pocisków z wrogami
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];

                if (this.isColliding(bullet, enemy)) {
                    // Usuń pocisk i wroga
                    this.scene.remove(bullet);
                    this.scene.remove(enemy);
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);

                    // Dodaj punkty
                    this.score += 10;
                    this.updateUI();
                    this.playExplosionSound();
                    break;
                }
            }
        }

        // Kolizje wrogów z graczem
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (this.isColliding(this.player, enemy)) {
                // Usuń wroga i odejmij życie
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);

                this.lives--;
                this.updateUI();
                this.playExplosionSound();

                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }

        // Kolizje gracza z power-upami
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];

            if (this.isColliding(this.player, powerUp)) {
                this.scene.remove(powerUp);
                this.powerUps.splice(i, 1);
                this.activatePowerUp();
                this.playPowerUpSound();
            }
        }
    }

    createPowerUp() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('img/powerup.png');

        const geometry = new THREE.PlaneGeometry(0.8, 1.2);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const powerUp = new THREE.Mesh(geometry, material);
        powerUp.position.set(
            (Math.random() - 0.5) * 18,
            10,
            0
        );

        this.powerUps.push(powerUp);
        this.scene.add(powerUp);
    }

    startPowerUpSpawn() {
        this.powerUpSpawnInterval = setInterval(() => {
            if (Math.random() < 0.3) {
                this.createPowerUp();
            }
        }, 5000);
    }

    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.position.y -= this.enemySpeed;

            if (powerUp.position.y < -10) {
                this.scene.remove(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
    }

    activatePowerUp() {
        this.fireRateMultiplier += 0.2;
        this.shotCooldown = this.baseShotCooldown / this.fireRateMultiplier;
        console.log(`Power-up collected! Fire rate: ${this.fireRateMultiplier.toFixed(1)}x`);
    }

    updatePowerUpStatus() {
        // Power-upy są teraz permanentne
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    createBeep(frequency, duration, volume = 0.1) {
        if (!this.audioContext || !this.audioEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playShootSound() {
        this.createBeep(800, 0.1, 0.05);
    }

    playExplosionSound() {
        this.createBeep(150, 0.3, 0.1);
        setTimeout(() => this.createBeep(100, 0.2, 0.08), 50);
    }

    playPowerUpSound() {
        this.createBeep(600, 0.2, 0.06);
        setTimeout(() => this.createBeep(800, 0.2, 0.06), 100);
        setTimeout(() => this.createBeep(1000, 0.2, 0.06), 200);
    }

    enableAudio() {
        this.audioEnabled = true;
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const btn = document.getElementById('audioBtn');
        btn.textContent = 'Audio ON';
        btn.classList.add('enabled');
        btn.onclick = null;
        console.log('Audio enabled');
    }

    isColliding(obj1, obj2) {
        const box1 = new THREE.Box3().setFromObject(obj1);
        const box2 = new THREE.Box3().setFromObject(obj2);
        return box1.intersectsBox(box2);
    }

    updateUI() {
        document.getElementById('highScore').textContent = `High Score: ${this.highScore}`;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
    }

    initUI() {
        this.updateUI();

        // Obsługa przycisku restart
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });

        // Obsługa przycisku audio
        document.getElementById('audioBtn').addEventListener('click', () => {
            this.enableAudio();
        });
    }

    gameOver() {
        this.isGameOver = true;
        
        // Sprawdź i zapisz high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateUI();
            console.log(`New High Score: ${this.highScore}!`);
        }
        
        // Zatrzymaj spawn wrogów i power-upów
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }
        if (this.powerUpSpawnInterval) {
            clearInterval(this.powerUpSpawnInterval);
        }

        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';

        console.log(`Game Over! Final Score: ${this.score}`);
    }

    restartGame() {
        // Zatrzymaj spawn wrogów i power-upów
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }
        if (this.powerUpSpawnInterval) {
            clearInterval(this.powerUpSpawnInterval);
        }

        // Wyczyść scenę
        this.bullets.forEach(bullet => this.scene.remove(bullet));
        this.enemies.forEach(enemy => this.scene.remove(enemy));
        this.powerUps.forEach(powerUp => this.scene.remove(powerUp));
        if (this.player) this.scene.remove(this.player);

        // Reset wartości
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.lives = 3;
        this.lastShot = 0;
        this.shotCooldown = this.baseShotCooldown;
        this.fireRateMultiplier = 1.0;
        this.enemySpawnRate = this.baseEnemySpawnRate;
        this.gameStartTime = Date.now();
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
        this.isGameOver = false;

        // Ukryj ekran Game Over
        document.getElementById('gameOver').style.display = 'none';

        // Stwórz gracza ponownie i wznowi spawn
        this.createPlayer();
        this.startEnemySpawn();
        this.startPowerUpSpawn();
        this.updateUI();

        console.log('Game restarted successfully');
    }

    // Funkcje debugowania
    debugCollisions() {
        console.log(`Bullets: ${this.bullets.length}, Enemies: ${this.enemies.length}`);
        console.log(`Player position: x=${this.player.position.x.toFixed(2)}, y=${this.player.position.y.toFixed(2)}`);
    }

    testPlayerMovement() {
        console.log('Testing player movement limits...');
        this.player.position.set(-10, 0, 0);
        this.updatePlayer();
        console.log(`Left limit test: x=${this.player.position.x} (should be -9)`);

        this.player.position.set(10, 0, 0);
        this.updatePlayer();
        console.log(`Right limit test: x=${this.player.position.x} (should be 9)`);

        this.player.position.set(0, -10, 0);
        this.updatePlayer();
        console.log(`Bottom limit test: y=${this.player.position.y} (should be -9)`);

        this.player.position.set(0, 10, 0);
        this.updatePlayer();
        console.log(`Top limit test: y=${this.player.position.y} (should be 9)`);

        // Reset pozycji
        this.player.position.set(0, -8, 0);
        console.log('Player movement limits test completed');
    }

    testShotCooldown() {
        console.log('Testing shot cooldown...');
        const initialBullets = this.bullets.length;

        // Szybkie strzały
        this.shoot();
        this.shoot();
        this.shoot();

        const afterShots = this.bullets.length;
        console.log(`Bullets before: ${initialBullets}, after rapid shots: ${afterShots} (should be +1)`);

        // Test po czasie
        setTimeout(() => {
            this.shoot();
            console.log(`Bullets after cooldown: ${this.bullets.length} (should be +1 more)`);
        }, this.shotCooldown + 50);
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('spaceShooterHighScore');
        return saved ? parseInt(saved) : 0;
    }
    
    saveHighScore() {
        localStorage.setItem('spaceShooterHighScore', this.highScore.toString());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.render();
    }
}

// Uruchomienie gry
const game = new SpaceShooterGame();
game.init();