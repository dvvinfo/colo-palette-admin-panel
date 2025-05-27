import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/views/GamesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bonuses',
      name: 'bonuses',
      component: () => import('@/views/BonusesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/AnalyticsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/UserProfile.vue'),
      meta: { requiresAuth: true }
    },
    {
      // Перенаправление с любого неизвестного маршрута на логин
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

// Глобальная защита роутов
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Если маршрут требует аутентификации
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      next() // Пользователь авторизован, разрешаем переход
    } else {
      next('/login') // Пользователь не авторизован, перенаправляем на логин
    }
  } else {
    // Если пользователь уже авторизован и пытается попасть на страницу логина
    if (to.name === 'login' && authStore.isAuthenticated) {
      next('/') // Перенаправляем на главную страницу
    } else {
      next() // Разрешаем переход
    }
  }
})

export default router
