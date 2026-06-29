<template>
  <div class="page-wrap">
  <div class="page-center home-pad">

    <!-- Carte évaluations — remplit l'espace restant -->
    <div class="home-card">
      <div class="home-card-head">
        <div class="flex items-center gap-2.5">
          <img src="/icons/icon.svg" alt="" class="w-7 h-7 rounded-lg" />
          <h1 class="home-card-title">Rubriques</h1>
        </div>
        <button class="btn btn-ghost btn-sm text-[15px]" @click="showLibrary = true">
          <AppIcon name="library" :size="20" /> Bibliothèque
        </button>
      </div>
      <div class="home-card-body">
        <!-- Boutons actions -->
        <div class="flex gap-2">
          <button class="btn btn-outline flex-1" @click="importEval">
            <AppIcon name="upload" :size="17" /> Import JSON
          </button>
          <button class="btn btn-primary flex-1" @click="showNewEval = true">
            <AppIcon name="plus" :size="17" /> Nouvelle évaluation
          </button>
        </div>

        <!-- Liste scrollable -->
        <div class="home-eval-list">
          <p v-if="!store.evaluations.length" class="empty-state">
            Aucune évaluation pour le moment.
          </p>
          <div class="card-list">
            <ItemCard
              v-for="ev in store.evaluations"
              :key="ev.id"
              :meta="`${ev.elevesList?.length || 0} élèves · ${totalItems(ev)} items · ${maxPts(ev)} pts · ${donePct(ev)}`"
              :clickDisabled="renamingEval === ev.id"
              @click="openEval(ev.id)"
            >
              <template #name>
                <span v-if="renamingEval !== ev.id">{{ ev.name }}</span>
                <input
                  v-else
                  class="input py-0.5 text-[15px] w-full"
                  :value="ev.name"
                  @mousedown.stop
                  @click.stop
                  @input="e => renamingValue = e.target.value"
                  @keydown.enter.stop="finishRenameEval(ev.id, renamingValue)"
                  @keydown.esc.stop="renamingEval = null"
                  @blur="onEvalInputBlur(ev.id)"
                  @vue:mounted="e => { renamingValue = ev.name; e.el?.select() }"
                />
              </template>
              <template #actions>
                <button v-if="renamingEval === ev.id" class="tool-btn tool-ok" @mousedown.prevent @click.stop="finishRenameEval(ev.id, renamingValue)" title="Valider">
                  <AppIcon name="check" :size="16" />
                </button>
                <button v-else class="tool-btn tool-edit" @click.stop="renamingEval = ev.id" title="Renommer">
                  <AppIcon name="pencil" :size="16" />
                </button>
                <button class="tool-btn tool-edit" @click.stop="openEdit(ev.id)" title="Modifier la grille">
                  <AppIcon name="grid" :size="16" />
                </button>
                <button class="tool-btn" @click.stop="toggleExportMenu(ev.id, $event)" title="Exporter">
                  <AppIcon name="download" :size="16" />
                </button>
                <button class="tool-btn tool-del" @click.stop="deleteEval(ev.id)" title="Supprimer">
                  <AppIcon name="trash" :size="16" />
                </button>
              </template>
            </ItemCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouvelle évaluation — wizard 3 étapes -->
    <Teleport to="body">
      <div v-if="showNewEval" class="modal-backdrop" @click.self="closeNewEval">
        <div class="modal-card modal-card-wizard">
          <!-- Tête : titre + étapes -->
          <div class="modal-head">
            <h2>Nouvelle évaluation</h2>
            <button class="icon-btn icon-btn-dark" @click="closeNewEval">
              <AppIcon name="close" :size="20" />
            </button>
          </div>

          <!-- Indicateur d'étapes -->
          <div class="wizard-steps">
            <div v-for="i in 3" :key="i" class="wizard-step-dot" :class="{ active: newEvalStep === i, done: newEvalStep > i }" />
          </div>

          <!-- Contenu de l'étape -->
          <div class="wizard-body">

            <!-- Étape 1 : Nom -->
            <div v-if="newEvalStep === 1" class="flex flex-col gap-3">
              <p class="wizard-step-label">Nom de l'évaluation</p>
              <input
                class="input"
                v-model="newEvalName"
                placeholder="Ex : Épreuve de natation"
                @keydown.enter="newEvalName.trim() && (newEvalStep = 2)"
                autofocus
              />
            </div>

            <!-- Étape 2 : Grille -->
            <div v-if="newEvalStep === 2" class="flex flex-col gap-3">
              <p class="wizard-step-label">Grille de notation</p>
              <div class="flex flex-col gap-2 overflow-y-auto flex-1">
                <button
                  v-for="g in store.grilles"
                  :key="g.id"
                  class="choice"
                  :class="{ active: newEvalGrilleId === g.id }"
                  @click="newEvalGrilleId = g.id"
                >
                  <span class="choice-name">{{ g.name }}</span>
                  <span class="choice-meta">{{ (g.gradeData || []).flatMap(c => c.items).length }} items · {{ gradeMaxFn(g.gradeData) }} pts</span>
                </button>
                <button
                  class="choice"
                  :class="{ active: newEvalGrilleId === 'empty' }"
                  @click="newEvalGrilleId = 'empty'"
                >
                  <span class="choice-name">Grille vide</span>
                  <span class="choice-meta">À configurer ensuite</span>
                </button>
              </div>
            </div>

            <!-- Étape 3 : Élèves -->
            <div v-if="newEvalStep === 3" class="flex flex-col gap-3 flex-1">
              <p class="wizard-step-label">Liste des élèves</p>
              <textarea
                class="input flex-1"
                style="resize:none; min-height: 160px"
                v-model="newEvalEleves"
                placeholder="DUPONT Jean&#10;MARTIN Marie&#10;BERNARD Lucas"
              />
            </div>

          </div>

          <!-- Pied : navigation -->
          <div class="wizard-foot">
            <button v-if="newEvalStep > 1" class="btn btn-ghost" @click="newEvalStep--">
              <AppIcon name="left" :size="16" /> Retour
            </button>
            <span v-else />
            <button
              v-if="newEvalStep < 3"
              class="btn btn-primary"
              :disabled="newEvalStep === 1 && !newEvalName.trim()"
              @click="newEvalStep++"
            >
              Suivant <AppIcon name="right" :size="16" />
            </button>
            <button
              v-else
              class="btn btn-primary"
              :disabled="!newEvalName.trim() || !newEvalEleves.trim()"
              @click="createEval"
            >
              <AppIcon name="check" :size="16" /> Créer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Bibliothèque -->
    <AppModal title="Bibliothèque de grilles" :show="showLibrary" @close="showLibrary = false" cardClass="modal-card-fixed">
      <div class="flex flex-col gap-3">
        <div class="flex gap-2">
          <button class="btn btn-outline flex-1" @click="importGrille">
            <AppIcon name="upload" :size="16" /> Import JSON
          </button>
          <button class="btn btn-primary flex-1" @click="createGrille">
            <AppIcon name="plus" :size="16" /> Nouvelle grille
          </button>
        </div>
        <div v-if="!store.grilles.length" class="empty-state">
          Aucune grille enregistrée.
        </div>
        <ItemCard
          v-for="g in store.grilles"
          :key="g.id"
          :meta="`${(g.gradeData || []).length} catégories · ${(g.gradeData || []).flatMap(c => c.items).length} items · ${gradeMaxFn(g.gradeData)} pts`"
          :clickDisabled="renamingGrille === g.id"
          @click="openEdit(g.id)"
        >
          <template #name>
            <span v-if="renamingGrille !== g.id">{{ g.name }}</span>
            <input
              v-else
              class="input py-0.5 text-[15px] w-full"
              :value="g.name"
              @mousedown.stop
              @click.stop
              @input="e => renamingValue = e.target.value"
              @keydown.enter.stop="finishRenameGrille(g.id, renamingValue)"
              @keydown.esc.stop="renamingGrille = null"
              @blur="onGrilleInputBlur(g.id)"
              @vue:mounted="e => { renamingValue = g.name; e.el?.select() }"
            />
          </template>
          <template #actions>
            <button v-if="renamingGrille === g.id" class="tool-btn tool-ok" @mousedown.prevent @click.stop="finishRenameGrille(g.id, renamingValue)" title="Valider">
              <AppIcon name="check" :size="16" />
            </button>
            <button v-else class="tool-btn tool-edit" @click.stop="renamingGrille = g.id" title="Renommer">
              <AppIcon name="pencil" :size="16" />
            </button>
            <button class="tool-btn" @click.stop="duplicateGrille(g.id)" title="Dupliquer">
              <AppIcon name="copy" :size="16" />
            </button>
            <button class="tool-btn tool-del" @click.stop="deleteGrille(g.id)" title="Supprimer">
              <AppIcon name="trash" :size="16" />
            </button>
          </template>
        </ItemCard>
      </div>
    </AppModal>

  </div><!-- /page-center -->

    <!-- Overlay fermeture menu export -->
    <div v-if="exportMenuOpen" class="fixed inset-0 z-20" @click="exportMenuOpen = null" />

    <!-- Menu export en position fixed -->
    <Teleport to="body">
      <div
        v-if="exportMenuOpen"
        class="export-menu"
        :style="{ top: exportMenuPos.y + 'px', left: exportMenuPos.left + 'px' }"
        @click.stop
      >
        <button class="export-menu-item" @click="exportPdf()">
          <span class="export-menu-label">PDF</span>
          <span class="export-menu-sub">Toute la classe</span>
        </button>
        <button class="export-menu-item" @click="exportXlsx()">
          <span class="export-menu-label">XLSX</span>
          <span class="export-menu-sub">Totaux + sous-totaux</span>
        </button>
        <button class="export-menu-item" @click="exportJson()">
          <span class="export-menu-label">JSON</span>
          <span class="export-menu-sub">Données complètes</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, gradeMax as gradeMaxFn } from '../stores/store.js'
