# Luxe Estate

Landing de bienes raíces de lujo hecha con vibe coding junto a Claude: portada con buscador y filtros, colecciones destacadas, novedades del mercado y tarjetas de propiedades con datos de ejemplo.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

## Ejecutar

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Cómo está organizado

| Ruta | Qué es |
|---|---|
| `app/page.tsx` | Portada |
| `app/components/` | Hero, colecciones destacadas, novedades y tarjetas de propiedades |
| `app/data/` | Propiedades de ejemplo |
| `antigravity/` | Brief de diseño, instrucciones y pantalla de referencia con las que se construyó |
| `CLAUDE.md`, `AGENTS.md` | Instrucciones para el agente de IA |
