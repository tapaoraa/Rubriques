import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EvalView from '../views/EvalView.vue'
import EditView from '../views/EditView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home', component: HomeView },
    { path: '/eval/:id',   name: 'eval', component: EvalView },
    { path: '/edit/:id',   name: 'edit', component: EditView },
  ],
})
