<template>
  <div class="banner-wrap">
    <!-- Bandeau élève -->
    <div class="eleve-banner">
      <div class="banner-nav">
        <button class="nav-btn" :disabled="selectedIdx <= 0" @click="$emit('prev')">&#8249;</button>
        <div class="banner-name" v-html="eleveDisplay(eleve)" />
        <button class="nav-btn" :disabled="selectedIdx >= ev.elevesList.length - 1" @click="$emit('next')">&#8250;</button>
      </div>

      <!-- Bouton conseils -->
      <button
        class="banner-side-btn"
        :class="{ active: showConseils, 'has-conseils': !!eleve?.conseils?.trim() }"
        title="Conseils"
        @click="showConseils = !showConseils"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <g class="conseils-dots" fill="currentColor" stroke="none">
            <circle cx="8" cy="10" r="1.1"/><circle cx="12" cy="10" r="1.1"/><circle cx="16" cy="10" r="1.1"/>
          </g>
        </svg>
      </button>

      <div class="banner-spacer" />

      <!-- Total / état -->
      <div
        class="banner-total"
        :class="{ state: isState }"
        title="Changer l'état (Total, Absent, Dispensé…)"
        @click="$emit('cycleState')"
      >
        <span class="banner-total-check" :class="{ show: !isState && isEleveDone(eleve, ev.gradeData) }">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <div class="banner-total-inner">
          <span class="banner-total-label">Total</span>
          <span class="banner-total-score" :style="scoreStyle">{{ scoreText }}</span>
          <span class="banner-total-max">/ {{ max }} pts</span>
        </div>
      </div>

      <!-- Imprimer -->
      <button class="banner-side-btn" title="Imprimer en PDF" @click="$emit('print')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
      </button>
    </div>

    <!-- Conseils (par élève) -->
    <div v-if="showConseils" class="conseils">
      <textarea
        rows="2"
        placeholder="Conseils…"
        :value="eleve?.conseils || ''"
        @input="$emit('conseils', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { eleveDisplay, studentTotal, gradeMax, EVAL_STATES, isEleveDone, isGrilleEmpty } from '../../stores/store.js'

const props = defineProps({
  ev: { type: Object, required: true },
  selectedIdx: { type: Number, default: null },
})
defineEmits(['prev', 'next', 'cycleState', 'print', 'conseils'])

const showConseils = ref(false)

const eleve = computed(() => props.ev.elevesList?.[props.selectedIdx] ?? null)
const evalStateKey = computed(() => eleve.value?.evalState || 'total')
const isState = computed(() => evalStateKey.value !== 'total')
const stateObj = computed(() => EVAL_STATES.find(s => s.key === evalStateKey.value) || EVAL_STATES[0])
const total = computed(() => eleve.value ? studentTotal(eleve.value, props.ev.gradeData) : 0)
const max = computed(() => gradeMax(props.ev.gradeData))
// Grille vide (aucun item actif) : on affiche un trait plutôt qu'un zéro.
const isEmpty = computed(() => !eleve.value || isGrilleEmpty(eleve.value.scores || {}, props.ev.gradeData))

// Affichage : libellé de l'état (Absent…) ou score total.
const scoreText = computed(() => isState.value ? stateObj.value.label : (isEmpty.value ? '–' : total.value))
// Mode « état » : pastille colorée (fond ~10 %, bordure ~33 %) — cf. grille-v2.
const scoreStyle = computed(() => {
  if (!isState.value) return {}
  const c = stateObj.value.color || ''
  return c ? { color: c, background: c + '1a', borderColor: c + '55' } : {}
})

watch(() => props.selectedIdx, () => { showConseils.value = false })
</script>

<style>
.banner-wrap { flex: none; padding: 0 1rem; }

.eleve-banner {
  flex: none;
  display: flex; align-items: stretch;
  width: 100%;
  margin: 10px 0 ;
  background: #ffffff;
  border: 1px solid #e2e8f0; border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.05);
  z-index: 20;
}
.banner-nav { display: flex; align-items: center; gap: 4px; min-width: 0; padding: 4px 8px; width: 340px; flex: none; }
.nav-btn {
  width: 40px; height: 40px; flex: none;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 8px;
  background: none; color: #475569; font-size: 28px; line-height: 1;
  cursor: pointer;
}
.nav-btn:disabled { opacity: .3; }
.banner-name { flex: 1; min-width: 0; text-align: center; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.banner-name strong { font-weight: 750; }

.banner-side-btn {
  width: 52px; flex: none;
  border: none; border-left: 1px solid #cbd5e1;
  background: #ffffff; color: #94a3b8;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.banner-side-btn.active { background: #eef2ff; color: #4f46e5; }

.conseils-dots { display: none; }
.banner-side-btn.has-conseils .conseils-dots { display: inline; }

.banner-spacer { flex: 1; min-width: 0; border-left: 1px solid #cbd5e1; }

.banner-total {
  flex: none; width: auto; position: relative;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border-left: 1px solid #cbd5e1;
  padding: 6px 22px;
  cursor: pointer; user-select: none; -webkit-user-select: none;
  transition: background .12s;
}
.banner-total:active { background: #f8fafc; }
/* État spécial (Absent, Dispensé…) : seul le libellé d'état s'affiche. */
.banner-total.state .banner-total-label,
.banner-total.state .banner-total-max,
.banner-total.state .banner-total-check { display: none; }
.banner-total.state .banner-total-score { font-size: 16px; font-weight: 600; padding: 7px 16px; border-radius: 999px; border: 1px solid transparent; }
.banner-total-inner { display: flex; align-items: baseline; gap: 6px; }
.banner-total-label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; font-weight: 700; }
.banner-total-score { font-size: 26px; font-weight: 800; color: #0f172a; }
.banner-total-max { font-size: 13px; color: #94a3b8; }
/* Témoin ✓ : hors flux tant que la grille n'est pas complète. */
.banner-total-check {
  display: none; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: #16a34a; color: #fff;
  transition: opacity .2s, transform .2s;
}
.banner-total-check.show { display: inline-flex; opacity: 1; transform: scale(1); }

/* ── Conseils ── */
.conseils {
  flex: none; width: 100%;
  margin: -10px auto 10px; padding: 10px;
  background: #ffffff; border: 1px solid #e2e8f0; border-top: none;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.05);
}
.conseils textarea {
  display: block; width: 100%;
  border: 1px solid #cbd5e1; border-radius: 0;
  padding: 10px 12px; font: inherit; font-size: 15px; resize: none; line-height: 1.45;
  color: #0f172a;
}
.conseils textarea:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px #eef2ff; }
</style>
