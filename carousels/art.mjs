// Illustrations for the Instagram carousels, drawn as inline SVG so they stay
// sharp at any size and use the brand colors. Every function returns an SVG
// string. Colors come from the post palette (`c`).

// ── Shared shapes ───────────────────────────────────────────────────────────

// Lower molar, viewBox 0 0 300 420: crown on top, two roots.
const MOLAR =
  "M62 150 C50 96 70 42 112 38 C132 36 140 56 150 56 C160 56 168 36 188 38 C230 42 250 96 238 150 C234 176 228 196 226 224 C222 288 216 352 200 384 C190 402 174 396 170 372 C164 330 162 292 150 286 C138 292 136 330 130 372 C126 396 110 402 100 384 C84 352 78 288 74 224 C72 196 66 176 62 150 Z";
// Enamel / dentin boundary (crown only).
const DEJ =
  "M80 222 C74 176 76 112 112 74 C128 64 140 80 150 80 C160 80 172 64 188 74 C224 112 226 176 220 222";
// Pulp chamber + root canals.
const PULP =
  "M120 182 C116 152 128 140 138 150 C144 156 156 156 162 150 C172 140 184 152 180 182 C178 206 176 222 178 250 C182 300 188 338 188 366 C184 370 180 370 178 366 C174 330 168 292 160 266 C156 254 144 254 140 266 C132 292 126 330 122 366 C120 370 116 370 112 366 C112 338 118 300 122 250 C124 222 122 206 120 182 Z";

// Single-rooted tooth (premolar / incisor), 120×300 grid.
const SINGLE_ROOT =
  "M20 60 C18 26 38 10 60 10 C82 10 102 26 100 60 L94 120 C90 190 74 260 62 290 C60 294 58 294 56 290 C46 260 30 190 26 120 Z";

// Simple tooth outline for logos and small icons (200×200 grid).
const TOOTH_ICON =
  "M60 40 C40 40 30 60 32 82 C34 104 44 118 48 140 C52 165 56 180 68 180 C80 180 82 160 86 145 C89 132 94 126 100 126 C106 126 111 132 114 145 C118 160 120 180 132 180 C144 180 148 165 152 140 C156 118 166 104 168 82 C170 60 160 40 140 40 C124 40 114 50 100 50 C86 50 76 40 60 40 Z";

let uid = 0;
const id = (p) => `${p}${++uid}`;

export const logoMark = (stroke, fill = "none", size = 56) => `
<svg width="${size}" height="${size}" viewBox="0 0 200 200" aria-hidden="true">
  <rect x="6" y="6" width="188" height="188" rx="54" fill="${fill}" stroke="${stroke}" stroke-width="10"/>
  <g transform="translate(36 34) scale(0.64)">
    <path d="${TOOTH_ICON}" fill="none" stroke="${stroke}" stroke-width="15" stroke-linejoin="round"/>
    <path d="M58 70 C52 76 51 84 52 94" fill="none" stroke="${stroke}" stroke-width="15" stroke-linecap="round"/>
  </g>
</svg>`;

// ── Line icons (48×48 grid, stroke = currentColor) ──────────────────────────

