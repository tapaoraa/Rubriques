import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GRILLE_DATA_DG } from '../data/grille-dg.js'

// ── Constantes ──────────────────────────────────────────────
export const MODALITIES = {
  check:   { label: 'Check',  color: 'vert' },
  level:   { label: 'Level',  color: 'violet' },
  columns: { label: 'Column', color: 'orange' },
}
export const CAT_COLOR_PALETTE = ['bleu', 'violet', 'vert', 'marron', 'rose', 'orange']

// Version du schéma de données persistées / exportées.
// À incrémenter en cas de changement de structure incompatible (+ migration).
export const SCHEMA_VERSION = 1

export const EVAL_STATES = [
  { key: 'total',    label: 'Total',    short: 'Total', color: '' },
  { key: 'absent',   label: 'Absent',   short: 'Abs',   color: '#dc2626' },
  { key: 'dispense', label: 'Dispensé', short: 'Dis',   color: '#6b7280' },
  { key: 'nonnote',  label: 'Non Noté', short: 'NoN',   color: '#6b7280' },
  { key: 'inapte',   label: 'Inapte',   short: 'Ina',   color: '#6b7280' },
]

// ── Helpers ──────────────────────────────────────────────────
const mkId = prefix => prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
export const mkGrilleId = () => mkId('grl')
export const mkEvalId   = () => mkId('ev')
export const mkCatId    = () => mkId('cat')
export const mkItemId   = () => mkId('itm')

const clone = obj => JSON.parse(JSON.stringify(obj))

// Valide la forme d'un gradeData importé (tableau de catégories d'items).
// Tolérant sur les champs optionnels, strict sur la structure de base.
export function isValidGradeData(data) {
  if (!Array.isArray(data)) return false
  return data.every(cat =>
    cat && typeof cat === 'object' &&
    (cat.items === undefined || (Array.isArray(cat.items) && cat.items.every(it =>
      it && typeof it === 'object' &&
      (it.modality === undefined || ['check', 'level', 'columns'].includes(it.modality))
    )))
  )
}

export function normalizeGrille(data) {
  const g = clone(data || [])
  g.forEach((cat, ci) => {
    if (!cat.id) cat.id = mkCatId()
    if (!cat.color) cat.color = CAT_COLOR_PALETTE[ci % CAT_COLOR_PALETTE.length]
    ;(cat.items || (cat.items = [])).forEach(it => { if (!it.id) it.id = mkItemId() })
  })
  return g
}

// ── Scoring helpers ──────────────────────────────────────────
export function itemMax(item) {
  const cfg = item.config || {}
  if (item.modality === 'check' && cfg.pills?.length)
    return cfg.pills.reduce((s, p) => s + (p.pts ?? 0), 0)
  if (item.modality === 'level' && cfg.groups?.length)
    return cfg.groups.reduce((s, grp) => {
      const lv = grp.levels || []
      return s + (lv.length ? (lv[lv.length - 1].pts ?? 0) : 0)
    }, 0)
  if (item.modality === 'columns' && cfg.levels?.length) {
    const lv = cfg.levels
    return lv[lv.length - 1].max ?? 0
  }
  return item.pts ?? 0
}

export function computeItemScore(item, scores) {
  const s = scores?.[item.id]
  if (!s) return 0
  if (s.type === 'check')
    return (item.config?.pills || []).reduce((sum, p, i) => sum + (s.states?.[i] === 'active' ? (p.pts ?? 0) : 0), 0)
  if (s.type === 'level') {
    const groups = item.config?.groups || []
    return groups.reduce((sum, grp, gi) => {
      const st = s.groupStates?.[gi] ?? 0
      return sum + (st > 0 ? (grp.levels[st - 1]?.pts ?? 0) : 0)
    }, 0)
  }
  if (s.type === 'columns') return s.score ?? 0
  return 0
}

export function studentTotal(eleve, gradeData) {
  const scores = eleve?.scores || {}
  return (gradeData || []).flatMap(c => c.items).reduce((sum, it) => sum + computeItemScore(it, scores), 0)
}

