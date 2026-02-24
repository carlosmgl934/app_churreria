// db.js — Capa de datos con IndexedDB
const DB_NAME = "churreria_db";
const DB_VERSION = 1;

let db;

export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains("bares")) {
        const bares = d.createObjectStore("bares", {
          keyPath: "id",
          autoIncrement: true,
        });
        bares.createIndex("nombre", "nombre", { unique: false });
      }
      if (!d.objectStoreNames.contains("repartos")) {
        const repartos = d.createObjectStore("repartos", {
          keyPath: "id",
          autoIncrement: true,
        });
        repartos.createIndex("fecha", "fecha", { unique: true });
      }
    };

    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

// ── BARES ──────────────────────────────────────────────────────────────────

export async function getBares() {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("bares", "readonly");
    const req = tx.objectStore("bares").getAll();
    req.onsuccess = () =>
      resolve(req.result.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    req.onerror = () => reject(req.error);
  });
}

export async function addBar(nombre, notas = "") {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("bares", "readwrite");
    const req = tx
      .objectStore("bares")
      .add({ nombre: nombre.trim(), notas: notas.trim() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function updateBar(id, nombre, notas = "") {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("bares", "readwrite");
    const req = tx
      .objectStore("bares")
      .put({ id, nombre: nombre.trim(), notas: notas.trim() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBar(id) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("bares", "readwrite");
    const req = tx.objectStore("bares").delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ── REPARTOS ───────────────────────────────────────────────────────────────

export async function getRepartoByFecha(fecha) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("repartos", "readonly");
    const index = tx.objectStore("repartos").index("fecha");
    const req = index.get(fecha);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllRepartos() {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("repartos", "readonly");
    const req = tx.objectStore("repartos").getAll();
    req.onsuccess = () =>
      resolve(req.result.sort((a, b) => b.fecha.localeCompare(a.fecha)));
    req.onerror = () => reject(req.error);
  });
}

export async function saveReparto(fecha, franjas) {
  // franjas: [{ hora: "6:00", pedidos: [{ barId, barNombre, churros, porras }] }]
  const d = await openDB();
  const existing = await getRepartoByFecha(fecha);
  return new Promise((resolve, reject) => {
    const tx = d.transaction("repartos", "readwrite");
    const store = tx.objectStore("repartos");
    const obj = { fecha, franjas };
    if (existing) obj.id = existing.id;
    const req = existing ? store.put(obj) : store.add(obj);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteReparto(fecha) {
  const d = await openDB();
  const existing = await getRepartoByFecha(fecha);
  if (!existing) return;
  return new Promise((resolve, reject) => {
    const tx = d.transaction("repartos", "readwrite");
    const req = tx.objectStore("repartos").delete(existing.id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ── ESTADÍSTICAS ───────────────────────────────────────────────────────────

export async function getStats() {
  const repartos = await getAllRepartos();
  const barStats = {};
  let totalChurros = 0;
  let totalPorras = 0;

  repartos.forEach((r) => {
    r.franjas.forEach((f) => {
      f.pedidos.forEach((p) => {
        totalChurros += Number(p.churros) || 0;
        totalPorras += Number(p.porras) || 0;
        if (!barStats[p.barNombre])
          barStats[p.barNombre] = { churros: 0, porras: 0, dias: 0 };
        barStats[p.barNombre].churros += Number(p.churros) || 0;
        barStats[p.barNombre].porras += Number(p.porras) || 0;
        barStats[p.barNombre].dias += 1;
      });
    });
  });

  const ranking = Object.entries(barStats)
    .map(([nombre, s]) => ({ nombre, ...s, total: s.churros + s.porras }))
    .sort((a, b) => b.total - a.total);

  return { totalChurros, totalPorras, totalRepartos: repartos.length, ranking };
}
