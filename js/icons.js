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
export function porraLabel(n, size = 22) {
  return `${iconPorra(size)} <strong style="vertical-align:middle">${n}</strong>`;
}
