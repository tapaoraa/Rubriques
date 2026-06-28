<template>
  <div class="item-card">
    <button
      type="button"
      class="item-card-main"
      :style="clickDisabled ? 'pointer-events:none' : ''"
      @click="$emit('click')"
    >
      <div class="item-card-name">
        <slot name="name">{{ name }}</slot>
      </div>
      <div class="item-card-meta">{{ meta }}</div>
    </button>
    <div class="item-card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: '' },
  meta: { type: String, default: '' },
  clickDisabled: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<style>
.item-card { display: flex; align-items: stretch; gap: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 6px 8px 6px 6px; transition: border-color .15s, box-shadow .15s, background .15s; cursor: pointer; }
.item-card:hover { background: #f8fafc; box-shadow: 0 1px 6px rgba(0,0,0,.07); }
.item-card-main { flex: 1; min-width: 0; text-align: left; display: flex; flex-direction: column; gap: 4px; border: none; background: none; padding: 10px 8px; border-radius: 10px; cursor: pointer; }
.item-card-name { width: 100%; font-size: 15px; font-weight: 650; color: #0f172a; }
/* Le champ de renommage occupe toute la largeur disponible de la carte. */
.item-card-name input { width: 100%; box-sizing: border-box; }
.item-card-meta { font-size: 13px; color: #475569; }
.item-card-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; align-self: center; padding-right: 2px; }
</style>
