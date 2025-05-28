<template>
  <div class="bg-card-bg rounded-xl p-6 border border-white/10">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-white">Настройки reCAPTCHA</h3>
        <p class="text-gray-400 text-sm mt-1">Управление защитой от ботов</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-400">
          {{ recaptchaStore.isEnabled ? 'Включено' : 'Отключено' }}
        </span>
        <button
          @click="toggleRecaptcha"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          :class="recaptchaStore.isEnabled ? 'bg-primary' : 'bg-gray-600'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="recaptchaStore.isEnabled ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </div>

    <div v-if="recaptchaStore.isEnabled" class="space-y-6">
      <!-- Предупреждение о режиме разработки -->
      <div
        v-if="isDevelopmentMode"
        class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
      >
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div>
            <div class="text-yellow-400 font-medium text-sm">Режим разработки</div>
            <div class="text-yellow-300 text-sm mt-1">
              Используются тестовые ключи reCAPTCHA. В режиме разработки проверка автоматически пропускается.
              Для продакшена установите настоящие ключи.
            </div>
          </div>
        </div>
      </div>

      <!-- Конфигурация -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">Site Key (Публичный ключ)</label>
          <BaseInput
            v-model="localConfig.siteKey"
            type="text"
            placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            :disabled="loading"
            class="font-mono text-xs"
          />
          <p class="text-xs text-gray-500 mt-1">
            Получите ключи на
            <a href="https://www.google.com/recaptcha/admin/" target="_blank" class="text-primary hover:underline">
              Google reCAPTCHA Console
            </a>
          </p>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Версия reCAPTCHA</label>
          <select
            v-model="localConfig.version"
            class="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-white"
            :disabled="loading"
          >
            <option value="v2">v2 (Checkbox)</option>
            <option value="v3">v3 (Score-based)</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Тема</label>
          <select
            v-model="localConfig.theme"
            class="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-white"
            :disabled="loading || localConfig.version === 'v3'"
          >
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Размер</label>
          <select
            v-model="localConfig.size"
            class="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-white"
            :disabled="loading || localConfig.version === 'v3'"
          >
            <option value="normal">Обычный</option>
            <option value="compact">Компактный</option>
          </select>
        </div>
      </div>

      <!-- Действия, требующие reCAPTCHA -->
      <div>
        <h4 class="text-white font-semibold mb-3">Действия, требующие проверку</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            v-for="action in availableActions"
            :key="action.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="action.value"
              v-model="requiredActions"
              class="w-4 h-4 text-primary bg-background border-gray-600 rounded focus:ring-primary"
            />
            <span class="text-gray-300 text-sm">{{ action.label }}</span>
          </label>
        </div>
      </div>

      <!-- Тестирование -->
      <div class="border-t border-white/10 pt-6">
        <h4 class="text-white font-semibold mb-3">Тестирование reCAPTCHA</h4>
        <div class="flex items-center gap-4">
          <BaseButton
            @click="testRecaptcha"
            variant="outline"
            size="sm"
            :loading="testing"
            :disabled="!localConfig.siteKey"
          >
            {{ testing ? 'Тестирование...' : 'Тест reCAPTCHA' }}
          </BaseButton>

          <div v-if="testResult" class="flex items-center gap-2">
            <svg
              v-if="testResult.success"
              class="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            <span :class="testResult.success ? 'text-green-400' : 'text-red-400'" class="text-sm">
              {{ testResult.message }}
            </span>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="border-t border-white/10 pt-6">
        <h4 class="text-white font-semibold mb-3">Статистика использования</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-background rounded-lg p-4">
            <div class="text-2xl font-bold text-primary">{{ stats.totalVerifications }}</div>
            <div class="text-gray-400 text-sm">Всего проверок</div>
          </div>
          <div class="bg-background rounded-lg p-4">
            <div class="text-2xl font-bold text-primary">{{ stats.activeTokens.length }}</div>
            <div class="text-gray-400 text-sm">Активные токены</div>
          </div>
          <div class="bg-background rounded-lg p-4">
            <div class="text-2xl font-bold text-primary">
              {{ stats.lastVerification ? formatDate(stats.lastVerification) : 'Нет' }}
            </div>
            <div class="text-gray-400 text-sm">Последняя проверка</div>
          </div>
          <div class="bg-background rounded-lg p-4">
            <BaseButton
              @click="cleanupTokens"
              variant="outline"
              size="sm"
              class="w-full"
            >
              Очистить токены
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex justify-end gap-3">
        <BaseButton
          @click="resetToDefaults"
          variant="outline"
          :disabled="loading"
        >
          Сбросить
        </BaseButton>
        <BaseButton
          @click="saveConfig"
          variant="primary"
          :loading="loading"
          :disabled="!hasChanges"
        >
          Сохранить настройки
        </BaseButton>
      </div>
    </div>

    <!-- Предупреждение когда отключено -->
    <div v-else class="text-center py-8">
      <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"/>
      </svg>
      <h3 class="text-white font-semibold mb-2">reCAPTCHA отключена</h3>
      <p class="text-gray-400 text-sm mb-4">
        Защита от ботов не активна. Рекомендуется включить для повышения безопасности.
      </p>
      <BaseButton @click="toggleRecaptcha" variant="primary">
        Включить reCAPTCHA
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRecaptchaStore } from '@/stores/recaptcha'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { RecaptchaConfig } from '@/types/recaptcha'

