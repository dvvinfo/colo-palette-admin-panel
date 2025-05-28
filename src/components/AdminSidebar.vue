<template>
  <aside
    class="bg-card-bg h-screen w-64 fixed left-0 top-0 z-50 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out"
    :class="{
      'lg:translate-x-0': true,
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
      'translate-x-0': isMobileOpen,
    }"
  >
    <!-- Логотип -->
    <div class="p-4 md:p-6 border-b border-white/10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-white font-bold text-lg">Админ Панель</h1>
            <p class="text-gray-400 text-sm">Казино</p>
          </div>
        </div>

        <!-- Кнопка закрытия для мобильных -->
        <button
          @click="$emit('closeMobile')"
          class="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Навигационное меню -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0"
              />
            </svg>
            <span>Дашборд</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/users"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/users' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span>Пользователи</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/games"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/games' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span>Игры</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/transactions"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/transactions' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Транзакции</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/bonuses"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/bonuses' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span>Бонусы</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/analytics"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/analytics' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Аналитика</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/settings"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': $route.path === '/settings' }"
            @click="$emit('closeMobile')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Настройки</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Профиль пользователя внизу -->
    <div class="p-4 border-t border-white/10">
      <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center"
          style="background-color: rgba(255, 48, 64, 0.2)"
        >
          <span class="text-primary text-sm font-bold">
            {{ authStore.user.username ? authStore.user.username.charAt(0).toUpperCase() : 'A' }}
          </span>
        </div>
        <div class="flex-1">
          <div class="text-white text-sm font-medium">{{ authStore.user.username || 'Admin' }}</div>
          <div class="text-gray-400 text-xs">
            {{ authStore.user.role?.name || 'Администратор' }}
          </div>
        </div>
        <BaseButton
          @click="handleLogout"
          variant="ghost"
          size="sm"
          class="!p-2 text-gray-400 hover:text-red-400"
          title="Выйти"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </BaseButton>
      </div>
      <div v-else class="text-center">
        <router-link to="/login" class="text-primary hover:text-primary/80 text-sm">
          Войти в систему
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

interface Props {
  isMobileOpen?: boolean
}

defineProps<Props>()
defineEmits<{
  closeMobile: []
}>()

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors;
}

.sidebar-item-active {
  @apply text-primary border-r-2 border-primary;
  background-color: rgba(255, 48, 64, 0.2);
}
</style>
