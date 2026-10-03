// Mantenimiento de las listas:
//   1) quita TILDES de las palabras y de las traducciones (el juego no las acepta)
//   2) elimina toda palabra que contenga ñ/Ñ
//   3) elimina duplicados (misma palabra + mismo idioma dentro de una lista)
//   4) informa cuántas quedan por lista e idioma
const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "..");
const RE  = /^palabras-(acaban|empiezan|letra)-(.+?)(?:\.txt)?$/i;
const LANGS = ["es", "esp", "mx", "en", "pauli"];

const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const normLang  = s => { s = String(s || "").trim().toLowerCase();
                         return LANGS.includes(s) ? s : "en"; };

let quitadasEnye = 0, quitadasDup = 0, sinTilde = 0;
const informe = [];

for (const f of fs.readdirSync(DIR)) {
  const m = RE.exec(f);
  if (!m) continue;
  const kind = m[1].toLowerCase(), key = m[2].toLowerCase();

  if (kind === "letra" && key === "ñ") { fs.unlinkSync(path.join(DIR, f)); continue; }

  const src = fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/);
  const seen = new Set();
  const out = [];
  let enye = 0, dup = 0;

  for (let line of src) {
    line = line.trim();
    if (!line) continue;
    const bar   = line.includes("|");
    const parts = bar ? line.split("|") : [null, line, ""];
    const lang  = bar ? normLang(parts[0]) : "en";
    let word    = (parts[1] || "").trim();
    let trad    = (parts.slice(2).join("|") || "").trim();
    if (!word) continue;
    if (/[ñÑ]/.test(word)) { enye++; continue; }        // palabra con ñ -> fuera

    const w2 = sinTildes(word), t2 = sinTildes(trad);
    if (w2 !== word || t2 !== trad) sinTilde++;
    word = w2; trad = t2;

    const k = lang + " " + word.toLowerCase();
    if (seen.has(k)) { dup++; continue; }
    seen.add(k);
    out.push(bar ? `${lang}|${word}|${trad}` : word);
  }

  fs.writeFileSync(path.join(DIR, f), out.join("\r\n") + "\r\n", "utf8");
  quitadasEnye += enye; quitadasDup += dup;

  const c = l => out.filter(x => x.startsWith(l + "|")).length;
  const es = c("es"), esp = c("esp"), mx = c("mx"), pa = c("pauli");
  informe.push({ lista: key.toUpperCase(), kind,
                 espana: esp, latino: es + mx, pauli: pa, ingles: out.length - es - esp - mx - pa,
                 total: out.length, enye, dup });
}

const orden = { letra: 0, empiezan: 1, acaban: 2 };
informe.sort((a, b) => (orden[a.kind] ?? 9) - (orden[b.kind] ?? 9) || String(a.lista).localeCompare(String(b.lista)));
console.table(informe);
console.log(`\nTildes quitadas en ${sinTilde} líneas · ${quitadasEnye} palabras con ñ · ${quitadasDup} duplicados`);
const T = informe.reduce((a, c) => ({ e: a.e + c.espana, l: a.l + c.latino, p: a.p + c.pauli, i: a.i + c.ingles, t: a.t + c.total }),
                         { e: 0, l: 0, p: 0, i: 0, t: 0 });
console.log(`TOTAL ${T.t} palabras · España ${T.e} · Latino ${T.l} · Pauli ${T.p} · Inglés ${T.i}`);