import AppIcon from '../components/AppIcon.vue'
import AppModal from '../components/AppModal.vue'
import ItemCard from '../components/ItemCard.vue'
import { exportEvalJson, exportEvalXlsx } from '../utils/exporters.js'
import { readJsonFile } from '../utils/files.js'

const router = useRouter()
const store = useStore()

const showNewEval = ref(false)
const showLibrary = ref(false)
const newEvalStep = ref(1)
const newEvalName = ref('')
const newEvalGrilleId = ref(null)
const newEvalEleves = ref('')
const renamingEval = ref(null)
const renamingGrille = ref(null)
const renamingValue = ref('')
const exportMenuOpen = ref(null)
const exportMenuPos = ref({ left: 0, y: 0 })
const currentExportEv = ref(null)

function openEval(id) { router.push(`/eval/${id}`) }
function openEdit(id) { router.push(`/edit/${id}`) }

function totalItems(ev) { return (ev.gradeData || []).flatMap(c => c.items || []).length }
function maxPts(ev) { return gradeMaxFn(ev.gradeData) }
function donePct(ev) {
  const total = ev.elevesList?.length || 0
  if (!total) return '0/0 terminés'
  const done = (ev.elevesList || []).filter(e => {
    if ((e.evalState || 'total') !== 'total') return true
    const items = (ev.gradeData || []).flatMap(c => c.items || [])
    if (!items.length) return false
    return items.every(it => {
      const s = e.scores?.[it.id]
      if (!s) return false
      if (it.modality === 'check') return (it.config?.pills || []).every((_, i) => s.states?.[i] === 'active' || s.states?.[i] === 'rejected')
      if (it.modality === 'level') return (it.config?.groups || []).every((_, i) => (s.groupStates?.[i] ?? 0) > 0)
      if (it.modality === 'columns') return s.ptBoxChosen === true
      return false
    })
  }).length
  return `${done}/${total} terminés`
}