const ICONS = {
  check: '<path d="M10 25 L20 35 L38 14"/>',
  arrow: '<path d="M40 24 H8 M20 12 L8 24 L20 36"/>',
  spot: '<path d="M24 6 C14 6 8 14 8 23 C8 34 16 42 24 42 C32 42 40 34 40 23 C40 14 34 6 24 6 Z"/><circle cx="20" cy="22" r="5" fill="currentColor" stroke="none"/>',
  snow: '<path d="M24 5 V43 M7.5 14.5 L40.5 33.5 M7.5 33.5 L40.5 14.5 M19 9 L24 13 L29 9 M19 39 L24 35 L29 39"/>',
  food: '<path d="M14 6 V22 C14 26 18 28 18 28 V42 M10 6 V18 M18 6 V18 M32 42 V6 C26 10 26 20 26 26 H32"/>',
  hole: '<path d="M10 14 C10 9 14 7 18 8 C21 9 22 11 24 11 C26 11 27 9 30 8 C34 7 38 9 38 14 C38 22 34 26 33 34 C32 40 30 42 28 42 C25 42 25 34 24 34 C23 34 23 42 20 42 C18 42 16 40 15 34 C14 26 10 22 10 14 Z"/><path d="M20 14 C21 18 27 18 28 14"/>',
  moon: '<path d="M30 6 C20 8 13 16 13 26 C13 35 20 42 30 42 C34 42 37 41 40 39 C30 37 24 30 24 22 C24 15 27 10 30 6 Z"/><path d="M38 9 V15 M35 12 H41"/>',
  brush: '<path d="M6 42 L26 22"/><path d="M24 24 L37 11 C39 9 42 12 40 14 L27 27 Z"/><path d="M29 14 L26 11 M33 10 L30 7 M37 6 L34 3"/>',
  tea: '<path d="M13 14 H35 L32 40 C32 42 30 43 28 43 H20 C18 43 16 42 16 40 Z"/><path d="M14 22 H34"/><path d="M20 4 C18 7 22 8 20 11 M27 4 C25 7 29 8 27 11"/>',
  floss: '<path d="M8 10 C16 18 22 18 24 24 C26 30 32 30 40 38"/><path d="M6 6 H14 V12 M34 42 H42 V36"/>',
  calendar: '<rect x="7" y="10" width="34" height="31" rx="5"/><path d="M7 19 H41 M16 5 V13 M32 5 V13"/><path d="M16 29 L21 34 L32 25"/>',
  drop: '<path d="M24 5 C24 5 11 20 11 29 C11 37 17 43 24 43 C31 43 37 37 37 29 C37 20 24 5 24 5 Z"/>',
  swell: '<path d="M6 30 C10 18 18 14 24 14 C30 14 38 18 42 30"/><path d="M6 36 H42"/><path d="M24 6 V10 M13 9 L15 12 M35 9 L33 12"/>',
  breath: '<path d="M8 20 C14 14 20 26 26 20 C32 14 38 26 42 20"/><path d="M8 30 C14 24 20 36 26 30 C32 24 38 36 42 30"/>',
  recede: '<path d="M14 6 V30 C14 38 18 42 24 42 C30 42 34 38 34 30 V6"/><path d="M6 22 C12 26 18 16 24 18 C30 16 36 26 42 22" stroke-dasharray="3 4"/>',
  loose: '<path d="M18 10 C18 10 14 22 18 34 C20 40 28 40 30 34 C34 22 30 10 30 10"/><path d="M8 16 L4 20 L8 24 M40 16 L44 20 L40 24"/>',
  noSmoke: '<rect x="6" y="22" width="30" height="8" rx="2"/><path d="M40 22 V30 M8 8 L42 42"/>',
  scaler: '<path d="M8 40 L28 20"/><path d="M28 20 L34 14 C38 10 42 8 42 12 C42 16 36 16 34 20"/><circle cx="12" cy="36" r="2" fill="currentColor"/>',
  jaw: '<path d="M6 14 C6 32 14 42 24 42 C34 42 42 32 42 14"/><path d="M12 14 V20 M19 16 V22 M29 16 V22 M36 14 V20"/>',
  gumUp: '<path d="M6 26 C12 18 18 18 24 22 C30 18 36 18 42 26"/><path d="M16 26 V40 M32 26 V40"/><path d="M24 6 V14 M20 10 L24 6 L28 10"/>',
  mouth: '<path d="M6 24 C12 14 36 14 42 24 C36 34 12 34 6 24 Z"/><path d="M4 12 L10 16 M44 12 L38 16"/>',
  taste: '<path d="M10 26 C10 36 16 42 24 42 C32 42 38 36 38 26 Z"/><path d="M18 18 C16 14 20 12 18 8 M26 18 C24 14 28 12 26 8"/>',
  alert: '<path d="M24 6 L44 40 H4 Z"/><path d="M24 18 V28"/><circle cx="24" cy="34" r="1.5" fill="currentColor"/>',
  lemon: '<circle cx="24" cy="24" r="17"/><path d="M24 7 V41 M7 24 H41 M12 12 L36 36 M36 12 L12 36"/>',
  clock: '<circle cx="24" cy="24" r="18"/><path d="M24 12 V24 L32 29"/>',
  grind: '<path d="M8 14 H40 M8 34 H40"/><path d="M12 14 V20 M20 14 V20 M28 14 V20 M36 14 V20 M12 34 V28 M20 34 V28 M28 34 V28 M36 34 V28"/><path d="M4 24 H10 M38 24 H44"/>',
  sparkle: '<path d="M22 6 C23 16 26 20 36 22 C26 24 23 28 22 38 C21 28 18 24 8 22 C18 20 21 16 22 6 Z"/><path d="M38 34 L38 44 M33 39 H43"/>',
  tube: '<path d="M10 16 H32 L40 22 V26 L32 32 H10 Z"/><path d="M40 24 H44"/><path d="M16 16 V32 M22 20 H28 M22 28 H28"/>',
  water: '<path d="M14 8 H34 L31 42 H17 Z"/><path d="M15 20 C20 16 28 24 33 20"/>',
  xray: '<rect x="5" y="9" width="38" height="30" rx="5"/><path d="M12 22 C12 30 17 32 24 32 C31 32 36 30 36 22"/><path d="M15 22 V26 M21 23 V27 M27 23 V27 M33 22 V26"/>',
  cyst: '<circle cx="24" cy="26" r="13" stroke-dasharray="4 4"/><circle cx="24" cy="26" r="5"/><path d="M24 4 V10"/>',
  neighbor: '<path d="M6 16 C6 30 9 40 14 40 C19 40 20 30 20 16 Z"/><path d="M28 22 L42 12 M28 22 L34 34 C36 40 42 38 42 30 Z"/>',
  infection: '<circle cx="24" cy="24" r="8"/><path d="M24 6 V12 M24 36 V42 M6 24 H12 M36 24 H42 M11 11 L15 15 M33 33 L37 37 M11 37 L15 33 M33 15 L37 11"/>',
  phone: '<path d="M14 6 H20 L23 15 L18 19 C20 25 23 28 29 30 L33 25 L42 28 V34 C42 38 39 42 35 42 C18 41 7 30 6 13 C6 9 10 6 14 6 Z"/>',
  pin: '<path d="M24 44 C24 44 9 29 9 19 C9 10 16 4 24 4 C32 4 39 10 39 19 C39 29 24 44 24 44 Z"/><circle cx="24" cy="19" r="6"/>',
  insta: '<rect x="6" y="6" width="36" height="36" rx="11"/><circle cx="24" cy="24" r="8"/><circle cx="34.5" cy="13.5" r="1.8" fill="currentColor"/>',
  chat: '<path d="M8 10 H40 C42 10 42 12 42 12 V32 C42 34 40 34 40 34 H20 L12 41 V34 H8 C6 34 6 32 6 32 V12 C6 10 8 10 8 10 Z"/><path d="M14 20 H34 M14 26 H28"/>',
};

