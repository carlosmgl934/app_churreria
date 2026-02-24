// ui.js — Renderizado de todas las vistas de la app
import {
  getBares,
  addBar,
  updateBar,
  deleteBar,
  saveReparto,
  getRepartoByFecha,
  getAllRepartos,
  deleteReparto,
  getStats,
} from "./db.js";
import {
  DIAS_SEMANA,
  MESES,
  fechaStr,
  hoy,
  parseFecha,
  formatFechaLarga,
  formatFechaMediana,
  buildCalendarMatrix,
  calcTotales,
} from "./calendar.js";
import { iconChurro, iconPorra, churroLabel, porraLabel } from "./icons.js";

// ── Toasts ───────────────────────────────────────────────────────────────────
export function toast(msg, type = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.className = "toast"), 2600);
}

// ── Logo SVG inline ──────────────────────────────────────────────────────────
export function logoSVG(size = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
    <defs>
      <radialGradient id="ibg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#FCD34D"/>
        <stop offset="100%" stop-color="#D97706"/>
      </radialGradient>
    </defs>
    <circle cx="256" cy="256" r="248" fill="url(#ibg)" stroke="#78350F" stroke-width="8"/>
    <g transform="translate(256,256) rotate(-28)">
      <rect x="-15" y="-100" width="30" height="140" rx="15" fill="#D4761A"/>
      <rect x="-15" y="-84" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-64" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-44" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-24" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
    </g>
    <g transform="translate(256,256)">
      <rect x="-17" y="-118" width="34" height="165" rx="17" fill="#F59E0B"/>
      <rect x="-17" y="-100" width="34" height="9" rx="4" fill="#92400E" opacity="0.5"/>
      <rect x="-17" y="-78" width="34" height="9" rx="4" fill="#92400E" opacity="0.5"/>
      <rect x="-17" y="-56" width="34" height="9" rx="4" fill="#92400E" opacity="0.5"/>
      <rect x="-17" y="-34" width="34" height="9" rx="4" fill="#92400E" opacity="0.5"/>
      <rect x="-17" y="-12" width="34" height="9" rx="4" fill="#92400E" opacity="0.5"/>
      <rect x="-6" y="-118" width="8" height="165" rx="4" fill="white" opacity="0.18"/>
    </g>
    <g transform="translate(256,256) rotate(28)">
      <rect x="-15" y="-100" width="30" height="140" rx="15" fill="#D4761A"/>
      <rect x="-15" y="-84" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-64" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-44" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
      <rect x="-15" y="-24" width="30" height="8" rx="4" fill="#78350F" opacity="0.45"/>
    </g>
    <ellipse cx="256" cy="170" rx="52" ry="15" fill="#5C2D0E" opacity="0.6"/>
  </svg>`;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export async function renderDashboard(container) {
  const today = hoy();
  const reparto = await getRepartoByFecha(today);
  const allRepartos = await getAllRepartos();
  const fecha = new Date();
  const diaNombre = DIAS_SEMANA[fecha.getDay()];
  const diaNum = fecha.getDate();
  const mes = MESES[fecha.getMonth()];

  let totHoy = { churros: 0, porras: 0, bares: 0 };
  if (reparto) totHoy = calcTotales(reparto.franjas);

  const semanaMs = 7 * 24 * 3600 * 1000;
  const inicioSemana = new Date(Date.now() - semanaMs);
  const dpSemana = allRepartos.filter(
    (r) => parseFecha(r.fecha) >= inicioSemana,
  );
  let churrosSemana = 0,
    porrasSemana = 0;
  dpSemana.forEach((r) => {
    const t = calcTotales(r.franjas);
    churrosSemana += t.churros;
    porrasSemana += t.porras;
  });

  container.innerHTML = `
    <div class="hero-card">
      <div class="hero-logo">${logoSVG(80)}</div>
      <div class="hero-title">Churrería Reparto</div>
      <div class="hero-subtitle">${diaNombre}, ${diaNum} de ${mes}</div>
    </div>

    <div class="section-title">📦 Hoy</div>
    <div class="today-summary">
      <div class="today-chip">
        <div class="chip-num">${totHoy.bares}</div>
        <div class="chip-label">🏪 Bares</div>
      </div>
      <div class="today-chip">
        <div class="chip-num">${totHoy.churros}</div>
        <div class="chip-label">${iconChurro(16)} Churros</div>
      </div>
      <div class="today-chip">
        <div class="chip-num">${totHoy.porras}</div>
        <div class="chip-label">${iconPorra(16)} Porras</div>
      </div>
    </div>

    <button class="btn btn-primary btn-full" id="btn-reparto-hoy" style="margin-bottom:14px">
      <span class="btn-icon">✏️</span> ${reparto ? "Ver / Editar reparto de hoy" : "Registrar reparto de hoy"}
    </button>

    <div class="section-title">📅 Esta semana</div>
    <div class="today-summary">
      <div class="today-chip">
        <div class="chip-num">${dpSemana.length}</div>
        <div class="chip-label">📋 Repartos</div>
      </div>
      <div class="today-chip">
        <div class="chip-num">${churrosSemana}</div>
        <div class="chip-label">${iconChurro(16)} Churros</div>
      </div>
      <div class="today-chip">
        <div class="chip-num">${porrasSemana}</div>
        <div class="chip-label">${iconPorra(16)} Porras</div>
      </div>
    </div>

    ${
      allRepartos.length > 0
        ? `
      <div class="section-title">🕐 Últimos repartos</div>
      ${allRepartos
        .slice(0, 4)
        .map((r) => {
          const t = calcTotales(r.franjas);
          return `<div class="bar-item" data-fecha="${r.fecha}" style="cursor:pointer">
          <div class="bar-avatar">📋</div>
          <div class="bar-info">
            <div class="bar-name">${formatFechaMediana(r.fecha)}</div>
            <div class="bar-notes">${t.bares} bares · ${t.churros} churros · ${t.porras} porras</div>
          </div>
          <span style="color:var(--text-muted);font-size:1.4rem">›</span>
        </div>`;
        })
        .join("")}
    `
        : ""
    }
  `;

  document.getElementById("btn-reparto-hoy").addEventListener("click", () => {
    window.App.nav("reparto", { fecha: today });
  });

  container.querySelectorAll("[data-fecha]").forEach((el) => {
    el.addEventListener("click", () =>
      window.App.nav("reparto", { fecha: el.dataset.fecha }),
    );
  });
}

// ── Reparto ───────────────────────────────────────────────────────────────────
export async function renderReparto(container, params = {}) {
  const bares = await getBares();
  let fechaActual = params.fecha || hoy();
  let franjas = [];

  async function loadFranjas() {
    const r = await getRepartoByFecha(fechaActual);
    franjas = r ? JSON.parse(JSON.stringify(r.franjas)) : [];
  }
  await loadFranjas();

  function render() {
    const fecha = parseFecha(fechaActual);
    const totales = calcTotales(franjas);

    container.innerHTML = `
      <div class="section-title">📅 Día del reparto</div>
      <div id="day-picker" style="margin-bottom:4px"></div>
      <div style="text-align:center;font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;font-weight:600">
        ${formatFechaLarga(fechaActual)}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0">🕐 Franjas horarias</div>
        <button class="btn btn-sm btn-outline" id="btn-add-franja">+ Añadir franja</button>
      </div>

      <div id="franjas-container">
        ${
          franjas.length === 0
            ? `
          <div class="empty-state">
            <span class="empty-icon">🕐</span>
            <p>Sin franjas. Pulsa<br>"+ Añadir franja"</p>
          </div>`
            : franjas.map((f, fi) => renderFranjaHTML(f, fi, bares)).join("")
        }
      </div>

      ${
        franjas.length > 0
          ? `
        <div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:14px;border:1px solid var(--surface2);display:flex;gap:12px;justify-content:space-around;text-align:center">
          <div><div style="font-size:1.8rem;font-weight:900;color:var(--gold)">${totales.churros}</div><div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">CHURROS</div></div>
          <div style="width:1px;background:var(--surface2)"></div>
          <div><div style="font-size:1.8rem;font-weight:900;color:var(--gold)">${totales.porras}</div><div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">PORRAS</div></div>
          <div style="width:1px;background:var(--surface2)"></div>
          <div><div style="font-size:1.8rem;font-weight:900;color:var(--gold)">${totales.bares}</div><div style="font-size:0.8rem;color:var(--text-muted);font-weight:700">BARES</div></div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:14px">
          <button class="btn btn-primary" style="flex:1" id="btn-guardar">💾 Guardar</button>
          <button class="btn btn-danger btn-sm" id="btn-borrar">🗑️</button>
        </div>
      `
          : `<button class="btn btn-primary btn-full" id="btn-guardar" style="margin-bottom:14px;opacity:0.4" disabled>💾 Guardar reparto</button>`
      }
    `;

    // Day picker navigation (week view)
    renderDayPicker();
    attachFranjaEvents();
  }

  function renderDayPicker() {
    const picker = document.getElementById("day-picker");
    // Show current week around fechaActual
    const base = parseFecha(fechaActual);
    const dow = base.getDay();
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() - dow);

    let html = '<div class="day-selector">';
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const ds = fechaStr(d);
      const isActive = ds === fechaActual;
      const isToday = ds === hoy();
      html += `<button class="day-btn ${isActive ? "active" : ""}" data-fecha="${ds}" style="${isToday && !isActive ? "border-color:var(--gold-d);" : ""}">
        <span style="font-size:0.65rem;${isActive ? "" : "color:var(--text-muted)"}">${DIAS_SEMANA[d.getDay()]}</span>
        <span class="day-num">${d.getDate()}</span>
      </button>`;
    }
    html += "</div>";
    picker.innerHTML = html;

    picker.querySelectorAll(".day-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        fechaActual = btn.dataset.fecha;
        await loadFranjas();
        render();
      });
    });
  }

  function renderFranjaHTML(f, fi, bares) {
    const pedidosHTML = f.pedidos
      .map(
        (p, pi) => `
      <div class="pedido-row" data-fi="${fi}" data-pi="${pi}">
        <div class="pedido-bar-name">${p.barNombre}</div>
        <div>
          <div class="qty-label">Churros</div>
          <input class="qty-input" type="number" min="0" value="${p.churros || ""}" placeholder="0" data-fi="${fi}" data-pi="${pi}" data-field="churros">
        </div>
        <div>
          <div class="qty-label">Porras</div>
          <input class="qty-input" type="number" min="0" value="${p.porras || ""}" placeholder="0" data-fi="${fi}" data-pi="${pi}" data-field="porras">
        </div>
        <button class="btn btn-danger btn-sm" style="padding:10px;min-height:44px;min-width:44px" data-del-pedido data-fi="${fi}" data-pi="${pi}">✕</button>
      </div>`,
      )
      .join("");

    return `<div class="franja-block" data-fi="${fi}">
      <div class="franja-header">
        <input class="form-input franja-hora" type="time" value="${f.hora}" data-fi="${fi}" style="width:120px;min-height:46px;font-size:1.2rem;font-weight:900;color:var(--gold);padding:10px 8px">
        <div class="franja-info">${f.pedidos.length} bar${f.pedidos.length !== 1 ? "es" : ""}</div>
        <button class="btn btn-outline btn-sm" data-add-bar="${fi}">+ Bar</button>
        <button class="btn btn-danger btn-sm" style="padding:10px;min-height:44px;min-width:44px" data-del-franja="${fi}">🗑️</button>
      </div>
      <div class="franja-body">${pedidosHTML.length ? pedidosHTML : '<div style="color:var(--text-muted);text-align:center;padding:12px;font-size:0.9rem">Añade bares a esta franja</div>'}</div>
    </div>`;
  }

  function attachFranjaEvents() {
    // Qty inputs
    container.querySelectorAll(".qty-input").forEach((inp) => {
      inp.addEventListener("input", () => {
        const fi = +inp.dataset.fi,
          pi = +inp.dataset.pi,
          field = inp.dataset.field;
        if (!franjas[fi] || !franjas[fi].pedidos[pi]) return;
        franjas[fi].pedidos[pi][field] = Number(inp.value) || 0;
      });
    });

    // Hora input
    container.querySelectorAll(".franja-hora").forEach((inp) => {
      inp.addEventListener("change", () => {
        franjas[+inp.dataset.fi].hora = inp.value;
        franjas.sort((a, b) => a.hora.localeCompare(b.hora));
        render();
      });
    });

    // Delete pedido
    container.querySelectorAll("[data-del-pedido]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fi = +btn.dataset.fi,
          pi = +btn.dataset.pi;
        franjas[fi].pedidos.splice(pi, 1);
        if (franjas[fi].pedidos.length === 0) franjas.splice(fi, 1);
        render();
      });
    });

    // Delete franja
    container.querySelectorAll("[data-del-franja]").forEach((btn) => {
      btn.addEventListener("click", () => {
        franjas.splice(+btn.dataset.fi, 1);
        render();
      });
    });

    // Add franja
    const btnAddF = document.getElementById("btn-add-franja");
    if (btnAddF)
      btnAddF.addEventListener("click", () => {
        franjas.push({ hora: "06:00", pedidos: [] });
        render();
        setTimeout(() => {
          const inputs = container.querySelectorAll(".franja-hora");
          if (inputs.length) inputs[inputs.length - 1].focus();
        }, 100);
      });

    // Add bar to franja
    container.querySelectorAll("[data-add-bar]").forEach((btn) => {
      btn.addEventListener("click", () => showBarSelector(+btn.dataset.addBar));
    });

    // Save
    const btnG = document.getElementById("btn-guardar");
    if (btnG && !btnG.disabled)
      btnG.addEventListener("click", async () => {
        // sync qty inputs before saving
        container.querySelectorAll(".qty-input").forEach((inp) => {
          const fi = +inp.dataset.fi,
            pi = +inp.dataset.pi;
          if (franjas[fi] && franjas[fi].pedidos[pi])
            franjas[fi].pedidos[pi][inp.dataset.field] = Number(inp.value) || 0;
        });
        await saveReparto(fechaActual, franjas);
        toast("✅ Reparto guardado", "success");
      });

    // Delete reparto
    const btnB = document.getElementById("btn-borrar");
    if (btnB)
      btnB.addEventListener("click", async () => {
        if (!confirm("¿Borrar todo el reparto de este día?")) return;
        await deleteReparto(fechaActual);
        franjas = [];
        render();
        toast("🗑️ Reparto borrado");
      });
  }

  function showBarSelector(fi) {
    const existingIds = new Set(franjas[fi].pedidos.map((p) => p.barId));
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title">
          🏪 Seleccionar bar
          <button class="modal-close" id="modal-close-btn">✕</button>
        </div>
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input class="form-input" id="bar-search" placeholder="Buscar bar..." autocomplete="off">
        </div>
        <div class="bar-select-list" id="bar-select-list">
          ${bares.length === 0 ? '<div style="text-align:center;padding:24px;color:var(--text-muted)">No hay bares guardados.<br>Ve a "Bares" para añadir.</div>' : ""}
        </div>
        <hr class="divider">
        <button class="btn btn-outline btn-full" id="btn-new-bar-modal">+ Añadir bar nuevo</button>
      </div>
    `;
    document.body.appendChild(overlay);

    function renderBarList(filter = "") {
      const list = document.getElementById("bar-select-list");
      const filtered = bares.filter((b) =>
        b.nombre.toLowerCase().includes(filter.toLowerCase()),
      );
      list.innerHTML = filtered
        .map(
          (b) => `
        <div class="bar-select-item ${existingIds.has(b.id) ? "selected" : ""}" data-bar-id="${b.id}" data-bar-nombre="${b.nombre}">
          <div class="bar-select-check">${existingIds.has(b.id) ? "✓" : ""}</div>
          <div style="font-size:1rem;font-weight:700">${b.nombre}</div>
        </div>`,
        )
        .join("");

      list.querySelectorAll(".bar-select-item").forEach((item) => {
        item.addEventListener("click", () => {
          const bid = Number(item.dataset.barId);
          const bname = item.dataset.barNombre;
          if (existingIds.has(bid)) {
            // remove
            const idx = franjas[fi].pedidos.findIndex((p) => p.barId === bid);
            if (idx !== -1) franjas[fi].pedidos.splice(idx, 1);
            existingIds.delete(bid);
          } else {
            franjas[fi].pedidos.push({
              barId: bid,
              barNombre: bname,
              churros: 0,
              porras: 0,
            });
            existingIds.add(bid);
          }
          item.classList.toggle("selected");
          item.querySelector(".bar-select-check").textContent = existingIds.has(
            bid,
          )
            ? "✓"
            : "";
        });
      });
    }

    renderBarList();

    document
      .getElementById("bar-search")
      .addEventListener("input", (e) => renderBarList(e.target.value));

    document.getElementById("modal-close-btn").addEventListener("click", () => {
      document.body.removeChild(overlay);
      render();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        render();
      }
    });

    document
      .getElementById("btn-new-bar-modal")
      .addEventListener("click", async () => {
        const nombre = prompt("Nombre del bar:");
        if (!nombre || !nombre.trim()) return;
        const id = await addBar(nombre);
        bares.push({ id, nombre: nombre.trim(), notas: "" });
        bares.sort((a, b) => a.nombre.localeCompare(b.nombre));
        franjas[fi].pedidos.push({
          barId: id,
          barNombre: nombre.trim(),
          churros: 0,
          porras: 0,
        });
        existingIds.add(id);
        renderBarList();
      });
  }

  render();
}

