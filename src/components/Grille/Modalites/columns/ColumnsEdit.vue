<template>
  <div class="col-edit">
    <!-- État vide -->
    <p v-if="localLevels.length === 0" class="col-edit-empty">Ajoutez une colonne pour démarrer la configuration.</p>

    <!-- Colonnes -->
    <div v-else class="col-edit-cols">
      <div v-for="(lv, li) in localLevels" :key="li" class="col-edit-col" :style="{ background: tint(lv.color, 50) }">
        <!-- Header : couleur + flèches + poubelle -->
        <div class="col-edit-header">
          <AppColorPicker v-model="lv.color" @update:modelValue="emit" />
          <div class="col-edit-arrows">
            <AppArrowBtn dir="left"  :size="28" :disabled="li === 0"                        @click="moveLevel(li, -1)" />
            <AppArrowBtn dir="right" :size="28" :disabled="li === localLevels.length - 1"   @click="moveLevel(li,  1)" />
          </div>
          <AppToolBtn variant="del" :size="28" title="Supprimer" @click="removeLevel(li)">
            <AppIcon name="trash" :size="13" />
          </AppToolBtn>
        </div>

        <!-- Label -->
        <div
          class="col-edit-textarea"
          contenteditable="true"
          data-placeholder="Description…"
          :ref="el => { if (el && el.innerText !== lv.label) el.innerText = lv.label }"
          @input="lv.label = $event.target.innerText; emit()"
        />

        <!-- Bornes min / max -->
        <div class="col-edit-foot">
          <span
            class="col-edit-sq col-edit-min"
            :style="{ color: tint(lv.color, 700), background: tint(lv.color, 100) }"
            title="Borne min (auto)"
          >{{ colMin(li) }}</span>
          <input
            class="col-edit-sq col-edit-max"
            type="number"
            :step="localStep"
            min="0"
            :value="lv.max"
            :style="{ color: tint(lv.color, 700), borderColor: tint(lv.color, 400) }"
            title="Borne max"
            @change="setMax(li, $event.target.value)"
          />
        </div>
      </div>
    </div>

    <!-- Footer : Pas + Ajouter colonne -->
    <div class="col-edit-footer">
      <div class="col-edit-step">
        <span class="col-edit-step-label">Pas :</span>
        <div class="col-step-group">
          <span
            v-for="s in STEPS"
            :key="s"
            :class="{ on: localStep === s }"
            @click="setStep(s)"
          >{{ s }}</span>
        </div>
      </div>
      <button class="col-add-btn" @click="addLevel">+ Colonne</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppIcon from '../../../AppIcon.vue'
import AppColorPicker from '../../../AppColorPicker.vue'
import { tint } from '../../../../utils/palette.js'
import AppArrowBtn from '../../../AppArrowBtn.vue'
import AppToolBtn from '../../../AppToolBtn.vue'

const STEPS = [0.25, 0.5, 1, 2]

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emits = defineEmits(['update'])

const localLevels = ref(JSON.parse(JSON.stringify(props.config?.levels || [])))
const localStep   = ref(props.config?.step ?? 1)

watch(() => props.config, c => {
  localLevels.value = JSON.parse(JSON.stringify(c?.levels || []))
  localStep.value   = c?.step ?? 1
}, { deep: true })

function emit() {
  emits('update', { ...props.config, levels: JSON.parse(JSON.stringify(localLevels.value)), step: localStep.value })
}

function colMin(li) {
  const pas = localStep.value
  return li === 0 ? 0 : Math.round((localLevels.value[li - 1].max + pas) * 100) / 100
}

function setMax(li, val) {
  const pas = localStep.value
  localLevels.value[li].max = Math.round((Number(val) || 0) / pas) * pas
  emit()
}

function addLevel() {
  const prev = localLevels.value[localLevels.value.length - 1]
  localLevels.value.push({ label: '', max: (prev?.max ?? 0) + 2, color: 'orange' })
  emit()
}

function removeLevel(li) {
  localLevels.value.splice(li, 1)
  emit()
}

function moveLevel(li, dir) {
  const to = li + dir
  if (to < 0 || to >= localLevels.value.length) return
  const arr = localLevels.value
  ;[arr[li], arr[to]] = [arr[to], arr[li]]
  emit()
}

function setStep(s) {
  localStep.value = s
  emit()
}
</script>

<style>
.col-edit { display: flex; flex-direction: column; justify-content: end; height: 100%;}
.col-edit-empty { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #9ca3af; margin: 0; }

.col-edit-cols {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  overflow: hidden;
}

.col-edit-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-right: 1px solid #e2e8f0;
  padding: 8px 7px;
  min-width: 0;
}
.col-edit-col:last-child { border-right: none; }

.col-edit-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.col-edit-arrows { display: flex; gap: 2px; flex: 1; justify-content: center; }

.col-edit-textarea {
  flex: 1;
  font-size: 12px;
  line-height: 1.4;
  color: #374151;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  word-break: break-word;
  white-space: pre-wrap;
  cursor: text;
}
.col-edit-textarea:focus { border-color: #94a3b8; }
.col-edit-textarea:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.col-edit-foot {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-top: 2px;
}

.col-edit-sq {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  border-radius: 7px;
  text-align: center;
  flex-shrink: 0;
  border: 1.5px solid;
}

.col-edit-min {
  background: transparent;
}

.col-edit-max {
  background: #fff;
  outline: none;
  padding: 0;
  -moz-appearance: textfield;
}
.col-edit-max::-webkit-outer-spin-button,
.col-edit-max::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

/* Footer */
.col-edit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.col-edit-step { display: flex; align-items: center; gap: 8px; }
.col-edit-step-label { font-size: 13px; color: #6b7280; }

.col-step-group {
  display: inline-flex;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  background: #f1f5f9;
}
.col-step-group span {
  width: 44px;
  padding: 8px 0;
  border-radius: 7px;
  line-height: 1;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
  text-align: center;
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}
.col-step-group span.on {
  background: #fff;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
}

.col-add-btn {
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1.5px dashed #cbd5e1;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.col-add-btn:hover { background: #f8fafc; color: #374151; }
</style>
