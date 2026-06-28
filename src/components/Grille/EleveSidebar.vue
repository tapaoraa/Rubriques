<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click="$emit('close')" />
    <div class="sidebar" :class="{ 'sidebar-closed': !open }">
      <div class="sidebar-head">
        <span class="sidebar-head-title">Élèves</span>
        <button class="icon-btn icon-btn-dark" @click="$emit('close')">
          <AppIcon name="close" :size="20" />
        </button>
      </div>
      <ul class="sidebar-list">
        <li
          v-for="(eleve, i) in ev.elevesList"
          :key="i"
          class="sidebar-row"
          :class="{ selected: selectedIdx === i }"
          @click="select(i)"
        >
          <span class="sidebar-name" v-html="eleveDisplay(eleve)" />
          <div class="sidebar-right">
            <template v-if="(eleve.evalState || 'total') !== 'total'">
              <span class="sidebar-state" :style="{ color: stateColor(eleve), borderColor: stateColor(eleve) }">
                {{ stateShort(eleve) }}
              </span>
            </template>
            <template v-else>
              <span v-if="isEleveDone(eleve, ev.gradeData)" class="sidebar-check">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span class="sidebar-pts" :class="isEleveDone(eleve, ev.gradeData) ? '' : 'sidebar-pts-partial'">
                {{ isGrilleEmpty(eleve.scores || {}, ev.gradeData) ? '–' : studentTotal(eleve, ev.gradeData) + ' pts' }}
              </span>
            </template>
          </div>
        </li>
      </ul>
      <div class="sidebar-foot">
        <button class="btn btn-outline btn-block" @click="$emit('manageEleves')">
          <AppIcon name="users" :size="16" /> Gérer les élèves
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import AppIcon from '../AppIcon.vue'
import { eleveDisplay, studentTotal, EVAL_STATES, isEleveDone, isGrilleEmpty } from '../../stores/store.js'

defineProps({
  open: { type: Boolean, default: false },
  ev: { type: Object, required: true },
  selectedIdx: { type: Number, default: null },
})
const emit = defineEmits(['select', 'close', 'manageEleves'])

function stateColor(eleve) {
  const k = eleve?.evalState || 'total'
  return EVAL_STATES.find(s => s.key === k)?.color || ''
}
function stateShort(eleve) {
  const k = eleve?.evalState || 'total'
  return EVAL_STATES.find(s => s.key === k)?.short || ''
}

function select(i) {
  emit('select', i)
  emit('close')
}
</script>

<style>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 40; }

.sidebar {
  position: fixed; top: 0; left: 0; height: 100%; width: 18rem;
  z-index: 50; display: flex; flex-direction: column;
  background: #fff; box-shadow: 4px 0 24px rgba(0,0,0,0.18);
  transform: translateX(0); transition: transform 0.2s ease;
}
.sidebar-closed { transform: translateX(-100%); }

.sidebar-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: calc(1rem + env(safe-area-inset-top)) 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}
.sidebar-head-title { font-size: 1rem; font-weight: 700; color: #0f172a; }

.sidebar-list {
  flex: 1; overflow-y: auto; list-style: none; margin: 0;
  padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;
}

.sidebar-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.625rem 0.75rem; cursor: pointer; border-radius: 0.75rem;
  transition: background 0.15s;
}
.sidebar-row:hover { background: #f1f5f9; }
.sidebar-row.selected { background: #eef2ff; }
.sidebar-row.selected .sidebar-name { color: #4338ca; }

.sidebar-name { flex: 1; min-width: 0; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1e293b; }
.sidebar-name strong { font-weight: 700; }

.sidebar-right { display: flex; align-items: center; gap: 0.375rem; margin-left: 0.5rem; flex-shrink: 0; }
.sidebar-pts { font-size: 0.875rem; font-weight: 600; color: #16a34a; }
.sidebar-pts-partial { color: #94a3b8; }
.sidebar-dash { color: #cbd5e1; font-weight: 700; }
.sidebar-state { font-size: 0.75rem; font-weight: 700; padding: 0.125rem 0.375rem; border-radius: 9999px; border: 1px solid; }
.sidebar-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: #16a34a; color: #fff;
}

.sidebar-foot { padding: 0.75rem; border-top: 1px solid #f1f5f9; }
</style>
