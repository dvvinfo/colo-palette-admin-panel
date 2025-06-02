<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('transactions.transactionDetails')"
    @close="closeModal"
  >
    <div v-if="transaction" class="space-y-4">
      <!-- ID транзакции -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.transactionId') }}</label>
        <p class="text-white font-mono">#{{ transaction.id }}</p>
      </div>

      <!-- Пользователь -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.user') }}</label>
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            style="background-color: rgba(255, 48, 64, 0.2)"
          >
            <span class="text-primary text-sm font-bold">
              {{ transaction.user?.username?.charAt(0).toUpperCase() || '?' }}
            </span>
          </div>
          <div>
            <p class="text-white font-medium">
              {{ transaction.user?.username || `User #${transaction.user_id}` }}
            </p>
            <p class="text-gray-400 text-sm">ID: {{ transaction.user_id }}</p>
          </div>
        </div>
      </div>

      <!-- Валюта -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.currency') }}</label>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2"
          :class="getCurrencyClass(transaction.currency)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="transaction.currency === 'btc'"
              d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.293 13.293A8.009 8.009 0 0710 18a8.009 8.009 0 01-5.293-4.707L10 8l5.293 5.293z"
            />
            <path v-else-if="transaction.currency === 'eth'" d="M10 0L4 10l6 4 6-4L10 0zm0 14.5L4.5 10.5 10 20l5.5-9.5L10 14.5z" />
            <path
              v-else-if="transaction.currency === 'usdt'"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
            />
            <path v-else d="M8.5 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-1zm0 5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-6z" />
          </svg>
          {{ transaction.currency.toUpperCase() }}
        </span>
      </div>

      <!-- Сумма -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.amount') }}</label>
        <div class="space-y-2">
          <p class="text-lg font-mono font-medium text-white">
            {{ formatCryptoAmount(transaction.amount_raw) }} {{ transaction.currency.toUpperCase() }}
          </p>
          <p class="text-gray-400 text-sm">
            ≈ {{ formatRubAmount(transaction.amount_rub) }} ₽
          </p>
        </div>
      </div>

      <!-- Курс -->
      <div v-if="transaction.rate > 0">
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.rate') }}</label>
        <p class="text-white">{{ formatRate(transaction.rate) }}</p>
      </div>

      <!-- Статус -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.status') }}</label>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="getStatusClass(transaction.status)"
        >
          {{ getStatusLabel(transaction.status) }}
        </span>
      </div>

      <!-- Даты -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">{{ $t('transactions.createdAt') }}</label>
          <p class="text-white">{{ formatDate(transaction.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-6">
      <BaseButton @click="closeModal" variant="outline" class="flex-1">
        {{ $t('common.close') }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Transaction } from '@/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  isOpen: boolean
  transaction: Transaction | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function closeModal() {
  emit('close')
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

function formatCryptoAmount(amount: number): string {
  return amount.toFixed(8).replace(/\.?0+$/, '')
}

function formatRubAmount(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(amount))
}

function formatRate(rate: number): string {
  return new Intl.NumberFormat('ru-RU').format(rate) + ' ₽'
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
</script>
