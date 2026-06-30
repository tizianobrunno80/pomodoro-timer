/* Genera audio/manifest.json da tutti gli .mp3 nella cartella.
   Legge i tag interni (titolo/genere) via ffprobe se presenti; altrimenti li ricava dal nome file.
   Uso:  node build-manifest.cjs           (scansiona la cartella corrente)
         node build-manifest.cjs <dir>     (scansiona <dir>)
*/
const fs = require("fs"), path = require("path");
let execSync; try { execSync = require("child_process").execSync; } catch(e){}

const dir = process.argv[2] || ".";
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".mp3")).sort();

// Override manuali di genere (substring del nome file -> genere). Hanno priorità sul rilevamento.
const GENRE_OVERRIDES = {
  "boss-shit": "rap",
  "organic-flow": "rap",
  "built-for-this": "rap",
  "hollow-road": "rock",
  "awakened": "rap",
  "sistemas-de-ecuaciones": "rap"
};
function classify(s){
  s = s.toLowerCase();
  for(const key in GENRE_OVERRIDES){ if(s.indexOf(key) >= 0) return GENRE_OVERRIDES[key]; }
  if(/jazz|jazzy/.test(s)) return "jazz";
  if(/rock/.test(s)) return "rock";
  if(/lo-?fi|chill|ambient|instrumental/.test(s)) return "lofi";
  if(/rap|hip-?hop|trap|beat/.test(s)) return "rap";
  return "other";
}
function titleFromName(f){
  let s = f.replace(/\.[^.]+$/,"");          // drop extension
  s = s.replace(/-?\d{4,}$/,"");             // drop trailing pixabay id
  let parts = s.split("-");
  if(parts.length > 1) parts.shift();        // drop uploader handle (first token)
  s = parts.join(" ").replace(/_/g," ").replace(/\s+/g," ").trim();
  const w = s.split(" "), out = [];          // dedupe consecutive repeated words
  for(const x of w){ if(!out.length || out[out.length-1].toLowerCase() !== x.toLowerCase()) out.push(x); }
  return out.join(" ").replace(/\b\w/g, c => c.toUpperCase());
}
function probe(f){
  if(!execSync) return {};
  try{
    const out = execSync('ffprobe -v quiet -print_format json -show_format ' + JSON.stringify(path.join(dir,f)), {encoding:"utf8"});
    return (JSON.parse(out).format || {}).tags || {};
  }catch(e){ return {}; }
}

const man = files.map(f => {
  const tags = probe(f);
  const g = (tags.genre || tags.GENRE || "").trim();
  const ti = (tags.title || tags.TITLE || "").trim();
  return { file: "audio/" + f, title: ti || titleFromName(f), genre: (g || classify(f)).toLowerCase() };
});
fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(man, null, 2));
// manifest.js: stesso contenuto come global, così funziona anche aprendo index.html in locale (file://)
fs.writeFileSync(path.join(dir, "manifest.js"), "window.__MUSIC = " + JSON.stringify(man) + ";\n");
console.log("Wrote manifest.json + manifest.js with " + man.length + " tracks:");
man.forEach(m => console.log("  " + m.genre.padEnd(6) + " | " + m.title));
