<template>
  <TableConstructor :gradeData="gradeData" :mode="mode">
    <!-- Bandeau de catégorie (mode évaluation) -->
    <template #cat-header="{ cat }">
      <span class="categorie-nom">{{ cat.name }}</span>
      <span class="categorie-points">
        <strong class="categorie-score">{{ catTouched(cat) ? catScore(cat) : '—' }}</strong>
        <span class="categorie-max"> / {{ catMax(cat) }} pts</span>
      </span>
    </template>

    <!-- Cellule item -->
    <template #item-cell="{ item }">
      <ItemEval :item="item" :scores="scores" />
    </template>

    <!-- Cellule notation : widget actif ou message « non configuré » -->
    <template #notation-cell="{ item }">
      <component
        v-if="isItemGradeable(item)"
        :is="widgetFor(item)"
        :item="item" :scores="scores" :mode="mode" :readonly="readonly"
        @update="d => emit('score', { itemId: item.id, scoreData: d })"
      />
      <p v-else class="notation-empty">Modalité non configurée.</p>
    </template>
  </TableConstructor>
</template>

<script setup>
import { itemMax, catScore as catScoreFn, isItemTouched, isItemGradeable } from '../../stores/store.js'
import TableConstructor from './TableConstructor.vue'
import ItemEval from './Items/ItemEval.vue'
import CheckWidget from './Modalites/check/CheckWidget.vue'
import LevelWidget from './Modalites/level/LevelWidget.vue'
import ColumnsWidget from './Modalites/columns/ColumnsWidget.vue'

const props = defineProps({
  gradeData: { type: Array, default: () => [] },
  scores: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'compact' },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['score'])

const WIDGETS = { check: CheckWidget, level: LevelWidget, columns: ColumnsWidget }
function widgetFor(item) { return WIDGETS[item.modality] || null }

function catScore(cat) { return catScoreFn(cat, props.scores) }
function catMax(cat) { return (cat.items || []).reduce((s, it) => s + itemMax(it), 0) }
function catTouched(cat) { return (cat.items || []).some(it => isItemTouched(it, props.scores)) }
</script>

<style>
/* Bandeau de catégorie — contenu (mode évaluation). La coquille colorée
   est fournie par TableConstructor (.categorie-header). */
.categorie-nom { flex: 1; min-width: 0; }
.categorie-points { font-size: 12px; }
.categorie-score { font-size: 15px; font-weight: 700; }
.categorie-max { opacity: 0.75; }
</style>
