# 🚀 2D Space Shooter

Przeglądarkowa gra 2D typu Space Shooter stworzona w Three.js z Web Audio API.

## 🎮 Opis gry

Steruj zielonym statkiem kosmicznym, unikaj czerwonych wrogów i strzelaj do nich żółtymi pociskami. Zbieraj niebieskie power-upy dla szybszego strzelania!

## 🎯 Mechanika gry

- **Punktacja**: 10 punktów za zniszczenie wroga
- **Życia**: 3 życia na start
- **Power-upy**: Szybsze strzelanie przez 10 sekund
- **Wrogowie**: Spadają z góry co 2 sekundy
- **Kolizje**: Precyzyjne wykrywanie AABB

## 🎵 Dźwięki

- 🔫 Strzał: Wysokie "pew"
- 💥 Eksplozja: Niskie "boom" z echem
- ⚡ Power-up: Melodyjny dźwięk wzrastający

## 🚀 Uruchamianie

### Metoda 1: Bezpośrednio
Otwórz `index.html` w przeglądarce

### Metoda 2: Lokalny serwer
```bash
python3 -m http.server 8000
# lub
npx serve .
```

## 🎮 Sterowanie

| Klawisz | Funkcja |
|---------|----------|
| WASD / Strzałki | Ruch statku |
| SPACJA | Strzał |
| Enable Audio | Aktywacja dźwięków |

## 🛠️ Technologie

- **Three.js** - Rendering 3D/2D
- **Web Audio API** - Generowanie dźwięków
- **JavaScript ES6+** - Logika gry
- **HTML5 Canvas** - Wyświetlanie
- **CSS3** - Stylowanie UI

## 📁 Struktura projektu

```
2D-Space-Shooter/
├── index.html         # Główna strona gry
├── game.js            # Logika gry (SpaceShooterGame)
├── style.css          # Stylowanie UI
├── debug.md           # Instrukcje debugowania
├── assets/            # Folder na zasoby
└── README.md          # Ta dokumentacja
```

## 🎨 Obiekty gry

- 🟢 **Gracz**: Zielony prostokąt (0.5×1×0.2)
- 🔴 **Wrogowie**: Czerwone prostokąty (0.6×0.8×0.2)
- 🟡 **Pociski**: Żółte prostokąty (0.1×0.3×0.1)
- 🔵 **Power-upy**: Niebieskie kostki (0.4×0.4×0.2)
- ⭐ **Tło**: 1000 białych gwiazd

## 🧪 Debugowanie

Otwórz konsolę przeglądarki (F12) i użyj:

```javascript
game.debugCollisions();     // Info o obiektach
game.testPlayerMovement();  // Test granic
game.testShotCooldown();    // Test cooldownu
```

## 🎮 Funkcjonalności

✅ Pełna mechanika gry  
✅ System kolizji AABB  
✅ Power-upy z efektami  
✅ Dźwięki proceduralne  
✅ Responsywny UI  
✅ Restart bez przeładowania  
✅ Funkcje debugowania  

## 🚀 Możliwe rozszerzenia

- Poziomy trudności
- High scores w localStorage
- Różne typy broni
- Animacje eksplozji
- Multiplayer
- Mobilne sterowanie

## 📄 Licencja

Projekt edukacyjny - wolne użycie.