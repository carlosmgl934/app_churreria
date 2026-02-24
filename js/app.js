// app.js — Router principal de la SPA
import {
  renderDashboard,
  renderReparto,
  renderCalendario,
  renderBares,
  renderStats,
} from "./ui.js";
import {
  iconHome,
  iconEdit,
  iconCalendar,
  iconBarUI,
  iconStats,
} from "./icons.js";

const TABS = [
  {
    id: "inicio",
    icon: iconHome(22),
    label: "Inicio",
    render: renderDashboard,
  },
  {
    id: "reparto",
    icon: iconEdit(22),
    label: "Reparto",
    render: renderReparto,
  },
  {
    id: "calendar",
    icon: iconCalendar(22),
    label: "Calendario",
    render: renderCalendario,
  },
  { id: "bares", icon: iconBarUI(22), label: "Bares", render: renderBares },
  { id: "stats", icon: iconStats(22), label: "Stats", render: renderStats },
];

let currentTab = "inicio";
let currentParams = {};

window.App = {
  nav(tabId, params = {}) {
    currentTab = tabId;
    currentParams = params;
    renderCurrentPage();
    updateNav();
  },
};

function updateNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === currentTab);
  });
}

async function renderCurrentPage() {
  const content = document.getElementById("page-content");
  content.innerHTML =
    '<div style="text-align:center;padding:40px;color:var(--text-muted)">Cargando...</div>';
  const tab = TABS.find((t) => t.id === currentTab);
  if (tab) await tab.render(content, currentParams);
}

function buildNav() {
  const nav = document.getElementById("bottom-nav");
  nav.innerHTML = TABS.map(
    (t) => `
    <button class="nav-btn ${t.id === currentTab ? "active" : ""}" data-tab="${t.id}">
      <span class="nav-icon">${t.icon}</span>
      ${t.label}
    </button>`,
  ).join("");

  nav.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => window.App.nav(btn.dataset.tab));
  });
}

async function init() {
  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  buildNav();
  await renderCurrentPage();
  initSwipeNav();
}

function initSwipeNav() {
  const TAB_IDS = TABS.map((t) => t.id);
  let startX = 0,
    startY = 0,
    startTarget = null;

  const el = document.getElementById("page-content");

  el.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTarget = e.target;
    },
    { passive: true },
  );

  el.addEventListener(
    "touchend",
    (e) => {
      // Ignore if a modal is open
      if (document.querySelector(".modal-overlay")) return;
      // Ignore if swipe started inside a horizontal scroller (day-selector)
      if (startTarget && startTarget.closest(".day-selector")) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      // Must be clearly horizontal (dx > 55px and more horizontal than vertical)
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.4) return;

      const idx = TAB_IDS.indexOf(currentTab);
      if (dx < 0 && idx < TAB_IDS.length - 1) {
        // Swipe left → next tab
        window.App.nav(TAB_IDS[idx + 1]);
      } else if (dx > 0 && idx > 0) {
        // Swipe right → previous tab
        window.App.nav(TAB_IDS[idx - 1]);
      }
    },
    { passive: true },
  );
}

document.addEventListener("DOMContentLoaded", init);
