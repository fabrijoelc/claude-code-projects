/**
 * entidades.js — Dimensiones, estado global, paddle, pelota y la grilla
 * de ladrillos generada desde NIVELES (un layout por nivel).
 *
 * Coordenadas con origen arriba-izquierda. Velocidades en px/frame
 * (escaladas por delta-time en el loop de main.js).
 */

// --------------------------------------------------------------------- //
// Dimensiones globales del juego
// --------------------------------------------------------------------- //
const CANVAS_ANCHO = 512;
const CANVAS_ALTO  = 600;

// --------------------------------------------------------------------- //
// Maquina de estados de pantalla
// --------------------------------------------------------------------- //
const PANTALLA = {
  INICIO: 'inicio',
  JUGANDO: 'jugando',
  PAUSA: 'pausa',
  GAME_OVER: 'game_over',
  VICTORIA: 'victoria',
};

const VIDAS_INICIALES = 3;

// Estado global del juego
const estado = {
  pantalla: PANTALLA.INICIO,
  vidas: VIDAS_INICIALES,
  score: 0,
  nivel: 0,             // indice del nivel actual dentro de NIVELES
  seleccionNivel: 0,    // indice resaltado en el selector de la pantalla de PAUSA
  pelotaPegada: true,   // true = la pelota descansa sobre el paddle, esperando lanzamiento
};

// --------------------------------------------------------------------- //
// Paddle (sprite paddle.sizes.medium: 64x14)
// --------------------------------------------------------------------- //
const paddle = {
  x: (CANVAS_ANCHO - 64) / 2,
  y: CANVAS_ALTO - 40,
  ancho: 64,
  alto: 14,
  velocidad: 7,   // px/frame para control por teclado
};

// --------------------------------------------------------------------- //
// Pelota (sprite balls.normal: 16x16)
// --------------------------------------------------------------------- //
// La velocidad crece con cada nivel para una curva de dificultad progresiva.
const PELOTA_VELOCIDAD_BASE = 5;
const PELOTA_VELOCIDAD_INC_NIVEL = 0.6;

const pelota = {
  x: 0, y: 0,
  ancho: 16, alto: 16,
  vx: 0, vy: 0,
  velocidad: PELOTA_VELOCIDAD_BASE,   // magnitud constante dentro de un mismo nivel
};

// --------------------------------------------------------------------- //
// Grilla de ladrillos
// 10 columnas de 48px ocupan exactamente el ancho util (512 - 2*16).
// --------------------------------------------------------------------- //
const LADRILLO_ANCHO  = 48;
const LADRILLO_ALTO   = 22;
const GRILLA_MARGEN_X = 16;   // margen lateral izquierdo/derecho
const GRILLA_MARGEN_Y = 64;   // distancia desde el techo a la primera fila

// Layout de un nivel: matriz de claves de color (o null = hueco).
// Hasta 10 columnas; los colores rompibles caen de 1 golpe, 'wood' aguanta 2
// y 'stone' aguanta 3. Mas puntos en las filas superiores.
// 'r'=red 'o'=orange 'y'=yellow 'g'=green 'b'=blue 'p'=purple 'W'=wood 'S'=stone '.'=hueco
const NIVELES = [
  // Nivel 1: clasico, 6 filas solidas de color.
  [
    'rrrrrrrrrr',
    'oooooooooo',
    'yyyyyyyyyy',
    'gggggggggg',
    'bbbbbbbbbb',
    'pppppppppp',
  ],
  // Nivel 2: patron con huecos y vigas de madera intercaladas.
  [
    'rr.rrrr.rr',
    '.WW....WW.',
    'oooooooooo',
    'y.y.yy.y.y',
    '.WW....WW.',
    'gggggggggg',
    'pp.pppp.pp',
  ],
  // Nivel 3: fortaleza con columnas de piedra y base de madera.
  [
    'rrrrrrrrrr',
    'S.bbbbbb.S',
    'pppppppppp',
    'S.gggggg.S',
    'oooooooooo',
    '..WWWWWW..',
  ],
  // Nivel 4: zigzag con piedra y madera intercaladas.
  [
    'pppppppppp',
    'b.b.b.b.b.',
    '.y.y.y.y.y',
    'oooooooooo',
    '.WW.SS.WW.',
    'rrrrrrrrrr',
  ],
  // Nivel 5: bastion final, marco de piedra y refuerzos de madera.
  [
    'SS.bbbb.SS',
    'rrrrrrrrrr',
    'oooooooooo',
    'yyyyyyyyyy',
    'gggggggggg',
    'WW.pppp.WW',
  ],
];

