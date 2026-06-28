<template>
  <div class="flex flex-col h-dvh">
    <header class="topbar">
      <div class="topbar-group">
        <button class="icon-btn" @click="goBack">
          <AppIcon name="back" :size="22" />
        </button>
      </div>
      <span class="topbar-title">Mode Édition</span>
      <div class="topbar-group">
        <DisplayModeToggle v-model="displayMode" />
      </div>
    </header>

    <div class="page-wrap">
      <div class="page-center">
        <template v-if="grille">
          <EditBanner
            :grille="grille"
            :isEval="isEval"
            @print="printBlank"
            @rename="onRename"
          />
          
            <EditGrille
              :grille="grille"
              :mode="displayMode"
              @save="onSave"
            />
        </template>
        <div v-else class="flex-1 flex items-center justify-center text-ink-muted">
          Grille introuvable.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../stores/store.js'
import AppIcon from '../components/AppIcon.vue'
import DisplayModeToggle from '../components/DisplayModeToggle.vue'
import EditBanner from '../components/Grille/EditBanner.vue'
import EditGrille from '../components/Grille/GrilleEditMode.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const displayMode = ref('compact')
const id = route.params.id

const grille = computed(() => store.getGrille(id) || store.getEval(id) || null)
const isEval = computed(() => !!store.getEval(id))

function goBack() {
  router.push('/')
}

function onSave() {
  if (isEval.value) store.saveEvalData(id)
  else store.saveGrilleData(id)
}

function onRename(name) {
  if (isEval.value) store.renameEval(id, name)
  else store.renameGrille(id, name)
}

async function printBlank() {
  alert('Impression PDF vierge : fonctionnalité à venir.')
}
</script>
