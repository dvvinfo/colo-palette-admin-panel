<template>
  <div class="flex  items-center justify-center h-[90vh]">
  <div class="bg-background w-full flex items-center justify-center">
    <div
    class=" flex items-center justify-center"
  >
    <div class="bg-card-bg rounded-2xl shadow-xl w-full max-w-md p-8 relative">
      <h2 class="text-2xl font-bold mb-6 text-white">{{ $t('auth.adminPanelLogin') }}</h2>
      <Form
        :validation-schema="schema"
        @submit="onSubmit"
        validate-on-blur
        validate-on-change
        validate-on-input
        v-slot="{ meta }"
      >
        <div class="space-y-4">
          <Field name="email" v-slot="{ field, errorMessage }">
            <BaseInput
              v-bind="field"
              type="email"
              :placeholder="$t('auth.email')"
              required
              :error="!!errorMessage"
              :disabled="loading"
            />
            <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
          </Field>
          <Field name="password" v-slot="{ field, errorMessage }">
            <BaseInput
              v-bind="field"
              type="password"
              :placeholder="$t('auth.password')"
              required
              :error="!!errorMessage"
              :disabled="loading"
            />
            <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
          </Field>

          <!-- reCAPTCHA -->
          <div v-if="recaptchaStore.requiresVerification('admin_login')" class="mt-4">
            <ReCaptcha
              ref="recaptchaRef"
              v-bind="recaptchaConfig"
              @success="onRecaptchaSuccess"
              @expired="onRecaptchaExpired"
              @error="onRecaptchaError"
            />
          </div>

          <!-- Информация о том, что reCAPTCHA отключена в разработке -->
          <div v-else-if="!recaptchaStore.isEnabled && isDevelopmentMode" class="mt-4">
            <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <span class="text-blue-300 text-sm">
                  {{ $t('auth.recaptchaDisabledInDev') }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <div class="flex-1">
                <div class="text-red-400 text-sm font-medium">{{ $t('auth.loginError') }}</div>
                <div class="text-red-300 text-sm">{{ error }}</div>

                                <!-- Кнопка для показа отладочной информации (для мобильных устройств) -->
                <button
                  v-if="debugInfo"
                  @click.prevent="toggleDebugInfo"
                  type="button"
                  class="mt-2 text-xs text-gray-400 hover:text-white underline bg-transparent border-none cursor-pointer"
                >
                  {{ showDebug ? $t('auth.hideDetails') : $t('auth.showDevDetails') }}
                </button>

                <!-- Отладочная информация -->
                <!-- <div
                  v-if="showDebug && debugInfo"
                  class="mt-3 p-3 bg-gray-900/70 border border-gray-700 rounded text-xs text-gray-200 font-mono overflow-auto max-h-40 transition-all duration-300"
                >
                  <div class="mb-1"><strong class="text-yellow-400">{{ $t('auth.time') }}:</strong> {{ debugInfo.timestamp }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">URL:</strong> {{ debugInfo.url }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">User Agent:</strong> {{ debugInfo.userAgent }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">{{ $t('auth.errorType') }}:</strong> {{ debugInfo.errorType }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">{{ $t('common.error') }}:</strong></div>
                  <pre class="text-red-300 whitespace-pre-wrap break-words">{{ JSON.stringify(debugInfo.error, null, 2) }}</pre>
                  <div v-if="debugInfo.stackTrace" class="mt-2">
                    <strong class="text-yellow-400">Stack Trace:</strong>
                    <pre class="text-gray-400 whitespace-pre-wrap break-words text-[10px] mt-1">{{ debugInfo.stackTrace }}</pre>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <BaseButton
          type="submit"
          variant="primary"
          class="w-full mt-4"
          :disabled="!meta.valid || loading || !isRecaptchaValid"
          :loading="loading"
        >
          {{ loading ? $t('auth.loggingIn') : $t('auth.login') }}
        </BaseButton>
      </Form>

      <!-- Дополнительная информация о безопасности -->
      <!-- <div v-if="recaptchaStore.isEnabled" class="mt-4 text-center">
        <div class="flex items-center justify-center gap-2 text-gray-400 text-xs">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span>Защищено Google reCAPTCHA</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Применяются <a href="https://policies.google.com/privacy" target="_blank" class="text-primary hover:underline">Политика конфиденциальности</a> и
          <a href="https://policies.google.com/terms" target="_blank" class="text-primary hover:underline">Условия использования</a> Google.
        </div>
      </div> -->
    </div>
  </div>
  </div>
</div>
</template>

<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import ReCaptcha from '@/components/ReCaptcha.vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useRecaptchaStore } from '@/stores/recaptcha'
import { ref, computed } from 'vue'
import type { RecaptchaInstance } from '@/types/recaptcha'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const recaptchaStore = useRecaptchaStore()

const loading = ref(false)
const error = ref<string | null>(null)
const debugInfo = ref<Record<string, unknown> | null>(null)
const showDebug = ref(false)
const recaptchaToken = ref<string | null>(null)
const recaptchaRef = ref<RecaptchaInstance>()

// Конфигурация reCAPTCHA для логина
const recaptchaConfig = computed(() => recaptchaStore.getConfigForAction('admin_login'))

// Проверка валидности reCAPTCHA
const isRecaptchaValid = computed(() => {
  if (!recaptchaStore.requiresVerification('admin_login')) return true
  return !!recaptchaToken.value
})

// Проверка режима разработки
const isDevelopmentMode = computed(() => {
  const isTestKey = recaptchaConfig.value.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
  const isDev = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development'
  return isDev && isTestKey
})

const schema = yup.object({
  email: yup.string().email(t('auth.invalidEmail')).required(t('auth.emailRequired')),
  password: yup.string().min(5, t('auth.passwordMinLength')).required(t('auth.passwordRequired')),
})

// Обработчики reCAPTCHA
function onRecaptchaSuccess(token: string) {
  recaptchaToken.value = token
  recaptchaStore.saveVerificationToken('admin_login', token)
  error.value = null
  console.log('reCAPTCHA успешно пройдена')
}

function onRecaptchaExpired() {
  recaptchaToken.value = null
  recaptchaStore.clearVerificationToken('admin_login')
  error.value = t('auth.recaptchaExpired')
}

function onRecaptchaError(errorMsg: string) {
  recaptchaToken.value = null
  recaptchaStore.clearVerificationToken('admin_login')
  error.value = t('auth.recaptchaError', { error: errorMsg })
}

async function onSubmit(values: Record<string, unknown>) {
  try {
    loading.value = true
    error.value = null
    debugInfo.value = null
    showDebug.value = false

    // Проверяем reCAPTCHA если она требуется
    if (recaptchaStore.requiresVerification('admin_login')) {
      if (!recaptchaToken.value) {
        // Для invisible reCAPTCHA выполняем проверку
        if (recaptchaConfig.value.theme === 'invisible' && recaptchaRef.value) {
          recaptchaRef.value.executeInvisibleRecaptcha()
          return // Ждем результата reCAPTCHA
        } else {
          error.value = 'Пожалуйста, подтвердите, что вы не робот'
          return
        }
      }

      // Валидируем токен на сервере
      const isValid = await recaptchaStore.validateToken(recaptchaToken.value, 'admin_login')
      if (!isValid) {
        error.value = 'Ошибка проверки reCAPTCHA. Попробуйте еще раз.'
        recaptchaToken.value = null
        recaptchaRef.value?.reset()
        return
      }
    }

    // Выполняем авторизацию
    const result = await authStore.login(values.email as string, values.password as string)
    if (result.success) {
      // Очищаем токен reCAPTCHA после успешного входа
      recaptchaStore.clearVerificationToken('admin_login')
      // Перенаправляем на главную страницу после успешного входа
      router.push('/')
    } else {
      error.value = result.error || 'Неверный email или пароль'
      // Сбрасываем reCAPTCHA при ошибке входа
      recaptchaToken.value = null
      recaptchaRef.value?.reset()

      // Сохраняем отладочную информацию для мобильных устройств
      debugInfo.value = {
        timestamp: new Date().toLocaleString(),
        error: result.error,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при входе'

    // Сбрасываем reCAPTCHA при ошибке
    recaptchaToken.value = null
    recaptchaRef.value?.reset()

    // Дополнительная отладочная информация
    debugInfo.value = {
      timestamp: new Date().toLocaleString(),
      error: err,
      errorType: typeof err,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: err instanceof Error ? err.stack : 'No stack trace'
    }
  } finally {
    loading.value = false
  }
}

function toggleDebugInfo() {
  console.log('Toggle debug info:', !showDebug.value)
  showDebug.value = !showDebug.value
}

// Убираем emit, так как это отдельная страница, а не модальное окно
</script>

<style scoped>
.input {
  @apply w-full rounded-lg px-4 py-3 bg-white/90 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary transition;
}
.btn-primary {
  @apply bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-opacity-90 transition;
}
</style>
