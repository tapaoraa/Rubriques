<template>
  <div class="eval-item-cell">
    <p class="eval-item-nom">{{ item.name }}</p>
    <p class="eval-item-score">
      <template v-if="touched"><strong>{{ score }}</strong> <span class="eval-score-max">/ {{ max }} pts</span></template>
      <span v-else class="eval-score-empty">/ {{ max }} pts</span>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { computeItemScore, itemMax as getItemMax, isItemTouched } from '../../../stores/store.js'

const props = defineProps({
  item: { type: Object, required: true },
  scores: { type: Object, default: () => ({}) },
})

const score = computed(() => computeItemScore(props.item, props.scores))
const max = computed(() => getItemMax(props.item))
const touched = computed(() => {
  // Pour une colonne : tant que les points ne sont pas saisis (ptBoxChosen),
  // on n'affiche pas le score (sinon on montrerait « 0 » à la simple sélection).
  if (props.item.modality === 'columns') return props.scores?.[props.item.id]?.ptBoxChosen === true
  return isItemTouched(props.item, props.scores)
})
</script>

<style>
.eval-item-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.eval-item-nom {
  font-weight: 700; text-transform: uppercase;
  font-size: 13px; color: #1f2937; line-height: 1.25;
}
.eval-item-score { margin: 0; font-size: 22px; font-weight: 600; color: #1f2937; }
.eval-score-empty { font-weight: 400; font-size: 0.72em; opacity: 0.35; }
.eval-score-max { font-weight: 400; font-size: 0.68em; opacity: 0.7; }
</style>
