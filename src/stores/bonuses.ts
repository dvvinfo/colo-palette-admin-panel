import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bonusesApi, type BonusResponse, type CreateBonusRequest } from '@/services/api'

export interface Bonus {
  id: number
  title: string
  description: string
  type: 'welcome' | 'promo' | 'cashback' | 'loyalty' | 'reload' | 'freespins'
  status: 'active' | 'scheduled' | 'ended' | 'paused'
  reward: string
  wager_multiplier: number
  is_active: boolean
  participants_count: number
  total_reward: number
  promo_code?: string | null
  max_activations?: number | null
  activated_count: number
  start_date: string
  end_date?: string | null
}

export interface BonusForm {
  title: string
  description: string
  type: Bonus['type']
  reward: string
  wager_multiplier: number
  promo_code?: string
  max_activations?: number
  start_date: string
  end_date?: string
}

// Функция для преобразования ответа API в локальный интерфейс
function mapBonusResponse(bonus: BonusResponse): Bonus {
  return {
    id: bonus.id,
    title: bonus.title,
    description: bonus.description,
    type: bonus.type,
    status: bonus.status,
    reward: bonus.reward,
    wager_multiplier: bonus.wager_multiplier,
    is_active: bonus.is_active,
    participants_count: bonus.participants_count,
    total_reward: bonus.total_reward,
    promo_code: bonus.promo_code,
    max_activations: bonus.max_activations,
    activated_count: bonus.activated_count,
    start_date: bonus.start_date,
    end_date: bonus.end_date
  }
}

// Функция для преобразования datetime-local в ISO формат
function formatDateForAPI(dateString: string): string {
  // Проверяем на пустую строку
  if (!dateString || dateString.trim() === '') {
    return dateString
  }

  // Если строка уже содержит секунды и timezone, возвращаем как есть
  if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
    return dateString
  }

  // Создаем объект даты из местного времени
  const localDate = new Date(dateString)

  // Получаем местный timezone offset в минутах
  const timezoneOffset = localDate.getTimezoneOffset()

  // Преобразуем offset в формат ±HH:MM
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
  const offsetMinutes = Math.abs(timezoneOffset) % 60
  const offsetSign = timezoneOffset <= 0 ? '+' : '-'
  const formattedOffset = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`

  // Добавляем секунды и местный timezone
  return dateString + ':00' + formattedOffset
}

export const useBonusesStore = defineStore('bonuses', () => {
  const bonuses = ref<Bonus[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const activeBonuses = computed(() =>
    bonuses.value.filter(bonus => bonus.status === 'active')
  )

  const totalActiveBonuses = computed(() => activeBonuses.value.length)

  const totalParticipants = computed(() =>
    bonuses.value.reduce((sum, bonus) => sum + bonus.participants_count, 0)
  )

  const totalBonusAmount = computed(() =>
    bonuses.value.reduce((sum, bonus) => sum + bonus.total_reward, 0)
  )

  const conversionRate = computed(() => {
    const totalShown = bonuses.value.reduce((sum, bonus) => sum + (bonus.max_activations || bonus.participants_count), 0)
    const totalUsed = bonuses.value.reduce((sum, bonus) => sum + bonus.activated_count, 0)
    return totalShown > 0 ? (totalUsed / totalShown * 100) : 0
  })

  // Actions
  async function fetchBonuses(): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      const response = await bonusesApi.getAll()
      bonuses.value = response.data.map(mapBonusResponse)
    } catch (err) {
      error.value = 'Ошибка при загрузке бонусов'
      console.error('Fetch bonuses error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createBonus(bonusData: BonusForm): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      const createRequest: CreateBonusRequest = {
        title: bonusData.title,
        description: bonusData.description,
        type: bonusData.type,
        reward: bonusData.reward,
        wager_multiplier: bonusData.wager_multiplier,
        promo_code: bonusData.promo_code,
        max_activations: bonusData.max_activations,
        start_date: formatDateForAPI(bonusData.start_date),
        end_date: bonusData.end_date ? formatDateForAPI(bonusData.end_date) : undefined
      }

      // Логируем для отладки
      console.log('Original dates:', {
        start_date: bonusData.start_date,
        end_date: bonusData.end_date
      })
      console.log('Formatted dates:', {
        start_date: createRequest.start_date,
        end_date: createRequest.end_date
      })

      await bonusesApi.create(createRequest)

      // Обновляем список бонусов после создания
      await fetchBonuses()
    } catch (err) {
      error.value = 'Ошибка при создании бонуса'
      console.error('Bonus creation error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteBonus(id: number): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      await bonusesApi.delete(id)

      // Удаляем бонус из локального списка
      bonuses.value = bonuses.value.filter(bonus => bonus.id !== id)
    } catch (err) {
      error.value = 'Ошибка при удалении бонуса'
      console.error('Bonus deletion error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function activateBonus(promoCode: string): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      await bonusesApi.activate({ promo_code: promoCode })

      // Обновляем список бонусов после активации
      await fetchBonuses()
    } catch (err) {
      error.value = 'Ошибка при активации бонуса'
      console.error('Bonus activation error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Вспомогательные функции
  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 0
    }).format(amount)
  }

  function getBonusTypeLabel(type: Bonus['type']): string {
    const labels = {
      welcome: 'Приветственный',
      reload: 'Перезагрузка',
      cashback: 'Кэшбэк',
      loyalty: 'Лояльность',
      promo: 'Промокод',
      freespins: 'Фриспины'
    }
    return labels[type] || type
  }

  function getBonusStatusLabel(status: Bonus['status']): string {
    const labels = {
      active: 'Активен',
      scheduled: 'Запланирован',
      ended: 'Завершен',
      paused: 'Приостановлен'
    }
    return labels[status] || status
  }

  function getBonusStatusClass(status: Bonus['status']): string {
    const classes = {
      active: 'bg-green-500/20 text-green-300',
      scheduled: 'bg-blue-500/20 text-blue-300',
      ended: 'bg-gray-500/20 text-gray-300',
      paused: 'bg-yellow-500/20 text-yellow-300'
    }
    return classes[status] || 'bg-gray-500/20 text-gray-300'
  }

  function getBonusTypeClass(type: Bonus['type']): string {
    const classes = {
      welcome: 'bg-purple-500/20 text-purple-300',
      reload: 'bg-blue-500/20 text-blue-300',
      cashback: 'bg-green-500/20 text-green-300',
      loyalty: 'bg-yellow-500/20 text-yellow-300',
      promo: 'bg-pink-500/20 text-pink-300',
      freespins: 'bg-cyan-500/20 text-cyan-300'
    }
    return classes[type] || 'bg-gray-500/20 text-gray-300'
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    bonuses,
    isLoading,
    error,

    // Computed
    activeBonuses,
    totalActiveBonuses,
    totalParticipants,
    totalBonusAmount,
    conversionRate,

    // Actions
    fetchBonuses,
    createBonus,
    deleteBonus,
    activateBonus,

    // Helpers
    formatAmount,
    getBonusTypeLabel,
    getBonusStatusLabel,
    getBonusStatusClass,
    getBonusTypeClass,
    clearError
  }
})
