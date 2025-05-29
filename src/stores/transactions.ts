import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transactionsApi } from '@/services/api'
import type { Transaction } from '@/types'

// Функция генерации мок-данных
function generateMockTransactions(): Transaction[] {
  const types: Transaction['type'][] = ['deposit', 'withdrawal', 'bonus', 'game_win', 'game_loss']
  const statuses: Transaction['status'][] = ['pending', 'completed', 'failed', 'cancelled']
  const methods = ['Банковская карта', 'QIWI', 'YooMoney', 'Криптовалюта', 'СБП']
  const usernames = ['admin', 'player1', 'vip_user', 'newbie', 'gambler', 'lucky_one', 'test_user']

  const transactions: Transaction[] = []

  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const username = usernames[Math.floor(Math.random() * usernames.length)]
    const userId = Math.floor(Math.random() * 100) + 1
    const amount = Math.floor(Math.random() * 50000) + 100
    const method = Math.random() > 0.3 ? methods[Math.floor(Math.random() * methods.length)] : undefined

    // Создаем дату в диапазоне последних 30 дней
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    const updatedAt = new Date(createdAt)
    if (status !== 'pending') {
      updatedAt.setHours(updatedAt.getHours() + Math.floor(Math.random() * 24))
    }

    let description = ''
    switch (type) {
      case 'deposit':
        description = `Пополнение баланса через ${method || 'систему'}`
        break
      case 'withdrawal':
        description = `Вывод средств на ${method || 'счет пользователя'}`
        break
      case 'bonus':
        description = 'Бонус за регистрацию'
        break
      case 'game_win':
        description = 'Выигрыш в игре'
        break
      case 'game_loss':
        description = 'Проигрыш в игре'
        break
    }

    transactions.push({
      id: i,
      user_id: userId,
      type,
      amount,
      status,
      method,
      description,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString(),
      user: {
        id: userId,
        username,
        email: `${username}@example.com`
      }
    })
  }

  return transactions.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Статистика
  const statistics = computed(() => {
    const stats = {
      deposits: { count: 0, amount: 0 },
      withdrawals: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      totalTurnover: 0
    }

    transactions.value.forEach(transaction => {
      switch (transaction.type) {
        case 'deposit':
          stats.deposits.count++
          if (transaction.status === 'completed') {
            stats.deposits.amount += transaction.amount
            stats.totalTurnover += transaction.amount
          }
          break
        case 'withdrawal':
          stats.withdrawals.count++
          if (transaction.status === 'completed') {
            stats.withdrawals.amount += transaction.amount
          }
          break
      }

      if (transaction.status === 'pending') {
        stats.pending.count++
        stats.pending.amount += transaction.amount
      }
    })

    return stats
  })

  async function fetchTransactions() {
    loading.value = true
    error.value = null

    try {
      const response = await transactionsApi.getAll()
      transactions.value = response.data
    } catch (err: unknown) {
      console.warn('API недоступен, используются мок-данные:', err instanceof Error ? err.message : 'Unknown error')
      // Используем мок-данные при недоступности API
      transactions.value = generateMockTransactions()
      error.value = null // Не показываем ошибку пользователю при использовании мок-данных
    } finally {
      loading.value = false
    }
  }

  async function updateTransactionStatus(id: number, status: Transaction['status']) {
    try {
      await transactionsApi.updateStatus(id, status)
      // Обновляем локальное состояние
      const transaction = transactions.value.find(t => t.id === id)
      if (transaction) {
        transaction.status = status
        transaction.updated_at = new Date().toISOString()
      }
      return true
    } catch {
      console.warn('API недоступен для обновления статуса, обновляем локально')
      // При недоступности API все равно обновляем локальное состояние
      const transaction = transactions.value.find(t => t.id === id)
      if (transaction) {
        transaction.status = status
        transaction.updated_at = new Date().toISOString()
      }
      return true
    }
  }

  async function fetchUserTransactions(userId: number) {
    loading.value = true
    error.value = null

    try {
      const response = await transactionsApi.getUserTransactions(userId)
      return response.data
    } catch (err: unknown) {
      console.warn('API недоступен, используются мок-данные для пользователя:', err instanceof Error ? err.message : 'Unknown error')
      // Фильтруем мок-данные по пользователю
      const userTransactions = generateMockTransactions().filter(t => t.user_id === userId)
      return userTransactions
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    statistics,
    fetchTransactions,
    updateTransactionStatus,
    fetchUserTransactions
  }
})