export const icon = (name, size = 48, width = 3) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// ── Tooth cross-section ─────────────────────────────────────────────────────

// Cross-section of a molar in its gum. `lesion` (0–3) draws a cavity of
// increasing depth: 1 enamel only, 2 into the dentin, 3 reaching the pulp.
const toothSection = ({ c, lesion = 0, gum = true, w = 300, recede = false, tubules = false }) => {
  const clip = id("clip");
  const lesionPaths = {
    1: `<ellipse cx="104" cy="52" rx="16" ry="9" fill="${c.white}" stroke="${c.ink}" stroke-width="2.5" stroke-dasharray="4 4" transform="rotate(-28 104 52)"/>`,
    2: `<path d="M86 50 C92 38 112 34 122 46 C126 66 122 96 110 112 C100 106 90 84 86 50 Z" fill="${c.decay}"/>`,
    3: `<path d="M82 52 C88 36 116 30 126 46 C134 78 136 128 132 150 C124 156 112 150 106 134 C96 108 86 84 82 52 Z" fill="${c.decay}"/>`,
  };
  const gumY = recede ? 262 : 214;
  return `
<svg width="${w}" viewBox="${tubules ? "-90 0 400 440" : "-10 0 320 440"}" aria-hidden="true">
  <defs><clipPath id="${clip}"><path d="${MOLAR}"/></clipPath></defs>
  ${gum ? `<path d="M-10 ${gumY + 14} C40 ${gumY - 8} 60 ${gumY - 2} 74 ${gumY} L74 440 L-10 440 Z M310 ${gumY + 14} C260 ${gumY - 8} 240 ${gumY - 2} 226 ${gumY} L226 440 L310 440 Z" fill="${c.gum}"/>
  <path d="M-10 ${gumY + 14} C40 ${gumY - 8} 60 ${gumY - 2} 74 ${gumY} M310 ${gumY + 14} C260 ${gumY - 8} 240 ${gumY - 2} 226 ${gumY}" fill="none" stroke="${c.gumLine}" stroke-width="3"/>` : ""}
  <path d="${MOLAR}" fill="${c.dentin}"/>
  <g clip-path="url(#${clip})">
    <path d="${DEJ} L240 0 L60 0 Z" fill="${c.enamel}"/>
    ${tubules ? Array.from({ length: 6 }, (_, i) => {
      const y = 226 + i * 7;
      return `<path d="M70 ${y} C88 ${y - 4} 104 ${y - 10} 122 ${y - 18}" stroke="${c.accent}" stroke-width="2.6" fill="none"/><path d="M230 ${y} C212 ${y - 4} 196 ${y - 10} 178 ${y - 18}" stroke="${c.accent}" stroke-width="2.6" fill="none"/>`;
    }).join("") : ""}
    ${gum ? `<rect x="-10" y="${gumY + 16}" width="320" height="440" fill="${c.gum}" opacity="0.6"/><path d="M-10 ${gumY + 14} C40 ${gumY - 8} 60 ${gumY - 2} 74 ${gumY} L74 440 L-10 440 Z M310 ${gumY + 14} C260 ${gumY - 8} 240 ${gumY - 2} 226 ${gumY} L226 440 L310 440 Z" fill="${c.gum}" opacity="0.94"/>` : ""}
    ${lesionPaths[lesion] || ""}
  </g>
  <path d="${DEJ}" fill="none" stroke="${c.ink}" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round" opacity="0.55"/>
  <path d="${PULP}" fill="${c.pulp}" stroke="${c.pulpLine}" stroke-width="2.5"/>
  <path d="${MOLAR}" fill="none" stroke="${c.ink}" stroke-width="5" stroke-linejoin="round"/>
  ${tubules ? `<g stroke="${c.accent}" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M-50 150 V206 M-74 164 L-26 192 M-74 192 L-26 164"/>
    <path d="M-30 222 C-6 230 20 236 52 240"/><path d="M38 228 L54 240 L38 252"/>
  </g>` : ""}
</svg>`;
};

