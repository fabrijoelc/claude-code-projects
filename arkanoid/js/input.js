/**
 * input.js — Control del paddle por mouse y teclado (ambos activos a la vez).
 * El mouse fija la X del paddle; las flechas lo desplazan por frame.
 */

const lienzoInput = document.getElementById('juego');

// Teclas de movimiento mantenidas.
const teclas = { izquierda: false, derecha: false };

/** Mantiene el paddle dentro de los bordes del canvas. */
function clampPaddle() {
  const maxX = CANVAS_ANCHO - paddle.ancho;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > maxX) paddle.x = maxX;
}

// --- Mouse: el centro del paddle sigue la X del cursor sobre el canvas. ---
lienzoInput.addEventListener('mousemove', (e) => {
  const rect = lienzoInput.getBoundingClientRect();
  // Escala por si el canvas se muestra a un tamano distinto al de su buffer.
  const escala = CANVAS_ANCHO / rect.width;
  const mouseX = (e.clientX - rect.left) * escala;
  paddle.x = mouseX - paddle.ancho / 2;
  clampPaddle();
});

// --- Teclado: flechas izquierda/derecha. ---
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  teclas.izquierda = true;
  if (e.key === 'ArrowRight') teclas.derecha = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft')  teclas.izquierda = false;
  if (e.key === 'ArrowRight') teclas.derecha = false;
});

/** Aplica el movimiento por teclado (llamado cada frame con delta-time). */
function actualizarPaddle(dt) {
  if (teclas.izquierda) paddle.x -= paddle.velocidad * dt;
  if (teclas.derecha)   paddle.x += paddle.velocidad * dt;
  clampPaddle();
}
