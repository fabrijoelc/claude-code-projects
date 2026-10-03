/**
 * spritesheet.js — Mapa de recursos del juego Arkanoid / Breakout.
 *
 * Coordenadas medidas pixel a pixel sobre "spritesheet-breakout.png" (559x337).
 * Todas las cajas son { x, y, w, h } en pixeles dentro del PNG.
 *
 * Uso:
 *   ctx.drawImage(img, s.x, s.y, s.w, s.h,  dx, dy, dw, dh);
 *
 * Atribucion del arte: spritesheet por Petraheim ("Credits Appreciated").
 * Sin dependencias: este archivo solo exporta datos.
 */

const SPRITESHEET = {
  image: 'assets/spritesheet-breakout.png',
  imageWidth: 559,
  imageHeight: 337,

  // --------------------------------------------------------------------- //
  // PELOTAS
  // --------------------------------------------------------------------- //
  balls: {
    normal: { x: 32, y: 32, w: 16, h: 16 }, // pelota grande (por defecto)
    small:  { x: 50, y: 34, w: 12, h: 12 }, // pelota pequena (powerup "multiball")
  },

  // --------------------------------------------------------------------- //
  // PALETA (paddle) — capsulas blancas con topes rojos.
  // Hay varios tamanos listos para usar y, ademas, un set de 3 cortes
  // (left / fill / right) para construir una paleta de cualquier ancho.
  // --------------------------------------------------------------------- //
  paddle: {
    sizes: {
      small:  { x: 32, y: 80,  w: 54,  h: 14 },
      medium: { x: 32, y: 96,  w: 64,  h: 14 },
      large:  { x: 32, y: 112, w: 162, h: 14 },
      xlarge: { x: 32, y: 128, w: 204, h: 13 },
    },
    solid: { x: 32, y: 144, w: 204, h: 13 }, // paleta roja maciza (variante "fuego")
    standing: { x: 32, y: 55, w: 14, h: 23 }, // capsula vertical (decorativa)

    // 9-slice horizontal a partir de paddle.sizes.large.
    // Dibuja left + (fill repetido/escalado) + right para anchos arbitrarios.
    slice: {
      capWidth: 16,
      left:  { x: 32,  y: 112, w: 16,  h: 14 },
      fill:  { x: 64,  y: 112, w: 32,  h: 14 },
      right: { x: 178, y: 112, w: 16,  h: 14 },
    },
  },

  // --------------------------------------------------------------------- //
  // LADRILLOS (bricks)
  // Rejilla regular: celda 32x16, origen (32,176).
  //   x = grid.originX + col * grid.cellW
  //   y = grid.originY + row * grid.cellH
  //
  // 6 colores rompibles (filas 0..5). Cada fila tiene 11 columnas:
  //   col 0        -> ladrillo intacto
  //   col 1..10    -> animacion de rotura/explosion (mismo color)
  //
  // 2 ladrillos especiales (filas 6..7) con 2 estados (intacto, agrietado):
  //   wood  -> madera   (resistente, varios golpes)
  //   stone -> piedra   (mas resistente / casi indestructible)
  // --------------------------------------------------------------------- //
  grid: { originX: 32, originY: 176, cellW: 32, cellH: 16 },

  bricks: {
    // row = fila en la rejilla; color = RGB para HUD / particulas / fallback.
    red:    { row: 0, hits: 1, color: '#c02a3e', frame: { x: 32, y: 176, w: 32, h: 16 } },
    green:  { row: 1, hits: 1, color: '#4fc99c', frame: { x: 32, y: 192, w: 32, h: 16 } },
    blue:   { row: 2, hits: 1, color: '#44aaf3', frame: { x: 32, y: 208, w: 32, h: 16 } },
    purple: { row: 3, hits: 1, color: '#632ff4', frame: { x: 32, y: 224, w: 32, h: 16 } },
    yellow: { row: 4, hits: 1, color: '#d9bd4c', frame: { x: 32, y: 240, w: 32, h: 16 } },
    orange: { row: 5, hits: 1, color: '#fc7d1c', frame: { x: 32, y: 256, w: 32, h: 16 } },

    // Especiales: 2 estados (col 0 intacto, col 1 agrietado). No explotan.
    wood:  { row: 6, hits: 2, color: '#9e3b09', states: 2,
             frames: [ { x: 32, y: 272, w: 32, h: 16 }, { x: 64, y: 272, w: 32, h: 16 } ] },
    stone: { row: 7, hits: 3, color: '#9998ab', states: 2,
             frames: [ { x: 32, y: 288, w: 32, h: 16 }, { x: 64, y: 288, w: 32, h: 16 } ] },
  },

  // Orden de colores tipico de arriba hacia abajo en un nivel (mas puntos arriba).
  brickRowOrder: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],

  // --------------------------------------------------------------------- //
  // EXPLOSION / ROTURA DE LADRILLO
  // Las 10 columnas (1..10) de la fila del color forman la animacion.
  // Helper getExplosionFrames(colorName) -> array de cajas listas para dibujar.
  // --------------------------------------------------------------------- //
  explosion: {
    frameCount: 10,    // columnas 1..10
    firstCol: 1,       // la columna 0 es el ladrillo intacto
    frameW: 32,
    frameH: 16,
    frameMs: 40,       // duracion de cada frame
    durationMs: 400,   // total (frameCount * frameMs)
    loop: false,
  },

  // --------------------------------------------------------------------- //
  // POWERUP (capsula que cae)
  // --------------------------------------------------------------------- //
  powerup: { x: 132, y: 16, w: 38, h: 16 },
};

// ------------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------------ //

/** Caja de una celda arbitraria de la rejilla de ladrillos. */
function brickCell(col, row) {
  const g = SPRITESHEET.grid;
  return { x: g.originX + col * g.cellW, y: g.originY + row * g.cellH, w: g.cellW, h: g.cellH };
}

/** Frames de explosion para un color de ladrillo ('red','green',...). */
function getExplosionFrames(colorName) {
  const b = SPRITESHEET.bricks[colorName];
  const e = SPRITESHEET.explosion;
  if (!b || b.row == null) return [];
  const out = [];
  for (let i = 0; i < e.frameCount; i++) out.push(brickCell(e.firstCol + i, b.row));
  return out;
}

// Export universal (ES modules, CommonJS o navegador con <script>).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPRITESHEET, brickCell, getExplosionFrames };
} else if (typeof window !== 'undefined') {
  window.SPRITESHEET = SPRITESHEET;
  window.brickCell = brickCell;
  window.getExplosionFrames = getExplosionFrames;
}