export function gradeMax(gradeData) {
  return (gradeData || []).flatMap(c => c.items).reduce((s, it) => s + itemMax(it), 0)
}

export function catScore(cat, scores) {
  return (cat.items || []).reduce((s, it) => s + computeItemScore(it, scores), 0)
}

export function isItemGradeable(item) {
  if (item.modality === 'check')   return !!item.config?.pills?.length
  if (item.modality === 'level')   return !!item.config?.groups?.length
  if (item.modality === 'columns') return !!item.config?.levels?.length
  return false
}

export function isItemComplete(item, scores) {
  const s = scores?.[item.id]
  if (item.modality === 'check') {
    const pills = item.config?.pills || []
    if (!pills.length) return false
    const states = s?.states || []
    return pills.every((_, i) => states[i] === 'active' || states[i] === 'rejected')
  }
  if (item.modality === 'level') {
    const groups = item.config?.groups || []
    if (!groups.length) return false
    const gs = s?.groupStates || []
    return groups.every((_, i) => (gs[i] ?? 0) > 0)
  }
  if (item.modality === 'columns') {
    if (!item.config?.levels?.length) return false
    return s?.ptBoxChosen === true
  }
  return false
}

export function isGrilleComplete(scores, gradeData) {
  const gradeable = (gradeData || []).flatMap(c => c.items).filter(isItemGradeable)
  if (!gradeable.length) return false
  return gradeable.every(it => isItemComplete(it, scores))
}

export function isItemTouched(item, scores) {
  const s = scores?.[item.id]
  if (!s) return false
  if (item.modality === 'check')   return (s.states || []).some(x => x === 'active' || x === 'rejected')
  if (item.modality === 'level')   return (s.groupStates || []).some(x => (x ?? 0) > 0)
  if (item.modality === 'columns') return s.colIdx >= 0 || s.ptBoxChosen === true
  return false
}

export function isGrilleEmpty(scores, gradeData) {
  const gradeable = (gradeData || []).flatMap(c => c.items).filter(isItemGradeable)
  return !gradeable.some(it => {
    const s = scores?.[it.id]
    if (!s) return false
    if (it.modality === 'check')   return (s.states || []).some(x => x === 'active' || x === 'rejected')
    if (it.modality === 'level')   return (s.groupStates || []).some(x => (x ?? 0) > 0)
    // Colonne : tant que les points ne sont pas saisis (ptBoxChosen), on
    // considère la case comme vide → on garde le trait au lieu d'afficher « 0 ».
    if (it.modality === 'columns') return s.ptBoxChosen === true
    return false
  })
}

export function isEleveDone(eleve, gradeData) {
  if (!eleve) return false
  if ((eleve.evalState || 'total') !== 'total') return true
  return isGrilleComplete(eleve.scores || {}, gradeData)
}

export function evalStateOf(eleve) {
  const k = eleve?.evalState || 'total'
  return EVAL_STATES.find(s => s.key === k) || EVAL_STATES[0]
}

export function cycleEvalState(eleve) {
  if (!eleve) return EVAL_STATES[0]
  const i = EVAL_STATES.findIndex(s => s.key === (eleve.evalState || 'total'))
  const next = EVAL_STATES[(i + 1) % EVAL_STATES.length]
  eleve.evalState = next.key
  return next
}

// ── Sécurité ──────────────────────────────────────────────────
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]))
}

