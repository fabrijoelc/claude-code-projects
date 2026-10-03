// Importador masivo desde listas públicas.
//   node app/importar.js <carpeta_fuentes> [cantidad_por_idioma]
// Espera en esa carpeta:
//   es_freq.txt / en_freq.txt  -> "palabra frecuencia" por línea (orden de uso)
//   es_dic.txt  / en_dic.txt   -> diccionario, una palabra por línea
// Cruza frecuencia x diccionario => solo palabras reales, ordenadas por uso.
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2];
const N   = Number(process.argv[3] || 20000);
const DIR = path.join(__dirname, "..");

const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const leer = f => fs.readFileSync(path.join(SRC, f), "utf8").split(/\r?\n/);

function dic(f) {
  const s = new Set();
  for (const l of leer(f)) {
    const w = sinTildes(l.trim().toLowerCase());
    if (w) s.add(w);
  }
  return s;
}

function elegir(freqFile, dicSet, n) {
  const out = [];
  const vistas = new Set();
  // 1) primero las más usadas (lista de frecuencia cruzada con el diccionario)
  for (const line of leer(freqFile)) {
    const raw = line.split(/\s+/)[0];
    if (!raw) continue;
    const low = raw.trim().toLowerCase();
    if (/[ñ]/.test(low)) continue;                       // sin ñ
    if (!/^[a-záéíóúüïçà]+$/.test(low)) continue;        // solo letras
    const w = sinTildes(low);
    if (w.length < 2 || w.length > 15) continue;
    if (!/^[a-z]+$/.test(w)) continue;
    if (vistas.has(w) || !dicSet.has(w)) continue;
    vistas.add(w); out.push(w);
    if (out.length >= n) return out;
  }
  // 2) si falta, se completa con el diccionario: primero las palabras cortas,
  //    que son las que de verdad sirven en el juego
  console.log(`  (frecuencia dio ${out.length.toLocaleString("es")}, completando desde el diccionario…)`);
  const resto = [];
  for (const w of dicSet) {
    if (vistas.has(w) || w.length < 3 || w.length > 13) continue;
    resto.push(w);
  }
  resto.sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
  for (const w of resto) { out.push(w); if (out.length >= n) break; }
  return out;
}

console.log("leyendo diccionarios…");
const dEs = dic("es_dic.txt"), dEn = dic("en_dic.txt");
console.log(`  español ${dEs.size.toLocaleString("es")} · inglés ${dEn.size.toLocaleString("es")}`);

const es = elegir("es_freq.txt", dEs, N);
const en = elegir("en_freq.txt", dEn, N);
console.log(`seleccionadas: ${es.length.toLocaleString("es")} español · ${en.length.toLocaleString("es")} inglés`);

// --- volcado a los archivos por letra, sin duplicar lo que ya existe ---
const porLetra = new Map();                 // letra -> [linea, ...]
const add = (lang, lista) => {
  for (const w of lista) {
    const L = w[0];
    if (!porLetra.has(L)) porLetra.set(L, []);
    porLetra.get(L).push(`${lang}|${w}|`);
  }
};
add("es", es); add("en", en);

let nuevas = 0, repetidas = 0;
for (const [L, lineas] of [...porLetra].sort()) {
  const file = path.join(DIR, "palabras-letra-" + L);
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/) : [];
  const seen = new Set(prev.map(l => {
    const p = l.split("|");
    return p.length > 1 ? p[0].trim().toLowerCase() + " " + p[1].trim().toLowerCase() : "";
  }).filter(Boolean));
  const add2 = [];
  for (const l of lineas) {
    const p = l.split("|");
    const k = p[0] + " " + p[1];
    if (seen.has(k)) { repetidas++; continue; }
    seen.add(k); add2.push(l);
  }
  if (add2.length) {
    const sep = prev.length && prev[prev.length - 1].trim() ? "\r\n" : "";
    fs.appendFileSync(file, sep + add2.join("\r\n") + "\r\n", "utf8");
    nuevas += add2.length;
  }
  process.stdout.write(`${L}:${add2.length} `);
}
console.log(`\n\nagregadas ${nuevas.toLocaleString("es")} · ya existían ${repetidas.toLocaleString("es")}`);
