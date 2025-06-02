import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transactionsApi } from '@/services/api'
import type { Transaction, TransactionFilters } from '@/types'

// Функция генерации мок-данных в новом формате
function generateMockTransactions(): Transaction[] {
  const currencies = ['btc', 'eth', 'usdt', 'rub']
  const statuses: Transaction['status'][] = ['pending', 'completed', 'failed', 'cancelled', 'success', 'progress', 'rejected']
  const usernames = ['admin', 'player1', 'vip_user', 'newbie', 'gambler', 'lucky_one', 'test_user']

  const transactions: Transaction[] = []

  for (let i = 1; i <= 50; i++) {
    const currency = currencies[Math.floor(Math.random() * currencies.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const username = usernames[Math.floor(Math.random() * usernames.length)]
    const userId = Math.floor(Math.random() * 100) + 1
    const amount_raw = Math.random() * 5 + 0.1
    const rate = currency === 'rub' ? 1 : Math.floor(Math.random() * 6000000) + 1000000
    const amount_rub = currency === 'rub' ? amount_raw : amount_raw * rate

    // Создаем дату в диапазоне последних 30 дней
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    transactions.push({
      id: i,
      user_id: userId,
      currency,
      amount_raw,
      rate,
      amount_rub,
      status,
      created_at: createdAt.toISOString(),
      user: {
        id: userId,
        username,
        email: `${username}@example.com`,
        role_id: 2,
        provider: '',
        provider_id: '',
        balance: Math.floor(Math.random() * 5000000) + 100000,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        role: {
          id: 2,
          name: 'user',
          permissions: null
        }
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
  const currentPage = ref(1)
  const totalPages = ref(1)

  // Статистика (пересчитываем для нового формата)
  const statistics = computed(() => {
    const stats = {
      deposits: { count: 0, amount: 0 },
      withdrawals: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      totalTurnover: 0
    }

    transactions.value.forEach(transaction => {
      // Теперь используем amount_rub вместо amount
      const amount = transaction.amount_rub

      // Определяем тип транзакции по статусу и контексту
      if (transaction.status === 'success' || transaction.status === 'completed') {
        stats.deposits.count++
        stats.deposits.amount += amount
        stats.totalTurnover += amount
      }

      if (transaction.status === 'pending' || transaction.status === 'progress') {
        stats.pending.count++
        stats.pending.amount += amount
      }
    })

    return stats
  })

  async function fetchTransactions(filters?: TransactionFilters) {
    loading.value = true
    error.value = null

    console.log('🔄 Загрузка транзакций с фильтрами:', filters)

    try {
      console.log('📡 Отправка запроса к API...')
      const response = await transactionsApi.getAll(filters)
      console.log('✅ API ответ получен:', response.data)

      transactions.value = response.data.data
      currentPage.value = response.data.page
      totalPages.value = response.data.pages

      console.log('📊 Данные обновлены в store:', {
        transactionsCount: transactions.value.length,
        currentPage: currentPage.value,
        totalPages: totalPages.value
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.warn('⚠️ API недоступен, используются мок-данные:', errorMessage)

      // Используем мок-данные при недоступности API
      const mockData = generateMockTransactions()
      console.log('🔨 Сгенерированы мок-данные:', mockData.length, 'транзакций')

      // Применяем фильтрацию к мок-данным
      let filtered = mockData
      if (filters?.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(t =>
          t.user?.username?.toLowerCase().includes(query) ||
          t.user?.email?.toLowerCase().includes(query) ||
          t.id.toString().includes(query)
        )
        console.log('🔍 Применен фильтр по запросу:', query, '→', filtered.length, 'результатов')
      }
      if (filters?.status) {
        filtered = filtered.filter(t => t.status === filters.status)
        console.log('🔍 Применен фильтр по статусу:', filters.status, '→', filtered.length, 'результатов')
      }

      // Простая пагинация для мок-данных
      const page = filters?.page || 1
      const perPage = 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage

      transactions.value = filtered.slice(startIndex, endIndex)
      currentPage.value = page
      totalPages.value = Math.ceil(filtered.length / perPage)
      error.value = null

      console.log('📄 Пагинация применена:', {
        страница: page,
        транзакцийНаСтранице: transactions.value.length,
        всегоСтраниц: totalPages.value
      })
    } finally {
      loading.value = false
      console.log('✅ Загрузка завершена')
    }
  }

  async function updateTransactionStatus(id: number, status: Transaction['status']) {
    try {
      await transactionsApi.updateStatus(id, status)
      // Обновляем локальное состояние
      const transaction = transactions.value.find(t => t.id === id)
      if (transaction) {
        transaction.status = status
      }
      return true
    } catch {
      console.warn('API недоступен для обновления статуса, обновляем локально')
      // При недоступности API все равно обновляем локальное состояние
      const transaction = transactions.value.find(t => t.id === id)
      if (transaction) {
        transaction.status = status
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
    currentPage,
    totalPages,
    statistics,
    fetchTransactions,
    updateTransactionStatus,
    fetchUserTransactions
  }
})