// ── Post 1 · Caries ─────────────────────────────────────────────────────────

export const cariesHook = (c) => {
  const clip = id("lens");
  // Molar placed at (230, 60) scale 0.95; decay spot at molar (176, 78).
  const tooth = (extra = "") => `<g transform="translate(230 60) scale(0.95)">
      <path d="${MOLAR}" fill="${c.white}" stroke="${c.ink}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M88 96 C84 108 84 122 88 136" fill="none" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/>
      ${extra}
    </g>`;
  return `
<div class="art-hook">
  <svg width="760" viewBox="0 0 760 520" aria-hidden="true">
    <defs><clipPath id="${clip}"><circle cx="398" cy="134" r="84"/></clipPath></defs>
    <circle cx="380" cy="270" r="250" fill="${c.soft}"/>
    ${tooth(`<ellipse cx="176" cy="78" rx="7" ry="4.5" fill="${c.decay}" transform="rotate(20 176 78)"/>`)}
    <g clip-path="url(#${clip})">
      <circle cx="398" cy="134" r="84" fill="${c.white}"/>
      <g transform="translate(398 134) scale(2.3) translate(-398 -134)">
        ${tooth(`<ellipse cx="176" cy="78" rx="7" ry="4.5" fill="${c.decay}" transform="rotate(20 176 78)"/><ellipse cx="176" cy="78" rx="12" ry="8" fill="none" stroke="${c.decay}" stroke-width="1.2" opacity="0.35" transform="rotate(20 176 78)"/>`)}
      </g>
    </g>
    <circle cx="398" cy="134" r="84" fill="none" stroke="${c.accent}" stroke-width="12"/>
    <path d="M458 194 L530 266" stroke="${c.ink}" stroke-width="26" stroke-linecap="round"/>
  </svg>
</div>`;
};

