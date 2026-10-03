// CONECTA - servidor local sin dependencias.
// Lee/escribe los archivos "palabras-*" de la carpeta padre.
//   palabras-letra-a       ->  lineas "es|palabra|traduccion"
//   palabras-empiezan-ly   ->  lineas "palabra"  (listas simples, ingles)
const http = require("http");
const fs   = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT     = Number(process.env.PORT) || 7777;
const WORD_DIR = path.join(__dirname, "..");
const HTML     = path.join(__dirname, "index.html");
const BAK_DIR  = path.join(__dirname, "backups");

const RE_FILE = /^palabras-(acaban|empiezan|letra)-(.+?)(?:\.txt)?$/i;
const ABC = "abcdefghijklmnñopqrstuvwxyz";

/* ---------------- lectura ---------------- */
function listFiles() {
  const map = new Map();
  for (const f of fs.readdirSync(WORD_DIR)) {
    const m = RE_FILE.exec(f);
    if (m) map.set(m[1].toLowerCase() + "-" + m[2].toLowerCase(), f);
  }
  return map;
}

// idiomas:  es = español común · esp = solo España · mx = solo Latinoamérica · en = inglés
const LANGS = ["es", "esp", "mx", "en", "pauli"];
const normLang = s => {
  s = String(s || "").trim().toLowerCase();
  return LANGS.includes(s) ? s : (s === "la" || s === "lat" ? "mx" : (s === "es" ? "es" : "en"));
};

function readList(file, kind) {
  const raw = fs.readFileSync(path.join(WORD_DIR, file), "utf8");
  const out = [];
  for (let line of raw.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.includes("|")) {
      const [lang, w, ...rest] = line.split("|");
      const word = (w || "").trim();
      if (!word || word.includes(" ")) continue;
      out.push({ w: word, t: rest.join("|").trim(), lang: normLang(lang) });
    } else {
      if (line.includes(" ") || line.includes(":")) continue;
      out.push({ w: line, t: "", lang: "en" });
    }
  }
  return out;
}

function loadLists() {
  const out = [];
  for (const [id, file] of listFiles()) {
    const m = RE_FILE.exec(file);
    const kind = m[1].toLowerCase(), key = m[2].toLowerCase();
    out.push({
      id, kind, key,
      label: kind === "letra"    ? `Letra ${key.toUpperCase()}`
           : kind === "acaban"   ? `Acaban en -${key}`
           :                       `Empiezan con ${key}-`,
      short: kind === "letra"    ? key.toUpperCase()
           : kind === "acaban"   ? `…${key}`
           :                       `${key}…`,
      words: readList(file, kind)
    });
  }
  const rank = c => c.kind === "letra"
    ? (ABC.indexOf(c.key) < 0 ? 90 : ABC.indexOf(c.key))
    : 200 + (c.kind === "empiezan" ? 0 : 1);
  out.sort((a, b) => rank(a) - rank(b) || a.key.localeCompare(b.key));
  return out;
}

/* ---------------- caché ----------------
   Con ~45.000 palabras releer y parsear todo en cada carga tarda segundos.
   Guardamos el resultado y solo lo recalculamos si algún archivo cambió.      */
let cacheLists = null, cacheKey = "", cacheHtml = null, cacheHtmlKey = "";
function huella() {
  let k = "";
  for (const [, f] of listFiles()) {
    const st = fs.statSync(path.join(WORD_DIR, f));
    k += f + ":" + st.mtimeMs + ":" + st.size + ";";
  }
  return k;
}
function listas() {
  const k = huella();
  if (cacheLists && k === cacheKey) return cacheLists;
  cacheLists = loadLists(); cacheKey = k;
  cacheHtml = null;                       // los datos cambiaron -> rehacer html
  return cacheLists;
}
function paginaHtml() {
  const datos = listas();                 // ojo: primero refrescar (actualiza cacheKey)
  const st = fs.statSync(HTML);
  const k  = cacheKey + "|" + st.mtimeMs + ":" + st.size;
  if (cacheHtml && k === cacheHtmlKey) return cacheHtml;
  cacheHtml    = fs.readFileSync(HTML, "utf8").split("__DATA__").join(JSON.stringify(datos));
  cacheHtmlKey = k;
  return cacheHtml;
}

/* ---------------- escritura ---------------- */
function resolveFile(id) {
  const f = listFiles().get(String(id || "").toLowerCase());
  if (!f) throw new Error("lista no encontrada: " + id);
  return f;
}

function serialize(words, kind) {
  return words.map(o => kind === "letra"
    ? `${o.lang}|${o.w}|${o.t || ""}`
    : o.w).join("\r\n") + "\r\n";
}

