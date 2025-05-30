<template>
  <AdminLayout
    :page-title="$t('pages.bonuses.title')"
    :page-description="$t('pages.bonuses.description')"
  >
    <template #header-actions>
      <BaseButton
        @click="openCreateBonusModal"
        variant="primary"
        class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2"
      >
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span class="hidden md:inline">{{ $t('bonuses.createBonus') }}</span>
      </BaseButton>
    </template>

    <!-- Статистика бонусов -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('bonuses.activeBonuses') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ bonusesStore.totalActiveBonuses }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('bonuses.participants') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ bonusesStore.formatAmount(bonusesStore.totalParticipants) }}</p>
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
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('bonuses.bonusesIssued') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ bonusesStore.formatAmount(bonusesStore.totalBonusAmount) }} ₽</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('bonuses.conversion') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ bonusesStore.conversionRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.searchBonuses') }}</label>
          <BaseInput
            v-model="searchQuery"
            type="text"
            :placeholder="$t('bonuses.searchPlaceholder')"
          />
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.bonusType') }}</label>
          <select
            v-model="selectedType"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">{{ $t('bonuses.allTypes') }}</option>
            <option value="welcome">{{ $t('bonuses.welcome') }}</option>
            <option value="reload">{{ $t('bonuses.reload') }}</option>
            <option value="cashback">{{ $t('bonuses.cashback') }}</option>
            <option value="loyalty">{{ $t('bonuses.loyalty') }}</option>
            <option value="promocode">{{ $t('bonuses.promocode') }}</option>
            <option value="freespins">{{ $t('bonuses.freespins') }}</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('common.status') }}</label>
          <select
            v-model="selectedStatus"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">{{ $t('bonuses.allStatuses') }}</option>
            <option value="active">{{ $t('bonuses.active') }}</option>
            <option value="scheduled">{{ $t('bonuses.scheduled') }}</option>
            <option value="ended">{{ $t('bonuses.ended') }}</option>
            <option value="paused">{{ $t('bonuses.paused') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблица бонусов -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">{{ $t('bonuses.bonusList') }}</h2>
        <div class="flex items-center gap-3">
          <BaseButton
            variant="outline"
            size="sm"
            @click="refreshBonuses"
            :disabled="bonusesStore.isLoading"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </BaseButton>
        </div>
      </div>

      <!-- Таблица -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('common.name') }}</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('bonuses.type') }}</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('bonuses.reward') }}</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('common.status') }}</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('bonuses.participants') }}</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">{{ $t('common.date') }}</th>
              <th class="text-right py-3 px-4 text-gray-400 font-medium">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bonus in filteredBonuses"
              :key="bonus.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <!-- Название и описание -->
              <td class="py-4 px-4">
                <div>
                  <h4 class="text-white font-medium mb-1">{{ bonus.title }}</h4>
                  <p class="text-gray-400 text-sm">{{ bonus.description }}</p>
                  <div v-if="bonus.promocode" class="mt-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300">
                      {{ bonus.promocode }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Тип -->
              <td class="py-4 px-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="bonusesStore.getBonusTypeClass(bonus.type)"
                >
                  {{ bonusesStore.getBonusTypeLabel(bonus.type) }}
                </span>
              </td>

              <!-- Награда -->
              <td class="py-4 px-4">
                <div class="text-white font-medium">
                  <template v-if="bonus.bonusType === 'percentage'">
                    {{ bonus.bonusValue }}%
                    <span v-if="bonus.maxBonus" class="text-gray-400 text-sm">
                      ({{ $t('bonuses.max') }} {{ formatCurrency(bonus.maxBonus) }})
                    </span>
                  </template>
                  <template v-else-if="bonus.bonusType === 'fixed'">
                    {{ formatCurrency(bonus.bonusValue) }}
                  </template>
                  <template v-else-if="bonus.bonusType === 'freespins'">
                    {{ bonus.freeSpinsCount }} {{ $t('bonuses.freespinsCount') }}
                  </template>
                </div>
                <div class="text-gray-400 text-sm">
                  {{ $t('bonuses.wagering') }}: {{ bonus.wagerRequirement }}x
                </div>
              </td>

              <!-- Статус -->
              <td class="py-4 px-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="bonusesStore.getBonusStatusClass(bonus.status)"
                >
                  {{ bonusesStore.getBonusStatusLabel(bonus.status) }}
                </span>
              </td>

              <!-- Участники -->
              <td class="py-4 px-4">
                <div class="text-white font-medium">{{ bonus.totalParticipants }}</div>
                <div v-if="bonus.maxUses" class="text-gray-400 text-sm">
                  {{ bonus.currentUses }}/{{ bonus.maxUses }}
                </div>
                <div v-if="bonus.totalAmount > 0" class="text-gray-400 text-sm">
                  {{ formatCurrency(bonus.totalAmount) }}
                </div>
              </td>

              <!-- Дата -->
              <td class="py-4 px-4">
                <div class="text-white text-sm">{{ formatDate(bonus.startDate) }}</div>
                <div v-if="bonus.endDate" class="text-gray-400 text-sm">
                  {{ $t('bonuses.until') }} {{ formatDate(bonus.endDate) }}
                </div>
              </td>

              <!-- Действия -->
              <td class="py-4 px-4">
                <div class="flex items-center justify-end gap-2">
                  <!-- Переключатель статуса -->
                  <BaseButton
                    @click="toggleBonusStatus(bonus)"
                    variant="ghost"
                    size="sm"
                    :title="bonus.status === 'active' ? $t('bonuses.pause') : $t('bonuses.activate')"
                    :class="bonus.status === 'active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'"
                  >
                    <svg v-if="bonus.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/>
                    </svg>
                  </BaseButton>

                  <!-- Редактировать -->
                  <BaseButton
                    @click="editBonus(bonus)"
                    variant="ghost"
                    size="sm"
                    :title="$t('common.edit')"
                    class="text-blue-400 hover:text-blue-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </BaseButton>

                  <!-- Удалить -->
                  <BaseButton
                    @click="deleteBonus(bonus)"
                    variant="ghost"
                    size="sm"
                    :title="$t('common.delete')"
                    class="text-red-400 hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Сообщение о пустом списке -->
        <div v-if="filteredBonuses.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-600/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
          </div>
          <p class="text-gray-400">
            {{ searchQuery || selectedType || selectedStatus ? $t('bonuses.noBonusesFound') : $t('bonuses.noBonuses') }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Модальное окно создания бонуса -->
  <CreateBonusModal
    :is-open="isCreateBonusModalOpen"
    @close="closeCreateBonusModal"
    @bonus-created="onBonusCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CreateBonusModal from '@/components/modals/CreateBonusModal.vue'
import { useBonusesStore, type Bonus } from '@/stores/bonuses'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/BaseInput.vue'

const { t } = useI18n()
const bonusesStore = useBonusesStore()

// Фильтры
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

// Модальное окно
const isCreateBonusModalOpen = ref(false)

// Отфильтрованные бонусы
const filteredBonuses = computed(() => {
  let filtered = bonusesStore.bonuses

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(bonus =>
      bonus.title.toLowerCase().includes(query) ||
      bonus.description.toLowerCase().includes(query) ||
      (bonus.promocode && bonus.promocode.toLowerCase().includes(query))
    )
  }

  // Фильтр по типу
  if (selectedType.value) {
    filtered = filtered.filter(bonus => bonus.type === selectedType.value)
  }

  // Фильтр по статусу
  if (selectedStatus.value) {
    filtered = filtered.filter(bonus => bonus.status === selectedStatus.value)
  }

  return filtered
})

// Методы модального окна
function openCreateBonusModal() {
  isCreateBonusModalOpen.value = true
}

function closeCreateBonusModal() {
  isCreateBonusModalOpen.value = false
}

function onBonusCreated() {
  closeCreateBonusModal()
}

// Методы управления бонусами
async function toggleBonusStatus(bonus: Bonus) {
  await bonusesStore.toggleBonusStatus(bonus.id)
}

function editBonus(bonus: Bonus) {
  // TODO: Открыть модальное окно редактирования
  console.log('Edit bonus:', bonus)
}

async function deleteBonus(bonus: Bonus) {
  if (confirm(t('bonuses.confirmDelete', { title: bonus.title }))) {
    await bonusesStore.deleteBonus(bonus.id)
  }
}

function refreshBonuses() {
  // TODO: Обновить данные с сервера
  console.log('Refresh bonuses')
}

// Вспомогательные функции
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
