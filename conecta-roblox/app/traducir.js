// Rellena las traducciones que faltan usando un diccionario bilingüe real.
//   node app/traducir.js <carpeta_fuentes>
// Espera muse_enes.txt y muse_esen.txt ("palabra traduccion" por línea).
// Si una palabra no está en el diccionario, se queda SIN traducción: no se inventa nada.
const fs = require("fs");
const path = require("path");
const SRC = process.argv[2];
const DIR = path.join(__dirname, "..");
const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ñ/g, "n");

function cargar(file) {
  const m = new Map();                 // palabra -> primera traducción (la más frecuente)
  for (const line of fs.readFileSync(path.join(SRC, file), "utf8").split(/\r?\n/)) {
    const p = line.trim().split(/\s+/);
    if (p.length < 2) continue;
    const a = sinTildes(p[0].toLowerCase());
    const b = sinTildes(p.slice(1).join(" ").toLowerCase());
    if (!a || !b || a === b) continue;
    if (!m.has(a)) m.set(a, b);
  }
  return m;
}

console.log("cargando diccionarios bilingües…");
const EN2ES = cargar("muse_enes.txt");
const ES2EN = cargar("muse_esen.txt");
console.log(`  MUSE: en→es ${EN2ES.size.toLocaleString("es")} · es→en ${ES2EN.size.toLocaleString("es")}`);

// segunda fuente: diccionario derivado de Wiktionary (<c>inglés</c><d>español</d>)
try {
  const xml = fs.readFileSync(path.join(SRC, "enes_dic.xml"), "utf8");
  const re = /<c>([^<]*)<\/c>\s*<d>([^<]*)<\/d>/g;
  let m, n = 0;
  const limpia = s => sinTildes(s.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "")
                       .split(/[,;]/)[0].trim().toLowerCase());
  while ((m = re.exec(xml))) {
    const en = sinTildes(m[1].trim().toLowerCase());
    const es = limpia(m[2]);
    if (!en || !es || en === es || /[^a-z ]/.test(en) || /[^a-z ]/.test(es)) continue;
    if (!en.includes(" ") && !EN2ES.has(en)) { EN2ES.set(en, es); n++; }
    if (!es.includes(" ") && !ES2EN.has(es)) { ES2EN.set(es, en); n++; }
  }
  console.log(`  Wiktionary: +${n.toLocaleString("es")} entradas`);
} catch (e) { console.log("  (sin enes_dic.xml)"); }
console.log(`  TOTAL: en→es ${EN2ES.size.toLocaleString("es")} · es→en ${ES2EN.size.toLocaleString("es")}`);

