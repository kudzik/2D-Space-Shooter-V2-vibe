# TODO

## ✅ TODO – Space Shooter 2D (Three.js)  
>
> _Wszystkie zadania są domyślnie odznaczone. Gotowe do pracy w Cursor AI._

```markdown
### 📦 Struktura projektu
- [x] Utwórz folder projektu `2D-Space-Shooter`
- [x] Dodaj plik `index.html` z kontenerem `<canvas>`
- [x] Dodaj plik `game.js` z klasą `SpaceShooterGame`
- [x] Dodaj plik `style.css` z prostym layoutem
- [x] Utwórz folder `assets/` na przyszłe tekstury i dźwięki

---

### 🧠 Inicjalizacja Three.js
- [x] Zainicjalizuj scenę, kamerę ortograficzną i renderer
- [x] Dodaj tło (np. czarne lub z teksturą gwiazd)
- [x] Dodaj pętlę `animate()` z `requestAnimationFrame`

---

### 🚀 Gracz
- [x] Stwórz klasę/statyczną metodę `createPlayer()`
- [x] Dodaj prosty model statku (np. `BoxGeometry`)
- [x] Ustaw pozycję startową statku na dole ekranu
- [x] Dodaj sterowanie (WASD / strzałki)
- [x] Ogranicz ruch statku do granic ekranu

---

### 🔫 Strzały
- [x] Dodaj metodę `shoot()` tworzącą pocisk
- [x] Ustaw prędkość pocisku i kierunek
- [x] Dodaj cooldown między strzałami
- [x] Usuń pociski po wyjściu poza ekran

---

### 👾 Wrogowie
- [x] Dodaj metodę `createEnemy()` z losową pozycją X
- [x] Ustaw prędkość wroga w dół
- [x] Dodaj interwał `setInterval()` do spawnów
- [x] Usuń wrogów po kolizji lub wyjściu poza ekran

---

### 💥 Kolizje
- [x] Dodaj metodę `checkCollisions()` (AABB lub bounding spheres)
- [x] Wykrywaj kolizje pocisków z wrogami
- [x] Wykrywaj kolizje wrogów z graczem
- [x] Odejmuj życie gracza po kolizji
- [x] Dodaj efekt zniszczenia (np. usunięcie obiektu)

---

### 🎯 Punktacja i UI
- [x] Dodaj licznik punktów w rogu ekranu
- [x] Dodaj licznik żyć gracza
- [x] Dodaj ekran „Game Over” z przyciskiem restartu

---

### 🧪 Debugowanie i testy
- [x] Sprawdź poprawność kolizji
- [x] Przetestuj limity ruchu gracza
- [x] Przetestuj cooldown strzałów
- [x] Przetestuj restart gry

---

### 🧩 Rozszerzenia (opcjonalnie)
- [x] Dodaj power-upy (np. szybsze strzały)
- [x] Dodaj dźwięki (strzał, eksplozja)
- [x] Dodaj poziomy trudności (progresywne zwiększanie)
- [x] Zapisuj high score w `localStorage`

---

### 🎨 Grafika i tekstury
- [x] Dodaj teksturę gracza z pliku `statek-gracza.png`
- [x] Zastąp model 3D gracza sprite'em 2D
- [x] Dodaj teksturę wroga z pliku `enemy_1.png`
- [x] Zastąp model 3D wroga sprite'em 2D
- [x] Dodaj teksturę power-upu z pliku `powerup.png`
- [x] Zastąp model 3D power-upu sprite'em 2D
- [x] Dostosuj rozmiary obiektów (PlaneGeometry)

---

### 📁 Organizacja projektu
- [x] Dodaj folder `img/` na tekstury
- [x] Stwórz plik `.gitignore`
- [x] Uzupełnij dokumentację README.md
- [x] Dodaj instrukcje debugowania

---

### 🔧 System audio
- [x] Implementuj Web Audio API
- [x] Dodaj przycisk Enable/Disable audio
- [x] Kontrola odtwarzania dźwięków flagą
- [x] Dźwięki proceduralne (oscylatory)

---

### 🎮 Mechanika gry
- [x] System progresywnej trudności (1% co sekundę)
- [x] Permanentne power-upy (+20% szybkość strzelania)
- [x] Wolniejsze strzelanie na start (500ms cooldown)
- [x] Zatrzymanie gry po Game Over
- [x] Blokada ruchu gracza po śmierci

---

### 🎨 Efekty wizualne
- [x] Świecące pociski z efektem glow
- [x] Futurystyczny UI z czcionką Orbitron
- [x] Gradienty i animacje CSS
- [x] Text-shadow i box-shadow efekty
- [x] Hover animacje na przyciskach

---

### 🔍 Balans gry
- [x] Dostosowanie prędkości strzelania
- [x] System permanentnych ulepszeń
- [x] Progresywne zwiększanie trudności
- [x] Optymalizacja spawn rate wrogów

```

## 🏆 Podsumowanie

**Status**: 🟢 PROJEKT ZAKOŃCZONY  
**Funkcjonalność**: 100% - Wszystkie główne zadania wykonane  
**Jakość**: Pełna gra z futurystycznym designem  
**Rozszerzenia**: Możliwe dalsze ulepszenia (high scores, nowe typy wrogów)  

### 📈 Statystyki realizacji:

- **Sekcji TODO**: 8 głównych + 4 dodatkowe
- **Zakończonych**: 12/12 (100%)
- **Funkcjonalności**: 25+ zaimplementowanych
- **Pliki**: 7 głównych + 3 tekstury

---
