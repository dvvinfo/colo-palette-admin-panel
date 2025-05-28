import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Bonus {
  id: number
  title: string
  description: string
  type: 'welcome' | 'reload' | 'cashback' | 'loyalty' | 'promocode' | 'freespins'
  status: 'active' | 'scheduled' | 'ended' | 'paused'

  // Условия получения
  minDeposit?: number
  maxBonus?: number
  wagerRequirement: number // x раз от бонуса

  // Значения бонуса
  bonusType: 'percentage' | 'fixed' | 'freespins'
  bonusValue: number // процент или фиксированная сумма
  freeSpinsCount?: number

  // Даты
  startDate: Date
  endDate?: Date
  createdAt: Date

  // Статистика
  totalClaimed: number
  totalParticipants: number
  totalAmount: number

  // Промокод (если применимо)
  promocode?: string
  maxUses?: number
  currentUses: number

  // Ограничения
  minLevel?: number
  vipOnly: boolean
  newPlayersOnly: boolean
  countries?: string[]

  // Игры (для фриспинов)
  allowedGames?: string[]
}

export interface BonusForm {
  title: string
  description: string
  type: Bonus['type']
  bonusType: Bonus['bonusType']
  bonusValue: number
  freeSpinsCount?: number
  minDeposit?: number
  maxBonus?: number
  wagerRequirement: number
  startDate: string
  endDate?: string
  promocode?: string
  maxUses?: number
  minLevel?: number
  vipOnly: boolean
  newPlayersOnly: boolean
  allowedGames?: string[]
}

