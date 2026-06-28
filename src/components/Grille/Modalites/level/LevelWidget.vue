<template>
  <!-- Reproduction fidèle du widget « level » de grille-v2 (mode détaillé) :
       une pill par groupe, listant tous les niveaux ; un clic sur la pill
       fait cycler l'état 0 → 1 → … → N → 0. -->
  <div class="widget-scroll widget-pad" :class="{ 'mode-etendu': mode === 'etendu' }">
    <div class="level-wrap">
      <div v-for="(grp, gi) in groups" :key="gi" class="level-pill-widget">
        <div
          class="level-pill-btn level-pill-detail"
          :style="pillStyle(grp, gi)"
          @click="cycle(gi)"
        >
          <div class="level-detail-title" :style="{ color: titleColor(grp, gi) }">{{ grp.title }}</div>
          <div v-for="(lvl, li) in grp.levels" :key="li" class="level-legend-row">
            <span class="level-dot" :style="{ background: tint(lvl.color, 500), opacity: dotOpacity(gi, li) }"></span>
            <span class="level-label" :style="{ color: labelColor(gi, li) }">
              <span class="label-visible" :style="{ fontWeight: isSelected(gi, li) ? 700 : 400 }">{{ lvl.label }}</span>
              <span class="ghost-bold" aria-hidden="true">{{ lvl.label }}</span>
            </span>
            <span class="level-pts" :style="{ color: ptsColor(gi) }">
              <span class="pts-visible" :style="{ fontWeight: isSelected(gi, li) ? 700 : 400 }">{{ lvl.pts }}</span>
              <span class="ghost-bold" aria-hidden="true">{{ lvl.pts }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tint } from '../../../../utils/palette.js'

const props = defineProps({
  item: { type: Object, required: true },
  scores: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'compact' },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const groups = computed(() => props.item.config?.groups || [])

const groupStates = computed(() => {
  const s = props.scores?.[props.item.id]
  return s?.groupStates || Array(groups.value.length).fill(0)
})

function stateOf(gi) { return groupStates.value[gi] ?? 0 }
function isSelected(gi, li) { return stateOf(gi) === li + 1 }

function cycle(gi) {
  if (props.readonly) return
  const levels = groups.value[gi]?.levels || []
  const next = (stateOf(gi) + 1) % (levels.length + 1)
  const newStates = [...groupStates.value]
  newStates[gi] = next
  emit('update', { type: 'level', groupStates: newStates })
}

// ── Styles reproduisant la fonction update() de grille-v2 ──
function pillStyle(grp, gi) {
  const st = stateOf(gi)
  if (st === 0) return { background: '#f3f4f6', borderColor: '#d1d5db' }
  const lvl = grp.levels[st - 1]
  return { background: tint(lvl?.color, 100), borderColor: tint(lvl?.color, 500) }
}
function titleColor(grp, gi) {
  const st = stateOf(gi)
  if (st === 0) return '#6b7280'
  return tint(grp.levels[st - 1]?.color, 700)
}
function labelColor(gi, li) {
  const st = stateOf(gi)
  if (st === 0) return '#6b7280'
  return isSelected(gi, li) ? '#374151' : '#9ca3af'
}
function ptsColor(gi) {
  return stateOf(gi) === 0 ? '' : '#111827'
}
function dotOpacity(gi, li) {
  return stateOf(gi) === 0 ? 1 : (isSelected(gi, li) ? 1 : 0.5)
}
</script>

<style>
.widget-scroll { overflow-x: auto; }
.widget-pad    { padding: 10px; }

/* Mode étendu : chaque pill prend la largeur de son contenu (pas de compression). */
.mode-etendu .level-wrap { max-width: none; }
.mode-etendu .level-pill-widget { flex-shrink: 0; }

/* ── Widget level (pills à étages) ── */
.level-wrap {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 10px;
  align-items: stretch;
  max-width: 100%;
  min-width: 0;
}
.level-pill-widget { flex-shrink: 1; min-width: 0; }

.level-pill-btn {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.level-pill-detail {
  display: block;
  width: 100%;
  padding: 8px 12px;
}
.level-detail-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.level-legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  line-height: 1.6;
  white-space: nowrap;
}
.level-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}
.level-label { color: #6b7280; flex: 1; font-weight: 400; min-width: 0; position: relative; }
.level-pts   { color: #374151; font-weight: 400; white-space: nowrap; flex-shrink: 0; position: relative; }
.label-visible, .pts-visible { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ghost-bold {
  display: block;
  font-weight: 700;
  visibility: hidden;
  height: 0;
  overflow: hidden;
}

/* Aperçu passif (édition) : on neutralise les clics. */
.is-readonly .level-pill-btn { cursor: default; }
</style>
