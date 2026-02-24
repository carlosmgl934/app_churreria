// calendar.js — Módulo de calendario
export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function fechaStr(date) {
  // Returns YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function hoy() {
  return fechaStr(new Date());
}

export function parseFecha(str) {
  // Parse YYYY-MM-DD safely
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatFechaLarga(str) {
  const d = parseFecha(str);
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatFechaMediana(str) {
  const d = parseFecha(str);
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()].substring(0, 3)}`;
}

export function buildCalendarMatrix(year, month) {
  // Returns flat array of { date: Date|null, dateStr: string|null }
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Dom
  const days = [];

  // Empty cells before first day
  for (let i = 0; i < startDow; i++) days.push(null);

  // Days in month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({ date, dateStr: fechaStr(date) });
  }

  // Pad to complete last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function calcTotales(franjas) {
  let churros = 0,
    porras = 0,
    bares = new Set();
  franjas.forEach((f) => {
    f.pedidos.forEach((p) => {
      churros += Number(p.churros) || 0;
      porras += Number(p.porras) || 0;
      bares.add(p.barNombre);
    });
  });
  return { churros, porras, bares: bares.size };
}
