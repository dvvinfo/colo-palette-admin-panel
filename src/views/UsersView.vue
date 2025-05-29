<template>
  <AdminLayout
    page-title="Управление пользователями"
    page-description="Просмотр, редактирование и управление пользователями системы"
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
        <span class="hidden md:inline">Добавить пользователя</span>
      </BaseButton>
    </template>

    <!-- Фильтры и поиск -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">Поиск пользователей</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по имени, email или ID..."
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none text-sm md:text-base"
              @input="onSearchInput"
            />
            <svg class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">Фильтр по роли</label>
          <select
            v-model="selectedRole"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">Все роли</option>
            <option value="admin">Администратор</option>
            <option value="user">Пользователь</option>
          </select>
        </div>

        <!-- Кнопка очистки фильтров -->
        <!-- <div class="flex items-end">
          <BaseButton
            @click="clearFilters"
            variant="outline"
            size="sm"
            :disabled="!hasActiveFilters"
            title="Очистить фильтры"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </BaseButton>
        </div> -->
      </div>
    </div>

    <!-- Таблица пользователей -->
    <UsersTable
      :search-query="searchQuery"
      :selected-role="selectedRole"
    />

    <!-- Модальное окно добавления пользователя -->
    <AddUserModal
      :is-open="isAddUserModalOpen"
      @close="closeAddUserModal"
      @user-added="onUserAdded"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import UsersTable from '@/components/UsersTable.vue'
import BaseButton from '@/components/BaseButton.vue'
import AddUserModal from '@/components/modals/AddUserModal.vue'

const searchQuery = ref('')
const selectedRole = ref('')
const isAddUserModalOpen = ref(false)

// Проверяем, активны ли фильтры
// const hasActiveFilters = computed(() =>
//   searchQuery.value.trim() !== '' ||
//   selectedRole.value !== ''
// )

// // Функция очистки фильтров
// function clearFilters() {
//   searchQuery.value = ''
//   selectedRole.value = ''
// }

// Функции для управления модальным окном
function openAddUserModal() {
  isAddUserModalOpen.value = true
}

function closeAddUserModal() {
  isAddUserModalOpen.value = false
}

function onUserAdded() {
  // Здесь можно добавить дополнительную логику после добавления пользователя
  console.log('Пользователь успешно добавлен!')
}

// Debounce для поиска (необязательно, но улучшает производительность)
let searchTimeout: number | null = null
function onSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  // Небольшая задержка для избежания избыточных вычислений при быстрой печати
  searchTimeout = setTimeout(() => {
    // Здесь можно добавить дополнительную логику при необходимости
  }, 300)
}
</script>
