<template>
  <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-white">
          {{ $t('transactions.transactionHistory') }}
        </h2>
        <p class="text-gray-400 text-xs md:text-sm mt-1">
          {{ transactions.length }} {{ $t('common.of') }} {{ (allTransactions || []).length }}
          {{ $t('nav.transactions').toLowerCase() }}
          {{ hasActiveFilters ? `(${$t('common.filtered')})` : '' }}
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ $t('common.refresh') }}
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading && (allTransactions || []).length === 0" class="flex justify-center py-8">
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ $t('transactions.loadingTransactions') }}
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-400 mb-4">{{ error }}</div>
      <BaseButton @click="refreshTransactions" class="bg-red-500 hover:bg-red-600 text-white">
        {{ $t('common.tryAgain') }}
      </BaseButton>
    </div>

    <!-- Transactions Table -->
    <div v-else-if="transactions.length > 0" class="overflow-x-auto -mx-4 md:mx-0">
      <div class="min-w-full md:min-w-0 px-4 md:px-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10">
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                ID
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.user') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.currency') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.amount') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.rate') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.status') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('transactions.date') }}
              </th>
              <th
                class="py-3 md:py-4 px-2 md:px-4 text-gray-400 font-medium text-sm whitespace-nowrap"
              >
                {{ $t('common.actions') }}
              </th>
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
                    style="background-color: rgba(255, 48, 64, 0.2)"
                  >
                    <span class="text-primary text-xs md:text-sm font-bold">
                      {{ transaction.user?.username?.charAt(0).toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-white font-medium text-sm md:text-base block">
                      {{ transaction.user?.username || `User #${transaction.user_id}` }}
                    </span>
                    <span class="text-gray-400 text-xs"> ID: {{ transaction.user_id }} </span>
                  </div>
                </div>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"
                  :class="getCurrencyClass(transaction.currency)"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      v-if="transaction.currency === 'btc'"
                      d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.293 13.293A8.009 8.009 0 0110 18a8.009 8.009 0 01-5.293-4.707L10 8l5.293 5.293z"
                    />
                    <path
                      v-else-if="transaction.currency === 'eth'"
                      d="M10 0L4 10l6 4 6-4L10 0zm0 14.5L4.5 10.5 10 20l5.5-9.5L10 14.5z"
                    />
                    <path
                      v-else-if="transaction.currency === 'usdt'"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                    />
                    <path
                      v-else
                      d="M8.5 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-1zm0 5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-6z"
                    />
                  </svg>
                  {{ transaction.currency.toUpperCase() }}
                </span>
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="text-sm">
                  <div class="text-white font-mono">
                    {{ formatCryptoAmount(transaction.amount_raw) }}
                    {{ transaction.currency.toUpperCase() }}
                  </div>
                  <div class="text-gray-400 text-xs">
                    ≈ {{ formatRubAmount(transaction.amount_rub) }} ₽
                  </div>
                </div>
              </td>
              <td
                class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap"
              >
                {{ transaction.rate > 0 ? formatRate(transaction.rate) : '—' }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaction.status)"
                >
                  {{ getStatusLabel(transaction.status) }}
                </span>
              </td>
              <td
                class="py-3 md:py-4 px-2 md:px-4 text-gray-300 text-sm md:text-base whitespace-nowrap"
              >
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="py-3 md:py-4 px-2 md:px-4 whitespace-nowrap">
                <div class="flex items-center gap-1 md:gap-2">
                  <BaseButton
                    @click="viewTransaction(transaction)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-blue-400 hover:bg-blue-400/10"
                    :title="$t('common.view')"
                  >
                    <svg
                      class="w-3.5 h-3.5 md:w-4 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    v-if="transaction.status === 'pending' || transaction.status === 'progress'"
                    @click="approveTransaction(transaction)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-green-400 hover:bg-green-400/10"
                    :title="$t('transactions.approve')"
                  >
                    <svg
                      class="w-3.5 h-3.5 md:w-4 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </BaseButton>
                  <BaseButton
                    v-if="transaction.status === 'pending' || transaction.status === 'progress'"
                    @click="rejectTransaction(transaction)"
                    variant="ghost"
                    size="sm"
                    class="!p-1.5 md:!p-2 text-red-400 hover:bg-red-400/10"
                    :title="$t('transactions.reject')"
                  >
                    <svg
                      class="w-3.5 h-3.5 md:w-4 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
        {{
          hasActiveFilters
            ? $t('transactions.noTransactionsFound')
            : $t('transactions.noTransactions')
        }}
      </div>
      <!-- <BaseButton
        @click="refreshTransactions"
        variant="primary"
      >
        {{ $t('common.refresh') }}
      </BaseButton> -->
    </div>

    <!-- Пагинация -->
    <div v-if="totalPages > 1" class="flex items-center justify-center mt-6 gap-2">
      <BaseButton
        @click="emit('page-change', props.currentPage - 1)"
        :disabled="props.currentPage <= 1"
        variant="ghost"
        size="sm"
        class="!p-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </BaseButton>

      <div class="flex items-center gap-1">
        <template v-for="page in paginationPages" :key="page">
          <BaseButton
            v-if="page !== '...'"
            @click="page !== '...' && emit('page-change', page as number)"
            :variant="page === props.currentPage ? 'primary' : 'ghost'"
            size="sm"
            class="!px-3 !py-2 min-w-[40px]"
          >
            {{ page }}
          </BaseButton>
          <span v-else class="text-gray-400 px-2">...</span>
        </template>
      </div>

      <BaseButton
        @click="emit('page-change', props.currentPage + 1)"
        :disabled="props.currentPage >= totalPages"
        variant="ghost"
        size="sm"
        class="!p-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
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
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import TransactionModal from '@/components/modals/TransactionModal.vue'
import { useTransactionsStore } from '@/stores/transactions'
import type { Transaction, TransactionFilters } from '@/types'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  searchQuery?: string
  selectedType?: string
  selectedStatus?: string
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  selectedType: '',
  selectedStatus: '',
  currentPage: 1,
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const transactionsStore = useTransactionsStore()
const { transactions: allTransactions, loading, error, totalPages } = storeToRefs(transactionsStore)

// Состояние модального окна
const isTransactionModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

// Проверяем наличие активных фильтров
const hasActiveFilters = computed(
  () => props.searchQuery.trim() !== '' || props.selectedType !== '' || props.selectedStatus !== '',
)

// Фильтрованные транзакции - теперь используем данные напрямую из store
const transactions = computed(() => {
  // Просто возвращаем данные из store без дополнительной фильтрации
  // Фильтрация теперь происходит на сервере/в store

  // Проверяем что allTransactions.value является массивом
  if (!Array.isArray(allTransactions.value)) {
    return []
  }

  const sorted = [...allTransactions.value]
  return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Пагинация - вычисляем страницы для отображения
const paginationPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    // Показываем все страницы если их мало
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Показываем первую страницу
    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    // Показываем страницы вокруг текущей
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }

    if (current < total - 3) {
      pages.push('...')
    }

    // Показываем последнюю страницу
    if (total > 1) {
      pages.push(total)
    }
  }

  return pages
})