// Mapa de caracteres del layout a claves de SPRITESHEET.bricks.
const SIMBOLO_LADRILLO = {
  r: 'red', o: 'orange', y: 'yellow', g: 'green', b: 'blue', p: 'purple',
  W: 'wood', S: 'stone',
};

// Puntaje por color (mas arriba = mas puntos; especiales valen mas por dureza).
const PUNTOS = {
  red: 60, orange: 50, yellow: 40, green: 30, blue: 20, purple: 10,
  wood: 80, stone: 120,
};

// Array de ladrillos vivos del nivel actual.
// { x, y, ancho, alto, color, vivo, golpes, golpesMax }
let ladrillos = [];

// --------------------------------------------------------------------- //
// Explosiones (efectos puramente visuales, independientes de ladrillos)
// { x, y, ancho, alto, color, t } -> misma caja del ladrillo; t en ms (0..400)
// --------------------------------------------------------------------- //
let explosiones = [];

const EXPLOSION_DURACION_MS = SPRITESHEET.explosion.durationMs; // 400
const EXPLOSION_FRAME_MS    = SPRITESHEET.explosion.frameMs;    // 40

/** Genera la grilla de ladrillos a partir del layout del nivel `indice`. */
function generarLadrillos(indice) {
  const layout = NIVELES[indice];
  const out = [];
  for (let fila = 0; fila < layout.length; fila++) {
    const cadena = layout[fila];
    for (let col = 0; col < cadena.length; col++) {
      const color = SIMBOLO_LADRILLO[cadena[col]];
      if (!color) continue; // hueco ('.') o caracter desconocido
      const golpes = SPRITESHEET.bricks[color].hits;
      out.push({
        x: GRILLA_MARGEN_X + col * LADRILLO_ANCHO,
        y: GRILLA_MARGEN_Y + fila * LADRILLO_ALTO,
        ancho: LADRILLO_ANCHO,
        alto: LADRILLO_ALTO,
        color: color,
        vivo: true,
        golpes: golpes,       // golpes restantes para destruirlo
        golpesMax: golpes,    // golpes totales (para elegir el sprite agrietado)
      });
    }
  }
  return out;
}

/** Centra el paddle horizontalmente. */
function reiniciarPaddle() {
  paddle.x = (CANVAS_ANCHO - paddle.ancho) / 2;
}

/** Pega la pelota sobre el centro del paddle y la deja sin velocidad. */
function repegarPelota() {
  pelota.x = paddle.x + paddle.ancho / 2 - pelota.ancho / 2;
  pelota.y = paddle.y - pelota.alto;
  pelota.vx = 0;
  pelota.vy = 0;
  estado.pelotaPegada = true;
}

/**
 * Prepara un nivel: genera su grilla, ajusta la velocidad segun el indice
 * y recoloca paddle y pelota. No toca vidas ni score (se acumulan).
 */
function prepararNivel(indice) {
  estado.nivel = indice;
  ladrillos = generarLadrillos(indice);
  explosiones = [];
  pelota.velocidad = PELOTA_VELOCIDAD_BASE + indice * PELOTA_VELOCIDAD_INC_NIVEL;
  reiniciarPaddle();
  repegarPelota();
}

/** Reinicia toda la partida desde el nivel 1 (vidas, score, grilla, posiciones). */
function reiniciarPartida() {
  estado.vidas = VIDAS_INICIALES;
  estado.score = 0;
  prepararNivel(0);
}
