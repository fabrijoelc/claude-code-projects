// Llena las listas "empiezan-XX" / "acaban-XX" (apartado inglés) con todo lo que
// exista en el diccionario inglés.
//   node app/importar-especiales.js <carpeta_fuentes> [tope_por_lista]
// Orden: primero las más usadas (lista de frecuencia), luego el resto por longitud.
const fs = require("fs");
const path = require("path");
const SRC  = process.argv[2];
const TOPE = Number(process.argv[3] || 4000);
const DIR  = path.join(__dirname, "..");
const RE   = /^palabras-(acaban|empiezan)-(.+?)(?:\.txt)?$/i;
const leer = f => fs.readFileSync(path.join(SRC, f), "utf8").split(/\r?\n/);

const dic = new Set();
for (const l of leer("en_dic.txt")) {
  const w = l.trim().toLowerCase();
  if (/^[a-z]{2,16}$/.test(w)) dic.add(w);
}
const frec = [], vis = new Set();
for (const l of leer("en_freq.txt")) {
  const w = (l.split(/\s+/)[0] || "").trim().toLowerCase();
  if (dic.has(w) && !vis.has(w)) { vis.add(w); frec.push(w); }
}
const resto = [...dic].filter(w => !vis.has(w)).sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
console.log(`diccionario inglés ${dic.size.toLocaleString("es")} · frecuentes ${frec.length.toLocaleString("es")}\n`);

let totalAntes = 0, totalDespues = 0;
for (const f of fs.readdirSync(DIR)) {
  const m = RE.exec(f);
  if (!m) continue;
  const kind = m[1].toLowerCase(), key = m[2].toLowerCase();
  const cumple = kind === "acaban" ? w => w.endsWith(key) : w => w.startsWith(key);
  const full = path.join(DIR, f);

  const prev = fs.readFileSync(full, "utf8").split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                 .map(l => (l.includes("|") ? l.split("|")[1] : l).trim().toLowerCase());
  const seen = new Set();
  const salida = [];
  for (const w of prev) if (w && !seen.has(w)) { seen.add(w); salida.push(w); }
  const antes = salida.length;

  let hay = 0;
  for (const fuente of [frec, resto]) {
    for (const w of fuente) {
      if (!cumple(w)) continue;
      hay++;
      if (salida.length >= TOPE || seen.has(w)) continue;
      seen.add(w); salida.push(w);
    }
  }
  fs.writeFileSync(full, salida.join("\r\n") + "\r\n", "utf8");
  totalAntes += antes; totalDespues += salida.length;
  console.log(`${f.padEnd(24)} ${String(antes).padStart(5)} -> ${String(salida.length).padStart(5)}   (existen ${hay.toLocaleString("es")} en total)`);
}
console.log(`\nTOTAL listas especiales: ${totalAntes.toLocaleString("es")} -> ${totalDespues.toLocaleString("es")}  (+${(totalDespues - totalAntes).toLocaleString("es")})`);
