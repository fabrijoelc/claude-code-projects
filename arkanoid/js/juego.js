/**
 * juego.js — Logica de la partida: pelota pegada, lanzamiento, movimiento,
 * rebotes y colisiones. La maquina de estados de pantalla se cablea en main.
 */

// Angulo de lanzamiento inicial (hacia arriba-derecha). cos/sin de -60deg.
const ANGULO_LANZAMIENTO = -Math.PI / 3;

/** Coloca la pelota pegada sobre el centro del paddle (sin resetear velocidad). */
function pegarPelotaAlPaddle() {
  pelota.x = paddle.x + paddle.ancho / 2 - pelota.ancho / 2;
  pelota.y = paddle.y - pelota.alto;
}

/** Lanza la pelota si esta pegada: fija vx,vy con magnitud constante. */
function lanzarPelota() {
  if (!estado.pelotaPegada) return;
  estado.pelotaPegada = false;
  pelota.vx = pelota.velocidad * Math.cos(ANGULO_LANZAMIENTO);
  pelota.vy = pelota.velocidad * Math.sin(ANGULO_LANZAMIENTO);
  reproducir('launch');
}

/** Logica de la partida por frame. */
function actualizarJuego(dt) {
  if (estado.pelotaPegada) {
    // La pelota descansa sobre el paddle y lo sigue.
    pegarPelotaAlPaddle();
    return;
  }
  // Avance segun velocidad (escalada por delta-time).
  pelota.x += pelota.vx * dt;
  pelota.y += pelota.vy * dt;

  rebotarParedes();
  rebotarPaddle();
  colisionLadrillos();
  caidaPelota();
  chequearVictoria();
}

/**
 * Sin ladrillos vivos: si quedan niveles, avanza al siguiente; si era el
 * ultimo, gana la partida. En ambos casos suena 'win'.
 */
function chequearVictoria() {
  if (ladrillos.some((l) => l.vivo)) return;

  reproducir('win');
  if (estado.nivel < NIVELES.length - 1) {
    prepararNivel(estado.nivel + 1); // siguiente nivel: pelota pegada, lista para lanzar
  } else {
    estado.pantalla = PANTALLA.VICTORIA;
  }
}

/** La pelota cae bajo el paddle: resta una vida y repega; a 0 vidas, game over. */
function caidaPelota() {
  if (pelota.y <= CANVAS_ALTO) return;

  estado.vidas--;
  if (estado.vidas <= 0) {
    estado.vidas = 0;
    estado.pantalla = PANTALLA.GAME_OVER;
    reproducir('game_over');
  } else {
    reproducir('lose_life');
  }
  repegarPelota(); // recoloca la pelota pegada sobre el paddle (resetea vx,vy)
}

/** Colision pelota-ladrillo: rompe el primero que toca, suma puntos y rebota. */
function colisionLadrillos() {
  for (const l of ladrillos) {
    if (!l.vivo) continue;

    const tocando =
      pelota.x + pelota.ancho >= l.x &&
      pelota.x <= l.x + l.ancho &&
      pelota.y + pelota.alto >= l.y &&
      pelota.y <= l.y + l.alto;
    if (!tocando) continue;

    // Eje de rebote: el de menor solapamiento (por donde entro la pelota).
    // Se calcula antes de modificar el ladrillo.
    const solapeX = Math.min(pelota.x + pelota.ancho, l.x + l.ancho) - Math.max(pelota.x, l.x);
    const solapeY = Math.min(pelota.y + pelota.alto, l.y + l.alto) - Math.max(pelota.y, l.y);
    if (solapeX < solapeY) {
      pelota.vx = -pelota.vx;
    } else {
      pelota.vy = -pelota.vy;
    }

    l.golpes--;
    if (l.golpes > 0) {
      // Ladrillo especial dañado pero aun en pie (se agrieta, no explota).
      reproducir('brick');
      break;
    }

    // Destruido: suma puntos y desaparece.
    l.vivo = false;
    estado.score += PUNTOS[l.color];

    if (SPRITESHEET.bricks[l.color].frames) {
      // Especiales (wood/stone): no tienen animacion de explosion.
      reproducir('brick');
    } else {
      // Efecto visual de explosion en la misma celda del ladrillo.
      explosiones.push({ x: l.x, y: l.y, ancho: l.ancho, alto: l.alto, color: l.color, t: 0 });
      reproducir('explode');
    }
    break; // un solo ladrillo por frame
  }
}

/**
 * Avanza el tiempo de cada explosion y descarta las que terminaron.
 * Puramente visual: se ejecuta tambien en GAME_OVER/VICTORIA.
 */
function actualizarExplosiones(dt) {
  for (const e of explosiones) {
    e.t += dt * (1000 / 60); // dt en frames -> ms reales
  }
  explosiones = explosiones.filter((e) => e.t < EXPLOSION_DURACION_MS);
}

// Angulo maximo de rebote respecto a la vertical (en los extremos del paddle).
const ANGULO_MAX_PADDLE = Math.PI / 3; // 60deg

