# Arkanoid

El clásico Arkanoid en HTML, CSS y JavaScript, sin dependencias ni proceso de build: niveles de ladrillos, vidas, pausa, efectos de sonido y control con mouse o teclado. Lo hice en el curso de Claude Code de DevTalles.

## Jugar

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
npx serve .
```

## Cómo está organizado

| Archivo | Qué hace |
|---|---|
| `js/main.js` | Punto de entrada: carga el spritesheet y corre el bucle con delta-time |
| `js/juego.js` | Lógica de la partida: lanzamiento, movimiento, rebotes y colisiones |
| `js/entidades.js` | Paleta, pelota, estado global y la grilla de ladrillos de cada nivel |
| `js/dibujo.js` | Dibujo de las entidades a partir del spritesheet |
| `js/input.js` | Control con mouse y teclado, los dos a la vez |
| `js/audio.js` | Efectos de sonido |
| `assets/` | Spritesheet y sonidos |
