<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @mousedown.self="$emit('close')"
  >
    <div class="bg-card-bg rounded-2xl shadow-xl w-full max-w-md p-8 relative">
      <button
        class="absolute top-4 right-4 text-2xl text-white/60 hover:text-primary"
        @click="$emit('close')"
      >
        &times;
      </button>
      <h2 class="text-2xl font-bold mb-6 text-white">Вход</h2>
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
              placeholder="Email"
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
              placeholder="Пароль"
              required
              :error="!!errorMessage"
              :disabled="loading"
            />
            <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
          </Field>
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <div class="flex-1">
                <div class="text-red-400 text-sm font-medium">Ошибка входа</div>
                <div class="text-red-300 text-sm">{{ error }}</div>

                                <!-- Кнопка для показа отладочной информации -->
                <button
                  v-if="debugInfo"
                  @click.prevent="toggleDebugInfo"
                  type="button"
                  class="mt-2 text-xs text-gray-400 hover:text-white underline bg-transparent border-none cursor-pointer"
                >
                  {{ showDebug ? 'Скрыть детали' : 'Показать детали для разработчика' }}
                </button>

                <!-- Отладочная информация -->
                <div
                  v-if="showDebug && debugInfo"
                  class="mt-3 p-3 bg-gray-900/70 border border-gray-700 rounded text-xs text-gray-200 font-mono overflow-auto max-h-32 transition-all duration-300"
                >
                  <div class="mb-1"><strong class="text-yellow-400">Время:</strong> {{ debugInfo.timestamp }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">URL:</strong> {{ debugInfo.url }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">User Agent:</strong> {{ debugInfo.userAgent }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">Тип ошибки:</strong> {{ debugInfo.errorType }}</div>
                  <div class="mb-1"><strong class="text-yellow-400">Ошибка:</strong></div>
                  <pre class="text-red-300 whitespace-pre-wrap break-words">{{ JSON.stringify(debugInfo.error, null, 2) }}</pre>
                  <div v-if="debugInfo.stackTrace" class="mt-2">
                    <strong class="text-yellow-400">Stack Trace:</strong>
                    <pre class="text-gray-400 whitespace-pre-wrap break-words text-[10px] mt-1">{{ debugInfo.stackTrace }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BaseButton
          type="submit"
          variant="primary"
          class="w-full mt-4"
          :disabled="!meta.valid || loading"
          :loading="loading"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </BaseButton>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref<string | null>(null)
const debugInfo = ref<Record<string, unknown> | null>(null)
const showDebug = ref(false)

const schema = yup.object({
  email: yup.string().email('Неверный формат email').required('Email обязателен'),
  password: yup.string().min(5, 'Минимум 6 символов').required('Пароль обязателен'),
})

async function onSubmit(values: Record<string, unknown>) {
  try {
    loading.value = true
    error.value = null
    debugInfo.value = null
    showDebug.value = false

    const result = await authStore.login(values.email as string, values.password as string)
    if (result.success) {
      setTimeout(() => {
        emit('close')
      }, 500)
    } else {
      error.value = result.error || 'Неверный email или пароль'
      debugInfo.value = {
        timestamp: new Date().toLocaleString(),
        error: result.error,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при входе'
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
  showDebug.value = !showDebug.value
}

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.input {
  @apply w-full rounded-lg px-4 py-3 bg-white/90 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary transition;
}
.btn-primary {
  @apply bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-opacity-90 transition;
}
</style>
