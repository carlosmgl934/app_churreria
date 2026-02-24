// icons.js — Iconos SVG personalizados para churros y porras

/**
 * Churro SVG: palo fino, dorado, con rayas de la estrella, azúcar espolvoreado
 * @param {number} size - px
 */
export function iconChurro(size = 28) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle">
    <defs>
      <linearGradient id="cg${size}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#92400E"/>
        <stop offset="30%" stop-color="#F59E0B"/>
        <stop offset="70%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#78350F"/>
      </linearGradient>
    </defs>
    <!-- Cuerpo del churro (inclinado ~20°) -->
    <g transform="translate(24,24) rotate(-20) translate(-24,-24)">
      <!-- Sombra -->
      <rect x="19" y="4" width="12" height="40" rx="6" fill="#3D1A08" opacity="0.35"/>
      <!-- Cuerpo principal -->
      <rect x="18" y="3" width="12" height="40" rx="6" fill="url(#cg${size})"/>
      <!-- Brillo lateral izquierdo -->
      <rect x="18" y="3" width="4" height="40" rx="4" fill="white" opacity="0.2"/>
      <!-- Estrías de la boquilla de estrella -->
      <rect x="18" y="10" width="12" height="3" rx="1.5" fill="#78350F" opacity="0.5"/>
      <rect x="18" y="17" width="12" height="3" rx="1.5" fill="#78350F" opacity="0.5"/>
      <rect x="18" y="24" width="12" height="3" rx="1.5" fill="#78350F" opacity="0.5"/>
      <rect x="18" y="31" width="12" height="3" rx="1.5" fill="#78350F" opacity="0.5"/>
      <rect x="18" y="38" width="12" height="3" rx="1.5" fill="#78350F" opacity="0.5"/>
      <!-- Azúcar (puntitos blancos) -->
      <circle cx="22" cy="8" r="1.2" fill="white" opacity="0.7"/>
      <circle cx="27" cy="15" r="1" fill="white" opacity="0.6"/>
      <circle cx="21" cy="22" r="1.2" fill="white" opacity="0.65"/>
      <circle cx="26" cy="29" r="1" fill="white" opacity="0.6"/>
      <circle cx="22" cy="35" r="1.1" fill="white" opacity="0.7"/>
    </g>
  </svg>`;
}

/**
 * Porra SVG: igual que el churro pero más gruesa, más oscura por ser más grande
 * @param {number} size - px
 */
export function iconPorra(size = 28) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle">
    <defs>
      <linearGradient id="pg${size}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#78350F"/>
        <stop offset="30%" stop-color="#D97706"/>
        <stop offset="65%" stop-color="#B45309"/>
        <stop offset="100%" stop-color="#5C2D0E"/>
      </linearGradient>
    </defs>
    <!-- Cuerpo de la porra (más gruesa, menos inclinada) -->
    <g transform="translate(24,24) rotate(-12) translate(-24,-24)">
      <!-- Sombra -->
      <rect x="14" y="3" width="20" height="42" rx="10" fill="#2D1206" opacity="0.4"/>
      <!-- Cuerpo principal (más ancho = porra) -->
      <rect x="13" y="2" width="20" height="42" rx="10" fill="url(#pg${size})"/>
      <!-- Brillo -->
      <rect x="13" y="2" width="6" height="42" rx="6" fill="white" opacity="0.18"/>
      <!-- Estrías más anchas por la boquilla grande -->
      <rect x="13" y="9" width="20" height="4" rx="2" fill="#5C2D0E" opacity="0.5"/>
      <rect x="13" y="18" width="20" height="4" rx="2" fill="#5C2D0E" opacity="0.5"/>
      <rect x="13" y="27" width="20" height="4" rx="2" fill="#5C2D0E" opacity="0.5"/>
      <rect x="13" y="36" width="20" height="4" rx="2" fill="#5C2D0E" opacity="0.5"/>
      <!-- Azúcar -->
      <circle cx="19" cy="6" r="1.4" fill="white" opacity="0.65"/>
      <circle cx="27" cy="14" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="18" cy="23" r="1.4" fill="white" opacity="0.65"/>
      <circle cx="28" cy="32" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="20" cy="40" r="1.3" fill="white" opacity="0.65"/>
      <!-- Tono más oscuro para parecer más gruesa -->
      <rect x="13" y="2" width="20" height="42" rx="10" fill="#78350F" opacity="0.15"/>
    </g>
  </svg>`;
}

/** Versión texto con icono para usar en contadores: "25 🫓" → "25 [churro]" */
export function churroLabel(n, size = 22) {
  return `${iconChurro(size)} <strong style="vertical-align:middle">${n}</strong>`;
}
export function porraLabel(qty, size = 22) {
  return `${iconPorra(size)} <strong style="vertical-align:middle;font-size:${size * 0.85}px">${qty}</strong>`;
}

// ── Iconos de Navegación e UI Generales ─────────────────────────────────────

export function iconHome(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>`;
}

export function iconEdit(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>`;
}

export function iconCalendar(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <circle cx="12" cy="15" r="1.5" fill="currentColor"></circle>
  </svg>`;
}

export function iconBarUI(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <path d="M3 9l1.5-4h15L21 9v2.5a2.5 2.5 0 0 1-5 0v-2.5h-1v2.5a2.5 2.5 0 0 1-5 0v-2.5h-1v2.5a2.5 2.5 0 0 1-5 0V9z"></path>
    <path d="M4 12v9h16v-9"></path>
    <path d="M10 21v-5a2 2 0 0 1 4 0v5"></path>
  </svg>`;
}

export function iconStats(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>`;
}

export function iconClock(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`;
}

export function iconVan(size = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">
    <rect x="1" y="3" width="15" height="13" rx="1" ry="1"></rect>
    <path d="M16 8h4l3 3v5h-7V8z"></path>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>`;
}
