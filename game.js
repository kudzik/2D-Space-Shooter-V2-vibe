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
        
        this.playerSpeed = 0.1;
        this.bulletSpeed = 0.8;
        this.enemySpeed = 0.02;
        this.enemySpawnRate = 2000;
        this.shotCooldown = 200;
        this.baseShotCooldown = 200;
        this.lastShot = 0;
        
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
        
        this.keys = {};
        this.enemySpawnInterval = null;
        this.audioContext = null;
        this.audioEnabled = false;
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
        
        const geometry = new THREE.PlaneGeometry(1, 1);
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
        const geometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
        }, this.enemySpawnRate);
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown) return;
        
        const geometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(geometry, material);
        
        bullet.position.copy(this.player.position);
        bullet.position.y += 0.6;
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
        
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
        if (!this.player) return;
        
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
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
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
        setInterval(() => {
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
        this.shotCooldown = 50;
        this.powerUpActive = true;
        this.powerUpEndTime = Date.now() + 10000;
        console.log('Power-up activated: Fast Shooting!');
    }
    
    updatePowerUpStatus() {
        if (this.powerUpActive && Date.now() > this.powerUpEndTime) {
            this.shotCooldown = this.baseShotCooldown;
            this.powerUpActive = false;
            console.log('Power-up expired');
        }
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
        // Zatrzymaj spawn wrogów
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
        }
        
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
        
        console.log(`Game Over! Final Score: ${this.score}`);
    }
    
    restartGame() {
        // Zatrzymaj spawn wrogów
        if (this.enemySpawnInterval) {
            clearInterval(this.enemySpawnInterval);
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
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
        
        // Ukryj ekran Game Over
        document.getElementById('gameOver').style.display = 'none';
        
        // Stwórz gracza ponownie i wznowi spawn
        this.createPlayer();
        this.startEnemySpawn();
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