const recaptchaStore = useRecaptchaStore()

// Локальная конфигурация для редактирования
const localConfig = ref<RecaptchaConfig>({ ...recaptchaStore.config })

// Состояние
const loading = ref(false)
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

// Доступные действия для защиты
const availableActions = [
  { value: 'login', label: 'Вход в систему' },
  { value: 'admin_login', label: 'Вход в админку' },
  { value: 'register', label: 'Регистрация' },
  { value: 'password_reset', label: 'Сброс пароля' }
]

const requiredActions = ref(['login', 'admin_login', 'register'])

// Статистика
const stats = computed(() => recaptchaStore.getUsageStats())

// Проверка изменений
const hasChanges = computed(() => {
  const original = recaptchaStore.config
  return (
    localConfig.value.siteKey !== original.siteKey ||
    localConfig.value.version !== original.version ||
    localConfig.value.theme !== original.theme ||
    localConfig.value.size !== original.size
  )
})

// Проверка режима разработки
const isDevelopmentMode = computed(() => {
  const isTestKey = localConfig.value.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
  const isDev = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development'
  return isDev && isTestKey
})

// Методы
function toggleRecaptcha() {
  recaptchaStore.setEnabled(!recaptchaStore.isEnabled)
}

async function saveConfig() {
  loading.value = true
  try {
    recaptchaStore.updateConfig(localConfig.value)
    // В реальном приложении здесь был бы запрос к API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('reCAPTCHA settings saved')
  } catch (error) {
    console.error('Failed to save reCAPTCHA settings:', error)
  } finally {
    loading.value = false
  }
}

function resetToDefaults() {
  localConfig.value = {
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    version: 'v2',
    theme: 'dark',
    size: 'normal',
    action: 'login'
  }
}

async function testRecaptcha() {
  testing.value = true
  testResult.value = null

  try {
    // Симуляция теста reCAPTCHA
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (localConfig.value.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
      testResult.value = {
        success: true,
        message: 'Тестовые ключи работают корректно'
      }
    } else {
      // В реальном приложении здесь была бы проверка настоящих ключей
      testResult.value = {
        success: Math.random() > 0.3,
        message: Math.random() > 0.3 ? 'reCAPTCHA настроена корректно' : 'Ошибка конфигурации ключей'
      }
    }
  } catch (err) {
    console.error('Failed to test reCAPTCHA:', err)
    testResult.value = {
      success: false,
      message: 'Ошибка при тестировании'
    }
  } finally {
    testing.value = false
  }
}

function cleanupTokens() {
  const cleaned = recaptchaStore.cleanupExpiredTokens()
  console.log(`Cleaned up ${cleaned} expired tokens`)
}

function formatDate(date: Date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Синхронизация с store при изменении
watch(() => recaptchaStore.config, (newConfig) => {
  if (!hasChanges.value) {
    localConfig.value = { ...newConfig }
  }
}, { deep: true })

onMounted(() => {
  localConfig.value = { ...recaptchaStore.config }
})
</script>

<style scoped>
/* Кастомные стили для переключателя */
.toggle-switch {
  @apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors;
}

.toggle-switch.enabled {
  @apply bg-primary;
}

.toggle-switch.disabled {
  @apply bg-gray-600;
}

.toggle-thumb {
  @apply inline-block h-4 w-4 transform rounded-full bg-white transition-transform;
}

.toggle-thumb.enabled {
  @apply translate-x-6;
}

.toggle-thumb.disabled {
  @apply translate-x-1;
}
</style>
