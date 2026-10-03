# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado actual

Juego de Arkanoid/Breakout **funcional**. Implementado: paddle (mouse + flechas), pelota con rebotes (paredes, techo, paddle con ángulo según punto de impacto), grilla de ladrillos, 3 vidas, score, HUD, y máquina de pantallas (inicio, jugando, pausa, game over, victoria).

Features ya construidas:

- **5 niveles** data-driven en `NIVELES` (`js/entidades.js`), cada uno un layout de strings. Avance automático al limpiar un nivel; al superar el último → pantalla "¡COMPLETASTE EL JUEGO!".
- **Ladrillos especiales**: `wood` (2 golpes) y `stone` (3 golpes), con sprite agrietado según golpes restantes. Los colores rompibles de 1 golpe disparan la animación de explosión de 10 frames.
- **Velocidad progresiva**: la pelota acelera por nivel (`PELOTA_VELOCIDAD_BASE + nivel * PELOTA_VELOCIDAD_INC_NIVEL`).
- **Pausa con selector de niveles** (tecla `P`): congela la escena y permite saltar a cualquier nivel con `←/→`, `Enter`/`Espacio`/`Click` o teclas `1`–`5`.

Pendiente / fuera de alcance hasta hoy: powerups (cápsula `powerup`), multiball (pelota `small`), persistencia de high-scores, canvas responsive, soporte táctil.

## Restricción central

**Cero dependencias.** HTML, CSS y JavaScript puro (vanilla), sin frameworks, sin bundlers, sin gestor de paquetes. El juego corre sirviéndolo con cualquier servidor estático. Los `.wav` y el PNG requieren servir por HTTP, **no `file://`** (CORS al cargar imagen/audio).

## Patrón de trabajo: spec-driven design

Cada feature no trivial se **especifica antes de codear** en `specs/NN-titulo-kebab.md`. La carpeta `specs/` puede estar vacía entre features: **un spec ya implementado se elimina** (no se reutiliza; ver commit `f066b29`). El historial git es el registro permanente, no los specs.

Estructura de un spec (seguir el estilo de los specs 01 y 02 ya retirados):

1. **Encabezado** en blockquote: `Estado` (borrador · aprobado · implementado) · `Depende de` (otros SPEC o `—`) · `Fecha` · `Objetivo` (1–2 frases).
2. `## Alcance` — listas **Dentro** y **Fuera de alcance** (lo que queda para specs futuros).
3. `## Data model` — estructuras y constantes nuevas, con snippets JS.
4. `## Plan de implementación` — pasos ordenados, qué archivos toca cada uno.
5. `## Criterios de aceptación` — checklist verificable a mano en el navegador.
6. `## Decisiones` — elecciones de diseño y su porqué.
7. `## Riesgos` — qué puede salir mal y mitigación.
8. `## Lo que **no** entra en este spec`.

Flujo: redactar spec → aprobar → implementar en rama dedicada → commit(s) que referencian el `SPEC NN` en el mensaje → al mergear, retirar el spec.

## Arquitectura (orden de carga en `index.html`, dependencias primero)

1. `assets/spritesheet.js` — datos de coordenadas del PNG. **Única fuente de verdad para dibujar.** No tiene lógica.
2. `js/entidades.js` — dimensiones, `estado` global, `paddle`, `pelota`, `NIVELES`/`SIMBOLO_LADRILLO`/`PUNTOS`, generación de la grilla, `prepararNivel()` y `reiniciarPartida()`.
3. `js/dibujo.js` — render con `ctx.drawImage` y todas las pantallas (HUD, inicio, pausa, game over, victoria).
4. `js/audio.js` — precarga de `.wav` y `reproducir(nombre)` (clona el nodo para solapar efectos).
5. `js/input.js` — control del paddle por mouse y teclado (movimiento por frame).
6. `js/juego.js` — lógica de partida: lanzamiento, rebotes, colisiones, vidas, victoria/avance de nivel, pausa y selector, `accionPrincipal()` y listeners de teclado.
7. `js/main.js` — punto de entrada: carga el spritesheet, loop con delta-time normalizado a 60fps, despacha `actualizar(dt)` y `dibujar()`.

Convenciones de motor: coordenadas con origen arriba-izquierda; velocidades en **px/frame** escaladas por `dt` (1.0 ≈ 16.67 ms). La máquina de pantallas en `estado.pantalla` decide qué se actualiza y qué se dibuja.

## Assets disponibles

- `assets/spritesheet-breakout.png` (559x337) — todo el arte en un solo PNG.
- `assets/spritesheet.js` — expone globals: `SPRITESHEET`, `brickCell(col,row)`, `getExplosionFrames(colorName)`. Dibujar con `ctx.drawImage(img, s.x, s.y, s.w, s.h, dx, dy, dw, dh)`.
- `assets/sounds/*.wav` — efectos: `wall`, `paddle`, `brick`, `explode`, `powerup`, `launch`, `lose_life`, `game_over`, `win`, `click`. (`powerup` aún sin cablear.)

## Convenciones del spritesheet (ver `assets/spritesheet.js`)

- **Ladrillos**: rejilla regular, celda 32x16, origen (32,176). 6 colores rompibles de 1 golpe (`red green blue purple yellow orange`) + 2 especiales (`wood` 2 golpes, `stone` 3 golpes, con estado intacto/agrietado en `frames`). Las columnas 1..10 de cada fila de color son la animación de explosión (`getExplosionFrames`).
- **Explosión**: 10 frames, 40ms c/u, 400ms total, sin loop. Solo los colores rompibles explotan; los especiales no.
- **Paddle**: tamaños fijos (`small/medium/large/xlarge`) o 9-slice horizontal (`left`+`fill`+`right`, capWidth 16) para anchos arbitrarios.
- **Pelotas**: `normal` 16x16, `small` 12x12 (multiball).

## Idioma

Código, comentarios y commits en español (seguir el estilo de `spritesheet.js`).
