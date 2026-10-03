/**
 * dibujo.js — Render de las entidades con ctx.drawImage usando las cajas
 * de SPRITESHEET. La imagen fuente vive en main.js (imagenSheet).
 */

/** Dibuja el paddle (sprite paddle.sizes.medium, 64x14 -> 1:1 con el paddle). */
function dibujarPaddle(ctx, img) {
  const s = SPRITESHEET.paddle.sizes.medium;
  ctx.drawImage(img, s.x, s.y, s.w, s.h, paddle.x, paddle.y, paddle.ancho, paddle.alto);
}

/** Dibuja la pelota (sprite balls.normal, 16x16). */
function dibujarPelota(ctx, img) {
  const s = SPRITESHEET.balls.normal;
  ctx.drawImage(img, s.x, s.y, s.w, s.h, pelota.x, pelota.y, pelota.ancho, pelota.alto);
}

/** Dibuja todos los ladrillos vivos, escalando la celda 32x16 al tamano de grilla. */
function dibujarLadrillos(ctx, img) {
  for (const l of ladrillos) {
    if (!l.vivo) continue;
    const def = SPRITESHEET.bricks[l.color];
    // Especiales (wood/stone): sprite intacto o agrietado segun los golpes recibidos.
    const s = def.frames
      ? def.frames[l.golpes >= l.golpesMax ? 0 : def.frames.length - 1]
      : def.frame;
    ctx.drawImage(img, s.x, s.y, s.w, s.h, l.x, l.y, l.ancho, l.alto);
  }
}

/** Dibuja las explosiones activas, escalando el frame actual a la celda del ladrillo. */
function dibujarExplosiones(ctx, img) {
  for (const e of explosiones) {
    const frames = getExplosionFrames(e.color);
    if (frames.length === 0) continue;
    const i = Math.min(Math.floor(e.t / EXPLOSION_FRAME_MS), 9);
    const s = frames[i];
    ctx.drawImage(img, s.x, s.y, s.w, s.h, e.x, e.y, e.ancho, e.alto);
  }
}

/** HUD: vidas y score en la franja superior. */
function dibujarHUD(ctx) {
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.textBaseline = 'top';

  ctx.textAlign = 'left';
  ctx.fillText('VIDAS: ' + estado.vidas, 12, 8);

  ctx.textAlign = 'center';
  ctx.fillText('NIVEL ' + (estado.nivel + 1) + '/' + NIVELES.length, CANVAS_ANCHO / 2, 8);

  ctx.textAlign = 'right';
  ctx.fillText('SCORE: ' + estado.score, CANVAS_ANCHO - 12, 8);
}

/** Texto centrado horizontalmente en una y dada. */
function textoCentrado(ctx, texto, y, tamano, color) {
  ctx.fillStyle = color;
  ctx.font = tamano + 'px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, CANVAS_ANCHO / 2, y);
}

/** Capa semitransparente para las pantallas de fin. */
function velo(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, CANVAS_ANCHO, CANVAS_ALTO);
}

/** Pantalla de inicio. */
function dibujarPantallaInicio(ctx) {
  textoCentrado(ctx, 'ARKANOID', CANVAS_ALTO / 2 - 60, 48, '#ffffff');
  textoCentrado(ctx, 'Click para empezar', CANVAS_ALTO / 2 + 10, 22, '#cccccc');
  textoCentrado(ctx, 'Mouse o flechas para mover  ·  Espacio/Click para lanzar',
    CANVAS_ALTO / 2 + 50, 14, '#888888');
  textoCentrado(ctx, 'P para pausar y elegir nivel', CANVAS_ALTO / 2 + 74, 14, '#888888');
}

/** Pantalla de PAUSA con el selector de niveles. */
function dibujarPantallaPausa(ctx) {
  velo(ctx);
  textoCentrado(ctx, 'PAUSA', 110, 42, '#ffffff');
  textoCentrado(ctx, 'Seleccionar nivel', 152, 18, '#cccccc');

  const baseY = 215;
  const paso = 42;
  for (let i = 0; i < NIVELES.length; i++) {
    const y = baseY + i * paso;
    const seleccionado = i === estado.seleccionNivel;
    const esActual = i === estado.nivel;

    let etiqueta = 'NIVEL ' + (i + 1);
    if (esActual) etiqueta += '  (actual)';
    if (seleccionado) etiqueta = '> ' + etiqueta + ' <';

    const color = seleccionado ? '#ffe066' : '#888888';
    const tam = seleccionado ? 26 : 20;
    textoCentrado(ctx, etiqueta, y, tam, color);
  }

  textoCentrado(ctx, '←/→ elegir   Enter/Espacio ir   P reanudar',
    CANVAS_ALTO - 40, 14, '#aaaaaa');
}

/** Pantalla de game over. */
function dibujarPantallaGameOver(ctx) {
  velo(ctx);
  textoCentrado(ctx, 'GAME OVER', CANVAS_ALTO / 2 - 50, 44, '#ff5566');
  textoCentrado(ctx, 'Score: ' + estado.score, CANVAS_ALTO / 2 + 5, 22, '#ffffff');
  textoCentrado(ctx, 'Click o Espacio para reiniciar', CANVAS_ALTO / 2 + 45, 16, '#cccccc');
}

/** Pantalla de victoria final (tras superar el ultimo nivel). */
function dibujarPantallaVictoria(ctx) {
  velo(ctx);
  textoCentrado(ctx, '¡COMPLETASTE EL JUEGO!', CANVAS_ALTO / 2 - 55, 30, '#66dd88');
  textoCentrado(ctx, 'Superaste los ' + NIVELES.length + ' niveles', CANVAS_ALTO / 2 - 15, 18, '#cccccc');
  textoCentrado(ctx, 'Score: ' + estado.score, CANVAS_ALTO / 2 + 20, 22, '#ffffff');
  textoCentrado(ctx, 'Click o Espacio para reiniciar', CANVAS_ALTO / 2 + 55, 16, '#cccccc');
}
