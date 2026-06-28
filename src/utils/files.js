export function readJsonFile(onData) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result)
        onData(data)
      } catch {
        alert('Fichier JSON invalide')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

export function safeName(s, fallback = '') {
  return (s || fallback).replace(/[^a-z0-9_\-\s]/gi, '').trim().replace(/\s+/g, '_') || fallback
}