function closeNewEval() {
  showNewEval.value = false
  newEvalStep.value = 1
  newEvalName.value = ''
  newEvalGrilleId.value = null
  newEvalEleves.value = ''
}

function createEval() {
  store.createEval({
    name: newEvalName.value,
    grilleId: newEvalGrilleId.value === 'empty' ? null : newEvalGrilleId.value,
    elevesText: newEvalEleves.value,
  })
  closeNewEval()
}

function deleteEval(id) {
  if (confirm('Supprimer cette évaluation ?')) store.deleteEval(id)
}

function onEvalInputBlur(id) {
  if (renamingEval.value === id) finishRenameEval(id, renamingValue.value)
}

function finishRenameEval(id, name) {
  store.renameEval(id, name)
  renamingEval.value = null
}

function toggleExportMenu(id, event) {
  if (exportMenuOpen.value === id) { exportMenuOpen.value = null; return }
  const rect = event.currentTarget.getBoundingClientRect()
  const menuW = 200
  const left = Math.max(8, Math.min(rect.right - menuW, window.innerWidth - menuW - 8))
  exportMenuPos.value = { left, y: rect.bottom + 6 }
  currentExportEv.value = store.evaluations.find(e => e.id === id)
  exportMenuOpen.value = id
}

// Export PDF : à réimplémenter. Bouton conservé, action désactivée pour l'instant.
function exportPdf() {
  exportMenuOpen.value = null
}
function exportXlsx() {
  exportMenuOpen.value = null
  exportEvalXlsx(currentExportEv.value)
}
function exportJson() {
  exportMenuOpen.value = null
  exportEvalJson(currentExportEv.value)
}

