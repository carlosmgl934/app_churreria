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
import {
  iconChurro,
  iconPorra,
  churroLabel,
  porraLabel,
  iconHome,
  iconEdit,
  iconCalendar,
  iconBarUI,
  iconStats,
  iconClock,
  iconVan,
} from "./icons.js";

// ── Time Picker Custom ────────────────────────────────────────────────────────
export function showTimePicker(initialTime, onChange) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  let [h, m] = (initialTime || "06:00").split(":");
  h = h || "06";
  m = m || "00";

  overlay.innerHTML = `
    <div class="modal-box" style="text-align:center;max-width:330px;padding:32px 20px">
      <div class="modal-title" style="justify-content:center;font-size:1.6rem;margin-bottom:30px">Selecciona Hora</div>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:40px;align-items:center">
        <select id="tp-h" class="form-input" style="font-size:2.8rem;padding:8px;text-align:center;width:110px;height:90px;border-radius:18px;background:var(--bg)">
          ${Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
            .map(
              (x) =>
                `<option value="${x}" ${x === h ? "selected" : ""}>${x}</option>`,
            )
            .join("")}
        </select>
        <div style="font-size:2.8rem;font-weight:900;color:var(--text-muted)">:</div>
        <select id="tp-m" class="form-input" style="font-size:2.8rem;padding:8px;text-align:center;width:110px;height:90px;border-radius:18px;background:var(--bg)">
          ${["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((x) => `<option value="${x}" ${x === m ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-secondary" style="flex:1;font-size:1.1rem" id="tp-cancel">✕ Cancelar</button>
        <button class="btn btn-primary" style="flex:1.5;font-size:1.1rem" id="tp-ok">✓ Aceptar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("tp-cancel").onclick = () => {
    document.body.removeChild(overlay);
    onChange(null);
  };
  document.getElementById("tp-ok").onclick = () => {
    const nh = document.getElementById("tp-h").value;
    const nm = document.getElementById("tp-m").value;
    document.body.removeChild(overlay);
    onChange(`${nh}:${nm}`);
  };
}

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
      <div class="hero-logo">${logoSVG(60)}</div>
      <div class="hero-title">Churrería Reparto</div>
      <div class="hero-subtitle">${diaNombre}, ${diaNum} de ${mes}</div>
    </div>

    <div class="section-title" style="display:flex;align-items:center;gap:6px">${iconVan(20)} Hoy</div>
    <div class="today-summary">
      <div class="today-chip">
        <div class="chip-num">${totHoy.bares}</div>
        <div class="chip-label" style="display:flex;align-items:center;justify-content:center;gap:4px">${iconBarUI(16)} Bares</div>
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

    <button class="btn btn-primary btn-full" id="btn-reparto-hoy" style="margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:8px">
      ${iconEdit(20)} ${reparto ? "Ver / Editar reparto de hoy" : "Registrar reparto de hoy"}
    </button>

    <div class="section-title">Esta semana</div>
    <div class="today-summary">
      <div class="today-chip">
        <div class="chip-num">${dpSemana.length}</div>
        <div class="chip-label">Repartos</div>
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
      <div class="section-title" style="display:flex;align-items:center;gap:6px">${iconClock(20)} Últimos repartos</div>
      ${allRepartos
        .slice(0, 5)
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
  let isEditMode = false;
  let pickerScroll = null; // preserve scroll position when changing day

  async function loadFranjas() {
    const r = await getRepartoByFecha(fechaActual);
    if (r) {
      franjas = JSON.parse(JSON.stringify(r.franjas));
      franjas.forEach((f) =>
        f.pedidos.forEach((p) => {
          if (p.entregado === undefined) p.entregado = false;
        }),
      );
      franjas.sort((a, b) => a.hora.localeCompare(b.hora));
      isEditMode = false; // By default open in read mode if data exists
    } else {
      franjas = [];
      isEditMode = true; // Open in edit mode if new day
    }
  }
  await loadFranjas();

  function render() {
    // Auto-merge franjas with duplicate hours
    const fmap = {};
    franjas.forEach((f) => {
      if (!fmap[f.hora]) fmap[f.hora] = { hora: f.hora, pedidos: [] };
      fmap[f.hora].pedidos.push(...f.pedidos);
    });
    franjas = Object.values(fmap).sort((a, b) => a.hora.localeCompare(b.hora));

    const fecha = parseFecha(fechaActual);
    const totales = calcTotales(franjas);

    container.innerHTML = `
      <div class="section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="display:flex;align-items:center;gap:6px">${iconVan(18)} Día del reparto</span>
        <span style="font-size:0.82rem;color:var(--text-muted);font-weight:600;letter-spacing:0;text-transform:none">${MESES[new Date().getMonth()]} ${new Date().getFullYear()}</span>
      </div>
      <div id="day-picker" style="margin-bottom:4px"></div>
      <div style="text-align:center;font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;font-weight:600">
        ${formatFechaLarga(fechaActual)}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="section-title" style="margin:0;display:flex;align-items:center;gap:6px">${iconClock(20)} Franjas horarias</div>
        ${isEditMode ? `<div style="display:flex;gap:6px"><button class="btn btn-sm btn-outline" id="btn-copy-reparto" title="Copiar de otro día">Copiar de...</button><button class="btn btn-sm btn-outline" id="btn-add-franja">+ Añadir franja</button></div>` : `<button class="btn btn-sm btn-outline" id="btn-toggle-edit" style="gap:4px;display:flex;align-items:center">${iconEdit(18)} Editar</button>`}
      </div>

      <div id="franjas-container">
        ${
          franjas.length === 0
            ? `
          <div class="empty-state">
            <div style="margin-bottom:12px;color:var(--text-muted)">${iconClock(48)}</div>
            <p>Sin franjas. Pulsa<br>"+ Añadir franja"</p>
          </div>`
            : franjas.map((f, fi) => renderFranjaHTML(f, fi, bares)).join("")
        }
      </div>

      ${
        franjas.length > 0
          ? `
        <div style="background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:14px;border:1px solid var(--surface2);display:flex;gap:12px;justify-content:space-around;text-align:center">
          <div><div style="font-size:1.5rem;font-weight:800;color:var(--gold)">${totales.churros}</div><div style="font-size:0.75rem;color:var(--text-muted);font-weight:700">CHURROS</div></div>
          <div style="width:1px;background:var(--surface2)"></div>
          <div><div style="font-size:1.5rem;font-weight:800;color:var(--gold)">${totales.porras}</div><div style="font-size:0.75rem;color:var(--text-muted);font-weight:700">PORRAS</div></div>
          <div style="width:1px;background:var(--surface2)"></div>
          <div><div style="font-size:1.5rem;font-weight:800;color:var(--gold)">${totales.bares}</div><div style="font-size:0.75rem;color:var(--text-muted);font-weight:700">BARES</div></div>
        </div>
        ${
          isEditMode
            ? `<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
                 <button class="btn btn-primary" id="btn-guardar" style="display:flex;align-items:center;justify-content:center;gap:6px;font-weight:900;font-size:1rem;letter-spacing:0.5px;box-shadow:0 0 18px rgba(245,158,11,0.5)"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> GUARDAR REPARTO</button>
                 <div style="display:flex;gap:10px">
                   <button class="btn btn-secondary" style="flex:1" id="btn-cancel-edit">✕ Cancelar</button>
                   <button class="btn btn-danger" style="flex:1" id="btn-borrar">ELIMINAR REPARTO</button>
                 </div>
               </div>`
            : ``
        }
      `
          : ``
      }
    `;

    // Day picker navigation (week view)
    renderDayPicker();
    attachFranjaEvents();
  }

  function renderDayPicker() {
    const picker = document.getElementById("day-picker");
    const todayStr = hoy();
    const today = parseFecha(todayStr);
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '<div class="day-selector">';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const ds = fechaStr(date);
      const isActive = ds === fechaActual;
      const isToday = ds === todayStr;
      html += `<button class="day-btn ${isActive ? "active" : ""}" data-fecha="${ds}" style="${isToday && !isActive ? "border-color:var(--gold);" : ""}">
        <span style="font-size:0.65rem;${isActive ? "" : "color:var(--text-muted)"}">${DIAS_SEMANA[date.getDay()]}</span>
        <span class="day-num">${d}</span>
      </button>`;
    }
    html += "</div>";
    picker.innerHTML = html;

    // Restore saved scroll or center on today (first load)
    setTimeout(() => {
      const selector = picker.querySelector(".day-selector");
      if (!selector) return;
      if (pickerScroll !== null) {
        selector.scrollLeft = pickerScroll;
        pickerScroll = null;
      } else {
        const todayBtn = picker.querySelector(`[data-fecha="${todayStr}"]`);
        if (todayBtn) {
          selector.scrollLeft =
            todayBtn.offsetLeft -
            selector.clientWidth / 2 +
            todayBtn.clientWidth / 2;
        }
      }
    }, 10);

    picker.querySelectorAll(".day-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        // Save scroll position so it doesn't reset after re-render
        const sel = picker.querySelector(".day-selector");
        pickerScroll = sel ? sel.scrollLeft : null;
        fechaActual = btn.dataset.fecha;
        await loadFranjas();
        render();
      });
    });
  }

  function renderFranjaHTML(f, fi, bares) {
    const pedidosHTML = f.pedidos
      .map((p, pi) => {
        if (isEditMode) {
          return `
          <div class="pedido-row" data-fi="${fi}" data-pi="${pi}" style="flex-direction:column;align-items:stretch;gap:6px;padding:10px 12px;border-radius:8px;margin:3px 0;background:var(--bg)">
            <div style="display:flex;align-items:center;gap:8px;justify-content:space-between">
              <div class="pedido-bar-name" style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;font-weight:600">${p.barNombre}</div>
              <button style="background:#ef4444;border:none;border-radius:6px;width:28px;height:28px;min-width:28px;color:white;font-size:0.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;-webkit-tap-highlight-color:transparent" data-del-pedido data-fi="${fi}" data-pi="${pi}">✕</button>
            </div>
            <div style="display:flex;gap:8px">
              <div style="flex:1">
                <div class="qty-label">Churros</div>
                <input class="qty-input" type="number" min="0" value="${p.churros || ""}" placeholder="0" data-fi="${fi}" data-pi="${pi}" data-field="churros" style="width:100%;box-sizing:border-box">
              </div>
              <div style="flex:1">
                <div class="qty-label">Porras</div>
                <input class="qty-input" type="number" min="0" value="${p.porras || ""}" placeholder="0" data-fi="${fi}" data-pi="${pi}" data-field="porras" style="width:100%;box-sizing:border-box">
              </div>
            </div>
          </div>`;
        } else {
          return `
          <div class="pedido-row" style="cursor:pointer;padding:10px 12px;border-radius:8px;margin:3px 0;flex-direction:column;align-items:stretch;gap:2px;transition:all 0.2s;background:${p.entregado ? "rgba(34,197,94,0.08)" : "var(--bg)"};border-left:3px solid ${p.entregado ? "var(--success)" : "transparent"}" data-toggle-entregado data-fi="${fi}" data-pi="${pi}">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;font-weight:600;color:${p.entregado ? "var(--text-muted)" : "var(--text)"};text-decoration:${p.entregado ? "line-through" : "none"};line-height:1.2">${p.barNombre}</div>
              <div style="flex-shrink:0;color:${p.entregado ? "var(--success)" : "rgba(255,255,255,0.18)"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;opacity:${p.entregado ? "0.45" : "1"}">
              <span style="font-size:1rem;font-weight:900;color:var(--gold)">${p.churros || 0}</span>
              <span style="font-size:0.78rem;color:var(--text-muted);font-weight:600">churros</span>
              <span style="color:var(--text-muted);font-size:0.8rem;margin:0 2px">·</span>
              <span style="font-size:1rem;font-weight:900;color:var(--gold)">${p.porras || 0}</span>
              <span style="font-size:0.78rem;color:var(--text-muted);font-weight:600">porras</span>
            </div>
          </div>`;
        }
      })
      .join("");

    return `<div class="franja-block" data-fi="${fi}">
      <div class="franja-header">
        ${
          isEditMode
            ? `<div guarclass="form-input franja-hora" data-fi="${fi}" style="width:90px;min-height:46px;font-size:1.2rem;font-weight:900;color:var(--gold);padding:10px 4px;display:flex;align-items:center;justify-content:center;cursor:pointer">${f.hora}</div>`
            : `<div style="font-size:1.2rem;font-weight:700;color:var(--gold);flex:0 0 auto;min-width:70px">${f.hora}</div>`
        }
        ${
          isEditMode
            ? `<button class="btn btn-primary btn-sm" style="font-weight:800;font-size:0.9rem;white-space:nowrap;margin-left:auto" data-add-bar="${fi}">+ Añadir bar</button>`
            : `<div class="franja-info" style="margin-left:8px">${f.pedidos.length} bar${f.pedidos.length !== 1 ? "es" : ""}</div>`
        }
      </div>
      ${
        isEditMode && f.pedidos.length > 0
          ? `<div style="padding:6px 16px 0;font-size:0.78rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">${f.pedidos.length} bar${f.pedidos.length !== 1 ? "es" : ""}</div>`
          : ""
      }
      <div class="franja-body" style="${!isEditMode && pedidosHTML.length ? "padding-top:0" : ""}">${
        pedidosHTML.length
          ? pedidosHTML
          : isEditMode
            ? '<div style="color:var(--text-muted);text-align:center;padding:12px;font-size:0.9rem">A&ntilde;ade bares a esta franja</div>'
            : '<div style="color:var(--text-muted);text-align:center;padding:12px;font-size:0.9rem">Sin repartos previstos</div>'
      }</div>
      ${isEditMode ? `<div style="padding:0 12px 12px"><button class="btn btn-danger" style="width:100%;font-size:0.85rem;font-weight:700" data-del-franja="${fi}">🗑 Borrar esta franja horaria</button></div>` : ""}
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
      inp.addEventListener("click", () => {
        showTimePicker(franjas[+inp.dataset.fi].hora, (newTime) => {
          if (newTime) {
            franjas[+inp.dataset.fi].hora = newTime;
            franjas.sort((a, b) => a.hora.localeCompare(b.hora));
            render();
          }
        });
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

    // Toggle entregado
    container.querySelectorAll("[data-toggle-entregado]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (isEditMode) return;
        const fi = +btn.dataset.fi,
          pi = +btn.dataset.pi;
        if (franjas[fi] && franjas[fi].pedidos[pi]) {
          franjas[fi].pedidos[pi].entregado =
            !franjas[fi].pedidos[pi].entregado;
          await saveReparto(fechaActual, franjas); // Auto-save when testing status
          render();
        }
      });
    });

    // Delete franja
    container.querySelectorAll("[data-del-franja]").forEach((btn) => {
      btn.addEventListener("click", () => {
        franjas.splice(+btn.dataset.fi, 1);
        render();
      });
    });

    // Edit Mode toggles
    const btnToggle = document.getElementById("btn-toggle-edit");
    if (btnToggle)
      btnToggle.addEventListener("click", () => {
        isEditMode = true;
        render();
      });

    const btnCancel = document.getElementById("btn-cancel-edit");
    if (btnCancel)
      btnCancel.addEventListener("click", async () => {
        await loadFranjas();
        render();
      });

    // Copy franjas
    const btnCopy = document.getElementById("btn-copy-reparto");
    if (btnCopy) {
      btnCopy.addEventListener("click", showCopySelector);
    }

    // Add franja
    const btnAddF = document.getElementById("btn-add-franja");
    if (btnAddF)
      btnAddF.addEventListener("click", () => {
        const sentinel = "__new__";
        franjas.push({ hora: sentinel, pedidos: [] });
        isEditMode = true;
        render();
        setTimeout(() => {
          showTimePicker("06:00", (newTime) => {
            const index = franjas.findIndex((f) => f.hora === sentinel);
            if (index !== -1) {
              if (newTime) {
                franjas[index].hora = newTime;
                franjas.sort((a, b) => a.hora.localeCompare(b.hora));
              } else {
                franjas.splice(index, 1);
              }
              render();
            }
          });
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
        isEditMode = false;
        render();
        toast("✅ Reparto guardado", "success");
      });

    // Delete reparto
    const btnB = document.getElementById("btn-borrar");
    if (btnB)
      btnB.addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.innerHTML = `
          <div class="modal-box" style="text-align:center;max-width:400px">
            <div class="modal-title" style="justify-content:center;color:var(--danger)">⚠️ Eliminar reparto</div>
            <p style="margin:20px 0;color:var(--text);font-size:1rem">¿Seguro que quieres eliminar TODO el reparto del día?</p>
            <div style="display:flex;gap:10px">
              <button class="btn btn-secondary" style="flex:1" id="btn-confirm-cancel">✕ Cancelar</button>
              <button class="btn btn-danger" style="flex:1" id="btn-confirm-delete">🗑️ Eliminar</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById("btn-confirm-cancel").onclick = () =>
          document.body.removeChild(overlay);
        document.getElementById("btn-confirm-delete").onclick = async () => {
          document.body.removeChild(overlay);
          await deleteReparto(fechaActual);
          franjas = [];
          isEditMode = true;
          render();
          toast("🗑️ Reparto borrado");
        };
      });
  }

  function showBarSelector(fi) {
    const existingIds = new Set(franjas[fi].pedidos.map((p) => p.barId));
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title" style="display:flex;align-items:center;gap:8px">
          ${iconBarUI(24)} Seleccionar bar
          <button class="modal-close" style="margin-left:auto" id="modal-close-btn">✕</button>
        </div>
        <div class="search-bar">
          <span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
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
          if (!existingIds.has(bid)) {
            franjas[fi].pedidos.push({
              barId: bid,
              barNombre: bname,
              churros: 0,
              porras: 0,
              entregado: false,
            });
          }
          document.body.removeChild(overlay);
          render();
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
      .addEventListener("click", () => {
        const btn = document.getElementById("btn-new-bar-modal");
        const container2 = btn.parentElement;
        btn.outerHTML = `
          <div id="new-bar-form" style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
            <input id="new-bar-input" class="form-input" placeholder="Nombre del nuevo bar..."
              style="font-size:1rem" autocapitalize="words" autocomplete="off">
            <div style="display:flex;gap:8px">
              <button class="btn btn-secondary btn-sm" style="flex:1" id="btn-new-bar-cancel">✕ Cancelar</button>
              <button class="btn btn-primary btn-sm" style="flex:2;font-weight:800" id="btn-new-bar-save">✓ Guardar bar</button>
            </div>
          </div>`;
        const input = document.getElementById("new-bar-input");
        input.focus();
        async function saveNewBar() {
          const nombre = input.value.trim();
          if (!nombre) {
            input.focus();
            return;
          }
          const capitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
          const id = await addBar(capitalizado);
          bares.push({ id, nombre: capitalizado, notas: "" });
          bares.sort((a, b) => a.nombre.localeCompare(b.nombre));
          franjas[fi].pedidos.push({
            barId: id,
            barNombre: capitalizado,
            churros: 0,
            porras: 0,
            entregado: false,
          });
          document.body.removeChild(overlay);
          render();
        }
        document
          .getElementById("btn-new-bar-save")
          .addEventListener("click", saveNewBar);
        document
          .getElementById("btn-new-bar-cancel")
          .addEventListener("click", () => {
            document.getElementById("new-bar-form").outerHTML =
              `<button class="btn btn-outline btn-full" id="btn-new-bar-modal">+ Añadir bar nuevo</button>`;
          });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") saveNewBar();
        });
      });
  }

  async function showCopySelector() {
    const todos = await getAllRepartos();
    const filtrados = todos.filter((r) => r.fecha !== fechaActual);

    if (filtrados.length === 0) {
      toast("No hay otros días para copiar", "error");
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    let listHTML = filtrados
      .slice(0, 15)
      .map((r) => {
        const tot = calcTotales(r.franjas);
        const d = parseFecha(r.fecha);
        const dayName = DIAS_SEMANA[d.getDay()];
        const dayNum = d.getDate();
        const monthName = MESES[d.getMonth()].substring(0, 3);
        const year = d.getFullYear();
        return `<div class="bar-select-item" data-copiar-fecha="${r.fecha}" style="gap:14px;align-items:center">
          <div style="flex-shrink:0;background:var(--surface2);border-radius:8px;padding:8px 10px;text-align:center;min-width:52px">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">${dayName}</div>
            <div style="font-size:1.4rem;font-weight:900;color:var(--gold);line-height:1">${dayNum}</div>
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase">${monthName} ${year !== new Date().getFullYear() ? year : ""}</div>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.95rem;font-weight:700;color:var(--text)">${tot.bares} bar${tot.bares !== 1 ? "es" : ""}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px">${tot.churros} churros · ${tot.porras} porras</div>
          </div>
        </div>`;
      })
      .join("");

    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title" style="display:flex;align-items:center;gap:8px">
          📋 Copiar de otro día
          <button class="modal-close" style="margin-left:auto" id="modal-close-copy">✕</button>
        </div>
        <div style="margin-bottom:12px;font-size:0.9rem;color:var(--text)">Selecciona un día anterior para copiar la ruta.</div>
        <div class="bar-select-list" style="max-height:60vh;overflow-y:auto">
          ${listHTML}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document
      .getElementById("modal-close-copy")
      .addEventListener("click", () => {
        document.body.removeChild(overlay);
      });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    overlay.querySelectorAll("[data-copiar-fecha]").forEach((item) => {
      item.addEventListener("click", () => {
        const rep = filtrados.find((r) => r.fecha === item.dataset.copiarFecha);
        if (rep) {
          franjas = JSON.parse(JSON.stringify(rep.franjas));
          franjas.forEach((f) =>
            f.pedidos.forEach((p) => (p.entregado = false)),
          );
          render();
          toast("✅ Reparto copiado", "success");
        }
        document.body.removeChild(overlay);
      });
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
            <span class="empty-icon" style="display:flex;justify-content:center;color:var(--text-muted)">${iconVan(48)}</span>
            <p>Sin reparto este día</p>
          </div>
          <button class="btn btn-primary btn-full" id="btn-go-reg" style="display:flex;align-items:center;justify-content:center;gap:8px">${iconEdit(20)} Registrar reparto</button>
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
            <div style="font-size:1rem;font-weight:800;color:var(--gold);margin-bottom:8px;display:flex;align-items:center;gap:4px">${iconClock(18)} ${f.hora}</div>
            ${f.pedidos
              .map(
                (p) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:10px;margin-bottom:6px;border:1px solid var(--surface2)">
                <span style="font-weight:700;font-size:1rem">${p.barNombre}</span>
                <span style="color:var(--text-muted);font-size:0.9rem;font-weight:600">${p.churros > 0 ? churroLabel(p.churros, 14) : ""}${p.churros > 0 && p.porras > 0 ? " · " : ""}${p.porras > 0 ? porraLabel(p.porras, 14) : ""}</span>
              </div>`,
              )
              .join("")}
          </div>`,
          )
          .join("")}
        <button class="btn btn-outline btn-full" id="btn-go-edit" style="display:flex;align-items:center;justify-content:center;gap:8px">${iconEdit(20)} Ver / Editar reparto</button>
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
      <div class="search-bar" style="margin-bottom:16px">
        <span class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
        <input class="form-input" id="bar-search-main" placeholder="Buscar nombre o nota..." autocomplete="off">
      </div>
      ${
        filtered.length === 0
          ? `
        <div class="empty-state">
          <div style="margin-bottom:12px;color:var(--text-muted)">${iconBarUI(48)}</div>
          <p>${bares.length === 0 ? 'Aún no hay bares.<br>Pulsa "Añadir bar nuevo"' : "Sin resultados"}</p>
        </div>`
          : filtered.map((b) => barItemHTML(b)).join("")
      }
    `;

    document
      .getElementById("btn-nuevo-bar")
      .addEventListener("click", () => showBarModal());
    document
      .getElementById("bar-search-main")
      .addEventListener("input", (e) => {
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
        toast("✕ Bar borrado");
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
        <button class="btn btn-secondary btn-sm" data-edit-bar="${b.id}" style="padding:10px">${iconEdit(20)}</button>
        <button class="btn btn-danger btn-sm" data-del-bar="${b.id}" data-name="${b.nombre}">✕</button>
      </div>
    </div>`;
  }

  function showBarModal(bar = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title" style="display:flex;align-items:center;gap:8px">
          ${bar ? iconEdit(24) + " Editar bar" : iconBarUI(24) + " Nuevo bar"}
          <button class="modal-close" style="margin-left:auto" id="modal-close-btn">✕</button>
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
  const mesesOrden = Object.keys(porMes).sort().reverse().slice(0, 3);
  const maxTotal = stats.ranking.length ? stats.ranking[0].total : 1;

  container.innerHTML = `
    <div class="section-title">${iconStats(22)} Totales globales</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.totalRepartos}</div>
        <div class="stat-label">${iconVan(18)} Repartos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalChurros + stats.totalPorras}</div>
        <div class="stat-label">${iconChurro(18)} Total unidades</div>
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
      <div class="section-title">${iconCalendar(22)} Por mes</div>
      ${mesesOrden
        .map((mes) => {
          const [y, m] = mes.split("-");
          return `<div class="bar-item" style="padding:14px 16px">
          <div class="bar-avatar" style="color:var(--cream);min-width:65px;min-height:65px">
             <div style="text-align:center;line-height:1.15">
               <div style="font-size:1.05rem;font-weight:900">${MESES[Number(m) - 1].substring(0, 3)}</div>
               <div style="font-size:0.75rem;font-weight:700;color:var(--gold-d)">${y}</div>
             </div>
          </div>
          <div class="bar-info" style="margin-left:4px">
            <div class="bar-name">${porMes[mes].dias} ${porMes[mes].dias === 1 ? "día" : "días"} de reparto</div>
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
      <div class="section-title">Ranking de bares</div>
      ${stats.ranking
        .slice(0, 3)
        .map((b, i) => {
          const posClass =
            i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
          const pct = Math.round((b.total / maxTotal) * 100);
          return `<div class="ranking-item">
          <div class="ranking-pos ${posClass}">${i + 1}</div>
          <div class="ranking-info">
            <div class="ranking-name">${b.nombre}</div>
            <div class="ranking-nums">${churroLabel(b.churros, 14)} · ${porraLabel(b.porras, 14)}</div>
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
        <div style="margin-bottom:12px;color:var(--text-muted)">${iconStats(48)}</div>
        <p>Aún no hay datos.<br>Registra tu primer reparto.</p>
      </div>`
        : ""
    }
  `;
}
