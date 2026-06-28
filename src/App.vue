<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useStore } from './stores/store.js'

const store = useStore()
onMounted(() => store.init())
</script>

<template>
  <RouterView />
</template>
