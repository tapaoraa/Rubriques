<template>
  <div class="banner-wrap">
    <div class="edit-banner">
      <div class="edit-banner-info">
        <textarea
          ref="nameInput"
          class="edit-banner-input"
          :value="grille.name"
          rows="1"
          @input="onInput"
          @blur="saveName"
          @keydown.enter.prevent="saveName"
          @keydown.esc="$event.target.blur()"
        />
        <span class="edit-banner-meta">
          {{ catCount }} catégories · {{ itemCount }} items · {{ maxPts }} pts
        </span>
      </div>

      <button class="edit-banner-print" title="Imprimer" @click="$emit('print')">
        <AppIcon name="printer" :size="22" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppIcon from '../AppIcon.vue'
import { gradeMax } from '../../stores/store.js'

const props = defineProps({
  grille: { type: Object, required: true },
  isEval: { type: Boolean, default: false },
})
const emit = defineEmits(['print', 'rename'])

const nameInput = ref(null)

const catCount = computed(() => props.grille.gradeData?.length || 0)
const itemCount = computed(() => (props.grille.gradeData || []).flatMap(c => c.items || []).length)
const maxPts = computed(() => gradeMax(props.grille.gradeData))

function onInput(e) {
  e.target.style.height = 'auto'
  e.target.style.height = e.target.scrollHeight + 'px'
}
function saveName(e) {
  const val = (e.target?.value || '').trim()
  if (val) emit('rename', val)
}
</script>

<style>
/* Bandeau d'édition — même carte que le bandeau élève (cf. EleveBanner),
   classes préfixées edit-banner-* pour éviter toute interférence. */
.edit-banner {
  flex: none;
  display: flex; align-items: stretch;
  width: 100%; min-height: 50px;
  margin: 10px 0;
  background: #ffffff;
  border: 1px solid #e2e8f0; border-radius: 10px ;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.05);
  z-index: 20;
}

.edit-banner-info {
  flex: 1; min-width: 0;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
  padding: 8px 16px;
}
.edit-banner-input {
  flex: 1 1 400px; min-width: 0;
  resize: none; overflow: hidden;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 6px 10px;
  font-size: 17px; font-weight: 700; color: #0f172a; font-family: inherit;
  line-height: 1.3; outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.edit-banner-input:hover { border-color: #94a3b8; }
.edit-banner-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px #eef2ff; background: #fff; }
.edit-banner-meta {
  flex: none;
  font-size: 14px; font-weight: 600; color: #475569;
  white-space: nowrap;
}

.edit-banner-print {
  width: 52px; flex: none;
  border: none; border-left: 1px solid #cbd5e1;
  background: #ffffff; color: #94a3b8;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .12s, color .12s;
}
.edit-banner-print:hover { background: #f8fafc; color: #475569; }
</style>