async function refreshTransactions() {
  await transactionsStore.fetchTransactions({
    page: props.currentPage,
    query: props.searchQuery,
    status: props.selectedStatus as TransactionFilters['status'],
    type: props.selectedType as TransactionFilters['type'],
  })
}

function getCurrencyClass(currency: string): string {
  const currencyClasses: Record<string, string> = {
    btc: 'bg-orange-500/20 text-orange-400',
    eth: 'bg-blue-500/20 text-blue-400',
    usdt: 'bg-green-500/20 text-green-400',
    rub: 'bg-gray-500/20 text-gray-400',
  }
  return currencyClasses[currency] || 'bg-gray-500/20 text-gray-400'
}

function getStatusClass(status: Transaction['status']): string {
  const statusClasses: Record<Transaction['status'], string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    progress: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    success: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    rejected: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  }
  return statusClasses[status] || 'bg-gray-500/20 text-gray-400'
}

function getStatusLabel(status: Transaction['status']): string {
  const statusLabels: Record<Transaction['status'], string> = {
    pending: t('transactions.pending'),
    progress: t('transactions.progress'),
    completed: t('transactions.completed'),
    success: t('transactions.success'),
    failed: t('transactions.failed'),
    rejected: t('transactions.rejected'),
    cancelled: t('transactions.cancelled'),
  }
  return statusLabels[status] || status
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
  const success = await transactionsStore.updateTransactionStatus(transaction.id, 'success')
  if (success) {
    console.log('Транзакция одобрена:', transaction.id)
  }
}

async function rejectTransaction(transaction: Transaction) {
  const success = await transactionsStore.updateTransactionStatus(transaction.id, 'rejected')
  if (success) {
    console.log('Транзакция отклонена:', transaction.id)
  }
}

function formatCryptoAmount(amount: number): string {
  return amount.toFixed(8).replace(/\.?0+$/, '')
}

function formatRubAmount(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(amount))
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat('ru-RU').format(rate) + ' ₽'
}
</script>
