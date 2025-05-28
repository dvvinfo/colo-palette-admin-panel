<template>
  <div class="p-6 space-y-6">
    <!-- Кнопка назад -->
    <BackButton />

    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Настройки безопасности</h1>
        <p class="text-gray-400 mt-2">Управление защитой от ботов</p>
      </div>
      <div class="flex items-center gap-4">
        <!-- Быстрый переключатель reCAPTCHA -->
        <div class="flex items-center gap-3 bg-card-bg px-4 py-2 rounded-lg border border-white/10">
          <span class="text-white text-sm">reCAPTCHA:</span>
          <button
            @click="recaptchaStore.setEnabled(!recaptchaStore.isEnabled)"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="recaptchaStore.isEnabled ? 'bg-primary' : 'bg-gray-600'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="recaptchaStore.isEnabled ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span class="text-sm" :class="recaptchaStore.isEnabled ? 'text-green-400' : 'text-gray-400'">
            {{ recaptchaStore.isEnabled ? 'ВКЛ' : 'ВЫКЛ' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Статистика reCAPTCHA -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-card-bg rounded-xl p-6 border border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-primary">{{ recaptchaStats.totalVerifications }}</div>
            <div class="text-gray-400 text-sm">Всего проверок</div>
          </div>
          <div class="p-3 bg-green-500/20 rounded-full">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-xl p-6 border border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-primary">{{ recaptchaStats.activeTokens.length }}</div>
            <div class="text-gray-400 text-sm">Активных токенов</div>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-full">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-xl p-6 border border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-primary">
              {{ recaptchaStats.lastVerification ? formatDate(recaptchaStats.lastVerification) : 'Нет' }}
            </div>
            <div class="text-gray-400 text-sm">Последняя проверка</div>
          </div>
          <div class="p-3 bg-purple-500/20 rounded-full">
            <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Настройки reCAPTCHA -->
    <div class="w-full">
      <RecaptchaSettings />
    </div>

    <!-- Информация о дополнительных функциях -->
    <!-- <div class="bg-card-bg rounded-xl p-6 border border-white/10">
      <div class="flex items-start gap-4">
        <svg class="w-6 h-6 text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <div>
          <h3 class="text-white font-semibold mb-2">Дополнительные функции безопасности</h3>
          <p class="text-gray-400 text-sm mb-3">
            Для полноценной защиты доступны дополнительные функции, которые требуют настройки бэкенда:
          </p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• <strong>Лимиты скорости</strong> - ограничение количества попыток входа</li>
            <li>• <strong>IP блокировка</strong> - блокировка подозрительных адресов</li>
            <li>• <strong>Управление сессиями</strong> - расширенная работа с пользовательскими сессиями</li>
            <li>• <strong>Детальная аналитика</strong> - мониторинг угроз и статистика атак</li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RecaptchaSettings from '@/components/RecaptchaSettings.vue'
import BackButton from '@/components/BackButton.vue'
import { useRecaptchaStore } from '@/stores/recaptcha'

const recaptchaStore = useRecaptchaStore()

// Статистика reCAPTCHA (реальная, из store)
const recaptchaStats = computed(() => recaptchaStore.getUsageStats())

// Форматирование даты
function formatDate(date: Date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Стили для переключателя */
.security-toggle {
  @apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors;
}

.security-toggle.enabled {
  @apply bg-primary;
}

.security-toggle.disabled {
  @apply bg-gray-600;
}

.security-toggle-thumb {
  @apply inline-block h-4 w-4 transform rounded-full bg-white transition-transform;
}

.security-toggle-thumb.enabled {
  @apply translate-x-6;
}

.security-toggle-thumb.disabled {
  @apply translate-x-1;
}
</style>
