/**
 * audio.js — Carga los efectos de sonido en uso y expone reproducir(nombre).
 * Solo los sonidos dentro del alcance actual (powerup queda fuera).
 */

const SONIDOS = ['wall', 'paddle', 'brick', 'explode', 'launch', 'lose_life', 'game_over', 'win', 'click'];

const _audios = {};
for (const nombre of SONIDOS) {
  const a = new Audio(`assets/sounds/${nombre}.wav`);
  a.preload = 'auto';
  _audios[nombre] = a;
}

/**
 * Reproduce un efecto por nombre. Clona el nodo para permitir solapamiento
 * (p. ej. rebotes rapidos seguidos). Ignora el bloqueo de autoplay previo
 * a la primera interaccion del usuario.
 */
function reproducir(nombre) {
  const base = _audios[nombre];
  if (!base) return;
  const clon = base.cloneNode();
  clon.play().catch(() => {});
}
