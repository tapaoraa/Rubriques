import { describe, it, expect } from 'vitest'
import {
  itemMax, computeItemScore, isItemComplete, isItemGradeable,
  escapeHtml, isValidGradeData, properCase, parseEleveLine,
} from './store.js'

describe('itemMax', () => {
  it('check : somme des points des pills', () => {
    const item = { modality: 'check', config: { pills: [{ pts: 2 }, { pts: 3 }] } }
    expect(itemMax(item)).toBe(5)
  })
  it('level : somme du dernier niveau de chaque groupe', () => {
    const item = { modality: 'level', config: { groups: [
      { levels: [{ pts: 1 }, { pts: 4 }] },
      { levels: [{ pts: 2 }] },
    ] } }
    expect(itemMax(item)).toBe(6)
  })
  it('columns : max du dernier niveau', () => {
    const item = { modality: 'columns', config: { levels: [{ max: 5 }, { max: 10 }] } }
    expect(itemMax(item)).toBe(10)
  })
  it('item sans config gradable : pts ou 0', () => {
    expect(itemMax({ modality: 'check', config: {} })).toBe(0)
    expect(itemMax({ pts: 7 })).toBe(7)
  })
})

describe('computeItemScore', () => {
  it('check : additionne les pills actives uniquement', () => {
    const item = { id: 'a', modality: 'check', config: { pills: [{ pts: 2 }, { pts: 3 }] } }
    const scores = { a: { type: 'check', states: ['active', 'rejected'] } }
    expect(computeItemScore(item, scores)).toBe(2)
  })
  it('level : prend le niveau sélectionné par groupe', () => {
    const item = { id: 'b', modality: 'level', config: { groups: [
      { levels: [{ pts: 1 }, { pts: 4 }] },
    ] } }
    const scores = { b: { type: 'level', groupStates: [2] } }
    expect(computeItemScore(item, scores)).toBe(4)
  })
  it('columns : renvoie le score stocké', () => {
    const item = { id: 'c', modality: 'columns', config: { levels: [{ max: 10 }] } }
    expect(computeItemScore(item, { c: { type: 'columns', score: 7 } })).toBe(7)
  })
  it('aucun score : 0', () => {
    expect(computeItemScore({ id: 'x', modality: 'check', config: { pills: [] } }, {})).toBe(0)
  })
})

describe('isItemComplete', () => {
  it('check complet quand toutes les pills sont tranchées', () => {
    const item = { id: 'a', modality: 'check', config: { pills: [{}, {}] } }
    expect(isItemComplete(item, { a: { states: ['active', 'rejected'] } })).toBe(true)
    expect(isItemComplete(item, { a: { states: ['active'] } })).toBe(false)
  })
  it('columns complet quand une case de point est choisie', () => {
    const item = { id: 'c', modality: 'columns', config: { levels: [{}] } }
    expect(isItemComplete(item, { c: { ptBoxChosen: true } })).toBe(true)
    expect(isItemComplete(item, { c: {} })).toBe(false)
  })
})

describe('isItemGradeable', () => {
  it('vrai seulement si la config a du contenu', () => {
    expect(isItemGradeable({ modality: 'check', config: { pills: [{}] } })).toBe(true)
    expect(isItemGradeable({ modality: 'check', config: {} })).toBe(false)
    expect(isItemGradeable({ modality: 'autre' })).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('échappe les caractères HTML dangereux', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(escapeHtml(`a&"'b`)).toBe('a&amp;&quot;&#39;b')
  })
  it('gère null/undefined', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })
})

describe('isValidGradeData', () => {
  it('accepte un tableau de catégories bien formées', () => {
    expect(isValidGradeData([{ name: 'Cat', items: [{ modality: 'check' }] }])).toBe(true)
    expect(isValidGradeData([])).toBe(true)
  })
  it('rejette les non-tableaux et structures invalides', () => {
    expect(isValidGradeData(null)).toBe(false)
    expect(isValidGradeData({ items: [] })).toBe(false)
    expect(isValidGradeData([{ items: 'nope' }])).toBe(false)
    expect(isValidGradeData([{ items: [{ modality: 'bidon' }] }])).toBe(false)
  })
})

describe('properCase / parseEleveLine', () => {
  it('properCase met une majuscule par mot', () => {
    expect(properCase('jean-paul de la TOUR')).toBe('Jean-Paul De La Tour')
  })
  it('parseEleveLine sépare nom (maj) et prénom', () => {
    expect(parseEleveLine('dupont jean')).toMatchObject({ nom: 'DUPONT', prenom: 'Jean' })
    expect(parseEleveLine('madonna')).toMatchObject({ nom: 'MADONNA', prenom: '' })
  })
})