export const useBonusesStore = defineStore('bonuses', () => {
  const bonuses = ref<Bonus[]>([
    {
      id: 1,
      title: 'Приветственный бонус 100%',
      description: 'Удваиваем ваш первый депозит до 50,000 ₽',
      type: 'welcome',
      status: 'active',
      minDeposit: 1000,
      maxBonus: 50000,
      wagerRequirement: 40,
      bonusType: 'percentage',
      bonusValue: 100,
      startDate: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      totalClaimed: 1250,
      totalParticipants: 1250,
      totalAmount: 2500000,
      currentUses: 1250,
      vipOnly: false,
      newPlayersOnly: true
    },
    {
      id: 2,
      title: 'Еженедельный кэшбэк',
      description: 'Возвращаем 10% от проигранных средств каждую неделю',
      type: 'cashback',
      status: 'active',
      wagerRequirement: 5,
      bonusType: 'percentage',
      bonusValue: 10,
      maxBonus: 10000,
      startDate: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      totalClaimed: 890,
      totalParticipants: 890,
      totalAmount: 456000,
      currentUses: 890,
      vipOnly: false,
      newPlayersOnly: false
    },
    {
      id: 3,
      title: 'MEGA2024',
      description: '50 фриспинов в слоте Book of Ra за промокод',
      type: 'promocode',
      status: 'active',
      wagerRequirement: 25,
      bonusType: 'freespins',
      bonusValue: 0,
      freeSpinsCount: 50,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-29'),
      createdAt: new Date('2024-02-01'),
      totalClaimed: 234,
      totalParticipants: 234,
      totalAmount: 0,
      promocode: 'MEGA2024',
      maxUses: 1000,
      currentUses: 234,
      vipOnly: false,
      newPlayersOnly: false,
      allowedGames: ['Book of Ra', 'Sizzling Hot']
    },
    {
      id: 4,
      title: 'VIP Перезагрузка',
      description: 'Бонус 75% на депозит для VIP игроков',
      type: 'reload',
      status: 'active',
      minDeposit: 5000,
      maxBonus: 75000,
      wagerRequirement: 30,
      bonusType: 'percentage',
      bonusValue: 75,
      startDate: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      totalClaimed: 156,
      totalParticipants: 156,
      totalAmount: 890000,
      currentUses: 156,
      vipOnly: true,
      newPlayersOnly: false,
      minLevel: 5
    },
    {
      id: 5,
      title: 'FRIDAY100',
      description: 'Пятничный бонус 5000 ₽ по промокоду',
      type: 'promocode',
      status: 'ended',
      wagerRequirement: 35,
      bonusType: 'fixed',
      bonusValue: 5000,
      startDate: new Date('2024-01-05'),
      endDate: new Date('2024-01-31'),
      createdAt: new Date('2024-01-05'),
      totalClaimed: 500,
      totalParticipants: 500,
      totalAmount: 2500000,
      promocode: 'FRIDAY100',
      maxUses: 500,
      currentUses: 500,
      vipOnly: false,
      newPlayersOnly: false
    }
  ])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const activeBonuses = computed(() =>
    bonuses.value.filter(bonus => bonus.status === 'active')
  )

  const totalActiveBonuses = computed(() => activeBonuses.value.length)

  const totalParticipants = computed(() =>
    bonuses.value.reduce((sum, bonus) => sum + bonus.totalParticipants, 0)
  )

  const totalBonusAmount = computed(() =>
    bonuses.value.reduce((sum, bonus) => sum + bonus.totalAmount, 0)
  )

  const conversionRate = computed(() => {
    const totalShown = bonuses.value.reduce((sum, bonus) => sum + (bonus.maxUses || bonus.totalParticipants), 0)
    const totalUsed = bonuses.value.reduce((sum, bonus) => sum + bonus.currentUses, 0)
    return totalShown > 0 ? (totalUsed / totalShown * 100) : 0
  })

  // Actions
  async function createBonus(bonusData: BonusForm): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      const newBonus: Bonus = {
        id: Date.now(),
        title: bonusData.title,
        description: bonusData.description,
        type: bonusData.type,
        status: 'active',
        bonusType: bonusData.bonusType,
        bonusValue: bonusData.bonusValue,
        freeSpinsCount: bonusData.freeSpinsCount,
        minDeposit: bonusData.minDeposit,
        maxBonus: bonusData.maxBonus,
        wagerRequirement: bonusData.wagerRequirement,
        startDate: new Date(bonusData.startDate),
        endDate: bonusData.endDate ? new Date(bonusData.endDate) : undefined,
        createdAt: new Date(),
        totalClaimed: 0,
        totalParticipants: 0,
        totalAmount: 0,
        promocode: bonusData.promocode,
        maxUses: bonusData.maxUses,
        currentUses: 0,
        minLevel: bonusData.minLevel,
        vipOnly: bonusData.vipOnly,
        newPlayersOnly: bonusData.newPlayersOnly,
        allowedGames: bonusData.allowedGames
      }

      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000))

      bonuses.value.unshift(newBonus)
    } catch (err) {
      error.value = 'Ошибка при создании бонуса'
      console.error('Bonus creation error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function updateBonus(id: number, updates: Partial<Bonus>): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      const index = bonuses.value.findIndex(bonus => bonus.id === id)
      if (index === -1) {
        throw new Error('Бонус не найден')
      }

      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500))

      bonuses.value[index] = { ...bonuses.value[index], ...updates }
    } catch (err) {
      error.value = 'Ошибка при обновлении бонуса'
      console.error('Bonus update error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function deleteBonus(id: number): Promise<void> {
    try {
      isLoading.value = true
      error.value = null

      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = bonuses.value.findIndex(bonus => bonus.id === id)
      if (index !== -1) {
        bonuses.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Ошибка при удалении бонуса'
      console.error('Bonus deletion error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function toggleBonusStatus(id: number): Promise<void> {
    const bonus = bonuses.value.find(b => b.id === id)
    if (!bonus) return

    const newStatus = bonus.status === 'active' ? 'paused' : 'active'
    await updateBonus(id, { status: newStatus })
  }

  function formatAmount(amount: number): string {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M'
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K'
    }
    return amount.toString()
  }

  function getBonusTypeLabel(type: Bonus['type']): string {
    const labels = {
      welcome: 'Приветственный',
      reload: 'Пополнение',
      cashback: 'Кэшбэк',
      loyalty: 'Лояльность',
      promocode: 'Промокод',
      freespins: 'Фриспины'
    }
    return labels[type] || type
  }

  function getBonusStatusLabel(status: Bonus['status']): string {
    const labels = {
      active: 'Активный',
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
    return classes[status] || classes.ended
  }

  function getBonusTypeClass(type: Bonus['type']): string {
    const classes = {
      welcome: 'bg-purple-500/20 text-purple-300',
      reload: 'bg-blue-500/20 text-blue-300',
      cashback: 'bg-green-500/20 text-green-300',
      loyalty: 'bg-yellow-500/20 text-yellow-300',
      promocode: 'bg-pink-500/20 text-pink-300',
      freespins: 'bg-orange-500/20 text-orange-300'
    }
    return classes[type] || classes.welcome
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
    createBonus,
    updateBonus,
    deleteBonus,
    toggleBonusStatus,
    clearError,

    // Helpers
    formatAmount,
    getBonusTypeLabel,
    getBonusStatusLabel,
    getBonusStatusClass,
    getBonusTypeClass
  }
})