export const cariesStages = (c) => {
  const stage = (n, label, fr, text) => `
  <div class="stage">
    <div class="stage-art">${toothSection({ c, lesion: n, w: 220 })}</div>
    <div class="stage-n">${n}</div>
    <div class="stage-fr">${fr}</div>
    <div class="stage-title">${label}</div>
    <div class="stage-text">${text}</div>
  </div>`;
  return `<div class="stages">
    ${stage(1, "بقعة بيضاء", "Émail", "ما كتوجعش. بالفليور تقدر تتوقف")}
    ${stage(2, "السوسة دخلات", "Dentine", "حساسية مع الحلو والبارد")}
    ${stage(3, "وصلات للعصب", "Pulpe", "وجع قوي، العلاج كيكبر")}
  </div>`;
};

// ── Post 2 · Gums ───────────────────────────────────────────────────────────

// Front tooth in its socket: gum (soft tissue) over bone. `state`:
// healthy | gingivitis | periodontitis.
const gumSection = (c, state) => {
  const boneTop = state === "periodontitis" ? 262 : 204;
  const gumTop = { healthy: 166, gingivitis: 150, periodontitis: 222 }[state];
  const bulge = state === "gingivitis" ? 22 : 6;
  const gumFill = state === "healthy" ? c.gum : c.inflamed;
  const clip = id("g");
  const tooth = "M48 64 C46 32 76 16 100 16 C124 16 154 32 152 64 L142 146 C139 164 134 174 132 182 C128 242 118 302 106 336 C103 344 97 344 94 336 C82 302 72 242 68 182 C66 174 64 166 62 150 Z";
  const side = (flip) => {
    const x = (v) => (flip ? 200 - v : v);
    return `M${x(0)} ${gumTop + 44} C${x(24)} ${gumTop + 34} ${x(40)} ${gumTop - bulge} ${x(64)} ${gumTop} L${x(72)} ${boneTop + 26} L${x(0)} ${boneTop + 36} Z`;
  };
  const bone = (flip) => {
    const x = (v) => (flip ? 200 - v : v);
    return `M${x(0)} ${boneTop + 14} C${x(30)} ${boneTop + 4} ${x(52)} ${boneTop} ${x(70)} ${boneTop} L${x(80)} 360 L${x(0)} 360 Z`;
  };
  return `
<svg width="240" viewBox="0 0 200 360" aria-hidden="true">
  <defs><clipPath id="${clip}"><rect x="0" y="0" width="200" height="360" rx="28"/></clipPath></defs>
  <g clip-path="url(#${clip})">
    <rect x="0" y="0" width="200" height="360" fill="${c.panel}"/>
    <path d="${tooth}" fill="${c.white}" stroke="${c.ink}" stroke-width="4"/>
    <rect x="0" y="${boneTop + 40}" width="200" height="360" fill="${c.bone}" opacity="0.82"/>
    <path d="${bone(false)}" fill="${c.bone}" opacity="0.82"/><path d="${bone(true)}" fill="${c.bone}" opacity="0.82"/>
    <path d="${side(false)}" fill="${gumFill}" opacity="0.94"/><path d="${side(true)}" fill="${gumFill}" opacity="0.94"/>
    <path d="M0 ${boneTop + 14} C30 ${boneTop + 4} 52 ${boneTop} 70 ${boneTop} M200 ${boneTop + 14} C170 ${boneTop + 4} 148 ${boneTop} 130 ${boneTop}" stroke="${c.boneLine}" stroke-width="2.5" stroke-dasharray="5 5" fill="none"/>
    ${state === "gingivitis" ? `<circle cx="44" cy="${gumTop + 6}" r="5" fill="${c.inflamedLine}"/><circle cx="158" cy="${gumTop + 8}" r="4" fill="${c.inflamedLine}"/><circle cx="66" cy="${gumTop + 2}" r="3.5" fill="${c.inflamedLine}"/>` : ""}
    ${state === "periodontitis" ? `<path d="M74 ${gumTop + 4} L78 ${boneTop - 2} M126 ${gumTop + 4} L122 ${boneTop - 2}" stroke="${c.inflamedLine}" stroke-width="4" stroke-dasharray="3 5" stroke-linecap="round"/>
    <path d="M14 204 H52" stroke="${c.accent}" stroke-width="2.5" stroke-dasharray="4 4"/>
    <path d="M33 210 V${boneTop - 8}" stroke="${c.accent}" stroke-width="3"/><path d="M26 ${boneTop - 16} L33 ${boneTop - 6} L40 ${boneTop - 16}" stroke="${c.accent}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
  </g>
</svg>`;
};

export const gumsHook = (c) => {
  const clip = id("hookc");
  const incisor = (x, y, w, h) =>
    `<path d="M${x} ${y + h} C${x - 2} ${y + h * 0.4} ${x + 4} ${y + 10} ${x + w * 0.5} ${y} C${x + w - 4} ${y + 10} ${x + w + 2} ${y + h * 0.4} ${x + w} ${y + h} Z" fill="${c.white}" stroke="${c.ink}" stroke-width="6" stroke-linejoin="round"/>`;
  const gumLine = "M110 330 C150 300 190 296 220 322 C250 290 300 290 330 316 C360 290 410 290 440 322 C470 296 510 300 560 330";
  return `
<div class="art-hook">
  <svg width="780" viewBox="0 0 680 560" aria-hidden="true">
    <defs><clipPath id="${clip}"><circle cx="340" cy="290" r="250"/></clipPath></defs>
    <circle cx="340" cy="290" r="250" fill="${c.soft}"/>
    <g clip-path="url(#${clip})">
      ${incisor(150, 150, 120, 200)}${incisor(270, 132, 130, 214)}${incisor(400, 150, 120, 200)}
      <path d="${gumLine} L560 560 L110 560 Z" fill="${c.inflamed}"/>
      <path d="${gumLine}" fill="none" stroke="${c.inflamedLine}" stroke-width="7" stroke-linecap="round"/>
    </g>
    <path d="M330 318 C330 318 312 344 312 358 C312 370 320 378 330 378 C340 378 348 370 348 358 C348 344 330 318 330 318 Z" fill="${c.inflamedLine}"/>
    <path d="M222 326 C222 326 212 340 212 348 C212 355 216 360 222 360 C228 360 232 355 232 348 C232 340 222 326 222 326 Z" fill="${c.inflamedLine}" opacity="0.7"/>
    <g transform="translate(420 248) rotate(-24)">
      <rect x="40" y="-17" width="290" height="34" rx="17" fill="${c.accent}"/>
      <rect x="-20" y="-11" width="80" height="22" rx="8" fill="${c.accent}"/>
      <rect x="-120" y="-22" width="112" height="44" rx="18" fill="${c.white}" stroke="${c.ink}" stroke-width="5"/>
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${-112 + i * 14.5}" y="20" width="9" height="40" rx="4.5" fill="${c.white}" stroke="${c.ink}" stroke-width="2.5"/>`).join("")}
    </g>
  </svg>
</div>`;
};

export const gumStages = (c) => {
  const col = (state, title, fr, text, tone) => `
  <div class="stage ${tone}">
    <div class="stage-art">${gumSection(c, state)}</div>
    <div class="stage-fr">${fr}</div>
    <div class="stage-title">${title}</div>
    <div class="stage-text">${text}</div>
  </div>`;
  return `<div class="stages">
    ${col("healthy", "لثة صحيحة", "Saine", "مشدودة، ما كيخرجش منها الدم", "ok")}
    ${col("gingivitis", "التهاب اللثة", "Gingivite", "كترجع لحالتها بالتنظيف والعلاج", "warn")}
    ${col("periodontitis", "العظم تضرر", "Parodontite", "الضرر ما كيرجعش، العلاج كيوقفو", "bad")}
  </div>`;
};

// ── Post 3 · Wisdom teeth (blueprint) ───────────────────────────────────────

const molarSmall = (x, y, rot, c, { highlight = false, scale = 0.42 } = {}) => `
  <g transform="translate(${x} ${y}) rotate(${rot} 63 88) scale(${scale})">
    <path d="${MOLAR}" fill="${highlight ? c.accentSoft : c.paper}" stroke="${highlight ? c.accent : c.ink}" stroke-width="${highlight ? 9 : 7}" stroke-linejoin="round"/>
  </g>`;

export const wisdomHook = (c) => `
<div class="art-hook">
  <svg width="900" viewBox="0 0 900 560" aria-hidden="true">
    <path d="M40 150 C120 470 300 520 450 520 C600 520 780 470 860 150" fill="none" stroke="${c.ink}" stroke-width="4"/>
    <path d="M70 168 C150 440 310 486 450 486 C590 486 750 440 830 168" fill="none" stroke="${c.ink}" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>
    ${molarSmall(110, 210, 0, c)}
    ${molarSmall(240, 250, 0, c)}
    ${[[372, 290], [425, 300], [478, 290]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(0.42)"><path d="${SINGLE_ROOT}" fill="${c.paper}" stroke="${c.ink}" stroke-width="7" stroke-linejoin="round"/></g>`).join("")}
    ${molarSmall(530, 250, 0, c)}
    ${molarSmall(660, 210, 0, c)}
    ${molarSmall(2, 150, 34, c, { highlight: true })}
    ${molarSmall(772, 150, -34, c, { highlight: true })}
    <circle cx="66" cy="244" r="96" fill="none" stroke="${c.accent}" stroke-width="3" stroke-dasharray="10 8"/>
    <circle cx="834" cy="244" r="96" fill="none" stroke="${c.accent}" stroke-width="3" stroke-dasharray="10 8"/>
    <g font-family="Cairo, sans-serif" font-weight="800" font-size="34" fill="${c.accent}">
      <text x="34" y="388">48</text><text x="808" y="388">38</text>
    </g>
    <path d="M380 120 H520 M450 92 V148" stroke="${c.ink}" stroke-width="2" opacity="0.35"/>
  </svg>
</div>`;

export const wisdomTypes = (c) => {
  const panel = (rot, buried, title, fr) => `
  <div class="stage">
    <div class="stage-art">
      <svg width="250" viewBox="0 0 260 300" aria-hidden="true">
        <rect x="2" y="2" width="256" height="296" rx="20" fill="${c.paper}" stroke="${c.ink}" stroke-width="2" stroke-dasharray="6 6"/>
        <path d="M2 ${buried ? 110 : 150} C80 ${buried ? 104 : 144} 180 ${buried ? 104 : 144} 258 ${buried ? 110 : 150} L258 298 L2 298 Z" fill="${c.bone}"/>
        <path d="M2 ${buried ? 110 : 150} C80 ${buried ? 104 : 144} 180 ${buried ? 104 : 144} 258 ${buried ? 110 : 150}" stroke="${c.ink}" stroke-width="2.5" fill="none"/>
        ${molarSmall(16, 60, 0, c, { scale: 0.4 })}
        ${molarSmall(132, buried ? 130 : 60, rot, c, { highlight: true, scale: 0.4 })}
        <text x="44" y="40" font-family="Cairo" font-weight="700" font-size="22" fill="${c.ink}" opacity="0.6">47</text>
        <text x="168" y="40" font-family="Cairo" font-weight="800" font-size="22" fill="${c.accent}">48</text>
      </svg>
    </div>
    <div class="stage-fr">${fr}</div>
    <div class="stage-title">${title}</div>
  </div>`;
  return `<div class="stages">
    ${panel(0, false, "طالعة مزيان", "Normale")}
    ${panel(-42, false, "معوجة", "Mésio-angulée")}
    ${panel(-82, true, "مدفونة فالعظم", "Incluse")}
  </div>`;
};

// ── Post 4 · Sensitivity ────────────────────────────────────────────────────

export const sensitivityHook = (c) => `
<div class="art-hook">
  <svg width="820" viewBox="0 0 820 600" aria-hidden="true">
    <circle cx="410" cy="300" r="270" fill="${c.white}" opacity="0.12"/>
    <circle cx="410" cy="300" r="200" fill="${c.white}" opacity="0.1"/>
    <g transform="translate(250 90) scale(0.9)">
      <path d="${MOLAR}" fill="${c.white}" stroke="${c.ink}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M86 92 C82 104 82 120 86 134" fill="none" stroke="${c.accentSoft}" stroke-width="8" stroke-linecap="round"/>
    </g>
    <g stroke="${c.white}" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M210 200 L170 182 M200 250 L150 250 M210 300 L170 318"/>
      <path d="M610 200 L650 182 M620 250 L670 250 M610 300 L650 318"/>
    </g>
    <g transform="translate(590 340) rotate(14)">
      <rect x="0" y="0" width="150" height="150" rx="30" fill="${c.white}" opacity="0.9"/>
      <rect x="18" y="18" width="40" height="70" rx="16" fill="${c.white}"/>
      <path d="M40 50 V100 M18 62 L62 88 M18 88 L62 62" transform="translate(35 0)" stroke="${c.accent}" stroke-width="7" stroke-linecap="round"/>
    </g>
  </svg>
</div>`;

export const sensitivityDiagram = (c) => `
<div class="diagram">
  <div class="diagram-art">${toothSection({ c, recede: true, tubules: true, w: 400 })}</div>
  <div class="callouts">
    <div class="callout"><span class="dot" style="background:${c.enamel};border:3px solid ${c.ink}"></span><b class="fr">Émail</b><span>الطبقة اللي كتحمي</span></div>
    <div class="callout"><span class="dot" style="background:${c.dentin}"></span><b class="fr">Dentine</b><span>فيها قنوات صغار</span></div>
    <div class="callout"><span class="dot" style="background:${c.pulp}"></span><b class="fr">Pulpe</b><span>العصب ديال السنة</span></div>
    <div class="callout"><span class="dot" style="background:${c.gum}"></span><b class="fr">Gencive</b><span>هبطات وبانت الجدر</span></div>
  </div>
</div>`;
