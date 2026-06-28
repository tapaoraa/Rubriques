<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-card" :class="cardClass">
        <div class="modal-head">
          <h2>{{ title }}</h2>
          <button class="icon-btn icon-btn-dark" @click="$emit('close')">
            <AppIcon name="close" :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: { type: String, default: '' },
  show: { type: Boolean, default: false },
  cardClass: { type: String, default: '' },
})
defineEmits(['close'])
</script>

<style>
.modal-backdrop { @apply fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center; }
.modal-card { @apply relative bg-surface rounded-t-2xl sm:rounded-2xl shadow-lg w-full sm:max-w-lg flex flex-col z-50; max-height: 90dvh; }
.modal-head { @apply flex items-center justify-between px-5 py-3 border-b border-border flex-none; }
.modal-head h2 { @apply text-base font-bold text-ink; }
.modal-body { @apply flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4; }
</style>
