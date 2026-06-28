<template>
  <div class="check-container" :class="{ 'mode-etendu': mode === 'etendu', 'is-readonly': readonly }">
    <div class="check-pills">
      <span
        v-for="(pill, i) in pills"
        :key="i"
        class="check-pill"
        :class="{ active: states[i] === 'active', rejected: states[i] === 'rejected' }"
        @click="!readonly && cycleState(i)"
        @contextmenu.prevent="!readonly && setRejected(i)"
      >
        {{ pill.label }}<span v-if="pill.pts" class="check-pill-pts">&nbsp;{{ pill.pts }}pt</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  scores: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'compact' },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const pills = computed(() => props.item.config?.pills || [])

const states = computed(() => {
  const s = props.scores?.[props.item.id]
  return s?.states || Array(pills.value.length).fill('neutral')
})

function cycleState(i) {
  const cur = states.value[i] || 'neutral'
  const next = cur === 'neutral' ? 'active' : cur === 'active' ? 'rejected' : 'neutral'
  const newStates = [...states.value]
  newStates[i] = next
  emit('update', { type: 'check', states: newStates })
}

function setRejected(i) {
  const cur = states.value[i] || 'neutral'
  const next = cur === 'rejected' ? 'neutral' : 'rejected'
  const newStates = [...states.value]
  newStates[i] = next
  emit('update', { type: 'check', states: newStates })
}
</script>

<style>
.check-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
}
/* En mode étendu, le container scrolle horizontalement sur toute la hauteur du td. */
.check-container.mode-etendu { overflow-x: auto; }
/* Aperçu passif (édition) : pills non interactives, mais le container reste scrollable. */
.check-container.is-readonly .check-pill { pointer-events: none; }

.check-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; width: 100%; }
.mode-etendu .check-pills { flex-wrap: nowrap; width: max-content; }

.check-pill {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-surface, #fff);
  color: var(--color-ink-muted, #64748b);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.check-pill.active {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border-color: rgba(22, 163, 74, 0.4);
}
.check-pill.rejected {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.4);
  text-decoration: line-through;
}
.check-pill-pts { font-size: 10px; opacity: 0.6; }
</style>
