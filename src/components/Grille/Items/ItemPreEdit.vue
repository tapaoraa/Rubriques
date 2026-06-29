<template>
  <div class="edit-item-cell edit-preedit-cell">
    <div class="edit-preedit-head">
      <p class="edit-preedit-nom">{{ item.name || '(sans nom)' }}</p>
      <p class="edit-preedit-pts">{{ max }} pts</p>
    </div>
    <button class="btn-item-edit" @click="emit('edit')">
      <AppIcon name="pencil" :size="16" /> <span>Éditer</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { itemMax as getItemMax } from '../../../stores/store.js'
import AppIcon from '../../AppIcon.vue'

const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['edit'])

const max = computed(() => getItemMax(props.item))
</script>

<style>
/* Coquille de cellule item, commune à ItemEdit (mode passif : aperçu). */
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

/* Aperçu (item non en cours d'édition) : centré. */
.edit-preedit-cell { align-items: center; text-align: center; }
.edit-preedit-head { flex: 1; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.edit-preedit-nom { margin: 0; font-weight: 700; text-transform: uppercase; font-size: 14px; color: #1f2937; line-height: 1.25; text-align: center; }
.edit-preedit-pts { margin: 0; font-size: 13px; font-weight: 700; color: #475569; }
</style>
