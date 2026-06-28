<template>
  <div class="flex flex-col h-dvh">
    <header class="topbar">
      <div class="topbar-group">
        <button class="icon-btn" @click="router.push('/')">
          <AppIcon name="back" :size="22" />
        </button>
        <button class="icon-btn" @click="sidebarOpen = true">
          <AppIcon name="users" :size="22" />
        </button>
      </div>
      <span class="topbar-title">{{ ev?.name }}</span>
      <div class="topbar-group">
        <DisplayModeToggle v-model="pillMode" />
      </div>
    </header>

    <div class="page-wrap">
    <div class="page-center">
      <EleveBanner
        v-if="ev && ev.elevesList.length"
        :ev="ev"
        :selectedIdx="ev.selectedEleveIdx"
        @prev="prevEleve"
        @next="nextEleve"
        @cycleState="onCycleState"
        @conseils="onConseils"
        @print="onPrint"
      />

      <GrilleView
        v-if="ev"
        :gradeData="ev.gradeData"
        :scores="selectedEleve?.scores || {}"
        :mode="pillMode"
        @score="onScore"
      />
    </div>
    </div>

    <EleveSidebar
      :open="sidebarOpen"
      :ev="ev || { elevesList: [], gradeData: [] }"
      :selectedIdx="ev?.selectedEleveIdx ?? null"
      @select="onSelect"
      @close="sidebarOpen = false"
      @manageEleves="showManageEleves = true"
    />

    <AppModal title="Gérer les élèves" :show="showManageEleves" @close="showManageEleves = false">
      <div class="flex flex-col gap-3">
        <p class="text-sm text-ink-muted">Liste des élèves (un par ligne, NOM Prénom) :</p>
        <textarea
          class="input"
          rows="8"
          v-model="newElevesText"
          placeholder="DUPONT Jean&#10;MARTIN Marie"
        />
        <div class="flex gap-2 justify-end">
          <button class="btn btn-outline btn-sm" @click="showManageEleves = false">Annuler</button>
          <button class="btn btn-primary btn-sm" @click="addEleves">Ajouter</button>
        </div>
        <div class="border-t border-border pt-3">
          <p class="text-sm font-semibold text-ink mb-2">Élèves actuels</p>
          <div v-for="(eleve, i) in ev?.elevesList" :key="i" class="flex items-center gap-2 py-1">
            <span class="flex-1 text-sm" v-html="eleveDisplay(eleve)" />
            <button class="icon-btn icon-btn-dark" @click="removeEleve(i)">
              <AppIcon name="trash" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore, eleveDisplay } from '../stores/store.js'
import AppIcon from '../components/AppIcon.vue'
import AppModal from '../components/AppModal.vue'
import DisplayModeToggle from '../components/DisplayModeToggle.vue'
import EleveBanner from '../components/Grille/EleveBanner.vue'
import EleveSidebar from '../components/Grille/EleveSidebar.vue'
import GrilleView from '../components/Grille/GrilleEvalMode.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const sidebarOpen = ref(false)
const showManageEleves = ref(false)
const newElevesText = ref('')

const ev = computed(() => store.getEval(route.params.id))
const selectedEleve = computed(() => {
  if (!ev.value || ev.value.selectedEleveIdx === null) return null
  return ev.value.elevesList[ev.value.selectedEleveIdx] ?? null
})
const pillMode = computed({
  get: () => ev.value?.pillMode || 'compact',
  set: v => { if (ev.value) store.setPillMode(ev.value.id, v) },
})

watch(ev, val => { if (!val) router.push('/') }, { immediate: true })

function prevEleve() {
  if (!ev.value) return
  const idx = ev.value.selectedEleveIdx ?? 0
  if (idx > 0) store.setSelectedEleve(ev.value.id, idx - 1)
}
function nextEleve() {
  if (!ev.value) return
  const idx = ev.value.selectedEleveIdx ?? 0
  if (idx < ev.value.elevesList.length - 1) store.setSelectedEleve(ev.value.id, idx + 1)
}
function onCycleState() {
  if (!ev.value || ev.value.selectedEleveIdx === null) return
  store.cycleState(ev.value.id, ev.value.selectedEleveIdx)
}
function onConseils(text) {
  if (!ev.value || ev.value.selectedEleveIdx === null) return
  store.saveConseils(ev.value.id, ev.value.selectedEleveIdx, text)
}
function onScore({ itemId, scoreData }) {
  if (!ev.value || ev.value.selectedEleveIdx === null) return
  store.saveScore(ev.value.id, ev.value.selectedEleveIdx, itemId, scoreData)
}
function onSelect(i) {
  if (!ev.value) return
  store.setSelectedEleve(ev.value.id, i)
}
// Impression : à réimplémenter. Bouton conservé, action désactivée pour l'instant.
function onPrint() {}
function addEleves() {
  if (!ev.value || !newElevesText.value.trim()) return
  store.addEleves(ev.value.id, newElevesText.value)
  newElevesText.value = ''
}
function removeEleve(i) {
  if (!ev.value) return
  store.removeEleve(ev.value.id, i)
}
</script>
