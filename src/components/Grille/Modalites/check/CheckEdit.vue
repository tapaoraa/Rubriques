<template>
  <div class="check-edit">
    <div class="check-edit-head">
      <span class="check-head-label">Libellé</span>
      <span class="check-head-pts">Pts</span>
      <span class="check-head-tools" />
    </div>
    <div
      v-for="(pill, i) in localPills"
      :key="i"
      class="check-edit-row"
    >
      <input class="check-label" v-model="pill.label" placeholder="Libellé" @input="emit" />
      <input class="check-num" type="number" v-model.number="pill.pts" min="0" placeholder="0" @input="emit" />
      <div class="check-row-tools">
        <div class="check-row-arrows">
          <AppArrowBtn dir="down" :size="30" :disabled="i === localPills.length - 1" @click="movePill(i, 1)" />
          <AppArrowBtn dir="up" :size="30" :disabled="i === 0" @click="movePill(i, -1)" />
        </div>
        <AppToolBtn variant="del" :size="30" title="Supprimer" @click="removePill(i)"><AppIcon name="trash" :size="15" /></AppToolBtn>
      </div>
    </div>
    <button class="check-add-pill" @click="addPill">Ajouter une pastille</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppIcon from '../../../AppIcon.vue'
import AppArrowBtn from '../../../AppArrowBtn.vue'
import AppToolBtn from '../../../AppToolBtn.vue'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emits = defineEmits(['update'])

const localPills = ref(JSON.parse(JSON.stringify(props.config?.pills || [])))

watch(() => props.config, c => {
  localPills.value = JSON.parse(JSON.stringify(c?.pills || []))
}, { deep: true })

function emit() {
  emits('update', { ...props.config, pills: JSON.parse(JSON.stringify(localPills.value)) })
}

function addPill() {
  localPills.value.push({ label: '', pts: 1 })
  emit()
}
function removePill(i) {
  localPills.value.splice(i, 1)
  emit()
}
function movePill(i, dir) {
  const j = i + dir
  if (j < 0 || j >= localPills.value.length) return
  const tmp = localPills.value[i]
  localPills.value[i] = localPills.value[j]
  localPills.value[j] = tmp
  emit()
}
</script>

<style>
.check-edit { display: flex; flex-direction: column; gap: 5px; padding: 10px; height: 100%;}

/* En-tête */
.check-edit-head { display: flex; align-items: center; gap: 8px; padding: 0 2px 2px; }
.check-head-label { flex: 1; padding-left: 5px; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .03em; }
.check-head-pts { width: 36px; text-align: center; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .03em; }
.check-head-tools { width: 96px; flex: none; }

/* Lignes */
.check-edit-row { display: flex; align-items: center; gap: 8px; }

/* Libellé : même hauteur (36px) et même taille de texte que l'input chiffre. */
.check-label {
  flex: 1;
  min-width: 0;
  height: 36px;
  font-size: 13px;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  outline: none;
}
.check-label:focus { border-color: #94a3b8; }

/* Input chiffre identique à celui de LevelEdit (.lvl-edit-pts), 36×36. */
.check-num {
  width: 36px;
  height: 36px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 0;
  outline: none;
  -moz-appearance: textfield;
}
.check-num:focus { border-color: #94a3b8; }
.check-num::-webkit-outer-spin-button,
.check-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

/* Bloc outils */
.check-row-tools { display: flex; align-items: center; gap: 6px; flex: none; }
.check-row-arrows { display: flex; gap: 2px; }

/* Identique au bouton « + Groupe » de LevelEdit. */
.check-add-pill {
  align-self: stretch;
  text-align: center;
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px dashed #cbd5e1;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.12s, color 0.12s;
}
.check-add-pill:hover { background: #f8fafc; color: #374151; }
</style>
