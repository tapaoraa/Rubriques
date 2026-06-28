// ── Palette de couleurs nommées ──────────────────────────────
// On ne stocke plus un hex libre mais une CLÉ de couleur (ex. 'bleu').
// Chaque couleur est une échelle de teintes 50→900 (valeurs Tailwind,
// sauf « marron » défini à la main car absent de Tailwind).
// Le rendu pioche la bonne teinte selon l'usage via shade()/tint().

export const PALETTE = {
  gris:   { 50:'#f9fafb', 100:'#f3f4f6', 200:'#e5e7eb', 300:'#d1d5db', 400:'#9ca3af', 500:'#6b7280', 600:'#4b5563', 700:'#374151', 800:'#1f2937', 900:'#111827' },
  marron: { 50:'#faf6f2', 100:'#f0e4d8', 200:'#e0c8ae', 300:'#cba37e', 400:'#b07d50', 500:'#92603a', 600:'#784c2e', 700:'#5e3b25', 800:'#492e20', 900:'#3a261c' },
  jaune:  { 50:'#fffbeb', 100:'#fef3c7', 200:'#fde68a', 300:'#fcd34d', 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706', 700:'#b45309', 800:'#92400e', 900:'#78350f' },
  orange: { 50:'#fff7ed', 100:'#ffedd5', 200:'#fed7aa', 300:'#fdba74', 400:'#fb923c', 500:'#f97316', 600:'#ea580c', 700:'#c2410c', 800:'#9a3412', 900:'#7c2d12' },
  rouge:  { 50:'#fef2f2', 100:'#fee2e2', 200:'#fecaca', 300:'#fca5a5', 400:'#f87171', 500:'#ef4444', 600:'#dc2626', 700:'#b91c1c', 800:'#991b1b', 900:'#7f1d1d' },
  rose:   { 50:'#fdf2f8', 100:'#fce7f3', 200:'#fbcfe8', 300:'#f9a8d4', 400:'#f472b6', 500:'#ec4899', 600:'#db2777', 700:'#be185d', 800:'#9d174d', 900:'#831843' },
  violet: { 50:'#f5f3ff', 100:'#ede9fe', 200:'#ddd6fe', 300:'#c4b5fd', 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9', 800:'#5b21b6', 900:'#4c1d95' },
  bleu:   { 50:'#eff6ff', 100:'#dbeafe', 200:'#bfdbfe', 300:'#93c5fd', 400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 800:'#1e40af', 900:'#1e3a8a' },
  vert:   { 50:'#f0fdf4', 100:'#dcfce7', 200:'#bbf7d0', 300:'#86efac', 400:'#4ade80', 500:'#22c55e', 600:'#16a34a', 700:'#15803d', 800:'#166534', 900:'#14532d' },
}

// Ordre d'affichage dans le picker + libellés.
export const COLORS = [
  { key: 'gris',   label: 'Gris' },
  { key: 'marron', label: 'Marron' },
  { key: 'jaune',  label: 'Jaune' },
  { key: 'orange', label: 'Orange' },
  { key: 'rouge',  label: 'Rouge' },
  { key: 'rose',   label: 'Rose' },
  { key: 'violet', label: 'Violet' },
  { key: 'bleu',   label: 'Bleu' },
  { key: 'vert',   label: 'Vert' },
]

export const DEFAULT_COLOR = 'gris'

// Retourne une teinte précise d'une couleur nommée.
// Tolérant : si on reçoit un hex hérité (#xxxxxx), on le renvoie tel quel.
export function tint(key, level = 500) {
  if (typeof key === 'string' && key[0] === '#') return key
  const scale = PALETTE[key] || PALETTE[DEFAULT_COLOR]
  return scale[level] || scale[500]
}

// Renvoie { bg, text, border, accent } selon l'usage et l'état.
//  - category            : teinte foncée, texte blanc
//  - level   / 'idle'    : neutre gris (état non sélectionné)
//  - level   / 'active'  : teinte claire, texte foncé
//  - column  / 'idle'    : très clair
//  - column  / 'active'  : teinte moyenne-claire
//  - column  / 'chosen'  : teinte foncée, texte blanc (point validé)
export function shade(key, usage, state = 'active') {
  const t = n => tint(key, n)
  if (usage === 'category') {
    return { bg: t(800), text: '#fff', border: t(800), accent: t(800) }
  }
  if (usage === 'level') {
    if (state === 'idle') return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db', accent: t(500) }
    return { bg: t(100), text: t(700), border: t(500), accent: t(500) }
  }
  if (usage === 'column') {
    if (state === 'chosen') return { bg: t(600), text: '#fff',  border: t(600), accent: t(600) }
    if (state === 'active') return { bg: t(200), text: t(800),  border: t(500), accent: t(600) }
    return { bg: t(50),  text: t(700), border: t(200), accent: t(500) } // idle
  }
  // fallback générique
  return { bg: t(100), text: t(700), border: t(500), accent: t(500) }
}
