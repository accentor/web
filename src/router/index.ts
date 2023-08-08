import { createRouter, createWebHistory } from 'vue-router'
import AppRootView from '@/views/AppRootView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/app',
      component: AppRootView,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
  ]
})

export default router