function writeList(file, words, kind) {
  const full = path.join(WORD_DIR, file);
  fs.mkdirSync(BAK_DIR, { recursive: true });
  if (fs.existsSync(full)) fs.copyFileSync(full, path.join(BAK_DIR, file + ".bak"));
  const tmp = full + ".tmp";
  fs.writeFileSync(tmp, serialize(words, kind), "utf8");
  fs.renameSync(tmp, full);
}

const clean = s => String(s == null ? "" : s).trim().replace(/[|\r\n]/g, " ").trim();
const kkey  = o => (o.lang || "en") + " " + o.w.toLowerCase();
// el juego no acepta tildes ni ñ
const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
                        .replace(/ñ/g, "n").replace(/Ñ/g, "N");

/* ---------------- api ---------------- */
const API = {
  "/api/lists": () => ({ lists: listas() }),

  "/api/words/add": body => {
    const file = resolveFile(body.id);
    const kind = RE_FILE.exec(file)[1].toLowerCase();
    const cur  = readList(file, kind);
    const seen = new Set(cur.map(kkey));
    const dup = [];
    let added = 0;
    for (const raw of (body.words || [])) {
      const w = clean(raw.w).replace(/\s+/g, "");
      if (!w) continue;
      const o = { w: sinTildes(w), t: clean(raw.t), lang: normLang(raw.lang) };
      if (seen.has(kkey(o))) { dup.push(w); continue; }
      seen.add(kkey(o)); cur.push(o); added++;
    }
    if (added) writeList(file, cur, kind);
    return { words: cur, added, dup: dup.length, dupList: dup.slice(0, 20) };
  },

  "/api/words/del": body => {
    const file = resolveFile(body.id);
    const kind = RE_FILE.exec(file)[1].toLowerCase();
    const kill = new Set((body.words || []).map(o =>
      normLang(o.lang) + " " + clean(o.w).toLowerCase()));
    const cur  = readList(file, kind);
    const kept = cur.filter(o => !kill.has(kkey(o)));
    if (kept.length !== cur.length) writeList(file, kept, kind);
    return { words: kept, removed: cur.length - kept.length };
  },

  "/api/words/edit": body => {          // corregir una traduccion
    const file = resolveFile(body.id);
    const kind = RE_FILE.exec(file)[1].toLowerCase();
    const cur  = readList(file, kind);
    const k = normLang(body.lang) + " " + clean(body.w).toLowerCase();
    let hit = 0;
    for (const o of cur) if (kkey(o) === k) { o.t = clean(body.t); hit++; }
    if (hit) writeList(file, cur, kind);
    return { words: cur, edited: hit };
  },

  "/api/lists/add": body => {
    const kind = String(body.kind || "").toLowerCase();
    const key  = String(body.key || "").trim().toLowerCase();
    if (!["acaban", "empiezan", "letra"].includes(kind)) throw new Error("tipo inválido");
    if (!/^[a-z0-9áéíóúüñ-]{1,14}$/.test(key)) throw new Error("nombre inválido (letras/números, máx 14)");
    if (listFiles().has(kind + "-" + key)) throw new Error("esa lista ya existe");
    fs.writeFileSync(path.join(WORD_DIR, `palabras-${kind}-${key}`), "", "utf8");
    return { lists: loadLists() };
  },

  "/api/lists/del": body => {
    const file = resolveFile(body.id);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    fs.renameSync(path.join(WORD_DIR, file),
                  path.join(WORD_DIR, `_papelera-${file}-${stamp}.txt`));
    return { lists: loadLists() };      // no se borra: se renombra
  }
};

/* ---------------- servidor ---------------- */
const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  const send = (code, obj) => {
    res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(JSON.stringify(obj));
  };

  if (url.startsWith("/api/")) {
    const fn = API[url];
    if (!fn) return send(404, { error: "no existe" });
    let raw = "";
    req.on("data", c => { raw += c; if (raw.length > 2e7) req.destroy(); });
    req.on("end", () => {
      try { send(200, fn(raw ? JSON.parse(raw) : {})); }
      catch (e) { send(400, { error: e.message }); }
    });
    return;
  }

  if (url !== "/" && url !== "/index.html") {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    return res.end("404");
  }
  try {
    const html = paginaHtml();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(html);
  } catch (e) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Error: " + e.message);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const l = loadLists();
  const tot = l.reduce((a, c) => a + c.words.length, 0);
  const es  = l.reduce((a, c) => a + c.words.filter(w => w.lang === "es").length, 0);
  console.log(`\n  CONECTA  ->  http://localhost:${PORT}`);
  console.log(`  ${l.length} listas · ${tot} palabras (${es} español / ${tot - es} inglés)`);
  console.log(`  Ctrl+C para salir.\n`);
  if (!process.env.NO_OPEN) exec(`start "" http://localhost:${PORT}`);
});
