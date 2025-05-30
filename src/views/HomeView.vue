<template>
  <AdminLayout
    :page-title="$t('pages.dashboard.title')"
    :page-description="$t('pages.dashboard.description')"
  >
    <template #header-actions>
      <BaseButton
        @click="openAddUserModal"
        variant="primary"
        class="flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span class="hidden md:inline">{{ $t('users.add') }}</span>
      </BaseButton>
    </template>
    <!-- Статистические карточки -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('dashboard.totalUsers') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ usersStore.users.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('dashboard.totalBalance') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ formatTotalBalance }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('dashboard.activeGames') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ gamesStore.games.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('dashboard.onlineToday') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ activeUsersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица пользователей -->
    <UsersTable />

    <!-- Модальное окно добавления пользователя -->
    <AddUserModal
      :is-open="isAddUserModalOpen"
      @close="closeAddUserModal"
      @user-added="onUserAdded"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import UsersTable from '@/components/UsersTable.vue'
import BaseButton from '@/components/BaseButton.vue'
import AddUserModal from '@/components/modals/AddUserModal.vue'
import { useUsersStore } from '@/stores/users'
import { useGamesStore } from '@/stores/games'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const gamesStore = useGamesStore()
const { users } = storeToRefs(usersStore)
const { games } = storeToRefs(gamesStore)

// Управление модальным окном
const isAddUserModalOpen = ref(false)

// Вычисляемые свойства для статистики
const formatTotalBalance = computed(() => {
  const total = users.value.reduce((sum, user) => sum + (user.balance || 0), 0)
  return new Intl.NumberFormat('ru-RU').format(total) + ' ₽'
})

const activeUsersCount = computed(() => {
  // Здесь можно добавить логику для подсчета активных пользователей
  // Пока просто показываем случайное число для демонстрации
  return Math.floor(Math.random() * 50) + 10
})

// Функции для управления модальным окном
function openAddUserModal() {
  isAddUserModalOpen.value = true
}

function closeAddUserModal() {
  isAddUserModalOpen.value = false
}

function onUserAdded() {
  console.log('Пользователь успешно добавлен!')
}

onMounted(() => {
  // Загружаем данные при монтировании компонента
  if (users.value.length === 0) {
    usersStore.fetchAllUsers()
  }
  if (games.value.length === 0) {
    gamesStore.fetchGames()
  }
})
</script>
