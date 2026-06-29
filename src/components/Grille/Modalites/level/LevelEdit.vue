<template>
  <!-- Éditeur de la modalité « level » (groupes de critères × niveaux),
       repris de grille-v2 : titre de groupe, niveaux (couleur + libellé + pts),
       réordonnancement et suppression. -->
  <div class="lvl-edit">
    <p v-if="localGroups.length === 0" class="lvl-edit-empty">Ajoutez un groupe pour démarrer la configuration.</p>

    <div
      v-for="(grp, gi) in localGroups"
      :key="gi"
      class="lvl-edit-group"
    >
      <!-- Header du groupe : titre + flèches + suppression -->
      <div class="lvl-edit-group-hdr">
        <input
          class="lvl-edit-title"
          v-model="grp.title"
          placeholder="Titre du groupe"
          @input="emit"
        />
        <div class="lvl-edit-arrows">
          <AppArrowBtn dir="up"   :size="30" :disabled="gi === 0"                       @click="moveGroup(gi, -1)" />
          <AppArrowBtn dir="down" :size="30" :disabled="gi === localGroups.length - 1"  @click="moveGroup(gi,  1)" />
        </div>
        <AppToolBtn variant="del" :size="30" title="Supprimer le groupe" @click="removeGroup(gi)">
          <AppIcon name="trash" :size="15" />
        </AppToolBtn>
      </div>

      <!-- Niveaux du groupe -->
      <div class="lvl-edit-levels">
        <div v-for="(lv, li) in grp.levels" :key="li" class="lvl-edit-level">
          <AppColorPicker usage="level" v-model="lv.color" @update:modelValue="emit" />
          <input
            class="lvl-edit-label"
            v-model="lv.label"
            placeholder="Libellé du niveau"
            @input="emit"
          />
          <input
            class="lvl-edit-pts"
            type="number"
            min="0"
            v-model.number="lv.pts"
            placeholder="pts"
            @input="emit"
          />
          <div class="lvl-edit-arrows">
            <AppArrowBtn dir="up"   :size="30" :disabled="li === 0"                     @click="moveLevel(gi, li, -1)" />
            <AppArrowBtn dir="down" :size="30" :disabled="li === grp.levels.length - 1" @click="moveLevel(gi, li,  1)" />
          </div>
          <AppToolBtn variant="del" :size="30" title="Supprimer le niveau" @click="removeLevel(gi, li)">
            <AppIcon name="trash" :size="15" />
          </AppToolBtn>
        </div>

        <button class="lvl-add-btn lvl-add-level" @click="addLevel(gi)">+ Niveau</button>
      </div>
    </div>

    <button class="lvl-add-btn lvl-add-group" @click="addGroup">+ Groupe</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppIcon from '../../../AppIcon.vue'
import AppColorPicker from '../../../AppColorPicker.vue'
import AppArrowBtn from '../../../AppArrowBtn.vue'
import AppToolBtn from '../../../AppToolBtn.vue'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emits = defineEmits(['update'])

const localGroups = ref(JSON.parse(JSON.stringify(props.config?.groups || [])))

watch(() => props.config, c => {
  localGroups.value = JSON.parse(JSON.stringify(c?.groups || []))
}, { deep: true })

function emit() {
  emits('update', { ...props.config, groups: JSON.parse(JSON.stringify(localGroups.value)) })
}

function addGroup() {
  localGroups.value.push({ title: '', levels: [] })
  emit()
}
function removeGroup(gi) {
  localGroups.value.splice(gi, 1)
  emit()
}
function moveGroup(gi, dir) {
  const to = gi + dir
  if (to < 0 || to >= localGroups.value.length) return
  const arr = localGroups.value
  ;[arr[gi], arr[to]] = [arr[to], arr[gi]]
  emit()
}

function addLevel(gi) {
  localGroups.value[gi].levels.push({ label: '', pts: 0, color: 'gris' })
  emit()
}
function removeLevel(gi, li) {
  localGroups.value[gi].levels.splice(li, 1)
  emit()
}
function moveLevel(gi, li, dir) {
  const lv = localGroups.value[gi].levels
  const to = li + dir
  if (to < 0 || to >= lv.length) return
  ;[lv[li], lv[to]] = [lv[to], lv[li]]
  emit()
}
</script>

<style>
.lvl-edit { display: flex; flex-direction: column; gap: 12px; padding: 10px;}
.lvl-edit-empty { font-size: 13px; color: #9ca3af; text-align: center; margin: 0; padding: 16px 0; }

.lvl-edit-group {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}

.lvl-edit-group-hdr {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.lvl-edit-title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 9px;
  outline: none;
}
.lvl-edit-title:focus { border-color: #94a3b8; }

.lvl-edit-arrows { display: flex; gap: 2px; }

.lvl-edit-levels {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 6px;
}
.lvl-edit-level {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lvl-edit-label {
  flex: 1;
  min-width: 0;
  height: 36px;
  font-size: 13px;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 8px;
  margin-left: 5px;
  outline: none;
}
.lvl-edit-label:focus { border-color: #94a3b8; }
.lvl-edit-pts {
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
.lvl-edit-pts::-webkit-outer-spin-button,
.lvl-edit-pts::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.lvl-edit-pts:focus { border-color: #94a3b8; }

.lvl-add-btn {
  align-self: flex-start;
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px dashed #cbd5e1;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.lvl-add-btn:hover { background: #f8fafc; color: #374151; }
.lvl-add-group { align-self: stretch; text-align: center; }
.lvl-add-level { align-self: stretch; text-align: center; margin-top: 4px; }
</style>
