// Llena palabras-acaban-ly con al menos N palabras por cada letra inicial (a, b, c, ... z).
//   node app/importar-ly.js <carpeta_fuentes> [por_letra]
const fs = require("fs");
const path = require("path");
const SRC = process.argv[2];
const POR = Number(process.argv[3] || 100);
const DIR = path.join(__dirname, "..");
const FILE = path.join(DIR, "palabras-acaban-ly");

const leer = f => fs.readFileSync(path.join(SRC, f), "utf8").split(/\r?\n/);

const dic = new Set();
for (const l of leer("en_dic.txt")) {
  const w = l.trim().toLowerCase();
  if (/^[a-z]{3,16}$/.test(w) && w.endsWith("ly")) dic.add(w);
}
const frec = [];
const vistas = new Set();
for (const l of leer("en_freq.txt")) {
  const w = (l.split(/\s+/)[0] || "").trim().toLowerCase();
  if (dic.has(w) && !vistas.has(w)) { vistas.add(w); frec.push(w); }
}
const resto = [...dic].filter(w => !vistas.has(w)).sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
console.log(`palabras que acaban en -ly en el diccionario: ${dic.size.toLocaleString("es")} (${frec.length} frecuentes)`);

const actual = fs.readFileSync(FILE, "utf8").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const yaEsta = new Set(actual.map(w => w.toLowerCase()));
const cuenta = {};
for (const w of actual) cuenta[w[0].toLowerCase()] = (cuenta[w[0].toLowerCase()] || 0) + 1;

const nuevas = [];
for (const L of "abcdefghijklmnopqrstuvwxyz") {
  for (const fuente of [frec, resto]) {
    for (const w of fuente) {
      if ((cuenta[L] || 0) >= POR) break;
      if (w[0] !== L || yaEsta.has(w)) continue;
      yaEsta.add(w); nuevas.push(w);
      cuenta[L] = (cuenta[L] || 0) + 1;
    }
  }
}
if (nuevas.length) fs.appendFileSync(FILE, nuevas.join("\r\n") + "\r\n", "utf8");

const fila = [];
for (const L of "abcdefghijklmnopqrstuvwxyz") fila.push(L.toUpperCase() + ":" + (cuenta[L] || 0));
console.log(fila.join("  "));
console.log(`\nagregadas ${nuevas.length} · total lista: ${actual.length + nuevas.length}`);
