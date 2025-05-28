<template>
  <div class="recaptcha-container">
    <!-- reCAPTCHA v2 (Invisible) -->
    <div
      v-if="version === 'v2' && theme === 'invisible'"
      ref="recaptchaContainer"
      class="g-recaptcha"
      :data-sitekey="siteKey"
      data-callback="onRecaptchaSuccess"
      data-expired-callback="onRecaptchaExpired"
      data-error-callback="onRecaptchaError"
      data-size="invisible"
    ></div>

    <!-- reCAPTCHA v2 (Visible) -->
    <div
      v-else-if="version === 'v2'"
      ref="recaptchaContainer"
      class="g-recaptcha"
      :data-sitekey="siteKey"
      data-callback="onRecaptchaSuccess"
      data-expired-callback="onRecaptchaExpired"
      data-error-callback="onRecaptchaError"
      :data-theme="theme"
      :data-size="size"
    ></div>

    <!-- reCAPTCHA v3 -->
    <div v-else-if="version === 'v3'" class="recaptcha-v3">
      <!-- v3 работает в фоне, видимый элемент не нужен -->
    </div>

    <!-- Кнопка для invisible reCAPTCHA -->
    <button
      v-if="version === 'v2' && theme === 'invisible'"
      type="button"
      @click="executeInvisibleRecaptcha"
      class="invisible-recaptcha-btn"
      :disabled="loading"
    >
      <slot name="button-content">
        {{ loading ? 'Проверка...' : 'Выполнить проверку' }}
      </slot>
    </button>

    <!-- Ошибка -->
    <div v-if="error" class="recaptcha-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  siteKey: string
  version?: 'v2' | 'v3'
  theme?: 'light' | 'dark' | 'invisible'
  size?: 'compact' | 'normal'
  action?: string // для v3
}

const props = withDefaults(defineProps<Props>(), {
  version: 'v2',
  theme: 'dark',
  size: 'normal',
  action: 'login'
})

const emit = defineEmits<{
  success: [token: string]
  expired: []
  error: [error: string]
}>()

const recaptchaContainer = ref<HTMLElement>()
const loading = ref(false)
const error = ref<string | null>(null)
const widgetId = ref<number | null>(null)

// Загружаем reCAPTCHA скрипт
const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    const renderParam = props.version === 'v3' ? '' : '&render=explicit'

    script.src = `https://www.google.com/recaptcha/api.js?render=${props.siteKey}${renderParam}`
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'))

    document.head.appendChild(script)
  })
}

// Инициализация reCAPTCHA v2
const initRecaptchaV2 = async () => {
  if (!window.grecaptcha || !recaptchaContainer.value) return

  try {
    // Ждем готовности grecaptcha
    if (window.grecaptcha.render) {
      widgetId.value = window.grecaptcha.render(recaptchaContainer.value, {
        sitekey: props.siteKey,
        theme: props.theme === 'invisible' ? 'light' : props.theme,
        size: props.theme === 'invisible' ? 'invisible' : props.size,
        callback: onRecaptchaSuccess,
        'expired-callback': onRecaptchaExpired,
        'error-callback': onRecaptchaError
      })
    }
  } catch (err) {
    console.error('Failed to initialize reCAPTCHA v2:', err)
    error.value = 'Ошибка загрузки reCAPTCHA'
  }
}

// Инициализация reCAPTCHA v3
const initRecaptchaV3 = async () => {
  if (!window.grecaptcha) return

  try {
    await window.grecaptcha.ready(() => {
      console.log('reCAPTCHA v3 ready')
    })
  } catch (err) {
    console.error('Failed to initialize reCAPTCHA v3:', err)
    error.value = 'Ошибка загрузки reCAPTCHA'
  }
}

// Выполнение проверки для v3
const executeV3 = async (): Promise<string | null> => {
  if (!window.grecaptcha || props.version !== 'v3') return null

  try {
    loading.value = true
    const token = await window.grecaptcha.execute(props.siteKey, {
      action: props.action
    })
    return token
  } catch (err) {
    console.error('reCAPTCHA v3 execution failed:', err)
    error.value = 'Ошибка выполнения reCAPTCHA'
    return null
  } finally {
    loading.value = false
  }
}

// Выполнение invisible reCAPTCHA
const executeInvisibleRecaptcha = () => {
  if (widgetId.value !== null && window.grecaptcha) {
    loading.value = true
    error.value = null
    window.grecaptcha.execute(widgetId.value)
  }
}

// Обработчики событий
const onRecaptchaSuccess = (token: string) => {
  loading.value = false
  error.value = null
  emit('success', token)
}

const onRecaptchaExpired = () => {
  loading.value = false
  error.value = 'Время проверки истекло'
  emit('expired')
}

const onRecaptchaError = () => {
  loading.value = false
  error.value = 'Ошибка reCAPTCHA'
  emit('error', 'reCAPTCHA error')
}

// Сброс виджета
const reset = () => {
  if (widgetId.value !== null && window.grecaptcha && window.grecaptcha.reset) {
    window.grecaptcha.reset(widgetId.value)
  }
  error.value = null
}

// Получение токена для v3
const getToken = async (): Promise<string | null> => {
  if (props.version === 'v3') {
    return await executeV3()
  }
  return null
}

// Глобальные обработчики для data-callback
window.onRecaptchaSuccess = onRecaptchaSuccess
window.onRecaptchaExpired = onRecaptchaExpired
window.onRecaptchaError = onRecaptchaError

onMounted(async () => {
  try {
    await loadRecaptchaScript()

    if (props.version === 'v3') {
      await initRecaptchaV3()
    } else {
      // Для v2 ждем готовности grecaptcha
      const checkReady = () => {
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          nextTick(() => initRecaptchaV2())
        } else {
          setTimeout(checkReady, 100)
        }
      }
      checkReady()
    }
  } catch (err) {
    console.error('reCAPTCHA initialization failed:', err)
    error.value = 'Не удалось загрузить reCAPTCHA'
  }
})

onUnmounted(() => {
  // Очищаем глобальные обработчики
  delete window.onRecaptchaSuccess
  delete window.onRecaptchaExpired
  delete window.onRecaptchaError
})

// Экспортируем методы для родительского компонента
defineExpose({
  reset,
  getToken,
  executeInvisibleRecaptcha
})
</script>

<style scoped>
.recaptcha-container {
  @apply flex flex-col items-center gap-2;
}

.recaptcha-error {
  @apply text-red-400 text-sm text-center;
}

.invisible-recaptcha-btn {
  @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.recaptcha-v3 {
  /* v3 не требует видимого элемента */
  display: none;
}

/* Кастомные стили для reCAPTCHA */
:deep(.g-recaptcha) {
  @apply mx-auto;
}

/* Темная тема для reCAPTCHA */
:deep(.g-recaptcha iframe) {
  @apply rounded-lg;
}
</style>
