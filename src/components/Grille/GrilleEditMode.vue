<template>
  <TableConstructor
    :gradeData="grille.gradeData"
    :mode="mode"
    headerClass="categorie-header-edit"
    class="grille-edit"
  >
    <!-- Bandeau de catégorie (mode édition) -->
    <template #cat-header="{ cat, ci }">
      <AppColorPicker usage="category" :model-value="cat.color || 'gris'" @update:model-value="setCatColor(ci, $event)" />
      <input
        class="edit-categorie-nom"
        :value="cat.name"
        placeholder="Nom de la catégorie"
        @input="cat.name = $event.target.value; save()"
      />
      <span class="categorie-points edit-categorie-points">
        <strong class="categorie-score">{{ catMax(cat) }}</strong>
        <span class="categorie-max"> pts</span>
      </span>
      <div class="edit-categorie-tools">
        <div class="edit-categorie-arrows">
          <AppArrowBtn dir="down" :disabled="ci === grille.gradeData.length - 1" :size="30" @click="moveCat(ci, 1)" />
          <AppArrowBtn dir="up" :disabled="ci === 0" :size="30" @click="moveCat(ci, -1)" />
        </div>
        <AppToolBtn variant="del" :size="30" title="Supprimer" @click="deleteCat(ci)"><AppIcon name="trash" :size="14" /></AppToolBtn>
      </div>
    </template>

    <!-- Cellule item : éditeur actif ou aperçu passif -->
    <template #item-cell="{ item, ii, cat, ci }">
      <ItemEdit
        v-if="editingIds.includes(item.id)"
        :item="item"
        :isFirst="ii === 0"
        :isLast="ii === cat.items.length - 1"
        @done="closeItem(item.id)"
        @move="dir => moveItem(ci, ii, dir)"
        @delete="deleteItem(ci, ii)"
        @update="save"
      />
      <ItemPreEdit v-else :item="item" @edit="openItem(item.id)" />
    </template>

    <!-- Cellule notation : éditeur de config (actif) ou aperçu passif -->
    <template #notation-cell="{ item }">
      <template v-if="editingIds.includes(item.id)">
        <component
          v-if="item.modality"
          :is="editorFor(item)"
:config="item.config || {}"
          @update="c => setConfig(item, c)"
        />
        <p v-else class="notation-empty">Choisissez une modalité d'évaluation.</p>
      </template>
      <template v-else>
        <component
          v-if="isItemGradeable(item)"
          :is="widgetFor(item)"
          :item="item" :scores="{}" :mode="mode" :readonly="true"
        />
        <p v-else class="notation-empty">{{ item.modality ? 'Modalité non configurée.' : 'Aucune modalité choisie.' }}</p>
      </template>
    </template>

    <!-- Ligne « + item » sous chaque tableau -->
    <template #tbody-after="{ ci }">
      <tr>
        <td class="edit-additem-cell" colspan="2">
          <button class="btn-add edit-additem" @click="addItem(ci)">Ajouter un nouvel item</button>
        </td>
      </tr>
    </template>

    <!-- Bouton « + catégorie » hors tableau -->
    <template #after>
      <button class="btn-add edit-addcat" @click="addCat">Ajouter une nouvelle catégorie</button>
    </template>
  </TableConstructor>
</template>

<script setup>
import { ref } from 'vue'
import { mkCatId, mkItemId, CAT_COLOR_PALETTE, itemMax, isItemGradeable } from '../../stores/store.js'
import AppIcon from '../AppIcon.vue'
import AppArrowBtn from '../AppArrowBtn.vue'
import AppToolBtn from '../AppToolBtn.vue'
import AppColorPicker from '../AppColorPicker.vue'
import TableConstructor from './TableConstructor.vue'
import ItemPreEdit from './Items/ItemPreEdit.vue'
import ItemEdit from './Items/ItemEdit.vue'
import CheckWidget from './Modalites/check/CheckWidget.vue'
import LevelWidget from './Modalites/level/LevelWidget.vue'
import ColumnsWidget from './Modalites/columns/ColumnsWidget.vue'
import CheckEdit from './Modalites/check/CheckEdit.vue'
import LevelEdit from './Modalites/level/LevelEdit.vue'
import ColumnsEdit from './Modalites/columns/ColumnsEdit.vue'

const props = defineProps({
  grille: { type: Object, required: true },
  mode: { type: String, default: 'compact' },
})
const emit = defineEmits(['save'])

