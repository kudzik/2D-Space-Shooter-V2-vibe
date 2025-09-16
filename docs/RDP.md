# 📄 Dokument RDP – Gra 2D Space Shooter (Three.js)

## 1️⃣ Cel projektu

Stworzenie przeglądarkowej gry 2D typu **Space Shooter**, w której gracz steruje statkiem kosmicznym, unika wrogów i strzela do nich, zdobywając punkty. Gra ma być lekka, responsywna i uruchamiana lokalnie bez backendu.

---

## 2️⃣ Zakres funkcjonalny

### 🎮 Mechanika gry

- Sterowanie statkiem (WASD / strzałki)
- Strzelanie pociskami (SPACJA)
- Kolizje z wrogami i pociskami
- System punktacji
- System żyć (3 życia)
- Restart gry po przegranej

### 🧠 Logika gry

- Losowe pojawianie się wrogów z góry ekranu
- Poruszanie się wrogów w dół
- Wykrywanie kolizji (AABB lub bounding spheres)
- Cooldown między strzałami
- Prosta pętla gry (update → render → input)

---

## 3️⃣ Technologie

| Komponent | Technologia |
|----------|-------------|
| Rendering | [Three.js](https://threejs.org/) |
| Logika gry | JavaScript (ES6+) |
| UI | HTML5 + CSS3 |
| Uruchamianie | Lokalnie przez `index.html` |
| Dev Server | `python3 -m http.server` lub Live Server |

---

## 4️⃣ Struktura projektu

```
2D-Space-Shooter/
├── index.html         # Główna strona gry
├── game.js            # Logika gry (klasa SpaceShooterGame)
├── style.css          # Stylowanie UI
├── assets/            # Modele, tekstury, dźwięki (opcjonalnie)
└── README.md          # Dokumentacja projektu
```

---

## 5️⃣ Klasy i moduły

### `SpaceShooterGame`

- `init()` – inicjalizacja sceny, kamery, renderera
- `createPlayer()` – tworzy statek gracza
- `createEnemy()` – tworzy wrogów
- `shoot()` – tworzy pocisk
- `update()` – aktualizuje pozycje obiektów
- `checkCollisions()` – wykrywa kolizje
- `render()` – renderuje scenę

---

## 6️⃣ Parametry gry (konfigurowalne)

```js
this.playerSpeed = 0.1;
this.bulletSpeed = 0.8;
this.enemySpeed = 0.02;
this.enemySpawnRate = 2000; // ms
this.shotCooldown = 200;    // ms
```

---

## 7️⃣ UI i sterowanie

| Klawisz | Funkcja |
|--------|---------|
| WASD / Strzałki | Ruch statku |
| SPACJA | Strzał |
| ESC | Pauza / Wznowienie |

---

## 8️⃣ Możliwe rozszerzenia (Future Scope)

- Power-upy i różne typy broni
- System poziomów
- Dźwięki i muzyka
- High scores (localStorage)
- Multiplayer (WebRTC / WebSocket)
- Integracja z silnikiem fizyki (np. Cannon.js)

---

## 9️⃣ Wymagania systemowe

- Przeglądarka z obsługą WebGL (Chrome, Firefox, Edge)
- Brak backendu – działa lokalnie
- Opcjonalnie: serwer lokalny (`Live Server`, `http.server`)

