<template>
  <button
    class="arrow-btn"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    :style="size !== 34 ? { width: size + 'px', height: size + 'px', borderRadius: Math.round(size * 0.26) + 'px', fontSize: Math.round(size * 0.38) + 'px' } : {}"
    v-bind="$attrs"
  >{{ { down: '↓', up: '↑', left: '←', right: '→' }[dir] ?? '↓' }}</button>
</template>

<script setup>
defineProps({
  dir:      { type: String, default: 'down' },  // 'up' | 'down' | 'left' | 'right'
  size:     { type: Number, required: true },
  disabled: { type: Boolean, default: false },
})
</script>
