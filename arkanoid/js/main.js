/**
 * main.js — Punto de entrada. Carga el spritesheet, arranca el loop con
 * delta-time y lo distribuye a la logica (actualizar) y al render (dibujar).
 */

const canvas = document.getElementById('juego');
const ctx = canvas.getContext('2d');

// Imagen del spritesheet (SPRITESHEET.image es una ruta, no un Image).
const imagenSheet = new Image();

// Marca de tiempo del frame anterior para calcular delta-time.
let tiempoPrevio = 0;

/**
 * Bucle principal. `dt` es el factor de tiempo normalizado a 60fps:
 * dt = 1.0 cuando el frame dura ~16.67ms. Asi las velocidades en
 * px/frame se mantienen estables aunque cambie la tasa de refresco.
 */
function loop(tiempoActual) {
  const deltaMs = tiempoActual - tiempoPrevio;
  tiempoPrevio = tiempoActual;

  // Acotar dt para evitar saltos grandes (cambio de pestana, lag)
  // que podrian provocar tunel de colision.
  let dt = deltaMs / (1000 / 60);
  if (dt > 3) dt = 3;

  actualizar(dt);
  dibujar();

  requestAnimationFrame(loop);
}

/** Logica del juego por frame. Se ira completando en pasos siguientes. */
function actualizar(dt) {
  // Las explosiones son visuales: siguen animandose en cualquier pantalla
  // (incluido GAME_OVER/VICTORIA, para ver la rotura del ultimo ladrillo).
  actualizarExplosiones(dt);

  if (estado.pantalla !== PANTALLA.JUGANDO) return;
  actualizarPaddle(dt); // movimiento por teclado (el mouse actua por evento)
  actualizarJuego(dt);  // pelota: pegada / movimiento / colisiones
}

/** Render del frame. Se ira completando en pasos siguientes. */
function dibujar() {
  // Fondo: limpiar el canvas cada frame.
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  switch (estado.pantalla) {
    case PANTALLA.INICIO:
      dibujarPantallaInicio(ctx);
      break;

    case PANTALLA.JUGANDO:
      dibujarLadrillos(ctx, imagenSheet);
      dibujarExplosiones(ctx, imagenSheet);
      dibujarPaddle(ctx, imagenSheet);
      dibujarPelota(ctx, imagenSheet);
      dibujarHUD(ctx);
      break;

    case PANTALLA.PAUSA:
      // Escena congelada de fondo + selector de niveles encima.
      dibujarLadrillos(ctx, imagenSheet);
      dibujarExplosiones(ctx, imagenSheet);
      dibujarPaddle(ctx, imagenSheet);
      dibujarPelota(ctx, imagenSheet);
      dibujarHUD(ctx);
      dibujarPantallaPausa(ctx);
      break;

    case PANTALLA.GAME_OVER:
      dibujarLadrillos(ctx, imagenSheet);
      dibujarExplosiones(ctx, imagenSheet);
      dibujarPaddle(ctx, imagenSheet);
      dibujarHUD(ctx);
      dibujarPantallaGameOver(ctx);
      break;

    case PANTALLA.VICTORIA:
      dibujarLadrillos(ctx, imagenSheet);
      dibujarExplosiones(ctx, imagenSheet);
      dibujarPaddle(ctx, imagenSheet);
      dibujarHUD(ctx);
      dibujarPantallaVictoria(ctx);
      break;
  }
}

// Arranque: esperar a que cargue la imagen antes de iniciar el loop.
imagenSheet.onload = () => {
  console.log('Spritesheet cargado:', imagenSheet.width + 'x' + imagenSheet.height);
  reiniciarPartida();
  requestAnimationFrame((t) => {
    tiempoPrevio = t;
    requestAnimationFrame(loop);
  });
};
imagenSheet.onerror = () => {
  console.error('No se pudo cargar el spritesheet:', SPRITESHEET.image,
    '(¿estas sirviendo por HTTP y no con file://?)');
};
imagenSheet.src = SPRITESHEET.image;
