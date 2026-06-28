import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router/index.js'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Enregistrement du service worker (PWA installable + offline).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((err) => console.warn('SW non enregistré :', err))
  })
}
