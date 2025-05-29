import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PaymentMethod, PaymentSettings } from '@/types'

// Функция генерации мок-данных для платежных методов
function generateMockPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: 'visa_mastercard',
      name: 'Visa/MasterCard',
      type: 'card',
      enabled: true,
      icon: '💳',
      minAmount: 100,
      maxAmount: 100000,
      commission: 3.5,
      commissionType: 'percent',
      processingTime: 'Мгновенно',
      currencies: ['RUB', 'USD', 'EUR'],
      settings: {
        merchantId: 'MERCHANT_123',
        apiKey: '****',
        testMode: false
      }
    },
    {
      id: 'qiwi',
      name: 'QIWI Кошелек',
      type: 'wallet',
      enabled: true,
      icon: '🅰️',
      minAmount: 50,
      maxAmount: 50000,
      commission: 2.5,
      commissionType: 'percent',
      processingTime: 'До 5 минут',
      currencies: ['RUB'],
      settings: {
        shopId: 'SHOP_123',
        secretKey: '****',
        sandboxMode: false
      }
    },
    {
      id: 'yoomoney',
      name: 'ЮMoney',
      type: 'wallet',
      enabled: true,
      icon: '🟡',
      minAmount: 50,
      maxAmount: 75000,
      commission: 2.0,
      commissionType: 'percent',
      processingTime: 'Мгновенно',
      currencies: ['RUB'],
      settings: {
        walletId: '41001234567890',
        notificationSecret: '****',
        testMode: false
      }
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      enabled: false,
      icon: '₿',
      minAmount: 1000,
      maxAmount: 500000,
      commission: 1.0,
      commissionType: 'percent',
      processingTime: 'До 60 минут',
      currencies: ['BTC'],
      settings: {
        walletAddress: 'bc1q...',
        confirmationsRequired: 3,
        networkFee: 'dynamic'
      }
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      type: 'crypto',
      enabled: false,
      icon: '⟐',
      minAmount: 500,
      maxAmount: 300000,
      commission: 1.5,
      commissionType: 'percent',
      processingTime: 'До 30 минут',
      currencies: ['ETH'],
      settings: {
        walletAddress: '0x...',
        confirmationsRequired: 12,
        gasLimit: 21000
      }
    },
    {
      id: 'sbp',
      name: 'СБП (Быстрые платежи)',
      type: 'bank',
      enabled: true,
      icon: '🏦',
      minAmount: 10,
      maxAmount: 600000,
      commission: 0,
      commissionType: 'fixed',
      processingTime: 'До 1 минуты',
      currencies: ['RUB'],
      settings: {
        bankCode: 'SBERBANK',
        merchantNumber: '123456',
        apiVersion: 'v2'
      }
    },
    {
      id: 'mobile_payments',
      name: 'Мобильные платежи',
      type: 'mobile',
      enabled: true,
      icon: '📱',
      minAmount: 50,
      maxAmount: 15000,
      commission: 5.0,
      commissionType: 'percent',
      processingTime: 'До 10 минут',
      currencies: ['RUB'],
      settings: {
        providerId: 'MOBILE_PAY',
        maxDailyAmount: 15000,
        verificationRequired: true
      }
    }
  ]
}

// Мок-данные для настроек платежей
function generateMockPaymentSettings(): PaymentSettings {
  return {
    minDepositAmount: 10,
    maxDepositAmount: 100000,
    minWithdrawalAmount: 100,
    maxWithdrawalAmount: 50000,
    dailyWithdrawalLimit: 100000,
    monthlyWithdrawalLimit: 1000000,
    autoApprovalLimit: 5000,
    defaultCurrency: 'RUB',
    enabledCurrencies: ['RUB', 'USD', 'EUR'],
    maintenanceMode: false,
    maintenanceMessage: 'Платежная система временно недоступна для технического обслуживания'
  }
}

export const usePaymentsStore = defineStore('payments', () => {
  const paymentMethods = ref<PaymentMethod[]>([])
  const paymentSettings = ref<PaymentSettings | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Статистика
  const statistics = computed(() => {
    const enabledMethods = paymentMethods.value.filter(method => method.enabled)
    const disabledMethods = paymentMethods.value.filter(method => !method.enabled)

    const methodsByType = paymentMethods.value.reduce((acc, method) => {
      acc[method.type] = (acc[method.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalMethods: paymentMethods.value.length,
      enabledMethods: enabledMethods.length,
      disabledMethods: disabledMethods.length,
      methodsByType
    }
  })

  // Методы по типам
  const methodsByType = computed(() => {
    return paymentMethods.value.reduce((acc, method) => {
      if (!acc[method.type]) {
        acc[method.type] = []
      }
      acc[method.type].push(method)
      return acc
    }, {} as Record<string, PaymentMethod[]>)
  })

  async function fetchPaymentMethods() {
    loading.value = true
    error.value = null

    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 500))
      paymentMethods.value = generateMockPaymentMethods()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка при загрузке платежных методов'
      console.error('Error fetching payment methods:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPaymentSettings() {
    loading.value = true
    error.value = null

    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 300))
      paymentSettings.value = generateMockPaymentSettings()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка при загрузке настроек платежей'
      console.error('Error fetching payment settings:', err)
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>) {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 200))

      const methodIndex = paymentMethods.value.findIndex(method => method.id === id)
      if (methodIndex !== -1) {
        paymentMethods.value[methodIndex] = { ...paymentMethods.value[methodIndex], ...data }
      }
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка при обновлении платежного метода'
      console.error('Error updating payment method:', err)
      return false
    }
  }

  async function updatePaymentSettings(data: Partial<PaymentSettings>) {
    try {
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 300))

      if (paymentSettings.value) {
        paymentSettings.value = { ...paymentSettings.value, ...data }
      }
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Ошибка при обновлении настроек платежей'
      console.error('Error updating payment settings:', err)
      return false
    }
  }

  async function togglePaymentMethod(id: string) {
    const method = paymentMethods.value.find(m => m.id === id)
    if (method) {
      return await updatePaymentMethod(id, { enabled: !method.enabled })
    }
    return false
  }

  return {
    paymentMethods,
    paymentSettings,
    loading,
    error,
    statistics,
    methodsByType,
    fetchPaymentMethods,
    fetchPaymentSettings,
    updatePaymentMethod,
    updatePaymentSettings,
    togglePaymentMethod
  }
})
