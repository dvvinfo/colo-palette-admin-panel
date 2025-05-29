<template>
  <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-white">История транзакций</h2>
        <p class="text-gray-400 text-xs md:text-sm mt-1">
          {{ transactions.length }} из {{ allTransactions.length }} транзакций
          {{ hasActiveFilters ? '(отфильтровано)' : '' }}
        </p>
      </div>
      <BaseButton
        @click="refreshTransactions"
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
    <div v-if="loading && allTransactions.length === 0" class="flex justify-center py-8">
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Загрузка транзакций...
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-400 mb-4">{{ error }}</div>
      <BaseButton
        @click="refreshTransactions"
        class="bg-red-500 hover:bg-red-600 text-white"
      >
        Попробовать снова
      </BaseButton>
    </div>

    <!-- Transactions Table -->
    <div v-else-if="transactions.length > 0" class="overflow-x-auto -mx-4 md:mx-0">
      <div class="min-w-full md:min-w-0 px-4 md:px-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10">
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">ID</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Пользователь</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Тип</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Сумма</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Метод</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Статус</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Дата</th>
              <th class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td class="py-3 md:py-4 px-2 md:px-4 text-white font-mono text-sm whitespace-nowrap">
                #{{ transaction.id }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-2 md:gap-3">
                  <div
                    class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                    style="background-color: rgba(255, 48, 64, 0.2);"
                  >
                    <span class="text-primary text-xs md:text-sm font-bold">
                      {{ transaction.user?.username?.charAt(0).toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-white font-medium text-sm md:text-base block">
                      {{ transaction.user?.username || `User #${transaction.user_id}` }}
                    </span>
                    <span class="text-gray-400 text-xs">
                      ID: {{ transaction.user_id }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"
                  :class="getTypeClass(transaction.type)"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="transaction.type === 'deposit'" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    <path v-else-if="transaction.type === 'withdrawal'" d="M10 2L3 9h4v6h6V9h4l-7-7z"/>
                    <path v-else-if="transaction.type === 'bonus'" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    <path v-else d="M10 12a2 2 0 100-4 2 2 0 000 4z M10 2a8 8 0 100 16 8 8 0 000-16z"/>
                  </svg>
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="text-sm md:text-base font-mono font-medium"
                  :class="getAmountClass(transaction.type)"
                >
                  {{ formatAmount(transaction.amount, transaction.type) }} ₽
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">
                {{ transaction.method || '—' }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaction.status)"
                >
                  {{ getStatusLabel(transaction.status) }}
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap">
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-1 md:gap-2">
                  <BaseButton
                    @click="viewTransaction(transaction)"
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
                    v-if="transaction.status === 'pending'"
                    @click="approveTransaction(transaction)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-green-400 hover:bg-green-400/10"
                    title="Одобрить"
                  >
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </BaseButton>
                  <BaseButton
                    v-if="transaction.status === 'pending'"
                    @click="rejectTransaction(transaction)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-red-400 hover:bg-red-400/10"
                    title="Отклонить"
                  >
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
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
        {{ hasActiveFilters
           ? 'По вашему запросу транзакции не найдены'
           : 'Транзакции не найдены' }}
      </div>
      <BaseButton
        @click="refreshTransactions"
        variant="primary"
      >
        Обновить
      </BaseButton>
    </div>

    <!-- Модальное окно просмотра транзакции -->
    <TransactionModal
      :is-open="isTransactionModalOpen"
      :transaction="selectedTransaction"
      @close="closeTransactionModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import TransactionModal from '@/components/modals/TransactionModal.vue'
import { useTransactionsStore } from '@/stores/transactions'
import type { Transaction } from '@/types'
import { storeToRefs } from 'pinia'

interface Props {
  searchQuery?: string
  selectedType?: string
  selectedStatus?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  selectedType: '',
  selectedStatus: ''
})

const transactionsStore = useTransactionsStore()
const { transactions: allTransactions, loading, error } = storeToRefs(transactionsStore)

// Состояние модального окна
const isTransactionModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

// Проверяем наличие активных фильтров
const hasActiveFilters = computed(() =>
  props.searchQuery.trim() !== '' ||
  props.selectedType !== '' ||
  props.selectedStatus !== ''
)

// Фильтрованные транзакции
const transactions = computed(() => {
  let filtered = allTransactions.value

  // Поиск по тексту
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase().trim()
    filtered = filtered.filter(transaction =>
      transaction.id.toString().includes(query) ||
      (transaction.user?.username && transaction.user.username.toLowerCase().includes(query)) ||
      (transaction.user?.email && transaction.user.email.toLowerCase().includes(query)) ||
      transaction.description.toLowerCase().includes(query) ||
      (transaction.method && transaction.method.toLowerCase().includes(query))
    )
  }

  // Фильтр по типу
  if (props.selectedType) {
    filtered = filtered.filter(transaction =>
      transaction.type === props.selectedType
    )
  }

  // Фильтр по статусу
  if (props.selectedStatus) {
    filtered = filtered.filter(transaction =>
      transaction.status === props.selectedStatus
    )
  }

  // Сортируем по дате создания (новые сверху)
  return filtered.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

onMounted(() => {
  transactionsStore.fetchTransactions()
})

async function refreshTransactions() {
  await transactionsStore.fetchTransactions()
}

function getTypeClass(type: Transaction['type']): string {
  const typeClasses: Record<Transaction['type'], string> = {
    deposit: 'bg-green-500/20 text-green-400',
    withdrawal: 'bg-red-500/20 text-red-400',
    bonus: 'bg-yellow-500/20 text-yellow-400',
    game_win: 'bg-blue-500/20 text-blue-400',
    game_loss: 'bg-gray-500/20 text-gray-400',
  }
  return typeClasses[type] || 'bg-gray-500/20 text-gray-400'
}

function getTypeLabel(type: Transaction['type']): string {
  const typeLabels: Record<Transaction['type'], string> = {
    deposit: 'Пополнение',
    withdrawal: 'Вывод',
    bonus: 'Бонус',
    game_win: 'Выигрыш',
    game_loss: 'Проигрыш',
  }
  return typeLabels[type] || type
}

function getStatusClass(status: Transaction['status']): string {
  const statusClasses: Record<Transaction['status'], string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }
  return statusClasses[status] || 'bg-gray-500/20 text-gray-400'
}

function getStatusLabel(status: Transaction['status']): string {
  const statusLabels: Record<Transaction['status'], string> = {
    pending: 'В ожидании',
    completed: 'Завершено',
    failed: 'Отклонено',
    cancelled: 'Отменено',
  }
  return statusLabels[status] || status
}

function getAmountClass(type: Transaction['type']): string {
  if (type === 'deposit' || type === 'bonus' || type === 'game_win') {
    return 'text-green-400'
  } else if (type === 'withdrawal' || type === 'game_loss') {
    return 'text-red-400'
  }
  return 'text-white'
}

function formatAmount(amount: number, type: Transaction['type']): string {
  const formattedAmount = new Intl.NumberFormat('ru-RU').format(Math.abs(amount))
  if (type === 'withdrawal' || type === 'game_loss') {
    return `-${formattedAmount}`
  } else if (type === 'deposit' || type === 'bonus' || type === 'game_win') {
    return `+${formattedAmount}`
  }
  return formattedAmount
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

function viewTransaction(transaction: Transaction) {
  selectedTransaction.value = transaction
  isTransactionModalOpen.value = true
}

function closeTransactionModal() {
  isTransactionModalOpen.value = false
  selectedTransaction.value = null
}

async function approveTransaction(transaction: Transaction) {
  const success = await transactionsStore.updateTransactionStatus(transaction.id, 'completed')
  if (success) {
    console.log('Транзакция одобрена:', transaction.id)
  }
}

async function rejectTransaction(transaction: Transaction) {
  const success = await transactionsStore.updateTransactionStatus(transaction.id, 'failed')
  if (success) {
    console.log('Транзакция отклонена:', transaction.id)
  }
}
</script>