/** Rebote en el paddle: el angulo depende del punto de impacto (sonido 'paddle'). */
function rebotarPaddle() {
  if (pelota.vy <= 0) return; // solo cuando la pelota baja

  // Solapamiento AABB pelota-paddle
  const tocando =
    pelota.x + pelota.ancho >= paddle.x &&
    pelota.x <= paddle.x + paddle.ancho &&
    pelota.y + pelota.alto >= paddle.y &&
    pelota.y <= paddle.y + paddle.alto;
  if (!tocando) return;

  // Offset normalizado [-1, 1]: -1 borde izquierdo, 0 centro, +1 borde derecho.
  const centroPelota = pelota.x + pelota.ancho / 2;
  const centroPaddle = paddle.x + paddle.ancho / 2;
  let offset = (centroPelota - centroPaddle) / (paddle.ancho / 2);
  if (offset > 1) offset = 1;
  if (offset < -1) offset = -1;

  // Nuevo angulo manteniendo la magnitud de velocidad constante.
  const ang = offset * ANGULO_MAX_PADDLE;
  pelota.vx = pelota.velocidad * Math.sin(ang);
  pelota.vy = -pelota.velocidad * Math.cos(ang);

  // Reposicionar encima del paddle para no quedar atrapada dentro.
  pelota.y = paddle.y - pelota.alto;

  reproducir('paddle');
}

/** Rebotes en paredes laterales y techo (sonido 'wall'). */
function rebotarParedes() {
  let reboto = false;

  // Pared izquierda
  if (pelota.x <= 0) {
    pelota.x = 0;
    pelota.vx = -pelota.vx;
    reboto = true;
  }
  // Pared derecha
  if (pelota.x + pelota.ancho >= CANVAS_ANCHO) {
    pelota.x = CANVAS_ANCHO - pelota.ancho;
    pelota.vx = -pelota.vx;
    reboto = true;
  }
  // Techo
  if (pelota.y <= 0) {
    pelota.y = 0;
    pelota.vy = -pelota.vy;
    reboto = true;
  }

  if (reboto) {
    reproducir('wall');
  }
}

// Accion principal del jugador (click / barra espaciadora):
// avanza las pantallas y, en juego, lanza la pelota.
function accionPrincipal() {
  switch (estado.pantalla) {
    case PANTALLA.INICIO:
      reproducir('click');
      estado.pantalla = PANTALLA.JUGANDO;
      break;
    case PANTALLA.JUGANDO:
      lanzarPelota();
      break;
    case PANTALLA.PAUSA:
      confirmarSeleccionNivel(); // saltar al nivel resaltado y reanudar
      break;
    case PANTALLA.GAME_OVER:
    case PANTALLA.VICTORIA:
      reproducir('click');
      reiniciarPartida();
      estado.pantalla = PANTALLA.JUGANDO;
      break;
  }
}

// --------------------------------------------------------------------- //
// Pausa y selector de niveles (tecla P)
// --------------------------------------------------------------------- //

/** Alterna entre JUGANDO y PAUSA. Reanudar con P no cambia de nivel. */
function alternarPausa() {
  if (estado.pantalla === PANTALLA.JUGANDO) {
    estado.pantalla = PANTALLA.PAUSA;
    estado.seleccionNivel = estado.nivel; // el cursor arranca en el nivel actual
    reproducir('click');
  } else if (estado.pantalla === PANTALLA.PAUSA) {
    estado.pantalla = PANTALLA.JUGANDO;
    reproducir('click');
  }
}

/** Mueve el cursor del selector de niveles (con envoltura circular). */
function moverSeleccionNivel(delta) {
  if (estado.pantalla !== PANTALLA.PAUSA) return;
  estado.seleccionNivel = (estado.seleccionNivel + delta + NIVELES.length) % NIVELES.length;
  reproducir('click');
}

/** Salta al nivel resaltado (lo prepara desde cero) y reanuda el juego. */
function confirmarSeleccionNivel() {
  if (estado.pantalla !== PANTALLA.PAUSA) return;
  prepararNivel(estado.seleccionNivel); // ajusta velocidad segun el indice
  estado.pantalla = PANTALLA.JUGANDO;
  reproducir('launch');
}

lienzoInput.addEventListener('click', accionPrincipal);
window.addEventListener('keydown', (e) => {
  // Barra espaciadora: accion principal (lanzar / avanzar pantalla / confirmar).
  if (e.code === 'Space') {
    e.preventDefault(); // evita el scroll de la pagina
    accionPrincipal();
    return;
  }
  // P: pausa / reanudar.
  if (e.key === 'p' || e.key === 'P') {
    alternarPausa();
    return;
  }
  // Controles propios del selector de niveles (solo en PAUSA).
  if (estado.pantalla === PANTALLA.PAUSA && !e.repeat) {
    if (e.key === 'ArrowLeft')  moverSeleccionNivel(-1);
    if (e.key === 'ArrowRight') moverSeleccionNivel(1);
    if (e.key === 'Enter')      confirmarSeleccionNivel();
    // Teclas 1..N: saltar directo a ese nivel.
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= NIVELES.length) {
      estado.seleccionNivel = n - 1;
      confirmarSeleccionNivel();
    }
  }
});
