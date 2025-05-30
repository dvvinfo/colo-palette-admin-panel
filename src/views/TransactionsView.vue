<template>
  <AdminLayout
    :page-title="$t('pages.transactions.title')"
    :page-description="$t('pages.transactions.description')"
  >
    <template #header-actions>
      <BaseButton variant="primary" class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2">
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="hidden md:inline">{{ $t('transactions.exportReport') }}</span>
      </BaseButton>
    </template>

    <!-- Статистика транзакций -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('transactions.deposits') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ statistics.deposits.count }}</p>
            <p class="text-green-400 text-xs font-medium">
              {{ formatAmount(statistics.deposits.amount) }} ₽
            </p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('transactions.withdrawals') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ statistics.withdrawals.count }}</p>
            <p class="text-red-400 text-xs font-medium">
              {{ formatAmount(statistics.withdrawals.amount) }} ₽
            </p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('transactions.totalTurnover') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">
              {{ formatAmount(statistics.totalTurnover) }} ₽
            </p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('transactions.pendingTransactions') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ statistics.pending.count }}</p>
            <p class="text-yellow-400 text-xs font-medium">
              {{ formatAmount(statistics.pending.amount) }} ₽
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('transactions.searchTransactions') }}</label>
          <div class="relative">
            <BaseInput
              v-model="searchQuery"
              type="text"
              :placeholder="$t('transactions.searchPlaceholder')"
            />
            <svg class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('transactions.type') }}</label>
          <select
            v-model="selectedType"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">{{ $t('transactions.allTypes') }}</option>
            <option value="deposit">{{ $t('transactions.deposit') }}</option>
            <option value="withdrawal">{{ $t('transactions.withdrawal') }}</option>
            <option value="bonus">{{ $t('transactions.bonus') }}</option>
            <option value="game_win">{{ $t('transactions.gameWin') }}</option>
            <option value="game_loss">{{ $t('transactions.gameLoss') }}</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('common.status') }}</label>
          <select
            v-model="selectedStatus"
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
          >
            <option value="">{{ $t('transactions.allStatuses') }}</option>
            <option value="completed">{{ $t('transactions.completed') }}</option>
            <option value="pending">{{ $t('transactions.pending') }}</option>
            <option value="failed">{{ $t('transactions.failed') }}</option>
            <option value="cancelled">{{ $t('transactions.cancelled') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблица транзакций -->
    <TransactionsTable
      :search-query="searchQuery"
      :selected-type="selectedType"
      :selected-status="selectedStatus"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import TransactionsTable from '@/components/TransactionsTable.vue'
import { useTransactionsStore } from '@/stores/transactions'
import BaseInput from '@/components/BaseInput.vue'

const transactionsStore = useTransactionsStore()
const { statistics } = storeToRefs(transactionsStore)

// Фильтры
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

// Форматирование суммы
function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU').format(amount)
}
</script>