// ── Calendario ────────────────────────────────────────────────────────────────
export async function renderCalendario(container) {
  const allRepartos = await getAllRepartos();
  const repartosMap = {};
  allRepartos.forEach((r) => {
    repartosMap[r.fecha] = r;
  });

  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();
  let selectedFecha = null;

  function render() {
    const matrix = buildCalendarMatrix(viewYear, viewMonth);
    const todayStr = hoy();

    container.innerHTML = `
      <div class="cal-header">
        <button class="cal-nav-btn" id="cal-prev">‹</button>
        <div class="cal-month">${MESES[viewMonth]} ${viewYear}</div>
        <button class="cal-nav-btn" id="cal-next">›</button>
      </div>
      <div class="card" style="padding:12px">
        <div class="cal-grid">
          ${DIAS_SEMANA.map((d) => `<div class="cal-weekday">${d}</div>`).join("")}
          ${matrix
            .map((cell) => {
              if (!cell) return `<div class="cal-day empty"></div>`;
              const isToday = cell.dateStr === todayStr;
              const hasData = !!repartosMap[cell.dateStr];
              const isSelected = cell.dateStr === selectedFecha;
              return `<div class="cal-day ${isToday ? "today" : ""} ${hasData ? "has-data" : ""} ${isSelected ? "selected" : ""}"
              data-fecha="${cell.dateStr}" style="${isSelected ? "background:rgba(245,158,11,0.2);border:2px solid var(--gold)" : ""}">
              ${cell.date.getDate()}
            </div>`;
            })
            .join("")}
        </div>
      </div>
      <div id="cal-detail"></div>
    `;

    document.getElementById("cal-prev").addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      render();
    });
    document.getElementById("cal-next").addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      render();
    });

    container.querySelectorAll(".cal-day:not(.empty)").forEach((el) => {
      el.addEventListener("click", () => {
        selectedFecha = el.dataset.fecha;
        renderDetail(el.dataset.fecha);
        // re-render just calendar grid selection
        container.querySelectorAll(".cal-day").forEach((d) => {
          d.style.background = "";
          d.style.border = "";
          d.classList.remove("selected");
        });
        el.style.background = "rgba(245,158,11,0.2)";
        el.style.border = "2px solid var(--gold)";
      });
    });
  }

  function renderDetail(fecha) {
    const detail = document.getElementById("cal-detail");
    const reparto = repartosMap[fecha];
    if (!reparto) {
      detail.innerHTML = `
        <div class="detail-panel">
          <div class="detail-date">${formatFechaLarga(fecha)}</div>
          <div class="empty-state" style="padding:16px 0">
            <span class="empty-icon">📭</span>
            <p>Sin reparto este día</p>
          </div>
          <button class="btn btn-primary btn-full" id="btn-go-reg">✏️ Registrar reparto</button>
        </div>`;
      document
        .getElementById("btn-go-reg")
        .addEventListener("click", () => window.App.nav("reparto", { fecha }));
      return;
    }

    const tot = calcTotales(reparto.franjas);
    detail.innerHTML = `
      <div class="detail-panel">
        <div class="detail-date">${formatFechaLarga(fecha)}</div>
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <div class="today-chip" style="background:var(--bg2)"><div class="chip-num">${tot.bares}</div><div class="chip-label">Bares</div></div>
          <div class="today-chip" style="background:var(--bg2)"><div class="chip-num">${tot.churros}</div><div class="chip-label">Churros</div></div>
          <div class="today-chip" style="background:var(--bg2)"><div class="chip-num">${tot.porras}</div><div class="chip-label">Porras</div></div>
        </div>
        ${reparto.franjas
          .map(
            (f) => `
          <div style="margin-bottom:12px">
            <div style="font-size:1rem;font-weight:800;color:var(--gold);margin-bottom:8px">⏰ ${f.hora}</div>
            ${f.pedidos
              .map(
                (p) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:10px;margin-bottom:6px;border:1px solid var(--surface2)">
                <span style="font-weight:700;font-size:1rem">${p.barNombre}</span>
                <span style="color:var(--text-muted);font-size:0.9rem;font-weight:600">${p.churros > 0 ? churroLabel(p.churros, 16) : ""}${p.churros > 0 && p.porras > 0 ? " · " : ""}${p.porras > 0 ? porraLabel(p.porras, 16) : ""}</span>
              </div>`,
              )
              .join("")}
          </div>`,
          )
          .join("")}
        <button class="btn btn-outline btn-full" id="btn-go-edit">✏️ Editar reparto</button>
      </div>`;
    document
      .getElementById("btn-go-edit")
      .addEventListener("click", () => window.App.nav("reparto", { fecha }));
  }

  render();
}

// ── Bares ─────────────────────────────────────────────────────────────────────
export async function renderBares(container) {
  let bares = await getBares();
  let searchTerm = "";
  let editingId = null;

  function render() {
    const filtered = bares.filter((b) =>
      b.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    container.innerHTML = `
      <button class="btn btn-primary btn-full" id="btn-nuevo-bar" style="margin-bottom:16px">
        <span class="btn-icon">＋</span> Añadir bar nuevo
      </button>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input class="form-input" id="bar-search" placeholder="Buscar bar..." value="${searchTerm}">
      </div>
      ${
        filtered.length === 0
          ? `
        <div class="empty-state">
          <span class="empty-icon">🏪</span>
          <p>${bares.length === 0 ? 'Aún no hay bares.<br>Pulsa "Añadir bar nuevo".' : "Sin resultados."}</p>
        </div>`
          : filtered.map((b) => barItemHTML(b)).join("")
      }
    `;

    document
      .getElementById("btn-nuevo-bar")
      .addEventListener("click", () => showBarModal());
    document.getElementById("bar-search").addEventListener("input", (e) => {
      searchTerm = e.target.value;
      render();
    });
    container.querySelectorAll("[data-edit-bar]").forEach((btn) => {
      const bar = bares.find((b) => b.id === Number(btn.dataset.editBar));
      btn.addEventListener("click", () => showBarModal(bar));
    });
    container.querySelectorAll("[data-del-bar]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm(`¿Borrar "${btn.dataset.name}"?`)) return;
        await deleteBar(Number(btn.dataset.delBar));
        bares = bares.filter((b) => b.id !== Number(btn.dataset.delBar));
        render();
        toast("🗑️ Bar borrado");
      });
    });
  }

  function barItemHTML(b) {
    const initials = b.nombre.charAt(0).toUpperCase();
    return `<div class="bar-item">
      <div class="bar-avatar">${initials}</div>
      <div class="bar-info">
        <div class="bar-name">${b.nombre}</div>
        ${b.notas ? `<div class="bar-notes">${b.notas}</div>` : ""}
      </div>
      <div class="bar-actions">
        <button class="btn btn-secondary btn-sm" data-edit-bar="${b.id}">✏️</button>
        <button class="btn btn-danger btn-sm" data-del-bar="${b.id}" data-name="${b.nombre}">🗑️</button>
      </div>
    </div>`;
  }

  function showBarModal(bar = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title">
          ${bar ? "✏️ Editar bar" : "🏪 Nuevo bar"}
          <button class="modal-close" id="modal-close-btn">✕</button>
        </div>
        <div class="form-group">
          <label class="form-label">Nombre del bar</label>
          <input class="form-input" id="bar-nombre" value="${bar ? bar.nombre : ""}" placeholder="Ej: Bar Los Amigos" autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Notas (opcional)</label>
          <input class="form-input" id="bar-notas" value="${bar ? bar.notas : ""}" placeholder="Ej: Esquina Calle Mayor">
        </div>
        <button class="btn btn-primary btn-full" id="btn-save-bar">💾 Guardar</button>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById("bar-nombre").focus();

    document
      .getElementById("modal-close-btn")
      .addEventListener("click", () => document.body.removeChild(overlay));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
    document
      .getElementById("btn-save-bar")
      .addEventListener("click", async () => {
        const nombre = document.getElementById("bar-nombre").value.trim();
        const notas = document.getElementById("bar-notas").value.trim();
        if (!nombre) {
          toast("⚠️ El nombre no puede estar vacío", "error");
          return;
        }
        if (bar) {
          await updateBar(bar.id, nombre, notas);
          const idx = bares.findIndex((b) => b.id === bar.id);
          bares[idx] = { ...bar, nombre, notas };
          toast("✅ Bar actualizado", "success");
        } else {
          const id = await addBar(nombre, notas);
          bares.push({ id, nombre, notas });
          bares.sort((a, b) => a.nombre.localeCompare(b.nombre));
          toast("✅ Bar añadido", "success");
        }
        document.body.removeChild(overlay);
        render();
      });
  }

  render();
}

// ── Estadísticas ──────────────────────────────────────────────────────────────
export async function renderStats(container) {
  const stats = await getStats();
  const allRepartos = await getAllRepartos();

  // Agrupación por mes
  const porMes = {};
  allRepartos.forEach((r) => {
    const mes = r.fecha.substring(0, 7);
    if (!porMes[mes]) porMes[mes] = { churros: 0, porras: 0, dias: 0 };
    const t = calcTotales(r.franjas);
    porMes[mes].churros += t.churros;
    porMes[mes].porras += t.porras;
    porMes[mes].dias++;
  });
  const mesesOrden = Object.keys(porMes).sort().reverse().slice(0, 6);
  const maxTotal = stats.ranking.length ? stats.ranking[0].total : 1;

  container.innerHTML = `
    <div class="section-title">📊 Totales globales</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.totalRepartos}</div>
        <div class="stat-label">📋 Repartos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalChurros + stats.totalPorras}</div>
        <div class="stat-label">Total unidades</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalChurros}</div>
        <div class="stat-label">${iconChurro(18)} Churros</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalPorras}</div>
        <div class="stat-label">${iconPorra(18)} Porras</div>
      </div>
    </div>

    ${
      mesesOrden.length > 0
        ? `
      <div class="section-title">📅 Por mes</div>
      ${mesesOrden
        .map((mes) => {
          const [y, m] = mes.split("-");
          return `<div class="bar-item" style="padding:14px 16px">
          <div class="bar-avatar" style="font-size:1rem;font-weight:800;color:var(--cream)">${MESES[Number(m) - 1].substring(0, 3)}<br><span style="font-size:0.7rem">${y}</span></div>
          <div class="bar-info">
            <div class="bar-name">${porMes[mes].dias} días de reparto</div>
            <div class="bar-notes">${iconChurro(14)} ${porMes[mes].churros} churros · ${iconPorra(14)} ${porMes[mes].porras} porras</div>
          </div>
        </div>`;
        })
        .join("")}
    `
        : ""
    }

    ${
      stats.ranking.length > 0
        ? `
      <div class="section-title">🏆 Ranking de bares</div>
      ${stats.ranking
        .slice(0, 10)
        .map((b, i) => {
          const posClass =
            i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
          const pct = Math.round((b.total / maxTotal) * 100);
          return `<div class="ranking-item">
          <div class="ranking-pos ${posClass}">${i + 1}</div>
          <div class="ranking-info">
            <div class="ranking-name">${b.nombre}</div>
            <div class="ranking-nums">${churroLabel(b.churros, 14)} · ${porraLabel(b.porras, 14)} · ${b.dias} días</div>
            <div class="ranking-bar"><div class="ranking-bar-fill" style="width:${pct}%"></div></div>
          </div>
          <div style="font-size:1.4rem;font-weight:900;color:var(--gold)">${b.total}</div>
        </div>`;
        })
        .join("")}
    `
        : ""
    }

    ${
      stats.totalRepartos === 0
        ? `
      <div class="empty-state">
        <span class="empty-icon">📊</span>
        <p>Aún no hay datos.<br>Registra tu primer reparto.</p>
      </div>`
        : ""
    }
  `;
}
