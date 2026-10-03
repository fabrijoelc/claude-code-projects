# CONECTA · palabras para Roblox

Cuadernillo bilingüe de palabras que hice para los juegos de palabras de Roblox: busco al instante palabras por su letra inicial o final, en español y en inglés, con su traducción.

Es una aplicación web **local**: un servidor pequeño en Node.js lee y escribe las listas de palabras, y la interfaz corre en el navegador.

## Ejecutar

Necesitas Node.js.

```bash
node app/server.js
```

Abre <http://localhost:7777>. En Windows también puedes usar `INICIAR.bat`.

## Cómo está organizado

| Ruta | Qué es |
|---|---|
| `app/server.js` | Servidor local: lee, guarda y filtra las listas de palabras |
| `app/index.html` | Interfaz del cuadernillo, con búsqueda instantánea |
| `app/agregar.js`, `importar*.js`, `limpiar.js`, `traducir.js` | Scripts para agregar, importar, limpiar y traducir palabras |
| `palabras-letra-*` | Palabras por letra inicial, en líneas `idioma\|palabra\|traducción` |
| `palabras-empiezan-*`, `palabras-acaban-*` | Listas de palabras que empiezan o terminan en ciertas letras |

Antes de modificar una lista, la aplicación guarda una copia en `app/backups/`, que no se sube al repositorio.
