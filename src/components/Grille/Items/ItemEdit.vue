<template>
  <div class="edit-item-cell">
    <input
      class="edit-item-name"
      :value="item.name"
      placeholder="Nom de l'item"
      @input="item.name = $event.target.value; emit('update')"
    />
    <select class="input edit-modality-select" :value="item.modality || ''" @change="onModalityChange">
      <option value="">Modalité…</option>
      <option v-for="(mod, key) in MODALITIES" :key="key" :value="key">{{ mod.label }}</option>
    </select>
    <div class="edit-item-total">
      <span class="form-inline-label">Total :</span>
      <span class="edit-pts-auto">{{ max }} pts</span>
    </div>
    <div class="edit-item-footer">
      <div class="edit-item-tools">
        <div class="move-btns">
          <AppArrowBtn dir="down" :size="32" :disabled="isLast" @click="emit('move', 1)" />
          <AppArrowBtn dir="up" :size="32" :disabled="isFirst" @click="emit('move', -1)" />
        </div>
        <AppToolBtn variant="del" :size="34" title="Supprimer" @click="emit('delete')"><AppIcon name="trash" :size="14" /></AppToolBtn>
      </div>
      <button class="btn-item-edit is-done" @click="emit('done')">
        <AppIcon name="check" :size="16" /> <span>Terminer</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MODALITIES, itemMax as getItemMax } from '../../../stores/store.js'
import AppIcon from '../../AppIcon.vue'
import AppArrowBtn from '../../AppArrowBtn.vue'
import AppToolBtn from '../../AppToolBtn.vue'

const props = defineProps({
  item: { type: Object, required: true },
  isFirst: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false },
})
const emit = defineEmits(['done', 'move', 'delete', 'update'])

const max = computed(() => getItemMax(props.item))

function configHasContent() {
  const c = props.item.config || {}
  if (props.item.modality === 'check')   return (c.pills || []).length > 0
  if (props.item.modality === 'level')   return (c.groups || []).length > 0
  if (props.item.modality === 'columns') return (c.levels || []).length > 0
  return false
}

function onModalityChange(e) {
  const key = e.target.value || null
  if (key === props.item.modality) return
  if (configHasContent() && !confirm('Changer de modalité effacera la configuration actuelle de cet item. Continuer ?')) {
    e.target.value = props.item.modality || ''
    return
  }
  props.item.modality = key
  if (key === 'check') props.item.config = { pills: [] }
  else if (key === 'level') props.item.config = { groups: [] }
  else if (key === 'columns') props.item.config = { levels: [], step: 1 }
  else props.item.config = {}
  emit('update')
}
</script>

<style>
/* Coquille de cellule item (commune à ItemPreEdit) + bouton bascule. */
.edit-item-cell { display: flex; flex-direction: column; gap: 8px; height: 100%; padding: 10px; text-align: left; }
.btn-item-edit {
  align-self: center;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 18px; border-radius: 10px;
  border: 1px solid #4f46e5; background: #ffffff;
  color: #4f46e5; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}
.btn-item-edit svg { flex: none; }
.btn-item-edit:hover { background: #eef2ff; }
.btn-item-edit.is-done { border-color: #16a34a; color: #16a34a; }
.btn-item-edit.is-done:hover { background: #f0fdf4; }

.form-inline-label { font-size: 13px; color: #94a3b8; }
.move-btns { display: flex; gap: 4px; flex: none; }

.edit-item-name {
  width: 100%;
  background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 8px;
  font: inherit; font-weight: 700; text-transform: uppercase;
  font-size: 13px; line-height: 1.25; color: #1f2937;
  border-radius: 8px; outline: none;
}
.edit-item-name::placeholder { color: #94a3b8; text-transform: none; font-weight: 600; }
.edit-item-name:hover { border-color: #4f46e5; }
.edit-item-name:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px #eef2ff; }

.edit-modality-select { font-size: 13px; padding: 8px 10px; }

.edit-item-total { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 35px; }
.edit-pts-auto { font-weight: 700; color: #0f172a; }

.edit-item-footer { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
.edit-item-tools { display: flex; gap: 6px; justify-content: space-between; }
</style>