// ── Élèves ────────────────────────────────────────────────────
export function properCase(s) {
  return (s || '').toLowerCase().replace(/(^|[\s\-'])([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase())
}

export function parseEleveLine(line) {
  const space = line.indexOf(' ')
  if (space === -1) {
    const nom = line.toUpperCase()
    return { nom, prenom: '', display: nom, evalState: 'total', scores: {}, conseils: '' }
  }
  const nom = line.slice(0, space).toUpperCase()
  const prenom = properCase(line.slice(space + 1).trim())
  return { nom, prenom, display: `${nom} ${prenom}`, evalState: 'total', scores: {}, conseils: '' }
}

export function parseEleves(raw) {
  return (raw || '').split('\n').map(s => s.trim()).filter(Boolean).map(parseEleveLine)
}

export function eleveDisplay(eleve) {
  if (!eleve) return ''
  return `<strong>${escapeHtml((eleve.nom || '').toUpperCase())}</strong>${eleve.prenom ? ' ' + escapeHtml(properCase(eleve.prenom)) : ''}`
}

// ── Store principal ────────────────────────────────────────────
const K = { grilles: 'rubriques:grilles', evals: 'rubriques:evaluations' }

function safeParse(raw) { try { return JSON.parse(raw) } catch { return null } }

// Lit une clé persistée, en tolérant l'ancien format (tableau brut) et le
// nouveau format versionné { version, data }. Retourne le tableau ou null.
function readStored(key) {
  const parsed = safeParse(localStorage.getItem(key))
  if (Array.isArray(parsed)) return parsed          // ancien format
  if (parsed && Array.isArray(parsed.data)) return parsed.data
  return null
}

function writeStored(key, data) {
  localStorage.setItem(key, JSON.stringify({ version: SCHEMA_VERSION, data }))
}

export const useStore = defineStore('main', () => {
  const grilles     = ref([])
  const evaluations = ref([])

  // ── Init ──
  function init() {
    const rawG = readStored(K.grilles)
    if (Array.isArray(rawG) && rawG.length) {
      grilles.value = rawG.map(g => ({ ...g, gradeData: normalizeGrille(g.gradeData) }))
    } else {
      grilles.value = [{
        id: mkGrilleId(), name: 'Modèle DG',
        gradeData: normalizeGrille(GRILLE_DATA_DG), createdAt: Date.now(),
      }]
      saveGrilles()
    }
    const rawE = readStored(K.evals)
    if (Array.isArray(rawE)) {
      evaluations.value = rawE.map(ev => ({
        ...ev,
        gradeData: normalizeGrille(ev.gradeData),
        elevesList: (ev.elevesList || []).map(e => ({ evalState: 'total', scores: {}, conseils: '', ...e })),
      }))
    }
  }

  function saveGrilles() {
    writeStored(K.grilles, grilles.value)
  }
  function saveEvals() {
    writeStored(K.evals, evaluations.value)
  }

  // ── Grilles CRUD ──
  function getGrille(id) { return grilles.value.find(g => g.id === id) || null }

  function createGrille({ name = '', gradeData = [] } = {}) {
    const g = { id: mkGrilleId(), name: name.trim() || 'Nouvelle grille', gradeData: normalizeGrille(gradeData), createdAt: Date.now() }
    grilles.value.unshift(g)
    saveGrilles()
    return g
  }

  function duplicateGrille(id) {
    const src = getGrille(id)
    if (!src) return null
    const copy = { ...clone(src), id: mkGrilleId(), name: src.name + ' (copie)', createdAt: Date.now() }
    copy.gradeData = normalizeGrille(copy.gradeData)
    grilles.value.unshift(copy)
    saveGrilles()
    return copy
  }

  function deleteGrille(id) {
    grilles.value = grilles.value.filter(g => g.id !== id)
    saveGrilles()
  }

  function renameGrille(id, name) {
    const g = getGrille(id)
    if (!g) return
    g.name = name.trim() || g.name
    saveGrilles()
  }

  function importGrille(data) {
    // Accepte un objet { name, gradeData } ou un tableau direct
    const gradeData = Array.isArray(data) ? data : data?.gradeData
    if (!isValidGradeData(gradeData)) return null
    return createGrille({ name: data.name || 'Grille importée', gradeData })
  }

  function saveGrilleData(id) {
    // Appelé après mutations directes sur gradeData
    saveGrilles()
  }

  // ── Évaluations CRUD ──
  function getEval(id) { return evaluations.value.find(e => e.id === id) || null }

  function createEval({ name = '', grilleId = null, gradeData = null, elevesText = '' } = {}) {
    const src = gradeData ?? (grilleId ? getGrille(grilleId)?.gradeData : []) ?? []
    const ev = {
      id: mkEvalId(),
      name: name.trim() || 'Nouvelle évaluation',
      gradeData: normalizeGrille(src),
      elevesList: parseEleves(elevesText),
      pillMode: 'compact',
      selectedEleveIdx: null,
      createdAt: Date.now(),
    }
    if (ev.elevesList.length) ev.selectedEleveIdx = 0
    evaluations.value.unshift(ev)
    saveEvals()
    return ev
  }

  function deleteEval(id) {
    evaluations.value = evaluations.value.filter(e => e.id !== id)
    saveEvals()
  }

  function renameEval(id, name) {
    const ev = getEval(id)
    if (!ev) return
    ev.name = name.trim() || ev.name
    saveEvals()
  }

  function importEval(data) {
    if (!isValidGradeData(data?.gradeData)) return null
    const ev = {
      id: mkEvalId(),
      name: (data.name || 'Évaluation importée').trim(),
      gradeData: normalizeGrille(data.gradeData),
      elevesList: (data.elevesList || []).map(e => ({ evalState: 'total', scores: {}, conseils: '', ...e })),
      pillMode: data.pillMode || 'compact',
      selectedEleveIdx: null,
      createdAt: Date.now(),
    }
    if (ev.elevesList.length) ev.selectedEleveIdx = 0
    evaluations.value.unshift(ev)
    saveEvals()
    return ev
  }

  function saveEvalData(id) {
    saveEvals()
  }

  // ── Élèves ──
  function addEleves(evalId, text) {
    const ev = getEval(evalId)
    if (!ev) return
    const parsed = parseEleves(text)
    ev.elevesList.push(...parsed)
    if (ev.selectedEleveIdx === null && ev.elevesList.length) ev.selectedEleveIdx = 0
    saveEvals()
  }

  function removeEleve(evalId, idx) {
    const ev = getEval(evalId)
    if (!ev) return
    ev.elevesList.splice(idx, 1)
    if (ev.selectedEleveIdx !== null) {
      if (!ev.elevesList.length) ev.selectedEleveIdx = null
      else ev.selectedEleveIdx = Math.min(ev.selectedEleveIdx, ev.elevesList.length - 1)
    }
    saveEvals()
  }

  function renameEleve(evalId, idx, line) {
    const ev = getEval(evalId)
    if (!ev || !ev.elevesList[idx]) return
    const parsed = parseEleveLine(line)
    Object.assign(ev.elevesList[idx], { nom: parsed.nom, prenom: parsed.prenom, display: parsed.display })
    saveEvals()
  }

  function saveScore(evalId, eleveIdx, itemId, scoreData) {
    const ev = getEval(evalId)
    if (!ev || !ev.elevesList[eleveIdx]) return
    const eleve = ev.elevesList[eleveIdx]
    if (!eleve.scores) eleve.scores = {}
    eleve.scores[itemId] = scoreData
    saveEvals()
  }

  function saveConseils(evalId, eleveIdx, text) {
    const ev = getEval(evalId)
    if (!ev || !ev.elevesList[eleveIdx]) return
    ev.elevesList[eleveIdx].conseils = text
    saveEvals()
  }

  function cycleState(evalId, eleveIdx) {
    const ev = getEval(evalId)
    if (!ev || !ev.elevesList[eleveIdx]) return null
    const next = cycleEvalState(ev.elevesList[eleveIdx])
    saveEvals()
    return next
  }

  function setPillMode(evalId, mode) {
    const ev = getEval(evalId)
    if (!ev) return
    ev.pillMode = mode
    saveEvals()
  }

  function setSelectedEleve(evalId, idx) {
    const ev = getEval(evalId)
    if (!ev) return
    ev.selectedEleveIdx = idx
    saveEvals()
  }

  // ── Computed helpers ──
  const grilleCount = computed(() => grilles.value.length)
  const evalCount   = computed(() => evaluations.value.length)

  return {
    grilles, evaluations,
    grilleCount, evalCount,
    init,
    // Grilles
    getGrille, createGrille, duplicateGrille, deleteGrille, renameGrille, importGrille, saveGrilleData,
    // Évaluations
    getEval, createEval, deleteEval, renameEval, importEval, saveEvalData,
    // Élèves
    addEleves, removeEleve, renameEleve, saveScore, saveConseils, cycleState, setPillMode, setSelectedEleve,
  }
})
