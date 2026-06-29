<template>
  <div ref="rootEl" class="grille-sections" :class="{ 'mode-etendu': mode === 'etendu' }">
    <section v-for="(cat, ci) in gradeData" :key="cat.id" class="grille-categorie">
      <!-- Bandeau coloré de catégorie : structure ici, contenu fourni par la grille. -->
      <div class="categorie-header" :class="headerClass" :style="{ '--cat-color': tint(cat.color, 800) }">
        <slot name="cat-header" :cat="cat" :ci="ci" />
      </div>

      <table class="categorie-table">
        <thead>
          <tr>
            <th class="th-item">Item</th>
            <th class="th-notation">Notation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, ii) in cat.items" :key="item.id">
            <td class="td-item">
              <slot name="item-cell" :item="item" :ii="ii" :cat="cat" :ci="ci" />
            </td>
            <td class="td-notation">
              <slot name="notation-cell" :item="item" :ii="ii" :cat="cat" :ci="ci" />
            </td>
          </tr>
          <slot name="tbody-after" :cat="cat" :ci="ci" />
        </tbody>
      </table>
    </section>

    <slot name="after" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { tint } from '../../utils/palette.js'

const props = defineProps({
  gradeData: { type: Array, default: () => [] },
  mode: { type: String, default: 'compact' },
  // Classe additionnelle posée sur chaque bandeau de catégorie (ex. variante édition).
  headerClass: { type: [String, Object, Array], default: '' },
})

const rootEl = ref(null)

// En-tête de colonnes sticky calé sous le bandeau de catégorie.
function positionHeaders() {
  const root = rootEl.value
  if (!root) return
  root.querySelectorAll('.grille-categorie').forEach(sec => {
    const hdr = sec.querySelector('.categorie-header')
    const top = (hdr?.offsetHeight || 0) + 'px'
    sec.querySelectorAll('thead th').forEach(th => {
      th.style.position = 'sticky'
      th.style.top = top
      th.style.zIndex = '9'
    })
  })
}

onMounted(positionHeaders)
watch(() => [props.gradeData, props.mode], () => nextTick(positionHeaders), { deep: true })

defineExpose({ rootEl })
</script>

<style>
/* ════════ Structure de la grille (partagée eval / édition) ════════
   Sections par catégorie + tableau Item / Notation. Coquille vide :
   le contenu des bandeaux et des cellules est injecté via slots. */

.grille-sections {
  flex: 1; min-height: 0; overflow-y: auto;
  width: 100%;
  padding: 0 1rem 20px;
}

.grille-categorie { margin-top: 10px; }
.grille-categorie:first-child { margin-top: 0; }

/* Bandeau coloré de catégorie. */
.categorie-header {
  background: var(--cat-color, #334155);
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.04em;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Tableau de la catégorie. Couleur unique : le fond de la ligne d'en-tête
   (thead) sert aussi de couleur de bordures. */
.categorie-table {
  --categorie-line: #6b7280;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  table-layout: fixed;
  border: 1px solid var(--categorie-line);
}
.categorie-table th,
.categorie-table td {
  border-right: 1px solid var(--categorie-line);
  border-bottom: 1px solid var(--categorie-line);
}
.categorie-table th:last-child,
.categorie-table td:last-child { border-right: none; }
.categorie-table tbody tr:last-child td { border-bottom: none; }
.categorie-table th {
  background: var(--categorie-line);
  color: #fff;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 5px 12px;
}
.th-item { width: 148px; text-align: center; }
.th-notation { text-align: left; }

.td-item {
  padding: 10px 8px;
  vertical-align: middle;
  text-align: center;
  width: 148px;
}
.td-notation {
  padding: 0;
  height: 1px; /* permet aux enfants en height:100% de remplir la cellule */
}

/* Message affiché quand la cellule notation n'a pas de widget configuré
   (commun eval / édition). */
.notation-empty { color: #94a3b8; font-size: 13px; font-style: italic; padding: 12px; }
</style>
