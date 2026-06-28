<template>
  <div class="col-widget" :class="{ 'is-readonly': readonly, 'is-preview': readonly }">
    <div
      v-for="(lv, li) in levels"
      :key="li"
      class="col-col"
      :class="{ active: colIdx === li }"
      :style="{ background: colIdx === li ? tint(lv.color, 200) : tint(lv.color, 50) }"
      @click="!readonly && selectCol(li)"
    >
      <div
        class="col-label"
        :class="{ 'col-label-active': colIdx === li, 'col-label-dimmed': colIdx !== li && activeColIdx >= 0 }"
        v-html="labelHtml(lv.label)"
      />
      <div class="col-pts" :class="{ 'col-pts-visible': readonly || colIdx === li }">
        <span
          v-for="v in ptBoxValues(li)"
          :key="v"
          class="col-pt-box"
          :class="{ chosen: colIdx === li && ptBoxChosen && scoreVal === v }"
          :style="ptBoxStyle(li, v)"
          @click.stop="!readonly && chooseScore(li, v)"
        >{{ v }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tint, shade } from '../../../../utils/palette.js'
import { escapeHtml } from '../../../../stores/store.js'

function labelHtml(label) {
  return escapeHtml(label || '').replace(/\n/g, '<br>')
}

const props = defineProps({
  item:     { type: Object, required: true },
  scores:   { type: Object, default: () => ({}) },
  mode:     { type: String, default: 'compact' },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const levels  = computed(() => props.item.config?.levels || [])
const step    = computed(() => props.item.config?.step ?? 1)

const scoreData    = computed(() => props.scores?.[props.item.id] || {})
const colIdx       = computed(() => scoreData.value.colIdx ?? -1)
const activeColIdx = colIdx
const scoreVal     = computed(() => scoreData.value.score ?? 0)
const ptBoxChosen  = computed(() => scoreData.value.ptBoxChosen === true)

function ptBoxValues(li) {
  const pas = step.value
  const prevMax = li === 0 ? -pas : levels.value[li - 1].max
  const start = Math.round((prevMax + pas) * 100) / 100
  const max = levels.value[li].max
  const vals = []
  for (let v = start; v <= max; v = Math.round((v + pas) * 100) / 100) vals.push(v)
  return vals
}

function ptBoxStyle(li, v) {
  const key = levels.value[li]?.color
  const chosen = colIdx.value === li && ptBoxChosen.value && scoreVal.value === v
  const s = shade(key, 'column', chosen ? 'chosen' : 'idle')
  return { background: s.bg, borderColor: s.border, color: s.text }
}

function selectCol(li) {
  const newIdx = colIdx.value === li ? -1 : li
  emit('update', { type: 'columns', colIdx: newIdx, score: 0, ptBoxChosen: false })
}

function chooseScore(li, v) {
  emit('update', { type: 'columns', colIdx: li, score: v, ptBoxChosen: true })
}
</script>

<style>
.col-widget {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 96px;
  align-items: stretch;
}

.col-col {
  flex: 1;
  border-right: 1px solid #e2e8f0;
  padding: 8px 6px;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.col-col:last-child { border-right: none; }
.col-col.active { justify-content: flex-end; }

/* En preview (preedit) : label en haut, pts toujours visibles */
.is-preview .col-col { justify-content: flex-start; pointer-events: none; }
.is-preview .col-label { flex: 1; display: flex; align-items: center; justify-content: center; }

.col-label {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  color: #4f535c;
  line-height: 1.35;
  transition: color 0.25s ease, opacity 0.25s ease;
}
.col-label-active { color: #374151; font-weight: 500; }
.col-label-dimmed { opacity: 0.45; }

.col-pts {
  display: none;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
.col-pts.col-pts-visible { display: flex; }

.col-pt-box {
  font-size: 14px;
  font-weight: 500;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  color: #6b7280;
  transition: background 0.1s, color 0.1s;
  flex-shrink: 0;
}
.col-pt-box.chosen { background: #1e3a5f; color: #fff; border-color: #1e3a5f; }
</style>
