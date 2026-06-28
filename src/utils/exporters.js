import { studentTotal, itemMax, gradeMax, computeItemScore, SCHEMA_VERSION, EVAL_STATES } from '../stores/store.js'

export function exportEvalJson(ev) {
  const data = JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...ev }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (ev.name || 'evaluation').replace(/[^a-z0-9_\-]/gi, '_') + '.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportEvalXlsx(ev) {
  const XLSX = window.XLSX
  if (!XLSX) { alert('XLSX non disponible'); return }

  const wb = XLSX.utils.book_new()
  const maxPts = gradeMax(ev.gradeData)
  const cats = ev.gradeData || []

  // Sous-total d'une catégorie pour un élève / son barème.
  const catMax = cat => (cat.items || []).reduce((s, it) => s + itemMax(it), 0)
  const catScore = (cat, eleve) =>
    (cat.items || []).reduce((s, it) => s + computeItemScore(it, eleve.scores || {}), 0)

  // Ligne 1 : libellés Élève / Total / nom des catégories.
  const headers = ['Élève', 'Total', ...cats.map(cat => cat.name || '')]

  // Ligne 2 : barèmes — vide / total max / sous-totaux max des catégories.
  const maxRow = ['', `/ ${maxPts}`, ...cats.map(cat => `/ ${catMax(cat)}`)]

  const rows = [headers, maxRow]
  ;(ev.elevesList || []).forEach(eleve => {
    const state = eleve.evalState || 'total'
    const row = [
      `${eleve.nom || ''} ${eleve.prenom || ''}`.trim(),
      state === 'total'
        ? studentTotal(eleve, ev.gradeData)
        : (EVAL_STATES.find(s => s.key === state)?.short || state),
    ]
    cats.forEach(cat => {
      row.push(state === 'total' ? catScore(cat, eleve) : '—')
    })
    rows.push(row)
  })

  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Ligne 1 (libellés) en gras.
  for (let c = 0; c < headers.length; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c })
    const cell = ws[ref]
    if (cell) {
      cell.s = { ...(cell.s || {}), font: { ...((cell.s && cell.s.font) || {}), bold: true } }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Résultats')
  XLSX.writeFile(wb, (ev.name || 'evaluation').replace(/[^a-z0-9_\-]/gi, '_') + '.xlsx')
}
