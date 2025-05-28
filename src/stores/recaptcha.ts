import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RecaptchaConfig } from '@/types/recaptcha'

export const useRecaptchaStore = defineStore('recaptcha', () => {
  // Конфигурация reCAPTCHA
  const config = ref<RecaptchaConfig>({
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // тестовый ключ
    version: 'v2',
    theme: 'dark',
    size: 'normal',
    action: 'login'
  })

  // Состояние
  const isEnabled = ref(false) // Изначально отключена для удобства разработки
  const lastVerificationTime = ref<Date | null>(null)
  const verificationTokens = ref<Map<string, { token: string; timestamp: Date }>>(new Map())

  // Компьютеры
  const isConfigured = computed(() => !!config.value.siteKey && config.value.siteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI')

  const isVerificationValid = computed(() => {
    if (!lastVerificationTime.value) return false
    const now = new Date()
    const diff = now.getTime() - lastVerificationTime.value.getTime()
    // Токен действителен 2 минуты
    return diff < 2 * 60 * 1000
  })

  // Методы
  function updateConfig(newConfig: Partial<RecaptchaConfig>) {
    config.value = { ...config.value, ...newConfig }
  }

  function setEnabled(enabled: boolean) {
    isEnabled.value = enabled
  }

  function saveVerificationToken(action: string, token: string) {
    verificationTokens.value.set(action, {
      token,
      timestamp: new Date()
    })
    lastVerificationTime.value = new Date()
  }

  function getVerificationToken(action: string): string | null {
    const verification = verificationTokens.value.get(action)
    if (!verification) return null

    // Проверяем, не истек ли токен (5 минут)
    const now = new Date()
    const diff = now.getTime() - verification.timestamp.getTime()
    if (diff > 5 * 60 * 1000) {
      verificationTokens.value.delete(action)
      return null
    }

    return verification.token
  }

  function clearVerificationToken(action: string) {
    verificationTokens.value.delete(action)
  }

  function clearAllTokens() {
    verificationTokens.value.clear()
    lastVerificationTime.value = null
  }

  // Методы для разных типов проверки
  function requiresVerification(action: string): boolean {
    if (!isEnabled.value) return false

    // В режиме разработки с тестовыми ключами делаем reCAPTCHA опциональной
    const isTestKey = config.value.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development'

    if (isDevelopment && isTestKey) {
      // В разработке с тестовыми ключами reCAPTCHA не обязательна
      return false
    }

    const sensitiveActions = ['login', 'register', 'password_reset', 'admin_login']
    return sensitiveActions.includes(action)
  }

  function getConfigForAction(action: string): RecaptchaConfig {
    const baseConfig = { ...config.value }

    // Настройки для разных действий
    switch (action) {
      case 'login':
      case 'admin_login':
        return {
          ...baseConfig,
          action: action,
          // Для логина можно использовать visible reCAPTCHA
          theme: 'dark',
          size: 'normal'
        }

      case 'register':
        return {
          ...baseConfig,
          action: action,
          theme: 'dark'
        }

      case 'password_reset':
        return {
          ...baseConfig,
          action: action,
          version: 'v3' // v3 лучше для сброса пароля
        }

      default:
        return baseConfig
    }
  }

  // Валидация токена (для отправки на сервер)
  async function validateToken(token: string, action: string): Promise<boolean> {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin
      const response = await fetch(`${baseURL}/api/recaptcha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          action,
          remoteip: undefined // В продакшене можно передавать IP
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('reCAPTCHA validation failed:', result)
        return false
      }

      console.log('reCAPTCHA validation successful:', {
        action: result.action,
        score: result.score,
        timestamp: result.challenge_ts
      })

      return result.success
    } catch (error) {
      console.error('reCAPTCHA validation error:', error)
      return false
    }
  }

  // Получение статистики использования
  function getUsageStats() {
    return {
      totalVerifications: verificationTokens.value.size,
      lastVerification: lastVerificationTime.value,
      activeTokens: Array.from(verificationTokens.value.entries()).map(([action, data]) => ({
        action,
        timestamp: data.timestamp,
        age: new Date().getTime() - data.timestamp.getTime()
      }))
    }
  }

  // Очистка просроченных токенов
  function cleanupExpiredTokens() {
    const now = new Date()
    const expiredActions: string[] = []

    verificationTokens.value.forEach((data, action) => {
      const age = now.getTime() - data.timestamp.getTime()
      if (age > 5 * 60 * 1000) { // 5 минут
        expiredActions.push(action)
      }
    })

    expiredActions.forEach(action => {
      verificationTokens.value.delete(action)
    })

    return expiredActions.length
  }

  return {
    // State
    config: computed(() => config.value),
    isEnabled: computed(() => isEnabled.value),
    isConfigured,
    isVerificationValid,
    lastVerificationTime: computed(() => lastVerificationTime.value),

    // Actions
    updateConfig,
    setEnabled,
    saveVerificationToken,
    getVerificationToken,
    clearVerificationToken,
    clearAllTokens,
    requiresVerification,
    getConfigForAction,
    validateToken,
    getUsageStats,
    cleanupExpiredTokens
  }
})