const WIDGETS = { check: CheckWidget, level: LevelWidget, columns: ColumnsWidget }
const EDITORS = { check: CheckEdit, level: LevelEdit, columns: ColumnsEdit }
function widgetFor(item) { return WIDGETS[item.modality] || null }
function editorFor(item) { return EDITORS[item.modality] || null }

const editingIds = ref([])

function save() { emit('save') }

function catMax(cat) { return (cat.items || []).reduce((s, it) => s + itemMax(it), 0) }

function openItem(id) { if (!editingIds.value.includes(id)) editingIds.value.push(id) }
function closeItem(id) { editingIds.value = editingIds.value.filter(x => x !== id) }

function setConfig(item, config) {
  item.config = config
  save()
}

function setCatColor(ci, v) {
  props.grille.gradeData[ci].color = v
  save()
}
function moveCat(ci, dir) {
  const data = props.grille.gradeData
  const j = ci + dir
  if (j < 0 || j >= data.length) return
  ;[data[ci], data[j]] = [data[j], data[ci]]
  save()
}
function deleteCat(ci) {
  const cat = props.grille.gradeData[ci]
  if (!confirm(`Supprimer la catégorie « ${cat.name || 'sans nom'} » ?`)) return
  props.grille.gradeData.splice(ci, 1)
  save()
}
function addCat() {
  const ci = props.grille.gradeData.length
  props.grille.gradeData.push({
    id: mkCatId(),
    name: '',
    color: CAT_COLOR_PALETTE[ci % CAT_COLOR_PALETTE.length],
    items: [],
  })
  save()
}
function addItem(ci) {
  const item = { id: mkItemId(), name: '', modality: 'check', config: { pills: [] } }
  props.grille.gradeData[ci].items.push(item)
  openItem(item.id) // nouvel item : ouvert directement en édition
  save()
}
function deleteItem(ci, ii) {
  const id = props.grille.gradeData[ci].items[ii].id
  props.grille.gradeData[ci].items.splice(ii, 1)
  closeItem(id)
  save()
}
function moveItem(ci, ii, dir) {
  const items = props.grille.gradeData[ci].items
  const j = ii + dir
  if (j < 0 || j >= items.length) return
  ;[items[ii], items[j]] = [items[j], items[ii]]
  save()
}
</script>

<style>

/* Cellules pleine hauteur, alignées en haut : le contenu (ItemEdit/PreEdit,
   éditeur de modalité) gère son propre padding. */
.grille-edit .td-item { padding: 0; vertical-align: top; height: 1px; }

/* Bandeau de catégorie, variante édition (aligné à gauche, champs éditables). */
.categorie-header-edit { padding: 8px 12px; gap: 12px; justify-content: flex-start; }
.edit-categorie-nom {
  flex: 0 1 400px; min-width: 0;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.28);
  color: #fff;
  font: inherit; font-weight: 700; text-transform: uppercase;
  font-size: 14px; letter-spacing: 0.04em;
  padding: 6px 10px; border-radius: 8px;
}
.edit-categorie-nom::placeholder { color: rgba(255,255,255,.6); }
.edit-categorie-nom:hover { background: rgba(255,255,255,.2); }
.edit-categorie-nom:focus { background: rgba(255,255,255,.24); border-color: rgba(255,255,255,.6); box-shadow: 0 0 0 2px rgba(255,255,255,.25); outline: none; }
.edit-categorie-points { color: #fff; white-space: nowrap; margin-left: auto; }
.edit-categorie-tools { display: flex; align-items: center; gap: 10px; margin-left: 6px; }
.edit-categorie-arrows { display: flex; gap: 3px; }


/* Cellule notation en édition active (éditeur de configuration). */

/* ── Pastille couleur (input color masqué) ── */
.color-dot { position: relative; width: 26px; height: 26px; border-radius: 50%; flex: none; box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,.18); overflow: hidden; cursor: pointer; }
.color-dot input[type=color] { position: absolute; inset: -4px; width: 150%; height: 150%; border: none; padding: 0; background: none; cursor: pointer; }

/* Ligne « + item » + bouton « + catégorie » hors tableau. */
.edit-additem-cell { padding: 8px; }
.edit-additem { margin: 0; width: 100%; justify-content: center; }
.edit-addcat { align-self: center; width: 100%; margin: 12px auto 0; justify-content: center; }

/* ── Bouton « + Ajouter » ── */
.btn-add {
  align-self: flex-start;
  border: 1.5px dashed #cbd5e1; border-radius: 10px;
  background: #ffffff; color: #475569;
  padding: 8px 14px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.btn-add:hover { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; }
</style>