function importEval() {
  readJsonFile(data => {
    const ev = store.importEval(data)
    if (ev) router.push(`/eval/${ev.id}`)
    else alert('Format invalide')
  })
}

function createGrille() {
  const g = store.createGrille({ name: 'Nouvelle grille' })
  showLibrary.value = false
  router.push(`/edit/${g.id}`)
}

function duplicateGrille(id) { store.duplicateGrille(id) }

function deleteGrille(id) {
  if (confirm('Supprimer cette grille ?')) store.deleteGrille(id)
}

function onGrilleInputBlur(id) {
  if (renamingGrille.value === id) finishRenameGrille(id, renamingValue.value)
}

function finishRenameGrille(id, name) {
  store.renameGrille(id, name)
  renamingGrille.value = null
}

function importGrille() {
  readJsonFile(data => {
    const g = store.importGrille(data)
    if (!g) alert('Format invalide')
  })
}
</script>

<style>
/* Padding propre à Home, par-dessus le layout global .page-center */
.home-pad { padding: calc(1rem + env(safe-area-inset-top)) 1rem 1rem; }

.empty-state { @apply text-center text-ink-faint text-sm py-12; }

.home-card { @apply flex-1 flex flex-col bg-surface rounded-2xl shadow-card border border-border overflow-hidden; }
.home-card-head { @apply flex items-center justify-between gap-2 px-5 py-4 border-b border-border flex-none; }
.home-card-title { @apply text-[24px] font-bold text-ink; letter-spacing: -0.01em; }
.home-card-body { @apply flex-1 flex flex-col overflow-hidden; padding: 16px 20px 0; gap: 12px; }
.home-eval-list { @apply flex-1 overflow-y-auto; padding: 0 0 20px; }

.card-list { @apply flex flex-col gap-2.5; }

/* Wizard « Nouvelle évaluation » + modale Bibliothèque (hauteurs fixes) */
.modal-card-wizard { height: 480px; }
.modal-card-fixed { height: 520px; }
.wizard-steps { @apply flex items-center justify-center gap-2 py-3 flex-none; }
.wizard-step-dot { @apply w-2 h-2 rounded-full bg-border transition-all; }
.wizard-step-dot.active { @apply bg-primary w-5; }
.wizard-step-dot.done { @apply bg-primary/40; }
.wizard-body { @apply flex-1 overflow-y-auto px-5 pb-2 flex flex-col gap-3; }
.wizard-step-label { @apply text-sm font-semibold text-ink-muted; }
.wizard-foot { @apply flex items-center justify-between px-5 py-4 border-t border-border flex-none; }

.choice { @apply flex flex-col items-start text-left w-full px-4 py-3 rounded-xl border-2 border-border bg-surface hover:border-primary/40 transition-colors; }
.choice.active { @apply border-primary bg-primary-soft; }
.choice-name { @apply text-[15px] font-semibold text-ink; }
.choice-meta { @apply text-sm text-ink-muted; }

.export-menu { @apply fixed z-30 flex flex-col p-1.5 bg-surface border border-border rounded-xl; box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 200px; }
.export-menu-item { @apply flex flex-col gap-0.5 text-left px-3 py-2.5 rounded-lg border-0 bg-transparent cursor-pointer transition-colors; }
.export-menu-item:hover { @apply bg-surface-raised; }
.export-menu-label { @apply text-[15px] font-bold text-ink; }
.export-menu-sub { @apply text-xs text-ink-muted; }
</style>
