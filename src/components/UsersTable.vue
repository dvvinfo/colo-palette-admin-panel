<template>
  <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-white">Пользователи</h2>
        <p class="text-gray-400 text-xs md:text-sm mt-1">
          {{ users.length }} из {{ allUsers.length }} пользователей
          {{ props.searchQuery || props.selectedRole ? '(отфильтровано)' : '' }}
        </p>
      </div>
      <BaseButton
        @click="refreshUsers"
        :disabled="loading"
        variant="primary"
        class="flex items-center gap-1 md:gap-2 text-sm md:text-base px-3 md:px-4 py-2"
      >
        <svg
          v-if="!loading"
          class="w-3.5 h-3.5 md:w-4 md:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <svg v-else class="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Обновить
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading && allUsers.length === 0" class="flex justify-center py-8">
      <div class="flex items-center gap-3 text-gray-400">
        <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Загрузка пользователей...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-400 mb-4">{{ error }}</div>
      <BaseButton
        @click="refreshUsers"
        class="bg-red-500 hover:bg-red-600 text-white"
      >
        Попробовать снова
      </BaseButton>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" class="overflow-x-auto -mx-4 md:mx-0">
      <div class="min-w-full md:min-w-0 px-4 md:px-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10">
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">ID</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Имя пользователя</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Email</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Роль</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Баланс</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Дата регистрации</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td class="py-3 md:py-4 px-2 md:px-4 text-white font-mono text-sm whitespace-nowrap">{{ user.id }}</td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-2 md:gap-3">
                  <div
                    class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                    style="background-color: rgba(255, 48, 64, 0.2);"
                  >
                    <span class="text-primary text-xs md:text-sm font-bold">
                      {{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}
                    </span>
                  </div>
                  <span class="text-white font-medium text-sm md:text-base">{{ user.username || '—' }}</span>
                </div>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">
                {{ user.email || '—' }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getRoleClass(user.role?.name)"
                >
                  {{ user.role?.name || '—' }}
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-white font-mono text-sm md:text-base whitespace-nowrap">
                {{ formatBalance(user.balance) }} ₽
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-1 md:gap-2">
                  <BaseButton
                    @click="viewUser(user)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-blue-400 hover:bg-blue-400/10"
                    title="Просмотр"
                  >
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </BaseButton>
                  <BaseButton
                    @click="openEditModal(user)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-yellow-400 hover:bg-yellow-400/10"
                    title="Редактировать"
                  >
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
            <div class="text-gray-400 mb-4">
        {{ props.searchQuery || props.selectedRole
           ? 'По вашему запросу пользователи не найдены'
           : 'Пользователи не найдены' }}
      </div>
              <BaseButton
          @click="refreshUsers"
          variant="primary"
        >
          Обновить
        </BaseButton>
    </div>

    <!-- Модальное окно редактирования пользователя -->
    <EditUserModal
      :is-open="isEditModalOpen"
      :user="selectedUser"
      @close="closeEditModal"
      @user-updated="onUserUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import EditUserModal from '@/components/modals/EditUserModal.vue'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/services/api'
import { storeToRefs } from 'pinia'

interface Props {
  searchQuery?: string
  selectedRole?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  selectedRole: ''
})

const usersStore = useUsersStore()
const { users: allUsers, loading, error } = storeToRefs(usersStore)

// Состояние модального окна редактирования
const isEditModalOpen = ref(false)
const selectedUser = ref<User | null>(null)

// Фильтрованные пользователи
const users = computed(() => {
  let filtered = allUsers.value

  // Поиск по тексту
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase().trim()
    filtered = filtered.filter(user =>
      user.id.toString().includes(query) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    )
  }

    // Фильтр по роли
  if (props.selectedRole) {
    filtered = filtered.filter(user =>
      user.role?.name?.toLowerCase() === props.selectedRole.toLowerCase()
    )
  }

  return filtered
})

onMounted(() => {
  usersStore.fetchAllUsers()
})

async function refreshUsers() {
  await usersStore.fetchAllUsers()
}

function getRoleClass(roleName?: string): string {
  if (!roleName) return 'bg-gray-500/20 text-gray-400'
  const roleClasses: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400',
    user: 'bg-green-500/20 text-green-400',
  }
  return roleClasses[roleName.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
}



function formatBalance(balance: number): string {
  if (balance === null || balance === undefined) return '—'
  return new Intl.NumberFormat('ru-RU').format(balance)
}

function formatDate(dateString: string): string {
  if (!dateString) return '—'
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  } catch {
    return '—'
  }
}

function viewUser(user: User) {
  // TODO: Открыть модальное окно с подробной информацией о пользователе
  console.log('Просмотр пользователя:', user)
}

function openEditModal(user: User) {
  selectedUser.value = user
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  selectedUser.value = null
}

async function onUserUpdated(updatedUser: User) {
  // Полностью обновляем список пользователей из API
  await refreshUsers()
  console.log('Пользователь обновлен:', updatedUser)
}
</script>
