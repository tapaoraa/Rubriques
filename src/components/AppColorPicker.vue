<template>
  <div class="app-color-picker" ref="root">
    <button
      type="button"
      class="app-color-trigger"
      :style="{ background: tint(modelValue, 500) }"
      :title="currentLabel"
      @click="open = !open"
    />
    <div v-if="open" class="app-color-pop">
      <button
        v-for="c in COLORS"
        :key="c.key"
        type="button"
        class="app-color-swatch"
        :class="{ on: c.key === modelValue }"
        :style="{ background: tint(c.key, 500), color: tint(c.key, 600) }"
        :title="c.label"
        @click="select(c.key)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { COLORS, tint, DEFAULT_COLOR } from '../utils/palette.js'

const props = defineProps({ modelValue: { type: String, default: DEFAULT_COLOR } })
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref(null)

const currentLabel = computed(() => COLORS.find(c => c.key === props.modelValue)?.label || '')

function select(key) {
  emit('update:modelValue', key)
  open.value = false
}

function onDocClick(e) {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style>
.app-color-picker { position: relative; display: inline-flex; flex: none; }

.app-color-trigger {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,.18);
  transition: box-shadow 0.15s;
}
.app-color-trigger:hover { box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,.35); }

.app-color-pop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(15,23,42,.18);
}

.app-color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0,0,0,.08);
  transition: transform 0.1s, box-shadow 0.1s;
}
.app-color-swatch:hover { transform: scale(1.12); }
.app-color-swatch.on { box-shadow: 0 0 0 2px #fff, 0 0 0 4px currentColor; }
</style>
