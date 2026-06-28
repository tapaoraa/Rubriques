<template>
  <div class="mode-toggle" title="Affichage des niveaux">
    <span
      v-for="opt in options"
      :key="opt.value"
      :class="{ on: modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >{{ opt.label }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'compact' },
})
defineEmits(['update:modelValue'])

const options = [
  { value: 'compact', label: 'Compact' },
  { value: 'etendu', label: 'Étendu' },
]
</script>

<style>
/* Segmented control « Compact / Étendu » — style exact de grille-v2
   (variante topbar sur fond indigo). */
.mode-toggle {
  display: inline-flex;
  border: none; border-radius: 10px;
  padding: 3px; gap: 2px;
  background: rgba(255, 255, 255, .16);
  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.mode-toggle span {
  padding: 9px 16px; border-radius: 7px; line-height: 1;
  font-size: 14px; font-weight: 600;
  color: rgba(255, 255, 255, .85);
  cursor: pointer; user-select: none; -webkit-user-select: none;
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}
.mode-toggle span.on {
  background: #fff; color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .18);
}
</style>
