// Inyector masivo: lee líneas "idioma|palabra|traduccion" por stdin o por archivo
// y las manda al archivo de su letra inicial, sin tildes y sin duplicados.
//   node app/agregar.js < lista.txt
//   type lista.txt | node app/agregar.js
// idiomas: es (español común) · esp (solo España) · mx (solo Latinoamérica) · en (inglés)
const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "..");
const LANGS = ["es", "esp", "mx", "en", "pauli"];
const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

const entrada = process.argv[2]
  ? fs.readFileSync(process.argv[2], "utf8")
  : fs.readFileSync(0, "utf8");

const porArchivo = new Map();
let leidas = 0, malas = 0;

for (let line of entrada.split(/\r?\n/)) {
  line = line.trim();
  if (!line || line.startsWith("#")) continue;
  const p = line.split("|");
  if (p.length < 2) { malas++; continue; }
  const lang = LANGS.includes(p[0].trim().toLowerCase()) ? p[0].trim().toLowerCase() : "en";
  const w = sinTildes(p[1].trim()).replace(/\s+/g, "");
  const t = sinTildes((p.slice(2).join("|") || "").trim());
  if (!w || /[ñÑ]/.test(w)) { malas++; continue; }
  const letra = w[0].toLowerCase();
  if (!/[a-z]/.test(letra)) { malas++; continue; }
  const file = "palabras-letra-" + letra;
  if (!porArchivo.has(file)) porArchivo.set(file, []);
  porArchivo.get(file).push({ lang, w, t });
  leidas++;
}

let agregadas = 0, repetidas = 0;
for (const [file, nuevas] of porArchivo) {
  const full = path.join(DIR, file);
  const prev = fs.existsSync(full) ? fs.readFileSync(full, "utf8").split(/\r?\n/) : [];
  const seen = new Set(prev.map(l => {
    const p = l.split("|");
    return p.length > 1 ? p[0].trim().toLowerCase() + " " + p[1].trim().toLowerCase() : "";
  }).filter(Boolean));
  const add = [];
  for (const o of nuevas) {
    const k = o.lang + " " + o.w.toLowerCase();
    if (seen.has(k)) { repetidas++; continue; }
    seen.add(k); add.push(`${o.lang}|${o.w}|${o.t}`);
  }
  if (add.length) {
    fs.appendFileSync(full, (prev.length && prev[prev.length - 1].trim() ? "\r\n" : "") + add.join("\r\n") + "\r\n", "utf8");
    agregadas += add.length;
  }
  console.log(file.padEnd(20), "+" + add.length);
}
console.log(`\nleídas ${leidas} · agregadas ${agregadas} · repetidas ${repetidas} · descartadas ${malas}`);
