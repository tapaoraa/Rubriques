<template>
  <svg
    class="app-icon inline-block flex-none"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <use :href="`/app-icons.svg#${name}`" />
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
})
</script>
