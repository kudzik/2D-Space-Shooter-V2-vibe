# Debug & Test Instructions

## Testowanie w konsoli przeglądarki

Otwórz konsolę deweloperską (F12) i użyj następujących komend:

### Test kolizji
```javascript
game.debugCollisions(); // Wyświetla liczbę pocisków i wrogów
```

### Test limitów ruchu gracza
```javascript
game.testPlayerMovement(); // Testuje wszystkie granice ekranu
```

### Test cooldownu strzałów
```javascript
game.testShotCooldown(); // Testuje opóźnienie między strzałami
```

### Test restartu gry
```javascript
game.gameOver(); // Wywołuje ekran Game Over
// Następnie kliknij "Restart Game"
```

## Ręczne testowanie

1. **Ruch gracza**: Sprawdź WASD i strzałki
2. **Granice**: Spróbuj wyjść poza ekran
3. **Strzelanie**: Trzymaj SPACJĘ - powinien być cooldown
4. **Kolizje**: Pozwól wrogowi dotknąć gracza
5. **Restart**: Po Game Over kliknij restart

## Oczekiwane wyniki

- Gracz nie może wyjść poza granice (-9 do 9)
- Cooldown strzałów: 200ms
- Kolizje działają precyzyjnie
- Restart czyści wszystkie obiekty