<template>
  <button
    class="tool-btn"
    :class="[variant && `tool-${variant}`, { 'ml-auto': pushRight }]"
    :style="size !== 38 ? { width: size + 'px', height: size + 'px', borderRadius: Math.round(size * 0.26) + 'px' } : {}"
    :title="title"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: null },  // 'del' | 'edit' | 'ok' | null
  size:    { type: Number, required: true },
  title:   { type: String, default: null },
  pushRight: { type: Boolean, default: false },
})
</script>
