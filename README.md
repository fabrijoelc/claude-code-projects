<div align="center">

# Claude Code Projects

**Juegos y aplicaciones que construí programando con Claude Code.**

Los del curso de Claude Code de [DevTalles](https://devtalles.com) y mis proyectos personales.

<p>
  <img src="https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-Canvas-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5 Canvas">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
</p>

</div>

## Proyectos

| Proyecto | Qué es | Tecnologías | Origen |
|---|---|---|---|
| [first-code](./first-code) | Primeros pasos: un hola mundo y un contador con botones | HTML, CSS, JavaScript | Curso DevTalles |
| [claude-tetris](./claude-tetris) | Tetris con pieza guardada, combos, poderes, desafíos, skins, récords y sonido | JavaScript vanilla, Canvas | Curso DevTalles |
| [arkanoid](./arkanoid) | Arkanoid con niveles, vidas, pausa, efectos de sonido y control con mouse o teclado | JavaScript vanilla, Canvas | Curso DevTalles |
| [arcade-vault](./arcade-vault) | Plataforma para jugar online y competir por puntos, construida con Spec Driven Design | Next.js 16, React 19, TypeScript, Tailwind CSS 4 | Curso DevTalles |
| [conecta-roblox](./conecta-roblox) | Cuadernillo bilingüe de palabras para los juegos de palabras de Roblox | Node.js, HTML, JavaScript | Personal |
| [luxe-estate](./luxe-estate) | Landing de bienes raíces de lujo con buscador, filtros y colecciones destacadas | Next.js 16, React 19, TypeScript, Tailwind CSS 4 | Personal |

## Cómo trabajé

- Cada proyecto nació conversando con Claude Code. La mayoría conserva su `CLAUDE.md` con las instrucciones que siguió el agente.
- `arcade-vault` sigue Spec Driven Design: primero la especificación en `specs/` y después la implementación, con las [skills de Fernando Herrera](https://github.com/Klerith/fernando-skills).
- `luxe-estate` partió de un brief de diseño y una pantalla de referencia, guardados en `luxe-estate/antigravity/`.

## Ejecutar

| Proyecto | Cómo |
|---|---|
| `first-code`, `claude-tetris`, `arkanoid` | Abrir `index.html` en el navegador o servir la carpeta con `npx serve` |
| `arcade-vault`, `luxe-estate` | `npm install` y `npm run dev` → <http://localhost:3000> |
| `conecta-roblox` | `node app/server.js` → <http://localhost:7777> (en Windows, `INICIAR.bat`) |

Este repositorio también forma parte de [cursos-devtalles](https://github.com/fabrijoelc/cursos-devtalles).

## Autor

**Fabrizio Allcca** · [@fabrijoelc](https://github.com/fabrijoelc)
