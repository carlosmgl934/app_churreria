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
}

document.addEventListener("DOMContentLoaded", init);
