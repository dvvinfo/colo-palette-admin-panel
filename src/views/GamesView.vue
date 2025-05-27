<template>
  <AdminLayout
    page-title="Управление играми"
    page-description="Просмотр, редактирование и управление играми казино"
  >
    <template #header-actions>
      <BaseButton variant="primary" class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Добавить игру
      </BaseButton>
    </template>

    <!-- Статистика игр -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </div>
                      <div>
            <p class="text-gray-400 text-xs md:text-sm">Всего игр</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ gamesStore.games.length }}</p>
          </div>
        </div>
      </div>

              <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Активные игры</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ activeGamesCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Средний RTP</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ averageRTP }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">Поиск игр</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по названию игры..."
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none text-sm md:text-base"
            />
            <svg class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">Категория</label>
          <select
            v-model="selectedCategory"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">Все категории</option>
            <option value="slots">Слоты</option>
            <option value="table">Настольные</option>
            <option value="live">Живые дилеры</option>
            <option value="poker">Покер</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">Статус</label>
          <select
            v-model="selectedStatus"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="maintenance">На обслуживании</option>
          </select>
        </div>

        <div class="flex flex-col justify-end w-full sm:w-auto">
          <BaseButton
            @click="clearFilters"
            variant="outline"
            class="h-10 md:h-12 text-sm md:text-base"
            :disabled="!hasActiveFilters"
          >
            Очистить
          </BaseButton>
        </div>
      </div>

      <!-- Результаты фильтрации -->
      <div v-if="hasActiveFilters || games.length > 0" class="mt-4 flex items-center justify-between text-sm">
        <div class="text-gray-400">
          <span v-if="hasActiveFilters">
            Найдено <span class="text-white font-medium">{{ filteredGames.length }}</span>
            из <span class="text-white font-medium">{{ games.length }}</span> игр
          </span>
          <span v-else>
            Всего игр: <span class="text-white font-medium">{{ games.length }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Таблица игр -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
              <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-white">Список игр</h2>
                  <BaseButton
            @click="refreshGames"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Обновить
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading && games.length === 0" class="flex justify-center py-8">
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
          Загрузка игр...
        </div>
      </div>

      <!-- Games Table -->
      <div v-else-if="filteredGames.length > 0" class="overflow-x-auto -mx-4 md:mx-0">
        <div class="min-w-full md:min-w-0 px-4 md:px-0">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/10">
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">ID</th>
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Название</th>
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Шанс</th>
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">RTP</th>
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Статус</th>
                <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Действия</th>
              </tr>
            </thead>
                      <tbody>
            <tr
              v-for="game in filteredGames"
              :key="game.id"
              class="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td class="py-3 md:py-4 px-2 md:px-4 text-white font-mono text-sm whitespace-nowrap">{{ game.id }}</td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-2 md:gap-3">
                  <div class="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center" style="background-color: rgba(255, 48, 64, 0.2);">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </div>
                  <span class="text-white font-medium text-sm md:text-base">{{ game.name }}</span>
                </div>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">{{ game.chance }}%</td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">{{ game.rtp }}%</td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  Активна
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-1 md:gap-2">
                  <BaseButton
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
                    @click="openEditModal(game)"
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
        <div v-if="games.length === 0" class="text-gray-400 mb-4">
          Игры не найдены
        </div>
        <div v-else class="text-gray-400 mb-4">
          По вашему запросу игры не найдены.<br>
          Попробуйте изменить критерии поиска.
        </div>

        <div class="flex gap-3 justify-center">
          <BaseButton
            v-if="games.length === 0"
            @click="refreshGames"
            variant="primary"
          >
            Обновить
          </BaseButton>
          <BaseButton
            v-else
            @click="clearFilters"
            variant="primary"
          >
            Сбросить фильтры
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования игры -->
    <EditGameModal
      :is-open="isEditModalOpen"
      :game="selectedGame"
      @close="closeEditModal"
      @game-updated="onGameUpdated"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import EditGameModal from '@/components/EditGameModal.vue'
import { useGamesStore } from '@/stores/games'
import type { Game } from '@/services/api'
import { storeToRefs } from 'pinia'

const gamesStore = useGamesStore()
const { games, loading } = storeToRefs(gamesStore)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

// Состояние модального окна редактирования
const isEditModalOpen = ref(false)
const selectedGame = ref<Game | null>(null)

// Фильтрованный список игр
const filteredGames = computed(() => {
  let filtered = games.value

  // Поиск по названию
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(game =>
      game.name.toLowerCase().includes(query)
    )
  }

  // Фильтр по категории (пока заглушка, так как в API нет поля category)
  if (selectedCategory.value) {
    // В будущем можно добавить поле category в Game interface
    // filtered = filtered.filter(game => game.category === selectedCategory.value)
  }

  // Фильтр по статусу (пока все игры активные)
  if (selectedStatus.value) {
    // В будущем можно добавить поле status в Game interface
    // filtered = filtered.filter(game => game.status === selectedStatus.value)
  }

  return filtered
})

const activeGamesCount = computed(() => {
  return filteredGames.value.length
})

const averageRTP = computed(() => {
  if (filteredGames.value.length === 0) return 0
  const total = filteredGames.value.reduce((sum, game) => sum + game.rtp, 0)
  return Math.round(total / filteredGames.value.length * 100) / 100
})

// Проверка активных фильтров
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' ||
         selectedCategory.value !== '' ||
         selectedStatus.value !== ''
})

// Функция очистки фильтров
function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
}

async function refreshGames() {
  await gamesStore.fetchGames()
}

function openEditModal(game: Game) {
  selectedGame.value = game
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  selectedGame.value = null
}

async function onGameUpdated(updatedGame: Game) {
  console.log('Игра обновлена:', updatedGame)
  console.log('Текущий список игр в store:', gamesStore.games)
  // Store уже обновил данные через fetchGames()
}

onMounted(() => {
  if (games.value.length === 0) {
    gamesStore.fetchGames()
  }
})
</script>
