<template>
  <BaseModal
    :is-open="isOpen"
    title="Детали транзакции"
    @close="closeModal"
  >
    <div v-if="transaction" class="space-y-4">
      <!-- ID транзакции -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">ID транзакции</label>
        <p class="text-white font-mono">#{{ transaction.id }}</p>
      </div>

      <!-- Пользователь -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">Пользователь</label>
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

      <!-- Тип транзакции -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">Тип</label>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2"
          :class="getTypeClass(transaction.type)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              v-if="transaction.type === 'deposit'"
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
            <path v-else-if="transaction.type === 'withdrawal'" d="M10 2L3 9h4v6h6V9h4l-7-7z" />
            <path
              v-else-if="transaction.type === 'bonus'"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
            <path v-else d="M10 12a2 2 0 100-4 2 2 0 000 4z M10 2a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
          {{ getTypeLabel(transaction.type) }}
        </span>
      </div>

      <!-- Сумма -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">Сумма</label>
        <p class="text-2xl font-bold font-mono" :class="getAmountClass(transaction.type)">
          {{ formatAmount(transaction.amount, transaction.type) }} ₽
        </p>
      </div>

      <!-- Метод -->
      <div v-if="transaction.method">
        <label class="block text-gray-400 text-sm mb-1">Метод</label>
        <p class="text-white">{{ transaction.method }}</p>
      </div>

      <!-- Статус -->
      <div>
        <label class="block text-gray-400 text-sm mb-1">Статус</label>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="getStatusClass(transaction.status)"
        >
          {{ getStatusLabel(transaction.status) }}
        </span>
      </div>

      <!-- Описание -->
      <div v-if="transaction.description">
        <label class="block text-gray-400 text-sm mb-1">Описание</label>
        <p class="text-white">{{ transaction.description }}</p>
      </div>

      <!-- Даты -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-1">Дата создания</label>
          <p class="text-white">{{ formatDate(transaction.created_at) }}</p>
        </div>
        <div v-if="transaction.updated_at !== transaction.created_at">
          <label class="block text-gray-400 text-sm mb-1">Дата обновления</label>
          <p class="text-white">{{ formatDate(transaction.updated_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-6">
      <BaseButton @click="closeModal" variant="outline" class="flex-1">
        Закрыть
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Transaction } from '@/types'

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
      second: '2-digit',
    }).format(new Date(dateString))
  } catch {
    return '—'
  }
}
</script>