// El diccionario bilingüe solo trae formas base. Como el español está lleno de
// conjugaciones y plurales, buscamos la palabra y, si no aparece, su lema.
// Nunca se inventa: el lema tiene que existir de verdad en el diccionario.
function candidatosEs(w) {
  const c = [];
  const add = x => { if (x && x.length >= 3) c.push(x); };
  if (w.endsWith("se")) add(w.slice(0, -2));                    // reflexivos: lavarse -> lavar
  if (w.endsWith("mente")) { const b = w.slice(0, -5); add(b); add(b.replace(/a$/, "o")); }
  if (w.endsWith("es")) add(w.slice(0, -2));                    // plurales
  if (w.endsWith("s"))  add(w.slice(0, -1));
  if (w.endsWith("as")) add(w.slice(0, -2) + "o");              // género
  if (w.endsWith("os")) add(w.slice(0, -2) + "o");
  if (w.endsWith("a"))  add(w.slice(0, -1) + "o");
  if (w.endsWith("cita") || w.endsWith("cito")) add(w.slice(0, -4) + "o");
  for (let n = 1; n <= 6; n++) {                                // verbos -> infinitivo
    const raiz = w.slice(0, w.length - n);
    if (raiz.length < 3) break;
    for (const r of [raiz,
                     raiz.replace(/zc$/, "c"),                  // agradezco -> agradecer
                     raiz.replace(/g$/, "gu"), raiz.replace(/j$/, "g"),
                     raiz.replace(/ue([^u]*)$/, "o$1"),         // puedo -> poder
                     raiz.replace(/ie([^e]*)$/, "e$1"),         // siento -> sentir
                     raiz.replace(/i([^i]*)$/, "e$1"),          // pidio -> pedir
                     raiz.replace(/uv$/, "en"), raiz.replace(/ui$/, "uir")]) {
      if (r.length < 3) continue;
      add(r + "ar"); add(r + "er"); add(r + "ir");
    }
  }
  return c;
}
function candidatosEn(w) {
  const c = [];
  const add = x => { if (x && x.length >= 3) c.push(x); };
  if (w.endsWith("ies")) add(w.slice(0, -3) + "y");
  if (w.endsWith("es"))  add(w.slice(0, -2));
  if (w.endsWith("s"))   add(w.slice(0, -1));
  if (w.endsWith("ing")) { const b = w.slice(0, -3); add(b); add(b + "e");
                           if (b.length > 2 && b[b.length - 1] === b[b.length - 2]) add(b.slice(0, -1)); }
  if (w.endsWith("ied"))  add(w.slice(0, -3) + "y");
  if (w.endsWith("ed"))  { const b = w.slice(0, -2); add(b); add(b + "e");
                           if (b.length > 2 && b[b.length - 1] === b[b.length - 2]) add(b.slice(0, -1)); }
  if (w.endsWith("ly"))  { const b = w.slice(0, -2); add(b); add(b.replace(/i$/, "y")); }
  if (w.endsWith("er") || w.endsWith("est")) {
    const b = w.slice(0, w.endsWith("er") ? -2 : -3); add(b); add(b + "e");
    if (b.length > 2 && b[b.length - 1] === b[b.length - 2]) add(b.slice(0, -1));
  }
  if (w.endsWith("ness")) add(w.slice(0, -4));
  return c;
}
function buscar(map, w, es) {
  if (map.has(w)) return map.get(w);
  for (const b of (es ? candidatosEs(w) : candidatosEn(w))) if (map.has(b)) return map.get(b);
  return null;
}

let total = 0, tenian = 0, puestas = 0, sinSuerte = 0;
const faltan = [];

for (const f of fs.readdirSync(DIR)) {
  const m = /^palabras-(letra|acaban|empiezan)-(.+)$/.exec(f);
  if (!m) continue;
  const especial = m[1] !== "letra";
  const src = fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/);
  const out = [];
  for (const line of src) {
    const t = line.trim();
    if (!t) continue;
    const p = t.includes("|") ? t.split("|") : ["en", t, ""];   // listas planas = inglés
    if (p.length < 2) { out.push(t); continue; }
    const lang = p[0], w = p[1], trad = (p.slice(2).join("|") || "").trim();
    total++;
    if (trad) { tenian++; out.push(t); continue; }
    const esEs = lang !== "en";
    const hit = buscar(esEs ? ES2EN : EN2ES, w.toLowerCase(), esEs);
    if (hit) { puestas++; out.push(`${lang}|${w}|${hit}`); }
    else { sinSuerte++; if (faltan.length < 12) faltan.push(w); out.push(t); }
  }
  fs.writeFileSync(path.join(DIR, f), out.join("\r\n") + "\r\n", "utf8");
  process.stdout.write(".");
}

console.log(`\n
palabras revisadas : ${total.toLocaleString("es")}
ya tenían          : ${tenian.toLocaleString("es")}
traducidas ahora   : ${puestas.toLocaleString("es")}
sin traducción     : ${sinSuerte.toLocaleString("es")}  (${(sinSuerte * 100 / total).toFixed(1)}%)
cobertura final    : ${((tenian + puestas) * 100 / total).toFixed(1)}%
ejemplos sin traducir: ${faltan.join(", ")}`);
