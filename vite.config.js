import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Nom du dépôt GitHub : sert l'app sous https://<user>.github.io/Rubriques/
  // Si tu renommes le repo, change uniquement cette ligne.
  base: '/Rubriques/',
  plugins: [vue()],
})
